require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Conexion con exito con la base de datos');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos', err);
    });

module.exports = sequelize;