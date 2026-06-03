import { Publicacion, Imagen, Usuario, Etiquetas } from '../models/index.js';

export const mostrarInicio = async (req, res) => {
    try {
        const categoriaSeleccionada = req.query.categoria;

        let opcionesDeBusqueda = {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
            ]
        };

        if (categoriaSeleccionada) {
            opcionesDeBusqueda.include.push({
                model: Etiquetas,
                as: 'etiquetas', 
                where: { nombre: categoriaSeleccionada } 
            });
        } else {
            opcionesDeBusqueda.include.push({
                model: Etiquetas,
                as: 'etiquetas'
            });
        }

        const publicaciones = await Publicacion.findAll(opcionesDeBusqueda);

        res.render('index', { 
            usuario: req.session.usuario,
            fotos: publicaciones,
            categoriaActiva: categoriaSeleccionada 
        });
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const mostrarDetalleFoto = async (req, res) => {
    try {
        const { id } = req.params;
        const foto = await Publicacion.findByPk(id, {
            include: [
                { 
                    model: Imagen, 
                    as: 'imagenes'
                },
                {
                    model: Usuario, 
                    as: 'Usuario', 
                    attributes: ['nombre_usuario'] 
                }
            ]
        });

        if (!foto) {
            return res.status(404).send("Foto no encontrada");
        }

        res.render('detalleFoto', { 
            usuario: req.session.usuario,
            foto: foto 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};