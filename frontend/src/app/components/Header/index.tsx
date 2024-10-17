import React, { useState } from "react";
import header from "./header.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { userProps } from "../../interface";
import Image from "next/image";
import picture from "../../assets/avatar.png";

interface headerProp {
  title: string;
  user: userProps | undefined;
}
const Header = ({ title, user }: headerProp) => {
  const [search, setSearch] = useState("");
  return (
    <div className={header.pageTitle}>
      <div className={header.titleCon}>
        <div className={header.greeting}>
          <p className={header.greetingText}>
            Hello {user?.first_name}, how is it going?
          </p>
        </div>
        <div className={header.title}>{title}</div>
      </div>

      <div className={header.search}>
        <AiOutlineSearch style={{ fontSize: "20px", marginLeft: "10px" }} />
        <input
          type="text"
          placeholder="Search"
          className={header.searchBox}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={header.adminNav}>
        <Image src={picture} alt="Avatar" className={header.adminImg} />
        <h4 className={header.name}>
          {user?.first_name} {user?.last_name}
        </h4>
      </div>
    </div>
  );
};

export default Header;
