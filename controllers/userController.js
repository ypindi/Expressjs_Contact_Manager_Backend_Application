const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler( async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory.");
    }

    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already present.");
    }
    // check if user is already present.

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password", hashedPassword);
    // can see the hashed password on cmd.
    // storing password after hashing it.
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User Created successfully - ${user}`);

    if(user){
        res.status(201).json({ _id: user.id , email: user.email});
        // we get this back as response on Thunderclient.
    }else{
        res.status(400);
        throw new Error("User data is not valid.")
    }
    // res.json({message: "Register the user."});
});
// on CMD:
// Hashed password $2b$10$VKQIZ94XM1B7A2p7WELE1.b7LsIbCuXQOGWR8CLv/2kj0p6ORrc2m
// User Created successfully - {
//   username: 'Yashwanth Pindi',
//   email: 'random@gmail.com',
//   password: '$2b$10$VKQIZ94XM1B7A2p7WELE1.b7LsIbCuXQOGWR8CLv/2kj0p6ORrc2m',
//   _id: new ObjectId('67687dc63713302f2c63bc2e'),
//   createdAt: 2024-12-22T20:59:50.241Z,
//   updatedAt: 2024-12-22T20:59:50.241Z,
//   __v: 0
// }
// On Thunderclient is pass:
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\User Created successfully.png
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\User seen on MongoDB.png
// On Thunderclient if user already exists:
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\User already present.png



//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatoryy!!");
    };
    const user = await User.findOne({email});
    // check if user is present.
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
            // This payload we are embedding in our JWT token.
            // We should also provide with an access token secret.
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    );
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Email or password is not valid.");
    };
    // if it matches, then we provide with a JWT access token
    // in our response.

    // res.json({message: "Login the user."});
});
// POST on
// http://localhost:5001/api/users/login
// with body:
// {
//     "email": "random@gmail.com",
//     "password": "password"
// }
// Output: D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\JWT Token Generated.png
// Status: 200 OK Size: 275 Bytes Time: 384 ms
// {
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiWWFzaHdhbnRoIFBpbmRpIiwiZW1haWwiOiJyYW5kb21AZ21haWwuY29tIiwiaWQiOiI2NzY4N2RjNjM3MTMzMDJmMmM2M2JjMmUifSwiaWF0IjoxNzM0OTAyOTU2LCJleHAiOjE3MzQ5MDMwMTZ9.OHl5sNry-CEW1tasHMEx3EOkK1BdAxzYmnep7cmK0EE"
//   }
// This Access Token will give us access to all our private routes.
// For this, we need to create a middleware that can authenticate the token that the user sends in their request as a bearer token.
// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend\controllers\how user can send bearer token.png
// You send the user token that was generated in the above way. to check if the token is the correct token
// and it is associated with the correct user. so for this we will create a middleware that will verify this token.
// This is handled in validateTokenHandler.js file.


//@desc Current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler( async (req, res) => {
    // res.json({message: "Current user information."});
    res.json(req.user);
    // because we added req.user = decoded.user; in validateTokenHandler.js file.
});


module.exports = {registerUser, loginUser, currentUser};