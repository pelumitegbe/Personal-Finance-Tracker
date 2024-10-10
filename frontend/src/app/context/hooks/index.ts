import { axiosInstance } from "../../axios-Instance";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../react-query/constants";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { getLoginToken, setStoredUser } from "../../storage";
import {  isAuthenticated } from "../../utils";

const userProfile = async () => {
  const data = await axiosInstance({
    url: "/auth/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginToken()}`,
    },
  });
  return data?.data?.data;
};

export function useAuthenticatedUser() {
  const authCtx = useContext(AuthContext);
  const fallback = undefined;
  const { data = fallback, isSuccess, error, isError } = useQuery({
    enabled: isAuthenticated(),
    queryKey: [queryKeys.user],
    queryFn: () => userProfile(),
    // isSuccess: (data: userProps) => {
    //   authCtx.updateUser(data);
    //   setStoredUser(data);
    // },
    // isError: (error: ErrorResponse) => {
    //   authCtx.logout();
    //   errorAlert(error);
    // },
  });
  if(isSuccess){
    authCtx.updateUser(data);
    setStoredUser(data);
  }
  if(isError){
    authCtx.logout();
    console.log(error);
  }
  return data;
}
