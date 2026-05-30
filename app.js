import 'dotenv/config';
import express from 'express';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT;


//MIDDLEWARES   
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


//Datos de prueba
const fotosPrueba = [
    { id: 1, titulo: "Atardecer en la playa", autor: "marcos_99", url: "https://picsum.photos/id/1015/400/300", etiquetas: ["Naturaleza", "Tendencias"] },
    { id: 2, titulo: "Ciudad de noche", autor: "luna_x", url: "https://picsum.photos/id/1016/400/300", etiquetas: ["Urbano"] },
    { id: 3, titulo: "Bosque neblinoso", autor: "tomas", url: "https://picsum.photos/id/1018/400/300", etiquetas: ["Naturaleza", "Tendencias"] },
    { id: 4, titulo: "Perrito en la ciudad", autor: "viajero", url: "https://picsum.photos/id/1025/400/300", etiquetas: ["Animales", "Urbano"] }
];


//Rutas
app.get('/', (req, res) => {
    const categoriaSeleccionada = req.query.categoria;
    
    let fotosFiltradas = fotosPrueba;

    if (categoriaSeleccionada) {
        fotosFiltradas = fotosPrueba.filter(f => f.etiquetas.includes(categoriaSeleccionada));
    }

    res.render('index', { 
        usuarioLogueado: req.session.usuario,
        fotos: fotosFiltradas,
        categoriaActiva: categoriaSeleccionada
    });
});

app.get('/foto/:id', (req, res) => {
    const fotoEncontrada = fotosPrueba.find(f => f.id == req.params.id);
    
    if (!fotoEncontrada) {
        return res.status(404).send("Foto no encontrada");
    }

    res.render('detalleFoto', { 
        usuarioLogueado: req.session.usuario,
        foto: fotoEncontrada 
    });
});

app.use('/auth', authRoutes);


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