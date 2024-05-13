import sequelize from "../../config/connection.js";
import initModels from '../../models/init-models.js';
import { baseResponse } from "../../config/response.js";
import {getUserIdByHeaderToken} from "../../config/jwt.js";

const model = initModels(sequelize);
const getCommentListByImageId = async (req, res) => {
    try {
        const imageId = req.params['image_id']
        if (!imageId) return baseResponse(res, "Field image_id is required", 400);

        const DEFAULT_LIMIT = 10;
        const DEFAULT_OFFSET = 1;
        const limit = (req.query.limit ?? DEFAULT_LIMIT) * 1;

        const { count, rows: comments } =
            await model.comments.findAndCountAll({
                where: {
                    image_id: imageId
                },
                include: ['image'],
                limit,
                offset: limit * ((req.query['page'] ?? DEFAULT_OFFSET) - 1),
            })

        baseResponse(res, "Success", 200, {
            comments: comments.map((e) => e),
            pagination: {
                count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

const postCommentForImageId = async (req, res) => {
    try {
        const userId = getUserIdByHeaderToken(req);
        const imageId = req.params['image_id'];
        const commentContent = req.body["comment_content"].trim();

        if (!commentContent)
            return baseResponse(res, "Field comment_content is required", 422);

        if (commentContent.length > 225)
            return baseResponse(res, "Field comment_content is too long", 422);

        const isExisted = await model.images.findByPk(imageId, null);

        if (!isExisted)
            return baseResponse(res, "Cannot found any matched data", 404);

        const data = await model.comments.create({
            user_id: userId,
            image_id: imageId,
            comment_date: new Date().getTime(),
            comment_content: commentContent
        });

        baseResponse(res, "Success", 200, data);
    } catch (e) {
        baseResponse(res, "Server Error", 500);
    }
}

export {
    getCommentListByImageId,
    postCommentForImageId
}