import React, { useContext } from "react";
import "./index.css";
import { LoginForm } from "../LoginForm";
import { RegisterForm } from "../RegisterForm";
import { AuthContext } from "../../context";

const TopNavigation = () => {
	const [isModalOpen, setModalOpen] = React.useState(false);
	const [isLogin, setIsLogin] = React.useState(true);

	const { user } = useContext(AuthContext);

	return (
		<div className='top-navigation'>
			<div className='logo'>Finance Tracker</div>
			<div className='nav-links'>
				<a href='#about'>About</a>
				{user && <a href='/dashboard'>Dashboard</a>}
			</div>
			<div className='signup-button'>
				<button onClick={() => setModalOpen(!isModalOpen)}>Login</button>
			</div>
			{isModalOpen && (
				<div className='modal'>
					<div className='modal-content'>
						<span
							className='close'
							onClick={() => setModalOpen(!isModalOpen)}>
							&times;
						</span>
						{isLogin ? (
							<LoginForm setIsLogin={setIsLogin} />
						) : (
							<RegisterForm setIsLogin={setIsLogin} />
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default TopNavigation;
