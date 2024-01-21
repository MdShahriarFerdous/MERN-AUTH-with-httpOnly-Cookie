import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SecretPage from "./pages/SecretPage";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./routes/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/user" element={<PrivateRoute />}>
					<Route path="secret-page" element={<SecretPage />} />
				</Route>
				<Route path="*" element={<PageNotFound />} replace />
			</Routes>
			<ToastContainer
				autoClose={3000}
				draggable={false}
				position="top-right"
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnHover
			/>
		</BrowserRouter>
	);
};

export default App;
