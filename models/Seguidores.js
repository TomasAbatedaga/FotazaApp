import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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

export default Seguidor;