import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Landing from '../page';

// Mock TopNavigation component
jest.mock('../components/TopNavigation', () => {
  return jest.fn(() => <div>TopNavigation</div>);
});

test('renders landing page with main sections', () => {
  render(<Landing />);

  // Check if the TopNavigation is rendered
  expect(screen.getByText('TopNavigation')).toBeInTheDocument();

  // Check if the main heading is rendered
  expect(screen.getByText('Track')).toBeInTheDocument();
  expect(screen.getByText('Plan')).toBeInTheDocument();
  expect(screen.getByText('Save')).toBeInTheDocument();

  // Check if the description is rendered
  expect(screen.getByText('Track expenses, plan ahead, and save more—simplify your finances')).toBeInTheDocument();

  // Check if the cards are rendered
  expect(screen.getByText('Track Your Spending')).toBeInTheDocument();
  expect(screen.getByText('Plan Your Budget')).toBeInTheDocument();
  expect(screen.getByText('Save Smarter')).toBeInTheDocument();
});
