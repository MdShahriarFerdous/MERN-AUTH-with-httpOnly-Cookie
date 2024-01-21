import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loader from "../../assets/loader/chat-loader.svg";
import "./counterloader.css";

const CounterLoader = ({ path = "/login" }) => {
	const [count, setCount] = useState(3);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const interval = setInterval(() => {
			setCount((prevValue) => {
				return --prevValue;
			});
		}, 1000); //function will work after each 1 sec.

		count === 0 &&
			navigate(`${path}`, {
				state: location.pathname,
			});
		// cleanup
		return () => clearInterval(interval);
	}, [count]);

	return (
		<div>
			<div className="ProcessingDiv">
				<div className="center-screen">
					<img className="loader-size" alt="Loading" src={loader} />
				</div>
			</div>
		</div>
	);
};

export default CounterLoader;
