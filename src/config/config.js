import dotenv from 'dotenv';
dotenv['config']();

export default {
    database: {
        dbname: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        ttl: process.env.JWT_TTL
    }
}