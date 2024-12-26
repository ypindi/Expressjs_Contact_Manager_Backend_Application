"use strict";

// const mongoose = require("mongoose");
const mongoose = require("mongoose");


// schema will have all the data that we want in our contact resource.
// Now we have created the mongoose object.
// Now we can apply our CRUD operations to store the data in
// our database.
const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add the contact name."],
    },
    email: {
        type: String,
        required: [true, "Please add the email address."],
    },
    phone: {
        type: String,
        required: [true, "Please add the contact phone number."],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Contact", contactSchema);