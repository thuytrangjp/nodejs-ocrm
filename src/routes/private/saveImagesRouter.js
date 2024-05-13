import express from "express";
import { middleToken } from "../../config/jwt.js";
import {
    getIsSavedImage,
    getSaveImagesByUserId,
    postSaveImageByImageId
} from "../../controllers/private/saveImagesControllers.js";

const saveImagesRouter = express.Router();

saveImagesRouter.get('/user/:user_id', middleToken, getSaveImagesByUserId);

// By Login User
saveImagesRouter.post('/image/:image_id', middleToken, postSaveImageByImageId);
saveImagesRouter.get('/image/:image_id', middleToken, getIsSavedImage);

export default saveImagesRouter;