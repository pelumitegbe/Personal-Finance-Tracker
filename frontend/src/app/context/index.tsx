/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useEffect, useState } from "react";
import { queryKeys } from "../react-query/constants";
import { getLoginToken, getStoredUser, setStoredUser } from "../storage";
import { getDecodedJWT, isAuthenticated } from "../utils";
import { useAuthenticatedUser } from "./hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ChildProps, userProps } from "../interface";

export const AuthContext = createContext({
  user: undefined as userProps | undefined,
  token: undefined as string | undefined,
  isAuthenticated: false,
  authenticate: (token: any) => {},
  logout: () => {},
  updateUser: (data: userProps) => {},
});

function AuthContextProvider({ children }: ChildProps) {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<userProps | undefined>(undefined);
  const userDetails = useAuthenticatedUser();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      logout();
    }
  }, []);

  useEffect(() => {
    const data = getLoginToken();
    if (data) {
      setAuthToken(data);
    }
  }, []);

  useEffect(() => {
    const data = getStoredUser();
    if (data) {
      setUser(data);
    }
  }, []);

  useEffect(() => {
    if (userDetails) {
      setUser(userDetails);
    }
  }, [userDetails]);

  function logout() {
    setUser(undefined);
    setAuthToken(undefined);
    localStorage.clear();
    queryClient.invalidateQueries({
      queryKey: [queryKeys.user],
    });
  }
  function updateUser(data: userProps) {
    setUser(data);
  }

  // function authenticate(data: string) {
  //   setAuthToken(data);
  //   const decoded = getDecodedJWT();

  //   const userPropsObj: userProps = {
  //     _id: decoded?._id || "",
  //     firstname: "",
  //     lastname: "",
  //     middlename: "",
  //     fullname: "",
  //     phone: "",
  //     email: decoded?.email || "",
  //   };

  //   setUser(userPropsObj);
  //   setStoredUser(userPropsObj);
  // }
  function authenticate(data: any) {
    setAuthToken(data.token);

    const userPropsObj: userProps = {
      id: data?.id || "",
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      username: data?.username || "",
      email: data?.email || "",
    };

    setUser(userPropsObj);
    setStoredUser(userPropsObj);
  }

  const value = {
    user: user,
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    updateUser: updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
