import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Valoracion = sequelize.define('Valoracion', {
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
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'valoraciones',
    timestamps: false
});

export default Valoracion;