import React from "react";
import { LoginFormProps } from "../../interface/form";

export const RegisterForm: React.FC<LoginFormProps> = ({ setIsLogin }) => {
  const handleSubmit = () => {};

  return (
    <div className="formContainer">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Firstname" name="first_name" />
        <input type="text" placeholder="Lastname" name="last_name" />
        <input type="text" placeholder="Username" name="username" />
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Signup</button>
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
