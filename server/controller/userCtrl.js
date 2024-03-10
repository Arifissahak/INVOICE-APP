const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const Client = require("../models/clienteModel");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if(!findUser) {
        //Create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User already Exists
        throw new Error("User Already Exists");
    }
});

//Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //check if user already exist or not
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

//update the user
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                tax: req?.body?.tax,
                address: req?.body?.address,
                city: req?.body?.city,
                country: req?.body?.country,
                postelcode: req?.body?.postelcode
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//create client by user
const createClient = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;
        // Validate the user ID
        validateMongoDbId(userId);
        // Check if a client with the provided email already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            // Client with the same email already exists, but check if it has a different author ID
            if (existingClient.author.toString() === userId) {
                // Client with the same author ID, so it's a duplicate
                throw new Error("Client already exists for this user");
            }
            // Client with different author ID, so allow registration
        }
        // Create a new client
        const newClient = await Client.create({
            ...req.body,
            author: userId // Set the author field to the user's ID
        });
        // Update the user document with the client's ID
        await User.findByIdAndUpdate(userId, { $push: { clients: newClient._id } });
        res.json(newClient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//GET all client List
const findAllClient = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try{
        const findAllUser = await Client.find({ author: userId });
        res.json(findAllUser);
    } catch (error){
        res.status(400).json({ error: error.message });
    }
});

//GET a client by its name
const findClientByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const userId = req.user._id;
    try {
        const regex = new RegExp(username, 'i'); // 'i' flag for case-insensitive matching
        const foundClients = await Client.find({ author: userId, username: regex });
        if (foundClients.length === 0) {
            return res.status(404).json({ message: "No clients found with similar username" });
        }
        res.json(foundClients);
    } catch (error) {
        // Log the error for debugging
        console.error(error);
        // Provide a generic error message to avoid exposing implementation details
        return res.status(500).json({ message: "Internal server error" });
    }
});

//DELETE a client by user
const deleteClient = asyncHandler(async (req, res) => {
    try {
        const clientId = req.params.id;
        const userId = req.user.id;
        // Validate the user ID and client ID
        validateMongoDbId(userId);
        validateMongoDbId(clientId);
        // Check if the client exists and belongs to the user
        const client = await Client.findOne({ _id: clientId, author: userId });
        if (!client) {
            return res.status(404).json({ message: "Client not found or does not belong to the user" });
        }
        // Delete the client
        await Client.deleteOne({ _id: clientId });
        // Remove the client ID from the user's document
        await User.findByIdAndUpdate(userId, { $pull: { clients: clientId } });
        res.json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//logout the user
// const logout = asyncHandler(async (req, res) => {
//     const cookie = localStorage.;
//     if (!cookie?.refreshToken) {
//         return res.status(400).json({ error: "No Refresh Token in Cookies" });
//     }
//     const refreshToken = cookie.refreshToken;
//     const user = await User.findOne({ refreshToken });

//     if (!user) {
//         res.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//         });
//         return res.sendStatus(401); // Unauthorized
//     }
//     await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: "" });
//     res.clearCookie("refreshToken", {
//         httpOnly: true,
//         secure: true,
//     });
//     res.sendStatus(204); // No Content
// });
// const logout = asyncHandler(async (req, res) => {
//     // The user ID should be available in req.userId after running the middleware
//     const userId = req.user.id;
//     console.log("this is user id", userId);
//     if (!userId) {
//         return res.status(400).json({ error: "No user ID provided" });
//     }

//     try {
//         // Find the user by their ID
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Clear user's session data (e.g., refresh token, session tokens, etc.)
//         // Your implementation may vary depending on how sessions are managed
        
//         // Example: clear refresh token
//         user.refreshToken = "";
//         await user.save();

//         return res.sendStatus(204); // No Content
//     } catch (error) {
//         // If an error occurs
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });
const logout = asyncHandler(async (req, res) => {
    try {
        // The user ID should be available in req.userId after running the middleware
        const userId = req.user.id;
        console.log("this is user id", userId);
        
        if (!userId) {
            return res.status(400).json({ error: "No user ID provided" });
        }

        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Clear user's session data (e.g., refresh token, session tokens, etc.)
        // Your implementation may vary depending on how sessions are managed
        // Example: clear refresh token
        user.refreshToken = null;
        await user.save();

        return res.sendStatus(204); // No Content
    } catch (error) {
        // If an error occurs
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = { 
        createUser,
        loginUserCtrl,
        updateaUser,
        createClient,
        findAllClient,
        findClientByUsername,
        deleteClient,
        logout
    }