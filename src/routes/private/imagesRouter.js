import express from "express";
import {
    getImageList,
    getImageByName,
    getImageInfo,
    deleteImageById,
    getImageByUserId,
    postImage
} from "../../controllers/private/imagesControllers.js";
import {getUserIdByHeaderToken, middleToken} from "../../config/jwt.js";
import multer, {diskStorage} from "multer";

const imagesRouter = express.Router();

const upload = multer({
    storage: diskStorage({
        destination: process.cwd() + "/public/images",
        filename: (req, file, callback) =>
            callback(null, getUserIdByHeaderToken(req) + "_images_"
                + new Date().getTime() + "." + file.originalname.split('.').pop())
    })
});

imagesRouter.get('/', middleToken, getImageList);
imagesRouter.get('/image/:image_id', middleToken, getImageInfo);
imagesRouter.get('/filter', middleToken, getImageByName);
imagesRouter.get('/user/:user_id', middleToken, getImageByUserId);

// By Login User
imagesRouter.delete('/image/:image_id', middleToken, deleteImageById);
imagesRouter.post('/', middleToken, upload.single("image"), postImage)

export default imagesRouter;