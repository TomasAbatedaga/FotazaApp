import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Coleccion = sequelize.define('Coleccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'colecciones',
    timestamps: false
});

export default Coleccion;