import connection from "@/config/database";
import {DataTypes} from "sequelize";


const History = connection.define('History', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_part: {
        type: DataTypes.STRING
    },
    barcode_pcc: {
        type: DataTypes.STRING
    }                       ,
    timestamp: {
        type: DataTypes.DATE   ,
        default: new Date()
    },
    operator: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        default: 'GAGAL'
    }
}, {
    tableName: 'history',
    createdAt: 'timestamp',
    updatedAt: false
});

export default History;