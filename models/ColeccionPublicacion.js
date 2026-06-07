import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ColeccionPublicacion = sequelize.define('ColeccionPublicacion', {
    coleccion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    publicacion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'coleccion_publicacion',
    timestamps: false
});

export default ColeccionPublicacion;