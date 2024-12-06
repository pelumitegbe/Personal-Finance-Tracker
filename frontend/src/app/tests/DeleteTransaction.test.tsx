import { renderHook, act } from '@testing-library/react';
import { useDeleteTransaction } from '../hooks/transactions';
import { axiosInstance } from '../axios-Instance';
import { errorAlert } from '../utils';

// Mocking axiosInstance to avoid real HTTP requests
jest.mock('../axios-Instance', () => ({
  axiosInstance: jest.fn(), // Make axiosInstance a mock function
}));

// Mocking errorAlert function
jest.mock('../utils', () => ({
  errorAlert: jest.fn(),
}));

describe('useDeleteTransaction', () => {
  it('should delete a transaction successfully and invalidate queries', async () => {
    const mockInvalidateQueries = jest.fn();
    const transactionId = '12345'; // Example transaction ID to be deleted

    // Mock axiosInstance.delete to resolve successfully
    axiosInstance.mockResolvedValue({ data: { success: true } });

    // Mock the useQueryClient to simulate invalidating queries
    jest.mock('react-query', () => ({
      useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries,
      }),
    }));

    // Render the hook
    const { result } = renderHook(() => useDeleteTransaction());

    // Call the mutate function to simulate the transaction deletion
    act(() => {
      result.current.mutate(transactionId);
    });

    // Wait for the mutation to complete (await the async behavior)
    await result.current.reset();

    // Ensure axiosInstance.delete was called with the correct parameters
    expect(axiosInstance).toHaveBeenCalledWith({
      url: `/users/transactions/${transactionId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: expect.any(String), // You can check the token if necessary
      },
    });

    // Ensure that the query cache was invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['transaction'],
    });
  });

  it('should handle errors when deleting a transaction', async () => {
    const transactionId = '12345';

    // Mock axiosInstance.delete to reject with an error
    axiosInstance.mockRejectedValue(new Error('Delete failed'));

    // Render the hook
    const { result } = renderHook(() => useDeleteTransaction());

    // Call the mutate function to simulate the transaction deletion
    act(() => {
      result.current.mutate(transactionId);
    });

    // Wait for the mutation to complete
    await result.current.reset();

    // Check if the errorAlert was called with the correct error message
    expect(errorAlert).toHaveBeenCalledWith(new Error('Delete failed'));
  });
});
