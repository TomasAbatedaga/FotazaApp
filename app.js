import 'dotenv/config';
import express from 'express';
import { sequelize } from './models/index.js';

const app = express();
const PORT = process.env.PORT;
//MIDDLEWARES   
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Motor de plantillas

//Rutas

/*
app.get('/', (req,res)=>{
    res.render('index');
})
*/

//inicio de servidor

sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de datos conectada');
        app.listen(PORT, (err) => {
            if (err) {
                console.error('Error al inciar servidor', err);
                return;
            }
            console.log(`Servidor escuchado en el puerto ${PORT}`);
        })

    })
    .catch((error) => {
        console.error('Error al conectar con PostgreSQL:', error);
    });