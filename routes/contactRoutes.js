const express = require("express");
const router = express.Router();
const {
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
} = require("../controllers/contactController");


const validateToken = require("../middleware/validateTokenHandler");
router.use(validateToken);
// Finally, to make all the routes as protected and must have a valid
// token to perform operations, we add this.
// if we want to add it in only some of the routes, then we can add it
// like how we used in the userRoutes.js like this:
// router.get("/current", validateToken, currentUser);




// this get method will give us the request and response.
// since we are using the app.use middleware in server.js
// to redirect the traffic to this file, we need to use 
// the get feature.
// router.route('/').get((req, res) => {
//     // res.send("Get all contacts.");
//     // res.json({message: "Get all contacts."});
//     res.status(200).json({message: "Get all contacts."});
// });

// router.route('/').get(getContacts);
// router.route('/').post(createContact);
// either the above way in 2 lines or
router.route('/').get(getContacts).post(createContact);



// Same here:
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);
// or
// router.route('/:id').get(getContact);
// router.route('/:id').put(updateContact);
// router.route('/:id').delete(deleteContact);
// On Thunder client:
// Put request to:
// http://localhost:5000/api/contacts/:001 or without colon: http://localhost:5000/api/contacts/1
// Output: 
// {
//     "message": "Update contact of :001."
//   }




module.exports = router;