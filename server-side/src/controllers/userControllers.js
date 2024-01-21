const {
	jwtAccessTokenExpTime,
	jwtAccessTokenSecretKey,
	jwtRefreshTokenSecretKey,
	jwtRefreshTokenExpTime,
} = require("../../secrets");
const { hashPassword, comparePassword } = require("../helpers/hashPass");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//*============User-Controllers =============
//user register
exports.register = async (req, res, next) => {
	try {
		// 1. destructure name, email, password from req.body
		const { name, email, password } = req.body;
		// 2. name, email, password fields require validation
		if (!name) {
			return res.json({ error: "Name is required!" });
		}
		if (!email) {
			return res.json({ error: "Email is required!" });
		}

		// 3. check if email is taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.json({ error: "Email is already taken!" });
		}
		// 4. hash password
		const hashedPassword = await hashPassword(password);

		//5. register new user
		const newUser = await new User({
			name,
			email,
			password: hashedPassword,
		}).save();

		res.status(201).json({
			status: "Success",
			message: "User registered successfully!",
			newUser,
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//user login
//if data.message = "User Already Loggedin", then show you are logged in already in frontend.
exports.userLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// 1. all fields require validation
		if (!email) {
			return res.json({ error: "Email is required" });
		}

		// 2. check if email is taken
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ error: "User account not found" });
		}

		// 3. compare password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.json({ error: "Invalid password" });
		}

		//generate accessToken
		const accessToken = createJsonWebToken(
			{ _id: user._id },
			jwtAccessTokenSecretKey,
			jwtAccessTokenExpTime
		);

		//generate refreshToken
		const refreshToken = createJsonWebToken(
			{ _id: user._id },
			jwtRefreshTokenSecretKey,
			jwtRefreshTokenExpTime
		);

		//we will set httpOnly cookie in the response
		//accessToken = any name you can use for the first param
		res.cookie("accessToken", accessToken, {
			expires: new Date(Date.now() + 1000 * 60 * 3), //3 minutes
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		res.cookie("refreshToken", refreshToken, {
			expires: new Date(Date.now() + 1000 * 60 * 5), //6 minutes
			httpOnly: true,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});

		res.status(200).json({
			status: "Success",
			message: "Login Successful",
			user: {
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

//user logout
//if data.message = "No token found", show you are already logged out! in frontend
exports.userLogout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		res.status(200).json({
			status: "Logout",
			message: "Logout Successfully",
		});
	} catch (error) {
		next(error);
		console.log(error.message);
		console.log(res.status);
	}
};

//if cookies have the access token and if the token expired or not
exports.tokenValidate = async (req, res, next) => {
	try {
		const { accessToken } = req.cookies;
		jwt.verify(accessToken, jwtAccessTokenSecretKey, (err, decoded) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					return res.status(401).json({
						status: "Access Token Expired",
						from: "Token validator",
					});
				} else {
					return res.status(401).json({
						error: "Failed to authenticate access token",
						from: "Token validator",
					});
				}
			} else {
				return res.status(200).json({ Success: "Token not expired" });
			}
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.isProtected = async (req, res, next) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken && !refreshToken) {
			return res
				.status(401)
				.json({ status: "Login Again", message: "No Token Exist" });
		}

		if (accessToken && !refreshToken) {
			res.clearCookie("accessToken");
			return res
				.status(400)
				.json({ status: "Login Again", message: "No Token Exist" });
		}

		if (!accessToken && refreshToken) {
			jwt.verify(
				refreshToken,
				jwtRefreshTokenSecretKey,
				(err, decoded) => {
					if (err) {
						if (err.name === "TokenExpiredError") {
							return res.status(401).json({
								status: "Fail",
								message: "RefreshToken Expired",
							});
						} else {
							return res.status(401).json({
								status: "Fail",
								message: "RefreshToken Problem",
							});
						}
					} else {
						//generate accessToken
						const accessToken = createJsonWebToken(
							{ _id: decoded._id },
							jwtAccessTokenSecretKey,
							jwtAccessTokenExpTime
						);

						res.cookie("accessToken", accessToken, {
							expires: new Date(Date.now() + 1000 * 60 * 3), //3 minutes
							httpOnly: true,
							path: "/",
							secure: true,
							sameSite: "Strict",
						});
						res.status(200).json({
							status: "Protected",
							message: "Has Token",
						});
					}
				}
			);
		}

		if (accessToken && refreshToken) {
			jwt.verify(accessToken, jwtAccessTokenSecretKey, (err, decoded) => {
				if (err) {
					if (err.name === "TokenExpiredError") {
						return res.status(401).json({
							status: "Fail",
							message: "AccessToken Expired",
						});
					} else {
						return res.status(401).json({
							status: "Fail",
							message: "AccessToken Problem",
						});
					}
				} else {
					res.status(200).json({
						status: "Protected",
						message: "Has Token",
					});
				}
			});
		}
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};

exports.userData = async (req, res, next) => {
	try {
		const userId = req.user._id;
		if (!userId) {
			return res
				.status(400)
				.json({ status: "Fail", message: "No id found" });
		}
		const user = await User.findById(userId, "-password").lean();
		res.status(200).json({
			status: "Success",
			message: "User Data Found",
			user: {
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		next(error);
		console.log(error.message);
	}
};
