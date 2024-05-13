import express from "express";
import {
    signup,
    login
} from "../../controllers/private/usersController.js";

const authRouter = express.Router();

// Signup API
authRouter.post('/signup', signup);

// Login API
authRouter.post('/login', login);

export default authRouter;