import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ThreadItem from "../../components/ThreadItem";
import { MemoryRouter } from "react-router-dom";

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (fn) => fn({ auth: { user: { id: "user1" } } }),
}));

const sampleThread = {
  id: "t1",
  title: "Judul Thread",
  body: "Isi thread contoh",
  category: "diskusi",
  createdAt: "2025-11-12T00:00:00Z",
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 3,
  owner: { name: "Samuel", avatar: "avatar.png" },
};

describe("ThreadItem Component", () => {
  it("renders thread title and category", () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThreadItem thread={sampleThread} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Judul Salah/i)).toBeInTheDocument();
    expect(screen.getByText(/#diskusi/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it("calls vote handler when upvote clicked", () => {
    render(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <ThreadItem thread={sampleThread} />
        </MemoryRouter>
      </Provider>
    );

    // Gunakan tombol pertama sebagai upvote
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
