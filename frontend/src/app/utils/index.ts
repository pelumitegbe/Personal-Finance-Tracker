import {jwtDecode} from "jwt-decode";
import { toast, ToastPosition } from "react-toastify";
import { getLoginToken } from "../storage";
import { IDecodedUser } from "../interface";

const SERVER_ERROR = "There was an error contacting the server.";

export const getDecodedJWT = () => {
  try {
    const token = getLoginToken();
    const decoded = jwtDecode<IDecodedUser>(token);
    return decoded;
  } catch (e) {
    console.log(e)
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const decode = getDecodedJWT();
    if (decode) {
      const { exp } = decode;
      const currentTime = Date.now() / 1000;
      return exp > currentTime;
    }
    return false;
  } catch (e) {
    console.log(e)
    return false;
  }
};

export const toastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 8000,
  draggable: true,
  pauseOnHover: true,
  style: {
    zIndex: "9999",
  },
};

export const successAlert = (msg: string) => {
  toast.success(msg || "Successfully created", toastOptions);
};

export type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
      msg?: string;
      error?: string;
    };
  };
};

export const errorAlert = (error : ErrorResponse) => {
  const err =
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.response?.data?.error
      ? error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.response?.data?.error
      : SERVER_ERROR;
  return err;
  //   toast.error(err, toastOptions);
};
export const infoAlert = (msg: string) => {
  toast.info(msg || "Info Notification !", toastOptions);
};
