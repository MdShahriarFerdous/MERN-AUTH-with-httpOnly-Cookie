const { readdirSync } = require("fs");
const createError = require("http-errors");
const express = require("express");
const app = express();

//DevDependency Lib import
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { errorResponse } = require("./src/helpers/responseHelpers");
const cookieParser = require("cookie-parser");
const { corsLocalPort } = require("./secrets");

// Middlewares implement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ origin: corsLocalPort, credentials: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));
app.use(cookieParser());

// Enable trust proxy
app.set("trust proxy", 1);

// Request Rate Limit
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 50, // limit each IP to 50 requests per windowMs
	message: "Too many requests from this IP",
});
app.use(limiter);

//for multiple files in routes folder
readdirSync("./src/routes").map((router) => {
	app.use("/api/v1", require(`./src/routes/${router}`));
});

//client error
app.use((req, res, next) => {
	next(createError(404, "Route not Found"));
});

//server error
app.use((err, req, res, next) => {
	return errorResponse(res, {
		statusCode: err.status,
		message: err.message,
	});
});

module.exports = app;
