import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT;
//MIDDLEWARES   
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Motor de plantillas

app.set('view engine', 'pug');
app.set('views', './views');

//Rutas
app.get('/', (req,res)=>{
    res.render('index');
})

//inicio de servidor
app.listen(PORT, (err) =>{
    if(err){
        console.error('Error al inciar servidor', err);
        return;
    }
    console.log(`Servidor escuchado en el puerto ${PORT}`);
})