import express from 'express';
import { mostrarInicio } from '../controllers/publicacionController.js';
import { mostrarDetalleFoto } from '../controllers/publicacionController.js';
import { estaLogueado } from '../middlewares/authMiddleware.js';
import { mostrarFormularioNuevo } from '../controllers/publicacionController.js';
import { crearPublicacion } from '../controllers/publicacionController.js';

const router = express.Router();

router.get('/', mostrarInicio);
router.get('/nuevaFoto', estaLogueado, mostrarFormularioNuevo);
router.post('/nuevaFoto', estaLogueado, crearPublicacion);
router.get('/foto/:id', mostrarDetalleFoto);

export default router;