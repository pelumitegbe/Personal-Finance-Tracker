import React from "react";
import { LoginFormProps } from "../../interface/form";
import { LoginProps } from "../../interface";
import { useLogin } from "../../hooks/auth";
import { useIsMutating } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

export const LoginForm: React.FC<LoginFormProps> = ({ setIsLogin }) => {
  const [formData, setFormData] = React.useState<LoginProps>({
    username: "",
    password: "",
  });

  const { mutate } = useLogin();
  const isLoading = useIsMutating();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="formContainer">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">
          Login
          {isLoading ? <ClipLoader size={20} color={"#fff"} /> : ""}
        </button>
      </form>
      <p>
        Don&apos;t have an account?{" "}
        <span onClick={() => setIsLogin(false)} className="toggle-link">
          Signup
        </span>
      </p>
    </div>
  );
};
