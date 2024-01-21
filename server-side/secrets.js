//Config Lib import and configured
require("dotenv").config();
const ServerPort = process.env.SERVER_PORT || process.env.PORT;
const MongoDBConnectionPort = process.env.MONGO_DB_CONNECTION;

const corsLocalPort = process.env.LOCAL_PORT_FOR_CORS;

const jwtAccessTokenSecretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const jwtAccessTokenExpTime = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;

const jwtRefreshTokenSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const jwtRefreshTokenExpTime = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;

module.exports = {
	ServerPort,
	MongoDBConnectionPort,
	jwtAccessTokenSecretKey,
	jwtAccessTokenExpTime,
	jwtRefreshTokenSecretKey,
	jwtRefreshTokenExpTime,
	corsLocalPort,
};
