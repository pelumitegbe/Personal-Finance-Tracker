import React from 'react';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';  // for extended matchers
import DashboardPage from "../dashboard/page";

test("renders dashboard with cards and transactions", () => {
  render(<DashboardPage />);

  // Check if the cards are rendered
  expect(screen.getByText("Total No. of Transactions")).toBeInTheDocument();
  expect(screen.getByText("Total No. of Income")).toBeInTheDocument();
  expect(screen.getByText("Total No. of Expenses")).toBeInTheDocument();

  // Check if the recent transactions table is rendered
  expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
  expect(screen.getByText("Groceries")).toBeInTheDocument();
  expect(screen.getByText("Entertainment")).toBeInTheDocument();

  // Check if the chart section is rendered
  expect(screen.getByText("Expenses by Category")).toBeInTheDocument();
});
