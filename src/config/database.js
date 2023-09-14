import {Sequelize} from "sequelize";

const connection = new Sequelize('hpm', 'root', 'root', {
    port: 8889,
    host: 'localhost',
    dialect: 'mysql',
    // logging: msg => logger.debug(msg),
});
export default connection