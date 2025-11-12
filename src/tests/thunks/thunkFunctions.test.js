import "../../tests/mocks/axiosMock"; // pastikan ini di baris paling atas
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "../../features/auth/authSlice";
import threadsReducer, {
  fetchThreads,
  createThread,
} from "../../features/threads/threadsSlice";

describe("Thunk function tests", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        threads: threadsReducer,
      },
    });
  });

  it("should dispatch login and store user data", async () => {
    const result = await store.dispatch(
      login({ email: "samuel@test.com", password: "123456" })
    );
    const state = store.getState().auth;

    expect(result.type).toBe("auth/login/fulfilled");
    expect(state.user).toEqual({ id: "u1", name: "Samuel" });
    expect(state.token).toBe("mockToken123");
    expect(state.status).toBe("succeeded");
  });

  it("should dispatch logout and clear user data", async () => {
    await store.dispatch(
      login({ email: "samuel@test.com", password: "123456" })
    );
    await store.dispatch(logout());
    const state = store.getState().auth;

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.status).toBe("idle");
  });

  it("should fetch threads successfully", async () => {
    const result = await store.dispatch(fetchThreads());
    const state = store.getState().threads;

    expect(result.type).toBe("threads/fetchThreads/fulfilled");
    expect(state.list).toHaveLength(1);
    expect(state.list[0].title).toBe("Thread Testing");
  });

  it("should create a new thread successfully", async () => {
    const newThread = { title: "Test Thread", body: "This is a new thread" };
    const result = await store.dispatch(createThread(newThread));
    const state = store.getState().threads;

    expect(result.type).toBe("threads/createThread/fulfilled");
    expect(state.list[0].title).toBe("Test Thread");
  });
});
