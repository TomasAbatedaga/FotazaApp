const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comentario = sequelize.define('Comentario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagen_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'comentarios',
    timestamps: false
});

module.exports = Comentario;