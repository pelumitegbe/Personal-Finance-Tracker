"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context";
import { LayoutProps } from "../interface";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import "./index.css";
import { isAuthenticated } from "../utils";
import { useRouter } from "next/navigation";

const Layout = ({ children, name, pageTitle }: LayoutProps) => {
	const { user } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push("/");
		}
	}, [router]);

	return (
		<div
			className='appContainer'
			style={{
				display: "flex",
				gap: "1rem",
				backgroundColor: "#F2F3F8",
				padding: "1rem",
			}}>
			<Navigation
				name={name}
				role={user?.role || "user"}
			/>
			<div
				className='contentsRight'
				style={{ display: "flex", flexDirection: "column", flex: "0.91" }}>
				{/* <ToastContainer /> */}
				<Header
					title={pageTitle}
					user={user}
				/>
				<div className={"contents"}>{children}</div>
			</div>
		</div>
	);
};

export default Layout;
