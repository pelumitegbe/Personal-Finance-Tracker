import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegisterForm } from "../components/RegisterForm";
import { useRegister } from "../hooks/auth";

// Mock the `useRegister` hook
jest.mock("../hooks/auth", () => ({
  useRegister: jest.fn(),
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

test("renders sign up form with input fields", () => {
  (useRegister as jest.Mock).mockReturnValue({ mutate: jest.fn(), isSuccess: false });

  renderWithQueryClient(<RegisterForm setIsLogin={jest.fn()} />);

  // Check if all input fields are rendered
  expect(screen.getByPlaceholderText("Firstname")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Lastname")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
});

test("allows user to type into form fields", () => {
  (useRegister as jest.Mock).mockReturnValue({ mutate: jest.fn(), isSuccess: false });

  renderWithQueryClient(<RegisterForm setIsLogin={jest.fn()} />);

  // Get the input fields
  const firstNameInput = screen.getByPlaceholderText("Firstname");
  const lastNameInput = screen.getByPlaceholderText("Lastname");
  const usernameInput = screen.getByPlaceholderText("Username");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");

  // Simulate typing into the fields
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(usernameInput, { target: { value: "johndoe" } });
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Check that the input values are updated
  expect(firstNameInput).toHaveValue("John");
  expect(lastNameInput).toHaveValue("Doe");
  expect(usernameInput).toHaveValue("johndoe");
  expect(emailInput).toHaveValue("test@example.com");
  expect(passwordInput).toHaveValue("password123");
});

test("calls register function when form is submitted", () => {
  const mockMutate = jest.fn();
  (useRegister as jest.Mock).mockReturnValue({ mutate: mockMutate, isSuccess: false });

  renderWithQueryClient(<RegisterForm setIsLogin={jest.fn()} />);

  // Fill out the form
  fireEvent.change(screen.getByPlaceholderText("Firstname"), { target: { value: "John" } });
  fireEvent.change(screen.getByPlaceholderText("Lastname"), { target: { value: "Doe" } });
  fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "johndoe" } });
  fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /signup/i }));

  // Assert that the register function is called with correct data
  expect(mockMutate).toHaveBeenCalledWith({
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    email: "test@example.com",
    password: "password123",
  });
});
