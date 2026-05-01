import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPageView from "./RegisterPageView";

const pushMock = vi.fn();
const registerMock = vi.fn();
const verifyEmailOtpMock = vi.fn();
const resendEmailOtpMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/src/features/auth/hooks/useAuth", () => ({
  useAuthActions: () => ({
    register: registerMock,
    verifyEmailOtp: verifyEmailOtpMock,
    resendEmailOtp: resendEmailOtpMock,
    isRegistering: false,
    isVerifyingEmailOtp: false,
    isResendingEmailOtp: false,
  }),
}));

describe("RegisterPageView", () => {
  beforeEach(() => {
    pushMock.mockReset();
    registerMock.mockReset();
    verifyEmailOtpMock.mockReset();
    resendEmailOtpMock.mockReset();
  });

  it("shows OTP verification panel with target email after successful register", async () => {
    registerMock.mockResolvedValueOnce({
      email: "test@test.com",
      message: "Код подтверждения отправлен на почту",
    });

    render(<RegisterPageView />);

    await userEvent.type(screen.getByPlaceholderText("Иван"), "Ivan");
    await userEvent.type(screen.getByPlaceholderText("Иванов"), "Ivanov");
    await userEvent.type(screen.getByPlaceholderText("ivan@email.com"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");

    await userEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    await waitFor(() => {
      expect(screen.getByText("Код отправлен на почту")).toBeInTheDocument();
      expect(screen.getByText("test@test.com")).toBeInTheDocument();
    });
  });
});
