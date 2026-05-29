import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';
import { iniciarSesion } from '../controllers/authController.js';

const router = express.Router();

//-- ruta para el registro --
router.get('/registro', (req, res) =>{
    res.render('registro');
})
router.post('/registro', registrarUsuario);

//-- ruta para el login --
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', iniciarSesion);

export default router;