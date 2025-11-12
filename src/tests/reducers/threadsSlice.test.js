import threadsReducer, {
  fetchThreads,
  createThread,
  optimisticVoteThread,
} from "../../features/threads/threadsSlice";

describe("threadsSlice reducer", () => {
  const initialState = {
    list: [],
    current: null,
    loading: false,
    error: null,
    leaderboard: [],
  };

  it("should return the initial state", () => {
    expect(threadsReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle fetchThreads.pending", () => {
    const action = { type: fetchThreads.pending.type };
    const result = threadsReducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  it("should handle fetchThreads.fulfilled", () => {
    const threads = [{ id: "1", title: "Thread 1" }];
    const action = { type: fetchThreads.fulfilled.type, payload: threads };
    const result = threadsReducer(initialState, action);
    expect(result.list).toEqual(threads);
    expect(result.loading).toBe(false);
  });

  it("should handle createThread.fulfilled", () => {
    const newThread = { id: "2", title: "New Thread" };
    const action = { type: createThread.fulfilled.type, payload: newThread };
    const result = threadsReducer(initialState, action);
    expect(result.list[0]).toEqual(newThread);
  });

  it("should handle optimisticVoteThread", () => {
    const prevState = {
      ...initialState,
      list: [{ id: "1", upVotesBy: [], downVotesBy: [] }],
    };
    const action = {
      type: optimisticVoteThread.type,
      payload: { threadId: "1", userId: "u1", type: "up" },
    };
    const result = threadsReducer(prevState, action);
    expect(result.list[0].upVotesBy).toContain("u1");
  });
});
