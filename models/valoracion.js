import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Valoracion = sequelize.define('Valoracion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    publicacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    me_gusta: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    }
}, {
    tableName: 'valoraciones',
    timestamps: false
});

export default Valoracion;