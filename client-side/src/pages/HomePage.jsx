import { useAuth } from "../context/authContext";

const HomePage = () => {
	const [auth] = useAuth();
	return (
		<div className="container mt-10">
			<div
				className="card p-4 m-4 m-auto"
				style={{ width: "70%", background: "#FFCAD4" }}>
				<h4 className="text-center mb-3">
					{auth.user
						? `Hello ${auth.user.name}, welcome to MERN AUTH`
						: "Hello, welcome to MERN AUTH"}
				</h4>
				<p className="text-center m-auto" style={{ width: "70%" }}>
					This project covers MERN Authentication using http-only
					cookie, which is most probably most secure than local
					storage and general cookie settings.
				</p>
			</div>
		</div>
	);
};

export default HomePage;
