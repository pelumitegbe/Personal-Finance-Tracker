import React from "react";
import { LoginFormProps } from "../../interface/form";
import { useRegister } from "../../hooks/auth";
import { RegisterProps } from "../../interface";
import { useIsMutating } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { successAlert } from "../../utils";
export const RegisterForm: React.FC<LoginFormProps> = ({ setIsLogin }) => {
  const [formData, setFormData] = React.useState<RegisterProps>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const { mutate, isSuccess } = useRegister();
  const isLoading = useIsMutating();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("here");
    mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSuccess) {
    successAlert("Registered successfully, please Login");
    setIsLogin(true);
  }

  return (
    <div className="formContainer">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Firstname"
          name="first_name"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Lastname"
          name="last_name"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
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
          Signup
          {isLoading ? <ClipLoader size={20} color={"#fff"} /> : ""}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <span onClick={() => setIsLogin(true)} className="toggle-link">
          Login
        </span>
      </p>
    </div>
  );
};
