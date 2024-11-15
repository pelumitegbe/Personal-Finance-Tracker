import React from "react";
import { LoginFormProps } from "../../interface/form";
import { LoginProps } from "../../interface";
import { useLogin } from "../../hooks/auth";
import FormInput from "../../components/FormInput";
import { useIsMutating } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

export const LoginForm: React.FC<LoginFormProps> = ({ setIsLogin }) => {
  const [formData, setFormData] = React.useState<LoginProps>({
    email: "",
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
        <FormInput
          type="text"
          placeholder="Email"
          name="email"
          value={formData?.email}
          onChange={handleChange}
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          value={formData?.password}
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
