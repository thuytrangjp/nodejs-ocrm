import sequelize from "../../config/connection.js";
import initModels from '../../models/init-models.js';
import { Op } from "sequelize";
import { baseResponse } from "../../config/response.js";
import bcrypt from "bcrypt";
import { createToken } from "../../config/jwt.js";

const model = initModels(sequelize);

const getUserList = async (req, res) => {
    try {
        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query.limit ?? DEFAULT_LIMIT) * 1;
        const { count, rows: users } = await model.users.findAndCountAll({
            where: (() => {
                let filterObj = {};
                if (req.query['filterByFullName']) {
                    filterObj = {
                        ...filterObj,
                        full_name: {
                            [Op.like]: '%' + req.query['filterByFullName'] + '%'
                        }
                    }
                }
                return filterObj;
            })(),
            limit,
            offset: limit * ((req.query.page ?? DEFAULT_OFFSET) * 1 - 1)
        });

        baseResponse(res, "Success", 200, {
            users,
            pagination: {
                count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        console.log(e);
        console.log(model)
        baseResponse(res, "Server Error", 500);
    }
}

const getUserDetail = async (req, res) => {
    try {
        const user = await model.users.findOne({
            where: {
                user_id: req.params.userId
            }
        });

        if (!user)
            return baseResponse(res, "Cannot find any match data", 404);

        baseResponse(res, "Success", 200, user);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}


const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            age
        } = req.body;

        const isExisted =
            await model.users.findOne({
                where: { email }
            })

        if (isExisted)
            return baseResponse(res, "This email is currently used by other user", 400)

        const user =
            await model.users.create({
                name: name,
                email,
                age,
                password: bcrypt.hashSync(password, 10)
            });

        const responseData = {
            userId: user.user_id,
            name: user.name,
            email: user.email,
            age: user.age
        }

        baseResponse(res, "Success", 200, {
            ...responseData,
            token: createToken(responseData)
        });
    } catch (e) {
        console.log("ahihi", e);
        baseResponse(res, "Server Error", 500);
    }
}

const login = async (req, res) => {
    try {
        const { email: _email, password: _password } = req.body;

        const user =
            await model.users.scope("withPassword").findOne({
                where: { email: _email }
            })

        const isPwCorrect = user ? bcrypt.compareSync(_password, user?.password) : false;

        if (!user || !_password || !isPwCorrect)
            return baseResponse(res, "Invalid Email or Password", 400);

        const responseData = {
            userId: user.user_id,
            name: user.name,
            email: user.email,
        }

        baseResponse(res, "Success", 200, {
            ...responseData,
            token: createToken(responseData)
        });
    } catch (e) {
        baseResponse(res, "Server Error", 500, e);
    }
}

export {
    getUserList,
    getUserDetail,
    signup,
    login
}