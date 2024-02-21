import {Sequelize} from "sequelize";

const connection = new Sequelize('hpm_db', 'hpm_user', 'vuteqhpmdb', {
    port: 3306,
    host: '103.224.124.83',
    dialect: 'mysql',
    // logging: msg => logger.debug(msg),
});
export default connection