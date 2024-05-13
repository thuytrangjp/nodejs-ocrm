import sequelize from "../../config/connection.js";
import initModels from '../../models/init-models.js';
import { getUserIdByHeaderToken } from "../../config/jwt.js";
import { baseResponse } from "../../config/response.js";
const model = initModels(sequelize)

const getSaveImagesByUserId = async (req, res) => {
    try {
        const userId = req.params['user_id']
        if (!userId) return baseResponse(res, "Field user_id is required", 400);

        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query.limit ?? DEFAULT_LIMIT) * 1;

        const { count, rows: images } =
            await model.save_images.findAndCountAll({
                where: {
                    user_id: userId
                },
                include: ['image'],
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
        baseResponse(res, "Server Error", 500);
    }
}

const postSaveImageByImageId = async (req, res) => {
    try {
        const userId = getUserIdByHeaderToken(req);
        const imageId = req.params['image_id'];
        const condition = {
            user_id: userId,
            image_id: imageId
        }

        const isExisted = await model.images.findByPk(imageId, null);

        if (!isExisted)
            return baseResponse(res, "Cannot found any matched data", 404);

        const isSaved = await model.save_images.findOne({
            where: condition
        });

        if (isSaved)
            return baseResponse(res, "Already saved", 400);

        const data = await model.save_images.create(condition);

        baseResponse(res, "Success", 200, data);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const getIsSavedImage = async (req, res) => {
    const userId = getUserIdByHeaderToken(req);
    const imageId = req.params["image_id"];
    const condition = {
        user_id: userId,
        image_id: imageId
    }

    const isSaved = await model.save_images.findOne({
        where: condition
    });

    baseResponse(res, "Success", 200, {
        ...condition,
        isSaved: !!isSaved
    })
}
export {
    getSaveImagesByUserId,
    postSaveImageByImageId,
    getIsSavedImage
}