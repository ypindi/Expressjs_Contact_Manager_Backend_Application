"use strict";

const Contact = require("../models/contactModel");

// add async for all functions because we are using mongodb
// and whenever we react with mongodb, we allways get a
// promise. And whenever we use async and we get an error,
// we need to use a try catch block.
// So we can add the try catch block in each function, or
// there is a better way to do this and we can use 
// middleware provided by expressjs async handler
// which is going to handle our exceptions inside the 
// async express routes. And it going to pass them to the
// express errorHandler.js error handler function.
// for this: npm i express-async-handler
const asyncHandler = require("express-async-handler");
// So now we don't need to write try catch blocks to 
// catch errors. When exception occures, asyncHandler
// will pass it to the errorHandler.js .

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler( async (req, res) => {
    // const contacts = await Contact.find();
    // will get an empty array initially if you try a GET.

    const contacts = await Contact.find({user_id: req.user.id});
    // This user_id is the one we added in contactSchema

    // res.send("Get all contacts.");
    // res.json({message: "Get all contacts."});
    // res.status(200).json({message: "Get all contacts."});
    res.status(200).json(contacts);
});


//@desc Create a new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler( async (req, res) => {
    console.log("The request body is", req.body);
    // Send this from the body of thunderclient post request:
    // {
    //     "name": "Yashwanth",
    //     "email": "ear@gmail.com",
    //     "phone": "2395350"
    //   }
    // for above statement, we will only get this on the cmd window:
    // Server running on port 5001
    // The request body is undefined
    // This is because whenever we need to get some data from the client
    // to the server, we need a body parser. For this, we need a middleware,
    // which express.js provides us with to get the JSON object from client
    // to the server.

    // After adding app.use(express.json()); in server.js, we can see in cmd:
    // The request body is { name: 'Yashwanth', email: 'ear@gmail.com', phone: '2395350' }

    const {name, email, phone} = req.body;
    if(!name || !phone || !email){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    // if one of the fields are missing, we get a bad response.
    // see badReponse_someFieldsMissing.txt
    // for that we need to add a middleware that converts HTML response to JSON response.
    // So we are creating a middleware folder with errorHandler.js file.

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
        // req.user.id since in validateTokenHandler.js file, we have req.user = decoded.user;
    });
    // since key and value are same, no need to put name = name.
    // this is only in ES6.
    // After this, on doing a POST request.

    // res.status(201).json({message: "Creating a new contact."});
    res.status(201).json(contact);
});
// After this, on doing a POST request:
// http://localhost:5001/api/contacts/
// {
//     "name": "Yashwanth",
//     "email": "ear@gmail.com",
//     "phone": "2357234"
//   }
// Output:
// Status: 201 Created
// Size: 181 Bytes
// Time: 118 ms
// {
//     "name": "Yashwanth",
//     "email": "ear@gmail.com",
//     "phone": "2357234",
//     "_id": "67686a969e44b3f3a9406d17",
//     "createdAt": "2024-12-22T19:37:58.121Z",
//     "updatedAt": "2024-12-22T19:37:58.121Z",
//     "__v": 0
//   }






//@desc Get a contact
//@route GET /api/contacts:id
//@access private
const getContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }

    // res.status(200).json({message: `Get contact of ${req.params.id}.`});
    res.status(200).json(contact);
});
// Can now send a GET with ID.
// http://localhost:5001/api/contacts/67686a969e44b3f3a9406d17
// Status: 200 OK
// Size: 181 Bytes
// Time: 168 ms
// {
//   "_id": "67686a969e44b3f3a9406d17",
//   "name": "Yashwanth",
//   "email": "ear@gmail.com",
//   "phone": "2357234",
//   "createdAt": "2024-12-22T19:37:58.121Z",
//   "updatedAt": "2024-12-22T19:37:58.121Z",
//   "__v": 0
// }


//@desc Update contact
//@route PUT /api/contacts:id
//@access private
// Old
// const updateContact = asyncHandler( async (req, res) => {
//     res.status(200).json({message: `Update contact of ${req.params.id}.`});
// });
// New
const updateContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User doesn't have permissions to update other users contact.");
    };
    // this is to prevent a user from changing the contacts of other users.

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
    );
    // first we find the contact by ID, then we send the body (data)
    // with which we want to update, and then we say its new.

    // res.status(200).json({message: `Update contact of ${req.params.id}.`});
    res.status(200).json(updatedContact);
});
// Now, we can send a PUT request with a BODY.
// http://localhost:5001/api/contacts/67686a969e44b3f3a9406d17
// {
//   "name": "Yashwanth Pindi",
//   "email": "earfulllll@gmail.com",
//   "phone": "235723235344"
// }
// Output:
// {
//   "_id": "67686a969e44b3f3a9406d17",
//   "name": "Yashwanth Pindi",
//   "email": "earfulllll@gmail.com",
//   "phone": "235723235344",
//   "createdAt": "2024-12-22T19:37:58.121Z",
//   "updatedAt": "2024-12-22T19:53:12.716Z",
//   "__v": 0
// }





//@desc Delete contact
//@route DELETE /api/contacts:id
//@access private
const deleteContact = asyncHandler( async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found.");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User doesn't have permissions to delete other users contact.");
    };
    // this is to prevent a user from changing the contacts of other users.

    // await Contact.remove();
    // can't use this as it will remove everything. Use this:
    await Contact.deleteOne({_id: req.params.id});

    // res.status(200).json({message: `Deleting the contact of ${req.params.id}.`});
    res.status(200).json(contact);
});


module.exports = {
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
};