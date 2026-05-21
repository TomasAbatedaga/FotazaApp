import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Etiqueta = sequelize.define('Etiqueta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'etiquetas',
    timestamps: false
});

export default Etiquetas;