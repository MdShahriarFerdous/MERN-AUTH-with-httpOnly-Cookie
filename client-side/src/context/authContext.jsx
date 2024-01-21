import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		user: null,
	});

	axios.defaults.baseURL = "http://localhost:3000/api/v1";
	axios.defaults.withCredentials = true;

	useEffect(() => {
		fetchLoggedUserData();
	}, []);

	const fetchLoggedUserData = async () => {
		try {
			const { data } = await axios.get("/user-data");
			if (data.status === "Success") {
				setAuth({
					...auth,
					user: data.user,
				});
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<AuthContext.Provider value={[auth, setAuth]}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { useAuth, AuthProvider };
