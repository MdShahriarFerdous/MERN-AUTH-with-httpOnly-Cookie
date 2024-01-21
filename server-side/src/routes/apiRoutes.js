const express = require("express");
const {
	register,
	userLogin,
	userLogout,
	isProtected,
	userData,
} = require("../controllers/userControllers");
const {
	checkLoggedIn,
	checkLoggedOut,
	requireLogIn,
} = require("../middlewares/authMiddlewares");

const router = express.Router();

//*======================= User-Routes =========================

router.post("/user-register", register);
router.post("/user-login", checkLoggedOut, userLogin);
router.get("/user-logout", checkLoggedIn, userLogout);
router.get("/user-data", requireLogIn, userData);

//data.status = "Protected", data.message= "Has Token" --> in frontend
router.get("/is-protected", isProtected);

/*
1. create protected route for both checking access and refresh-token, if no access-token but
still refresh token exist, then generate one access token. if both token not exist then return a false message, so that frontend can show login page base on that message.

2. create verify middleware for checking tokens and if refresh token exist then generate one access token if there is none. if both do not exist then show that message so that frontend can show login page. 

3. create login and logout middleware

4. we will try to give the expiration time of token and cookies same
5. If access token expired
*/
module.exports = router;
