const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Denuncia = sequelize.define('Denuncia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_denuncia: {
        type: DataTypes.STRING(20),
        allowNull: false // imagen o comentario
    },
    referencia_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_denunciante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    justificacion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente' // pendiente, desestimada, aceptada
    }
}, {
    tableName: 'denuncias',
    timestamps: false
});

module.exports = Denuncia;