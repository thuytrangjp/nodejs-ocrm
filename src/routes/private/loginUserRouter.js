//Upload Avatar
import express from "express";
import {middleToken, getUserIdByHeaderToken} from "../../config/jwt.js";
import {getProfile, postUpdateProfile, postUploadAvatar} from "../../controllers/private/loginUserController.js";
import multer, {diskStorage} from "multer";

const loginUserRouter = express.Router();

const upload = multer({
    storage: diskStorage({
        destination: process.cwd() + "/public/avatar",
        filename: (req, file, callback) =>
            callback(null, getUserIdByHeaderToken(req) + "_avatar_"
                                + new Date().getTime() + "." + file.originalname.split('.').pop())
    })
});

//Upload Avatar API
loginUserRouter.post('/upload', middleToken, upload.single('profile_picture'), postUploadAvatar);
loginUserRouter.post('/update', middleToken, postUpdateProfile);
loginUserRouter.get('/', middleToken, getProfile);

export default loginUserRouter;