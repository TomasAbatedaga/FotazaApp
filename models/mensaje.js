const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mensaje = sequelize.define('Mensaje', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    emisor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receptor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_envio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'mensajes',
    timestamps: false
});

module.exports = Mensaje;