import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { LoginAPI } from "../backend-services/api";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LoginPage = () => {
	const [auth, setAuth] = useAuth();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values, { resetForm }) => {
			try {
				const data = await LoginAPI(values);
				if (data.message === "Already Loggedin") {
					toast.warn("You are already loggedin");
				} else if (data.status === "Success") {
					setAuth({
						...auth,
						user: data.user,
					});
					toast.success("Log in successful ");
					resetForm({
						values: "",
					});
					navigate("/");
				} else {
					console.log("An error when login");
				}
			} catch (error) {
				console.log(error.message);
			}
		},
	});
	// console.log(auth.user);
	return (
		<div className="container mt-5">
			<form className="form-group " onSubmit={formik.handleSubmit}>
				<div className="row d-flex py-4 justify-content-center">
					<div className="col-lg-6">
						<div className="card p-5">
							<h1 className="card-title mb-4 text-center">
								Login
							</h1>
							<input
								type="email"
								className="form-control my-2 py-3"
								placeholder="Email"
								name="email"
								value={formik.values.email}
								onChange={formik.handleChange}
							/>
							<input
								type="password"
								className="form-control my-2 py-3"
								placeholder="Password"
								name="password"
								value={formik.values.password}
								onChange={formik.handleChange}
							/>
							<button
								type="submit"
								className="btn bg-gradient-primary my-2">
								Login
							</button>
							<p className="text-center mt-2">
								New Here?
								<Link className="text-info ms-2" to="/register">
									Register
								</Link>
							</p>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
