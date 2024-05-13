import { Sequelize } from "sequelize";
import config from "./config.js";

const db = config.database

const sequelize = new Sequelize(
    db.dbname,
    db.username,
    db.password,
    {
        host: db.host,
        port: db.port,
        dialect: db.dialect
    }
)

export default sequelize;
