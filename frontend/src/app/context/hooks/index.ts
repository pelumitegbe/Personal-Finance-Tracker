  import { axiosInstance } from "../../axios-Instance";
  import { useQuery } from "@tanstack/react-query";
  import { queryKeys } from "../../react-query/constants";
  import { useContext } from "react";
  import { AuthContext } from "../../context";
  import { getLoginToken, setStoredUser } from "../../storage";
  import {  isAuthenticated } from "../../utils";

  const userProfile = async () => {
    try {
      const data = await axiosInstance({
        url: "/auth/me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": `${getLoginToken()}`,
        },
      });
      return data?.data?.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  export function useAuthenticatedUser() {
    const authCtx = useContext(AuthContext);
    const fallback = undefined;
    const { data = fallback, isSuccess, error, isError } = useQuery({
      enabled: isAuthenticated(),
      queryKey: [queryKeys.user],
      queryFn: () => userProfile(),
    });

    if (isSuccess && !authCtx.user) {
      authCtx.updateUser(data);
      setStoredUser(data);
    }

    if (isError) {
      console.error('Query error:', error);
      authCtx.logout();
    }

    return data;
  }
