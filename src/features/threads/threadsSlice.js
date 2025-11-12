import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./threadsApi";

/* ==============================
   FETCH THREAD LIST
============================== */
export const fetchThreads = createAsyncThunk(
  "threads/fetchThreads",
  async (_, thunkAPI) => {
    try {
      const [threadsResp, usersResp] = await Promise.all([
        api.fetchThreadsRequest(),
        api.fetchUsersRequest?.(),
      ]);

      const threads = threadsResp.data?.data?.threads || [];
      const users = usersResp?.data?.data?.users || [];

      // gabungkan data owner berdasarkan ownerId
      const mergedThreads = threads.map((thread) => {
        const owner = users.find((u) => u.id === thread.ownerId);
        return { ...thread, owner };
      });

      return mergedThreads;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ==============================
   FETCH THREAD DETAIL (fixed)
============================== */
export const fetchThreadDetail = createAsyncThunk(
  "threads/fetchThreadDetail",
  async (id, thunkAPI) => {
    try {
      const [threadResp, usersResp] = await Promise.all([
        api.fetchThreadDetailRequest(id),
        api.fetchUsersRequest?.(),
      ]);

      const threadData =
        threadResp.data?.data?.detailThread ||
        threadResp.data?.data?.thread ||
        threadResp.data?.data ||
        threadResp.data;

      const users = usersResp?.data?.data?.users || [];

      // 🧩 Tambahkan owner pada thread utama (fix)
      const owner =
        users.find((u) => u.id === threadData.ownerId) ||
        threadData.owner ||
        null;

      const enrichedThread = { ...threadData, owner };

      // 🧩 Tambahkan owner ke setiap komentar (fix agar tidak hilang saat refresh)
      enrichedThread.comments = (threadData.comments || []).map((comment) => {
        const commentOwner =
          users.find((u) => u.id === comment.ownerId) ||
          (comment.owner ? comment.owner : null);

        return {
          ...comment,
          owner: commentOwner || {
            id: comment.ownerId,
            name: "User Tidak Dikenal",
            avatar: null,
          },
        };
      });

      return enrichedThread;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ==============================
   CREATE THREAD
============================== */
export const createThread = createAsyncThunk(
  "threads/createThreadd",
  async (payload, thunkAPI) => {
    try {
      const resp = await api.createThreadRequest(payload);
      return resp.data?.data || resp.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ==============================
   ADD COMMENT
============================== */
export const addComment = createAsyncThunk(
  "threads/addComment",
  async ({ threadId, content }, thunkAPI) => {
    try {
      const resp = await api.addCommentRequest(threadId, { content });
      const commentData =
        resp.data?.data?.comment || resp.data?.data || resp.data;

      return { threadId, comment: commentData };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ==============================
   VOTE THREAD (langsung update)
============================== */
export const voteThread = createAsyncThunk(
  "threads/voteThread",
  async ({ threadId, type }, { dispatch, rejectWithValue }) => {
    try {
      if (type === "up") await api.upVoteThreadRequest(threadId);
      if (type === "down") await api.downVoteThreadRequest(threadId);
      if (type === "neutral") await api.neutralVoteThreadRequest(threadId);

      // ✅ panggil thunk resmi supaya data lengkap (dengan owner & comments)
      const result = await dispatch(fetchThreadDetail(threadId)).unwrap();
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   VOTE COMMENT (langsung update)
============================== */
export const voteComment = createAsyncThunk(
  "threads/voteComment",
  async ({ threadId, commentId, type }, { dispatch, rejectWithValue }) => {
    try {
      if (type === "up") await api.upVoteCommentRequest(threadId, commentId);
      if (type === "down") {
        await api.downVoteCommentRequest(threadId, commentId);
      }
      if (type === "neutral") {
        await api.neutralVoteCommentRequest(threadId, commentId);
      }

      const result = await dispatch(fetchThreadDetail(threadId)).unwrap();
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ==============================
   LEADERBOARD
============================== */
export const fetchLeaderboard = createAsyncThunk(
  "threads/fetchLeaderboard",
  async (_, thunkAPI) => {
    try {
      const resp = await api.fetchLeaderboardRequest();
      const leaderboards = resp.data?.data?.leaderboards || [];
      return leaderboards;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ==============================
   SLICE
============================== */
const threadsSlice = createSlice({
  name: "threads",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    leaderboard: [],
  },
  reducers: {
    // ✅ Tambahkan reducer Optimistic Vote Thread
    optimisticVoteThread: (state, action) => {
      const { threadId, userId, type } = action.payload;
      const thread =
        state.list.find((t) => t.id === threadId) ||
        (state.current && state.current.id === threadId ? state.current : null);

      if (!thread) return;

      // Hilangkan vote sebelumnya
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

      // Tambahkan vote baru
      if (type === "up") thread.upVotesBy.push(userId);
      else if (type === "down") thread.downVotesBy.push(userId);
    },
  },
  extraReducers: (builder) => {
    builder
      /* ----- FETCH THREADS ----- */
      .addCase(fetchThreads.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchThreads.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchThreads.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- FETCH THREAD DETAIL ----- */
      .addCase(fetchThreadDetail.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
      })
      .addCase(fetchThreadDetail.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ----- CREATE THREAD ----- */
      .addCase(createThread.fulfilled, (s, a) => {
        const newItem = a.payload;
        if (newItem) s.list.unshift(newItem);
      })

      /* ----- ADD COMMENT ----- */
      .addCase(addComment.fulfilled, (s, a) => {
        const { threadId, comment } = a.payload;
        if (s.current && s.current.id === threadId) {
          const newComment = {
            ...comment,
            createdAt: comment.createdAt || new Date().toISOString(),
            content: comment.content || "",
          };
          s.current.comments = [...(s.current.comments || []), newComment];
        }
      })

      /* ----- VOTE THREAD ----- */
      .addCase(voteThread.fulfilled, (s, a) => {
        if (a.payload?.id) {
          s.current = a.payload;
        }
      })

      /* ----- VOTE COMMENT ----- */
      .addCase(voteComment.fulfilled, (s, a) => {
        if (a.payload?.id) {
          s.current = a.payload;
        }
      })

      /* ----- LEADERBOARD ----- */
      .addCase(fetchLeaderboard.fulfilled, (s, a) => {
        s.leaderboard = a.payload;
      });
  },
});

// ✅ Export action baru
export const { optimisticVoteThread } = threadsSlice.actions;
export default threadsSlice.reducer;
