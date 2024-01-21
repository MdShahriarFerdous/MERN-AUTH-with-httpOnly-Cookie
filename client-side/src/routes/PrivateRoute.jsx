import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CounterLoader from "../components/counterloader/CounterLoader";
import axios from "axios";

const PrivateRoute = () => {
	const [hasToken, setHasToken] = useState(false);

	useEffect(() => {
		isProtected();
	}, []);

	const isProtected = async () => {
		try {
			const { data } = await axios.get("/is-protected");
			if (data.status === "Login Again" || data.status === "Fail") {
				setHasToken(false);
			} else if (
				data.status === "Protected" &&
				data.message === "Has Token"
			) {
				setHasToken(true);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return hasToken ? <Outlet /> : <CounterLoader />;
};

export default PrivateRoute;
