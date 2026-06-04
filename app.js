import 'dotenv/config';
import express from 'express';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import publicacionRoutes from './routes/publicacionRoutes.js';

const app = express();
const PORT = process.env.PORT;


//MIDDLEWARES   
app.use(express.static('public'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

//Motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

//Rutas
app.use('/auth', authRoutes);
app.use('/', publicacionRoutes);

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