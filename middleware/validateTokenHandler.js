const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

// you can pass the token either through the header->Authorization or through Bearer field.
// we need to be able to check both from our backend.
const validateToken = asyncHandler ( async(req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("User is not authorized.!!!!");
                // user is not using a valid token so.
            };
            console.log(decoded);
            // if user is using correctToken, then we get the user information.
            req.user = decoded.user;
            next();
            // sending the user information to the middleware.
        });

        if(!token){
            res.status(401);
            throw new Error("User not authorizeddddddd or token is missing in the request.");
        }
    };
});
// now, we can add this in the userRoutes.js file.
// router.get("/current", validateToken, currentUser);
// New with validating user tokens

module.exports = validateToken;