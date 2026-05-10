import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPageView } from "./LoginPageView";

const pushMock = vi.fn();
const loginMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/src/features/auth/hooks/useAuth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/src/features/auth/hooks/useAuth")>()
  return {
    ...actual,
    useAuthActions: () => ({
      login: loginMock,
      isLogging: false,
    }),
    useAuth: () => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),
  }
});

describe("LoginPageView", () => {
  beforeEach(() => {
    pushMock.mockReset();
    loginMock.mockReset();
  });

  it("submits credentials and redirects on successful login", async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(<LoginPageView />);

    await userEvent.type(screen.getByPlaceholderText("ivan@email.com"), "demo@tinterest.ru");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "demo@tinterest.ru",
        password: "password123",
      });
      expect(pushMock).toHaveBeenCalledWith("/search");
    });
  });

  it("shows error and does not redirect when login fails", async () => {
    loginMock.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<LoginPageView />);

    await userEvent.type(screen.getByPlaceholderText("ivan@email.com"), "demo@tinterest.ru");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "bad-password");
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
