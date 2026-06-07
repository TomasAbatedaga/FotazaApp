import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DenunciaComentario = sequelize.define('DenunciaComentario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentario_id: {
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
        allowNull: true
    }
}, {
    tableName: 'denuncias_comentarios',
    timestamps: true
});

export default DenunciaComentario;