import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { toast } from "react-toastify";
import { errorAlert, ErrorResponse, toastOptions } from "../utils";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";

const SERVER_ERROR = "There was an error contacting the server.";

async function addTransaction(formData: any) {
  const data = await axiosInstance({
    url: `/users/transactions`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data;
}

const getTransaction = async () => {
  const data = await axiosInstance({
    url: "/users/transactions",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });
  return data?.data?.data;
};

async function updateTransaction(formData: any) {
  const data = await axiosInstance({
    url: `/users/transactions/${formData["_id"]}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data;
}

async function deleteTransaction(formData: any) {
  const data = await axiosInstance({
    url: `/users/transactions/${formData}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data;
}


export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<any, ErrorResponse>({
    mutationFn: (formData) => addTransaction(formData),
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
  const { mutate, isSuccess, isError, error, reset } = useMutation<any, ErrorResponse>({
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
  const { mutate, isSuccess, isError, error, reset } = useMutation<any, ErrorResponse>({
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
