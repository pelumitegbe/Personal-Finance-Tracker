import React from "react";
import { LoginFormProps } from "../../interface/form";

export const LoginForm: React.FC<LoginFormProps> = ({ setIsLogin }) => {
  return (
    <div className="formContainer">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Username" name="username" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit">Login</button>
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
