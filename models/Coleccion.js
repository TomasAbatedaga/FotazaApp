const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coleccion = sequelize.define('Coleccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'colecciones',
    timestamps: false
});

module.exports = Coleccion;