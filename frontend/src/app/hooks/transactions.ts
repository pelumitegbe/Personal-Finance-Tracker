import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { errorAlert, ErrorResponse } from "../utils";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";
import { Transaction } from '../interface'

async function addTransaction(formData: Transaction) {
  const data = await axiosInstance({
    url: `/users/transactions`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data?.data as Transaction;
}

const getTransaction = async () => {
  const data = await axiosInstance({
    url: "/users/transactions",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });
  return data?.data?.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateTransaction(formData: any) {
  const data = await axiosInstance({
    url: `/users/transactions/${formData["_id"]}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}

async function deleteTransaction(formData: unknown) {
  const data = await axiosInstance({
    url: `/users/transactions/${formData}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}


  export function useCreateTransaction() {
    const queryClient = useQueryClient();
    const { mutate, isSuccess, isError, error, reset } = useMutation<Transaction, ErrorResponse, Transaction, unknown>({
      mutationFn: (formData: Transaction) => addTransaction(formData),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:[queryKeys.transaction]});
      },
      onError: (error) => {
        errorAlert(error);
      },
    });
    return { mutate, isSuccess, isError, error, reset };
  }

export function useTransaction() {
  const fallback = undefined;
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.transaction],
    queryFn: () => getTransaction(),
  });
  return data;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => updateTransaction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.transaction]});
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => deleteTransaction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.transaction]});
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}
