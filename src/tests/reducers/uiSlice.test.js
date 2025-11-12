import uiReducer, { setGlobalLoading } from "../../features/ui/uiSlice";

describe("uiSlice reducer", () => {
  const initialState = { globalLoading: false };

  it("should return initial state", () => {
    expect(uiReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("should set globalLoading true", () => {
    const result = uiReducer(initialState, setGlobalLoading(true));
    expect(result.globalLoading).toBe(true);
  });

  it("should set globalLoading false", () => {
    const result = uiReducer({ globalLoading: true }, setGlobalLoading(false));
    expect(result.globalLoading).toBe(false);
  });
});
