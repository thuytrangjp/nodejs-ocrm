import jwt from 'jsonwebtoken';
import config from "./config.js";
import {baseResponse} from "./response.js";

// Create Token
export const createToken = (data) => {
    return jwt.sign(data, config.jwt.secret, {
        expiresIn: config.jwt.ttl
    });
}


// Check Token
// Error:
// - Expired
// - Invalid Secret Key
// - Invalid Token Format
export const verifyToken = (token) => {
    // return jwt.verify(token, config.jwt, (err, decode) => err);
    return jwt.verify(token, config.jwt.secret, err => err);
}


// Decode Token
export const decodeToken = (token) => {
    return jwt.decode(token);
}

export const getCurrentToken = (req) => {
    return req.headers.authorization;
}
export const getUserIdByHeaderToken = (req) => {
    const json = decodeToken(getCurrentToken(req));
    return json.userId;
}

export const middleToken = (req, res, next) => {
    const token = getCurrentToken(req);
    if (verifyToken(token) === null) {
        return next();
    }
    return baseResponse(res, "No Permission", 401);
}