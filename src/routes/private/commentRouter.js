import express from "express";
import {getCommentListByImageId, postCommentForImageId} from "../../controllers/private/commentsControllers.js";
import { middleToken } from "../../config/jwt.js";


const commentRouter = express.Router();

//Get Comment List
commentRouter.get('/image/:image_id', middleToken, getCommentListByImageId);

//Post Comment
commentRouter.post('/image/:image_id', middleToken, postCommentForImageId);

export default commentRouter;