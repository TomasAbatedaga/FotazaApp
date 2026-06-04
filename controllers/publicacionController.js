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
        const fotosPlanas = publicaciones.map(foto => foto.toJSON());

        res.render('index', { 
            usuario: req.session.usuario,
            fotos: fotosPlanas,
            categoriaActiva: categoriaSeleccionada,
        });
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        res.render('index', {
            usuario: req.session.usuario,
            fotos: [],
            mensajeAlerta: { status: 'error', text: 'Error al cargar las publicaciones' }
        });
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
            return res.render('index', {
                usuario: req.session.usuario,
                fotos: [], 
                mensajeAlerta: { status: 'error', text: 'Foto no encontrada' }
            });
        }

        res.render('detalleFoto', { 
            usuario: req.session.usuario,
            foto: foto 
        });
    } catch (error) {
        console.error(error);
        return res.render('index', {
            usuario: req.session.usuario,
            fotos: [],
            mensajeAlerta: { status: 'error', text: 'Ocurrió un error al cargar la foto' }
        });
    }
};

export const mostrarFormularioNuevo = async (req,res)=>{
    try{
        const etiquetasDisponibles = await Etiquetas.findAll();

        res.render('nuevaFoto', {
            usuario: req.session.usuario,
            etiquetas: etiquetasDisponibles
        });
    } catch (error) {
        console.error(error);
        res.render('nuevaFoto', {
            usuario: req.session.usuario,
            etiquetas: [],
            mensajeAlerta: { status: 'error', text: 'Ocurrio un error al cargar el formulario' }
        });
    }
};

export const crearPublicacion = async (req,res)=>{
    try{
        const { titulo, descripcion, tiene_copyright, imagenes_base64, etiquetas, nuevas_etiquetas } = req.body;
        const usuarioId = req.session.usuario.id;

        if (!titulo || titulo.trim() === '') {
            const todasLasEtiquetas = await Etiquetas.findAll(); 
            return res.render('nuevaFoto', { 
                etiquetas: todasLasEtiquetas,
                mensajeAlerta: { status: 'error', text: 'El titulo es obligatorio' } 
            });
        }

        if (!imagenes_base64 || imagenes_base64.length === 0) {
            const todasLasEtiquetas = await Etiquetas.findAll();
            return res.render('nuevaFoto', { 
                etiquetas: todasLasEtiquetas,
                mensajeAlerta: { status: 'error', text: 'Debes subir al menos una imagen valida' } 
            });
        }


        const nuevaPublicacion = await Publicacion.create({
            usuario_id: usuarioId,
            titulo: titulo,
            descripcion: descripcion,
            estado: 'activa'
        });

        const arrayImagenes = Array.isArray(imagenes_base64) ? imagenes_base64 : [imagenes_base64];

        const aplicarMarca = tiene_copyright === 'si' ? 'watermark_logo.png' : null;

        for (const base64Texto of arrayImagenes) {
            await Imagen.create({
                publicacion_id: nuevaPublicacion.id,
                url_imagen: base64Texto,
                licencia: tiene_copyright === 'si' ? 'copyright' : 'sin_copyright',
                marca_agua: aplicarMarca
            });
        }

        let idsEtiquetasFinales = [];

        if (etiquetas) {
            const etiquetasArray = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
            idsEtiquetasFinales = [...etiquetasArray];
        }

        if (nuevas_etiquetas && nuevas_etiquetas.trim() !== '') {
            const arrayNuevas = nuevas_etiquetas.split(',').map(tag => tag.trim());
            
            for (const nombreTag of arrayNuevas) {
                if (nombreTag !== '') {
                    const [etiquetaDB, created] = await Etiquetas.findOrCreate({
                        where: { nombre: nombreTag }
                    });
                    idsEtiquetasFinales.push(etiquetaDB.id);
                }
            }
        }

        if (idsEtiquetasFinales.length > 0) {
            await nuevaPublicacion.addEtiquetas(idsEtiquetasFinales);
        }

        res.redirect('./');

    } catch (error) {
        console.error("Error al crear la publicacion", error);
        try{
            const todasLasEtiquetas = await Etiquetas.findAll();
            res.render('nuevaFoto', {
                etiquetas: todasLasEtiquetas,
                mensajeAlerta: { 
                status: 'error',
                text: 'Hubo un error al guardar la foto, intente nuevamente'}
            });         
        } catch (e) {
            res.redirect('/');
        }
    }
};