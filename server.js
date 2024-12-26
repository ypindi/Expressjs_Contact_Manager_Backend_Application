"use strict";

// console.log("My Express project");

const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const { connect } = require("mongoose");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();
// const port = 5000;
const port = process.env.PORT || 5000;


app.use(express.json());
// This gives a parser for sending body data from client to server.
// check createContact in contactcontroller.js

// middleware directing the traffic.
app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));

app.use(errorHandler);
// added to get JSON instead of HTML bad responses.

// Testing:
// app.get('/api/contacts', (req, res) => {
//     // res.send("Get all contacts.");
//     // res.json({message: "Get all contacts."});
//     res.status(200).json({message: "Get all contacts."});
// });
// // Do a get request on thunder client on:
// // http://localhost:5000/api/contacts
// // Response:
// // {
// //     "message": "Get all contacts."
// // }


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// To test this app.listen / our API, we need a HTTP client.
// Thunder Client.