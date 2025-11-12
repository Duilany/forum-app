import React from "react";
import { render, screen } from "@testing-library/react";
import ThreadList from "../../components/ThreadList";

jest.mock("../../components/ThreadItem", () => () => (
  <div data-testid="mock-thread-item">ThreadItemMock</div>
));

describe("ThreadList Component", () => {
  it("renders empty message when no threads", () => {
    render(<ThreadList threads={[]} />);
    expect(screen.getByText(/Belum ada thread/i)).toBeInTheDocument();
  });

  it("renders list of threads", () => {
    const threads = [{ id: 1 }, { id: 2 }];
    render(<ThreadList threads={threads} />);
    expect(screen.getAllByTestId("mock-thread-item")).toHaveLength(2);
  });
});
