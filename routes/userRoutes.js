"use strict";

const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
// GET: http://localhost:5001/api/users/register
// Output:
// {
//     "message": "Register the user."
// }

router.post("/login", loginUser);

// router.get("/current", currentUser);
// Old without validating user tokens
router.get("/current", validateToken, currentUser);
// New with validating user tokens
// Can do a GET request on http://localhost:5001/api/users/current
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\unauthorized not Valid token.png
// So this is because it is either an invalid user / token expired.
// Now,
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\7 first login and get the Token.png
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\8 then use Valid Token to perform requests.png
// Basically, we made this a PROTECTED route. If no access token, no access to the database/route.

module.exports = router;