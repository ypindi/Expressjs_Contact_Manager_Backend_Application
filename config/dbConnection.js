"use strict";

const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connection Established.", connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;

// after this, the moment you put connectDb(); in the server.js file,
// you will see "Connection Established." in cmd.

// D:\Yashwanth\HTW_Berlin\Self_Learnings\Nodejs\Expressjs_ContactManagerApp\mycontacts-backend>npm run dev

// > mycontacts-backend-api@1.0.0 dev
// > nodemon server.js

// [nodemon] 3.1.9
// [nodemon] to restart at any time, enter `rs`
// [nodemon] watching path(s): *.*
// [nodemon] watching extensions: js,mjs,cjs,json
// [nodemon] starting `node server.js`
// Server running on port 5001
// [nodemon] restarting due to changes...
// [nodemon] starting `node server.js`
// Server running on port 5001
// Connection Established. yashwanthcluster-shard-00-01.gpnwl.mongodb.net mycontacts-backend