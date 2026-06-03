import express from 'express';
import { mostrarInicio } from '../controllers/publicacionController.js';
import { mostrarDetalleFoto } from '../controllers/publicacionController.js';

const router = express.Router();

router.get('/', mostrarInicio);
router.get('/foto/:id', mostrarDetalleFoto);

export default router;