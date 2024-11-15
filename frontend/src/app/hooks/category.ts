import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { errorAlert, ErrorResponse } from "../utils";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";


async function addCategory(formData: unknown) {
  const data = await axiosInstance({
    url: `/admin/category`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}

const getCategory = async () => {
  const data = await axiosInstance({
    url: "/category",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "token": `${getLoginToken()}`,
    },
  });
  return data?.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateCategory(formData: any) {
  const data = await axiosInstance({
    url: `/admin/category/${formData["_id"]}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}

async function deleteCategory(formData: unknown) {
  const data = await axiosInstance({
    url: `/admin/category/${formData}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "token": `${getLoginToken()}`,
    },
  });

  return data;
}


export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => addCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[queryKeys.category]});
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}

export function useCategory() {
  const fallback = [];
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.category],
    queryFn: () => getCategory(),
  });
  return data;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => updateCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.category]});
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, reset } = useMutation<unknown, ErrorResponse>({
    mutationFn: (formData) => deleteCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.category]});
    },
    onError: (error) => {
      errorAlert(error);
    },
  });
  return { mutate, isSuccess, isError, error, reset };
}
