import {verifyToken} from "./jwt.js";

export const baseResponse = (res, message, statusCode, data) => {
    res.send({
        datetime: new Date(),
        message: message,
        status: statusCode,
        data: data
    })
}
