import sequelize from '../config/db.js'; 
import { sembrarDatos } from './seed.js';

const inicializarBaseDeDatos = async () => {
    try {
        console.log("Conectando y sincronizando base de datos");
        await sequelize.sync({ force: true }); 
        console.log("Tablas creadas desde cero.");

        await sembrarDatos();

        console.log("Proceso terminado! Base de datos lista para usar.");
        process.exit(0);
    } catch (error) {
        console.error("Error fatal inicializando la base de datos:", error);
        process.exit(1);
    }
};

inicializarBaseDeDatos();