const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_receptor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_generador_id: {
        type: DataTypes.INTEGER,
        allowNull: true 
    },
    tipo_evento: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'notificaciones',
    timestamps: false
});

module.exports = Notificacion;