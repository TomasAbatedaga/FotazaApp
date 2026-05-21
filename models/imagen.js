import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
const Imagen = sequelize.define('Imagen', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    publicacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url_imagen: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    licencia: {
        type: DataTypes.STRING(50),
        defaultValue: 'sin_copyright'
    },
    marca_agua: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'imagenes',
    timestamps: false
});

export default Imagen;