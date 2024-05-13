import express from "express";
import {getUserList, getUserDetail} from "../../controllers/private/usersController.js";
import { middleToken } from "../../config/jwt.js";

const userRouter = express.Router();

//Get User List
userRouter.get('/', middleToken, getUserList);

//Get User Detail
userRouter.get('/:userId', middleToken, getUserDetail);

export default userRouter;
