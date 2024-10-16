import { axiosInstance } from "../../axios-Instance";
import { errorAlert, ErrorResponse } from "../../utils";
import { useContext } from "react";
import { AuthContext } from "../../context";
import { setLoginToken } from "../../storage";
import { useMutation } from "@tanstack/react-query";
import { LoginProps, RegisterProps } from "../../interface";

async function userLogin(formData: LoginProps) {
  const data = await axiosInstance({
    url: "/users/login",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(data?.data)

  return data?.data;
}

async function userRegister(formData: RegisterProps) {
  try {
    const response = await axiosInstance({
      url: "/users/signup",
      method: "POST",
      data: formData,
    });

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorAlert(error)
    console.error("Error occurred during user registration:", error);
    throw error;
  }
}

export function useLogin() {
  const authCtx = useContext(AuthContext);
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData: LoginProps) => userLogin(formData),
    onSuccess: (data) => {
      setLoginToken(data.token);
      authCtx.authenticate(data.token);
    },
    onError: (error: ErrorResponse) => {
      errorAlert(error);
    },
  });
  return { mutate, isError, error, isSuccess, reset };
}

export function useRegister() {
  const { mutate, isError, error, isSuccess, reset } = useMutation({
    mutationFn: (formData: RegisterProps) => userRegister(formData),
    // onError: (error: ErrorResponse) => {
    //   errorAlert(error);
    // },
  });
  return { mutate, isError, error, isSuccess, reset };
}
