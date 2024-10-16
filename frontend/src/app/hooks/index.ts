import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios-Instance";
import { queryKeys } from "../react-query/constants";
import { getLoginToken } from "../storage";
import { useLogin, useRegister } from "./auth";
import { toastOptions } from "../utils";
import { toast } from "react-toastify";

const SERVER_ERROR = "There was an error contacting the server.";

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
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: () => getMe(),
    onSuccess: () => {},
    onError: (error: any) => {
      const err = error?.response?.data?.error
        ? error?.response?.data?.error
        : SERVER_ERROR;
      toast.error(err, toastOptions);
    },
  });
  return data;
}
