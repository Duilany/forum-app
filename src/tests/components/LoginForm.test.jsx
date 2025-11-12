import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import LoginForm from "../../components/LoginForm";

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

// Mock react-redux
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: (fn) => fn({ auth: { status: "idle", error: null } }),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders form inputs and button", () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Masukkan email/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Masukkan password/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("updates email and password fields", () => {
    render(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Masukkan email/i);
    const passwordInput = screen.getByPlaceholderText(/Masukkan password/i);

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(emailInput.value).toBe("user@test.com");
    expect(passwordInput.value).toBe("secret");
  });

  it("dispatches login action on submit", async () => {
    // Mock dispatch untuk mengembalikan object seperti thunk
    mockDispatch.mockResolvedValue({
      type: "auth/login/fulfilled",
      payload: { user: { email: "test@mail.com" } },
    });

    render(
      <Provider store={mockStore({})}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Masukkan email/i), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan password/i), {
      target: { value: "123456" },
    });

    // Klik tombol login untuk submit
    await fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(mockDispatch).toHaveBeenCalled();
  });
});
