import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { errorAlert, ErrorResponse, successAlert } from "../utils";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";


async function addBudget(formData: unknown) {
  const data = await axiosInstance({
    url: `/budget`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}

const getBudget = async () => {
  const data = await axiosInstance({
    url: "/budget",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "token": `${getLoginToken()}`,
    },
  });
  return data?.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateBudget(formData: any) {
  const data = await axiosInstance({
    url: `/budget/${formData["id"]}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}

async function deleteBudget(formData: unknown) {
  const data = await axiosInstance({
    url: `/budget/${formData}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}


export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => addBudget(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[queryKeys.budget]});
      successAlert("Budget created successfully");
      reset();
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}

export function useBudget() {
  const fallback = undefined;
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.budget],
    queryFn: () => getBudget(),
  });
  return data;
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => updateBudget(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.budget]});
      successAlert("Budget updated successfully");
      reset();
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => deleteBudget(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.budget]});
      successAlert("Budget deleted successfully");
      reset();
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}
