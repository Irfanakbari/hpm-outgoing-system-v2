import connection from "@/config/database";
import {DataTypes} from "sequelize";

const Order = connection.define('Order', {
    kode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    part_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    part_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    part_color: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    to1: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    to2: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    date_local: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    time_local: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    date_export: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    time_export: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    weekly: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    type_part: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    seq_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    kd_lot_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    date: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    time: {
        type: DataTypes.TIME,
        allowNull: true
    },
}, {
    tableName: 'orders',
    timestamps: false,
    // Opsi tambahan model jika diperlukan
});

export default Order;