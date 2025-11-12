/**
 * Skenario Pengujian: ThreadList Component
 * 1. Jika props `threads` kosong, maka teks "Belum ada thread" harus ditampilkan.
 * 2. Jika terdapat data thread, maka setiap item harus dirender menggunakan komponen ThreadItem.
 * 3. ThreadItem dimock agar pengujian hanya fokus pada perilaku ThreadList.
 */
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
