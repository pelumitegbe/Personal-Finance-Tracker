import React, { Fragment, useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../context";
import { adminLinks } from "./link";
import links from "./navigation.module.css";
import Link from "next/link";

interface LinkProps {
	name: string;
	role: string;
}

const Navlinks: React.FC<LinkProps> = ({ name, role }) => {
	const authCtx = useContext(AuthContext);
	const logout = () => {
		authCtx.logout();
	};

	return (
		<div className={links.links}>
			<ul>
				{adminLinks
					?.filter((item) => item.allowed.includes(role))
					.map((item, index) => (
						<Fragment key={index}>
							<li
								key={index}
								className={name === item.name ? links.active : undefined}>
								<Link href={item.route}>
									<item.Icon /> {item.name}
								</Link>
							</li>
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
