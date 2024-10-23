import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/auth';

// Mock the `useLogin` hook
jest.mock('../hooks/auth', () => ({
  useLogin: jest.fn(),
}));

// Helper function to render with QueryClientProvider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

test("renders login form with email and password inputs", () => {
  (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn(), isSuccess: false });

  renderWithQueryClient(<LoginForm setIsLogin={jest.fn()} />);

  // Check if email and password inputs are rendered
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("allows user to type into email and password fields", () => {
  (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn(), isSuccess: false });

  renderWithQueryClient(<LoginForm setIsLogin={jest.fn()} />);

  // Get email and password inputs
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");

  // Simulate typing
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Assert that input values have been updated
  expect(emailInput).toHaveValue("test@example.com");
  expect(passwordInput).toHaveValue("password123");
});

test("calls login function when form is submitted", () => {
  const mockMutate = jest.fn();
  (useLogin as jest.Mock).mockReturnValue({ mutate: mockMutate, isSuccess: false });

  renderWithQueryClient(<LoginForm setIsLogin={jest.fn()} />);

  // Fill out form
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  // Assert that the login function is called with correct data
  expect(mockMutate).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });
});
