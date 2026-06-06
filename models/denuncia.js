import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Denuncia = sequelize.define('Denuncia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    publicacion_id: {
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
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente' // pendiente, desestimada, aceptada
    }
}, {
    tableName: 'denuncias',
    timestamps: true
});

export default Denuncia;