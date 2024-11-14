import { renderHook, act } from '@testing-library/react';
import { useCreateTransaction } from '../hooks/transactions'; 
import { Transaction } from "../interface";

describe('useCreateTransaction hook', () => {
  it('should create a transaction successfully', async () => {
    const { result } = renderHook(() => useCreateTransaction());

    const newTransaction: Transaction = {
      description: 'Test Transaction',
      amount: 100,
      transaction_type: 'income',
      category: 'Food',
      created_at: new Date().toISOString(), // Assuming you need created_at as well, adjust as needed
    };

    act(() => {
      result.current.mutate(newTransaction);
    });

    // Assuming `isSuccess` is part of your mutation result, it should be true on success
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle errors when creating a transaction', async () => {
    const { result } = renderHook(() => useCreateTransaction());

    const invalidTransaction: Transaction = {
      description: '',  // Invalid description (empty)
      amount: 100,
      transaction_type: 'income',
      category: 'Food',
      created_at: new Date().toISOString(), // Adjust as necessary
    };

    act(() => {
      result.current.mutate(invalidTransaction);
    });

    // Assuming `isError` is part of your mutation result, it should be true on error
    expect(result.current.isError).toBe(true);
  });
});
