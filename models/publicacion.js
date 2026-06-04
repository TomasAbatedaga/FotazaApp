import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'publicaciones',
    timestamps: false
});

export default Publicacion;