import React, { useContext } from "react";
// import { ToastContainer } from "react-toastify";
// import { Header, Navigation } from "../components";
import { AuthContext } from "../context";
import { LayoutProps, userProps } from "../interface";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

const Layout = ({ children, name, pageTitle }: LayoutProps) => {
  const { user } = useContext(AuthContext);

  const defaultUser: userProps = {
    _id: "",
    firstname: "Guest",
    lastname: "",
    middlename: "",
    fullname: "Guest User",
    phone: "",
    email: "",
  };

  return (
    <div
      className="appContainer"
      style={{
        display: "flex",
        gap: "1rem",
        backgroundColor: "#F2F3F8",
        padding: "1rem",
      }}
    >
      <Navigation name={name} />
      <div
        className="contentsRight"
        style={{ display: "flex", flexDirection: "column", flex: "0.91" }}
      >
        {/* <ToastContainer /> */}
        <Header title={pageTitle} user={user || defaultUser} />
        <div className={"contents"}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
