import authReducer, { login, logout } from "../../features/auth/authSlice";

describe("authSlice reducer", () => {
  const initialState = {
    user: null,
    token: null,
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should handle login.pending", () => {
    const action = { type: login.pending.type };
    const result = authReducer(initialState, action);
    expect(result.status).toBe("loading");
    expect(result.error).toBeNull();
  });

  it("should handle login.fulfilled", () => {
    const payload = {
      token: "token123",
      user: { id: "u1", name: "Samuel" },
    };
    const action = { type: login.fulfilled.type, payload };
    const result = authReducer(initialState, action);
    expect(result.status).toBe("succeeded");
    expect(result.user).toEqual(payload.user);
    expect(result.token).toBe("token123");
  });

  it("should handle logout.fulfilled", () => {
    const stateBefore = {
      user: { id: "u1" },
      token: "token123",
      status: "succeeded",
      error: null,
    };
    const action = { type: logout.fulfilled.type };
    const result = authReducer(stateBefore, action);
    expect(result.user).toBeNull();
    expect(result.token).toBeNull();
    expect(result.status).toBe("idle");
  });
});
