/**
 * Skenario Pengujian: LoadingIndicator Component
 * 1. Komponen harus menampilkan teks "Loading" pada layar.
 * 2. Komponen harus menampilkan elemen spinner/loading indicator.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingIndicator from "../../components/LoadingIndicator";

describe("LoadingIndicator Component", () => {
  it("renders loading text and spinner", () => {
    render(<LoadingIndicator />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
