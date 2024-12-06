import React from "react";
import nav from "./navigation.module.css";
import Navlinks from "./Navlinks";

interface LinkProps {
  name: string;
  role: string;
}
const Navigation = ({ name, role }: LinkProps) => {
  return (
    <div className={nav.navigation}>
      <div className={nav.logo}>
        <h2>Finance Tracker</h2>
      </div>
      <Navlinks name={name} role={role}/>
    </div>
  );
};

export default Navigation;
