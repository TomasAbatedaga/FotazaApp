import express from 'express';
import { mostrarInicio } from '../controllers/publicacionController.js';
import { mostrarDetalleFoto } from '../controllers/publicacionController.js';
import { estaLogueado } from '../middlewares/authMiddleware.js';
import { mostrarFormularioNuevo } from '../controllers/publicacionController.js';
import { crearPublicacion } from '../controllers/publicacionController.js';
import { darMeGusta } from '../controllers/publicacionController.js';
import { valorarPublicacion } from '../controllers/publicacionController.js';
import { agregarComentario } from '../controllers/publicacionController.js';
import { denunciarPublicacion } from '../controllers/publicacionController.js';
import { esValidador } from '../middlewares/authMiddleware.js';
import { mostrarPanel } from '../controllers/validadorController.js';
import { rechazarDenuncias } from '../controllers/validadorController.js';
import { darDeBaja } from '../controllers/validadorController.js';
import { mostrarFormularioEdicion } from '../controllers/publicacionController.js';
import { actualizarPublicacion } from '../controllers/publicacionController.js';
import { mostrarPerfil } from '../controllers/publicacionController.js';
import { eliminarPublicacion } from '../controllers/publicacionController.js';

const router = express.Router();

router.get('/', mostrarInicio);
router.get('/nuevaFoto', estaLogueado, mostrarFormularioNuevo);
router.post('/nuevaFoto', estaLogueado, crearPublicacion);
router.get('/foto/:id', mostrarDetalleFoto);
router.post('/publicacion/:id_publicacion/like', estaLogueado, darMeGusta);
router.post('/publicacion/:id_publicacion/valorar', estaLogueado, valorarPublicacion);
router.post('/publicacion/:id_publicacion/comentar', estaLogueado, agregarComentario);
router.post('/publicacion/:id_publicacion/denunciar', estaLogueado, denunciarPublicacion);
router.get('/validador/panel', esValidador, mostrarPanel);
router.post('/validador/rechazar/:id_publicacion', esValidador, rechazarDenuncias);
router.post('/validador/baja/:id_publicacion', esValidador, darDeBaja);
router.get('/publicacion/:id_publicacion/editar', estaLogueado, mostrarFormularioEdicion);
router.post('/publicacion/:id_publicacion/editar', estaLogueado, actualizarPublicacion);
router.get('/mi-perfil', estaLogueado, mostrarPerfil);
router.post('/publicacion/:id_publicacion/eliminar', estaLogueado, eliminarPublicacion);


export default router;