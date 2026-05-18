const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importamos la conexión que hicimos antes

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING(20),
        defaultValue: 'usuario'
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo'
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;