import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../context/authContext";
import { LogoutAPI } from "../backend-services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
	const [auth, setAuth] = useAuth();

	const handleLogout = async () => {
		const data = await LogoutAPI();
		if (data.message === "No token") {
			toast.warn("You are already logged out!");
		} else if (data.status === "Logout") {
			setAuth({
				...auth,
				user: null,
			});
			toast.success("You logged out!");
		}
	};

	return (
		<nav className="navbar navbar-expand-lg">
			<div className="container">
				{" "}
				<h1 className="navbar-brand logo text-primary">MERN-AUTH</h1>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerDemo02"
					aria-controls="navbarTogglerDemo02"
					aria-expanded="false"
					aria-label="Toggle navigation">
					{" "}
					<span className="navbar-toggler-icon icon-ham" />{" "}
				</button>
				<div
					className="collapse navbar-collapse"
					id="navbarTogglerDemo02">
					<ul className="navbar-nav ms-auto">
						<li
							className="nav-item me-3 text-center "
							data-bs-toggle="tab"
							style={{
								paddingTop: !auth?.user ? "8px" : "0.98rem",
							}}>
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive
										? "active-link nav-link"
										: "pending-link nav-link"
								}>
								Home
							</NavLink>{" "}
						</li>

						<li
							className="nav-item me-3 text-center"
							data-bs-toggle="tab"
							style={{
								paddingTop: !auth?.user ? "8px" : "0.98rem",
							}}>
							<NavLink
								to="/user/secret-page"
								className={({ isActive }) =>
									isActive
										? "active-link nav-link"
										: "pending-link nav-link"
								}>
								Secret
							</NavLink>{" "}
						</li>

						{/* !null = true */}
						{!auth?.user ? (
							<>
								<li
									className="nav-item me-3  text-center pt-2"
									data-bs-toggle="tab">
									<NavLink
										to="/login"
										className={({ isActive }) =>
											isActive
												? "active-link nav-link"
												: "pending-link nav-link"
										}>
										Login
									</NavLink>{" "}
								</li>

								<li
									className="nav-item me-3 text-center pt-2"
									data-bs-toggle="tab">
									<NavLink
										to="/register"
										className={({ isActive }) =>
											isActive
												? "active-link nav-link"
												: "pending-link nav-link"
										}>
										Register
									</NavLink>
								</li>
							</>
						) : (
							<div className="dropdown">
								<a
									className="nav-link pointer dropdown-toggle"
									data-bs-toggle="dropdown">
									{auth?.user?.name.toUpperCase()}
									<img
										src="https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
										className="ms-2 avatar shadow mb-2"
									/>
								</a>
								<ul className="dropdown-menu p-2 mt-4">
									{/* <li className="pointer">
										<NavLink className="nav-link dropdown-item">
											Dashboard
										</NavLink>
									</li> */}
									<li className="pointer">
										<span
											className="nav-link dropdown-item"
											onClick={handleLogout}>
											Logout
										</span>
									</li>
								</ul>
							</div>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
