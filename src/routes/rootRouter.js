import express from "express";
import authRouter from "./public/authRouter.js";
import userRouter from "./private/usersRouter.js";
import publicRouter from './public/publicRouter.js';
import saveImagesRouter from "./private/saveImagesRouter.js";
import imagesRouter from "./private/imagesRouter.js";
import loginUserRouter from "./private/loginUserRouter.js";
import commentRouter from "./private/commentRouter.js";

const rootRouter = express.Router();

// Public APis
rootRouter.use('/guest', publicRouter);
rootRouter.use('/auth', authRouter);

// Login User's Private APis
rootRouter.use('/me', loginUserRouter);

// Private APis
rootRouter.use('/users', userRouter);
rootRouter.use('/comments', commentRouter);
rootRouter.use('/images', imagesRouter);
rootRouter.use('/save-images', saveImagesRouter);

export default rootRouter;