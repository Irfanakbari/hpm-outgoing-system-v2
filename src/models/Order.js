import connection from "@/config/database";
import {DataTypes} from "sequelize";

const Order = connection.define('Order', {
    kode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
    from: {
        type: DataTypes.STRING(50),
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
    supply: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    next_supply: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ms_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    inventory_category: {
        type: DataTypes.STRING(100),
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
    ps_code: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    order_class: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    seq_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    kd_lot1: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    kd_lot2: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    qty: {
        type: DataTypes.INTEGER,
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
    hns: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    kd_lot_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    part_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    part_no: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: false,
    // Opsi tambahan model jika diperlukan
});

export default Order;