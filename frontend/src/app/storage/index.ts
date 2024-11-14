import { userProps } from "../interface";

export function getStoredUser() {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function setStoredUser(user: userProps) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Save login and refresh tokens to local storage
export function setLoginToken(token: string, refreshToken: string) {
  localStorage.setItem("token", JSON.stringify(token));
  localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
}

// STUB: get login token from local storage
export function getLoginToken() {
  const storedToken = localStorage.getItem("token");
  return storedToken ? JSON.parse(storedToken) : null;
}

export function getRefreshToken() { 
  const storedRefreshToken = localStorage.getItem("refreshToken"); 
  return storedRefreshToken ? JSON.parse(storedRefreshToken) : null
}
