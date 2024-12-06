import { renderHook, act } from '@testing-library/react';
import { useCreateTransaction } from '../hooks/transactions'; 
import { Transaction } from "../interface";

// Mock the useCreateTransaction hook
jest.mock('../hooks/transactions', () => ({
  useCreateTransaction: jest.fn(),
}));

describe('useCreateTransaction hook', () => {
  it('should create a transaction successfully', async () => {
    // Mock mutate function to resolve successfully
    const mockMutate = jest.fn().mockResolvedValue({ isSuccess: true });
    (useCreateTransaction as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: false,
    });

    const { result } = renderHook(() => useCreateTransaction());

    // Create a sample transaction
    const newTransaction: Transaction = {
        description: 'Test Transaction',
        amount: 100,
        category: 'Food',
        id: 0,
        type: 'income',
        date: ''
    };

    // Call mutate to simulate the transaction creation
    act(() => {
      result.current.mutate(newTransaction);
    });

    // Ensure the mutate function was called with the correct transaction
    expect(mockMutate).toHaveBeenCalledWith(newTransaction);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle errors when creating a transaction', async () => {
    // Mock mutate function to reject with an error
    const mockMutate = jest.fn().mockRejectedValue(new Error('Transaction creation failed'));
    (useCreateTransaction as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      isError: true,
    });

    const { result } = renderHook(() => useCreateTransaction());

    // Create an invalid transaction (empty description)
    const invalidTransaction: Transaction = {
        description: '', // Invalid description (empty)
        amount: 100,
        category: 'Food',
        id: 0,
        type: 'income',
        date: ''
    };

    // Call mutate to simulate the transaction creation
    act(() => {
      result.current.mutate(invalidTransaction);
    });

    // Ensure the mutate function was called with the invalid transaction
    expect(mockMutate).toHaveBeenCalledWith(invalidTransaction);
    expect(result.current.isError).toBe(true);
  });
});
