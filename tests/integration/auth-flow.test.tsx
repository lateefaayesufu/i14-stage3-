// ─── Integration Tests: Auth Flow ────────────────────────────────────────────

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import LoginForm from "../../src/components/auth/LoginForm.tsx";
import SignupForm from "../../src/components/auth/SignupForm.tsx";
import { STORAGE_KEYS } from "../../src/lib/constants";

beforeEach(() => {
  localStorage.clear();
  mockReplace.mockClear();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "sprout@garden.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "roots123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      // Session should be stored
      const session = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe("sprout@garden.com");

      // User should be in users array
      const users = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.USERS) ?? "[]",
      );
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBe("sprout@garden.com");

      // Should redirect to dashboard
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    // Pre-seed existing user
    const existingUser = [
      {
        id: "existing-001",
        email: "taken@garden.com",
        password: "pass",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUser));

    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "taken@garden.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "anotherpass");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "User already exists",
      );
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    // Pre-seed user
    const existingUser = [
      {
        id: "user-login-001",
        email: "grower@garden.com",
        password: "greenthumb",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUser));

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "grower@garden.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "greenthumb");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.userId).toBe("user-login-001");
      expect(session.email).toBe("grower@garden.com");
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "ghost@garden.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpass");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password",
      );
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
