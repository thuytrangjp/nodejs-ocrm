import sequelize from "../../config/connection.js";
import initModels from '../../models/init-models.js';
import { getUserIdByHeaderToken } from "../../config/jwt.js";
import { baseResponse } from "../../config/response.js";
import {Op} from "sequelize";
const model = initModels(sequelize)

const deleteImageById = async (req, res) => {
    try {
        const userId = getUserIdByHeaderToken(req);
        const image_id = req.params['image_id'];
        const targetImage =
            await model.images.findByPk(image_id, null);
        console.log(targetImage.user)
        if (!targetImage)
            return baseResponse(res, "Cannot find any match data", 404);

        if (targetImage.user_id !== userId)
            return baseResponse(res, "Cannot delete this data", 403);

        await model.images.destroy({
            where: {
                image_id: req.params['image_id']
            }
        });

        baseResponse(res, "Success", 201);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const getImageList = async (req, res) => {
    try {
        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query['limit'] ?? DEFAULT_LIMIT) * 1;
        const { count, rows: images } =
            await model.images.findAndCountAll({
                include: ['user'],
                limit,
                offset: limit * ((req.query['page'] ?? DEFAULT_OFFSET) - 1),
            })

        baseResponse(res, "Success", 200, {
            images: images.map((e) => e),
            pagination: {
                count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        console.log(e);
        baseResponse(res, "Server Error", 500);
    }
}

const getImageByName = async (req, res) => {
    try {
        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query.limit ?? DEFAULT_LIMIT) * 1;
        const { count, rows: images } = await model.images.findAndCountAll({
            where: (() => {
                let filterObj = {};
                if (req.query['filterByImageName']) {
                    filterObj = {
                        ...filterObj,
                        image_name: {
                            [Op.like]: '%' + req.query['filterByImageName'] + '%'
                        }
                    }
                }
                return filterObj;
            })(),
            limit,
            offset: limit * ((req.query.page ?? DEFAULT_OFFSET) * 1 - 1)
        });

        baseResponse(res, "Success", 200, {
            images,
            pagination: {
                count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        console.log(e);
        baseResponse(res, "Server Error", 500);
    }
}

const getImageInfo = async (req, res) => {
    try {
        const imageId = req.params["image_id"];
        const image =
            await model.images.findByPk(imageId, {
                include: ['user']
            })

        baseResponse(res, "Success", 200, image);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const getImageByUserId = async (req, res) => {
    try {
        const userId = req.params["user_id"]
        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query.limit ?? DEFAULT_LIMIT) * 1;
        const { count, rows: data } =
            await model.images.findAndCountAll({
                where: {
                    user_id: userId
                },
                limit,
                offset: limit * ((req.query['page'] ?? DEFAULT_OFFSET) - 1),
            })
        baseResponse(res, "Success", 200, {
            images: data.map((e) => e),
            pagination: {
                count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const postImage = async (req, res) => {
    try {
        const file = req.file;
        console.log(file)
        const body = req.body;
        console.log(body);
        if (!file)
            return baseResponse(res, "File image is required", 422);
        if (!body['description'])
            return baseResponse(res, "Description is required", 422);
        const userId = getUserIdByHeaderToken(req);

        const image = await model.images.create({
            image_name: body["image_name"] ?? file.filename,
            description: body["description"],
            link: file.filename,
            user_id: userId
        });

        baseResponse(res, "Successfully Uploaded", 200, image);
    } catch (e) {
        console.log(e)
        baseResponse(res, "Server Error", 500);
    }
}

export {
    deleteImageById,
    getImageList,
    getImageByName,
    getImageInfo,
    getImageByUserId,
    postImage
}