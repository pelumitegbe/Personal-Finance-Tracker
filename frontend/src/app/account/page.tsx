"use client";

import React, { useContext, useState } from "react";
import style from "./index.module.css";
import swal from "sweetalert";
import { AuthContext } from "../context";
import FormInput from "../components/FormInput";
import Layout from "../layout/index";

const ContactSupport = () => {
	const { user } = useContext(AuthContext);

	const [formData, setFormdata] = useState({
		first_name: user?.first_name,
		last_name: user?.last_name,
		username: user?.username,
		email: user?.email,
	} as any);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormdata({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		swal({
			title: "Confirmation",
			text: "Are you sure you want to submit this?",
			icon: "warning",
			buttons: ["Cancel", "Submit"],
			dangerMode: true,
		}).then((willSubmit) => {
			if (willSubmit) {
				console.log(formData);
			}
		});
	};

	return (
		<Layout
			name='Account'
			pageTitle='Account'>
			<div className={style.account}>
				<p>Your account details</p>
				<form onSubmit={handleSubmit}>
					<div className={style.personalDet}>
						<div className={style.group1}>
							<label htmlFor='first_name'>Firstname</label>
							<FormInput
								type='text'
								name='first_name'
								placeholder='Firstname'
								value={formData?.first_name}
								onChange={handleChange}
							/>
						</div>
						<div className={style.group1}>
							<label htmlFor='last_name'>Lastname</label>
							<FormInput
								type='text'
								name='last_name'
								placeholder='Lastname'
								value={formData?.last_name}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className={style.group1}>
						<label htmlFor='username'>Username</label>
						<FormInput
							type='text'
							placeholder='Username'
							name='username'
							onChange={handleChange}
							disabled={true}
							value={formData?.username}
						/>
					</div>
					<div className={style.group1}>
						<label htmlFor='email'>Email</label>
						<FormInput
							type='email'
							name='email'
							placeholder='Email'
							value={formData?.email}
							onChange={handleChange}
							disabled={true}
						/>
					</div>
					{/* <button type='submit'>Edit Profile</button> */}
				</form>
			</div>
		</Layout>
	);
};

export default ContactSupport;
