import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//* =========================Register API=========================
export const RegisterAPI = async (values) => {
	let postBody = {
		...values,
	};
	try {
		const { data } = await axios.post("/user-register", postBody);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error.message);
	}
};

//* =========================Login/Sign in API=========================
export const LoginAPI = async (values) => {
	let postBody = {
		...values,
	};
	try {
		const { data } = await axios.post("/user-login", postBody);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Login failed. Try again.");
	}
};

//* =========================Logout API=========================
export const LogoutAPI = async () => {
	try {
		const { data } = await axios.get("/user-logout");
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Logout failed. Try again.");
	}
};
