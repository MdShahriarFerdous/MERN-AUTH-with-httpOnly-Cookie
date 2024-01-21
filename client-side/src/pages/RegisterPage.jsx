import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { RegisterAPI } from "../backend-services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async (values, { resetForm }) => {
			try {
				const data = await RegisterAPI(values);
				if (data.status === "Success") {
					toast.success("Registration Done!");
				} else {
					toast.success("Registration Failed!");
				}
			} catch (error) {
				console.log(error.message);
			} finally {
				navigate("/login");
			}
			resetForm({
				values: "",
			});
		},
	});
	return (
		<div className="container mt-5">
			<form className="form-group " onSubmit={formik.handleSubmit}>
				<div className="row d-flex py-4 justify-content-center">
					<div className="col-lg-6">
						<div className="card p-5">
							<h1 className="card-title mb-4 text-center">
								Register
							</h1>
							<input
								type="text"
								className="form-control my-2 py-3"
								placeholder="Name"
								name="name"
								value={formik.values.name}
								onChange={formik.handleChange}
							/>
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
								Register
							</button>
							<p className="text-center mt-2">
								Already have an account?
								<Link className="text-info ms-2" to="/login">
									Login
								</Link>
							</p>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
