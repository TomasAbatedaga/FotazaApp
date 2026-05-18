const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Publicacion = sequelize.define('Publicacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa'
    },
    comentarios_abiertos: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'publicaciones',
    timestamps: false
});

module.exports = Publicacion;