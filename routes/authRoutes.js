import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';

const router = express.Router();
router.get('/registro', (req, res) =>{
    res.render('registro');
})
router.post('/registro', registrarUsuario);

export default router;