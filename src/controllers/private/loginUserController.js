import sequelize from "../../config/connection.js";
import initModels from '../../models/init-models.js';
import {getUserIdByHeaderToken} from "../../config/jwt.js";
import {baseResponse} from "../../config/response.js";
import bcrypt from "bcrypt";

const model = initModels(sequelize);

const postUploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = getUserIdByHeaderToken(req);

        const user = await model.users.findByPk(userId, null);
        user.profile_picture = file.filename;

        await model.users.update(user.dataValues, {
            where: {
                user_id: userId
            }
        })

        baseResponse(res, "Successfully Uploaded", 200, file.filename);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const postUpdateProfile = async (req, res) => {
    try {
        const userId = getUserIdByHeaderToken(req);
        const body = req.body;

        if (Object.keys(req.body).length <= 0)
            return baseResponse(res, "Success", 200);

        if(body['email']) {
            const isExisted =
                await model.users.findOne({
                    where: { email: body.email }
                })
            
            if (isExisted && isExisted.user_id !== userId)
                return baseResponse(res, "This email is currently used by other user", 400);
        }

        if(!Number.isInteger(body['age']))
            return baseResponse(res, "Age should be integer", 400);

        const user = await model.users.findByPk(userId, null);

        if (body['name']) user.name = body['name'];
        if (body['age']) user.age = body['age'];
        if (body['email']) user.email = body['email'];
        if (body['password']) user.password = bcrypt.hashSync(body['password'], 10);

        await model.users.update(user.dataValues, {
            where: {
                user_id: userId
            }
        })

        const newData = await model.users.findByPk(userId, null);

        baseResponse(res, "Success", 200, newData);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = getUserIdByHeaderToken(req);
        const user = await model.users.findByPk(userId, null);

        baseResponse(res, "Success", 200, user);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

export {
    getProfile,
    postUploadAvatar,
    postUpdateProfile
};