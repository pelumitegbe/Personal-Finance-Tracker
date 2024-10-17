import React, { Fragment, useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context";
import { adminLinks } from "./link";
import links from "./navigation.module.css";
import Link from "next/link";

interface LinkProps {
  name: string;
}

const Navlinks: React.FC<LinkProps> = ({ name }) => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const logout = () => {
    authCtx.logout();
    router.push("/");
  };

  return (
    <div className={links.links}>
      <ul>
        {adminLinks.map((item, index) => (
          <Fragment key={index}>
            <Fragment key={index}>
              <li
                key={index}
                className={name === item.name ? links.active : undefined}
              >
                <Link href={item.route}>
                  <item.Icon />
                  {item.name}
                </Link>
              </li>
            </Fragment>
          </Fragment>
        ))}
        <li className={links.logoutLink}>
          <span onClick={logout}>
            <FaSignOutAlt />
            Logout
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Navlinks;
