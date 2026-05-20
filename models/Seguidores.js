const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seguidor = sequelize.define('Seguidor', {
    usuario_seguido_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    usuario_seguidor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    fecha_seguimiento: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'seguidores',
    timestamps: false
});

module.exports = Seguidor;