const jwt = require("jsonwebtoken");
const {
	jwtAccessTokenSecretKey,
	jwtRefreshTokenSecretKey,
	jwtAccessTokenExpTime,
} = require("../../secrets");
const createError = require("http-errors");
const { createJsonWebToken } = require("../helpers/jsonWebToken");

//if create middleware then use return for next(error), ex: return next(error);

exports.checkLoggedIn = async (req, res, next) => {
	try {
		const { accessToken, refreshToken } = req.cookies;

		if (!accessToken && !refreshToken) {
			return res.status(200).json({ message: "No token" }); //that means already loggedOut
		} else {
			next();
		}
	} catch (error) {
		return next(error);
	}
};

exports.checkLoggedOut = async (req, res, next) => {
	try {
		const { accessToken } = req.cookies;

		if (accessToken) {
			try {
				const decoded = jwt.verify(
					accessToken,
					jwtAccessTokenSecretKey
				);
				if (decoded) {
					res.status(200).json({ message: "Already Loggedin" });
				}
			} catch (error) {
				throw error;
			}
		}
		next();
	} catch (error) {
		return next(error);
	}
};

exports.requireLogIn = async (req, res, next) => {
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

						req.user = decoded;
						return next();
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
					req.user = decoded;
					return next();
				}
			});
		}
	} catch (error) {
		return next(error);
	}
};
