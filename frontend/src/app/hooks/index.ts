import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";
import { useLogin, useRegister } from "./auth";
import { errorAlert, ErrorResponse } from "../utils";

export const hooks = {
  useLogin,
  useRegister,
};

async function getMe() {
  const data = await axiosInstance({
    url: "/auth/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });

  return data?.data;
}

export function useGetMe() {
  const fallback = {};
  const { data = fallback, isError, error } = useQuery<any, ErrorResponse>({
    queryKey: [queryKeys.user],
    queryFn: () => getMe(),
  });
  if (isError){
    errorAlert(error)
  }
  return data;
}
