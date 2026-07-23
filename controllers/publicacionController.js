import { Publicacion, Imagen, Usuario, Etiquetas, Valoracion, Comentarios, Denuncia, DenunciaComentario, Seguidor, Notificacion, Coleccion } from '../models/index.js';
import { Op } from 'sequelize';

export const mostrarInicio = async (req, res) => {
    try {
        const categoriaSeleccionada = req.query.categoria;
        const orden = req.query.orden;
        const todasLasEtiquetas = await Etiquetas.findAll();
        const etiquetasUnicas = [...new Set(todasLasEtiquetas.map(e => e.nombre))];

        let opcionesDeBusqueda = {
            where: { estado: 'activa'},
            include: [
                { model: Imagen, as: 'imagenes',
                    where: req.session.usuario ? {} : { licencia: 'sin_copyright'},
                    required: !req.session.usuario ? true : false },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
            ],
            order: [['fecha_publicacion', orden === 'antiguas' ? 'ASC' : 'DESC']]
        };

        if (categoriaSeleccionada) {
            opcionesDeBusqueda.include.push({
                model: Etiquetas,
                as: 'etiquetas', 
                where: { nombre: categoriaSeleccionada },
                required: true
            });
        } else {
            opcionesDeBusqueda.include.push({
                model: Etiquetas,
                as: 'etiquetas'
            });
        }

        const publicaciones = await Publicacion.findAll(opcionesDeBusqueda);
        const fotosPlanas = publicaciones.map(foto => foto.toJSON ? foto.toJSON() : foto);

        res.render('index', { 
            usuario: req.session.usuario,
            fotos: fotosPlanas,
            etiquetasSidebar: etiquetasUnicas,
            filtrosActuales: {categoriaSeleccionada, orden}
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
                    as: 'imagenes',
                    where: req.session.usuario ? {} : { licencia: 'sin_copyright' },
                    required: false
                },
                {
                    model: Usuario, 
                    as: 'Usuario', 
                    attributes: ['nombre_usuario'] 
                },
                {
                    model: Valoracion,
                    as: 'valoraciones'
                },
                {
                    model: Comentarios,
                    as: 'comentarios',
                    include: [{ model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }]
                },
                {
                    model: Etiquetas,
                    as: 'etiquetas'
                }
            ],
            order: [
                [{ model: Comentarios, as: 'comentarios' }, 'createdAt', 'DESC']
            ]
        });

        if (!foto) {
            return res.render('index', {
                usuario: req.session.usuario,
                fotos: [], 
                mensajeAlerta: { status: 'error', text: 'Foto no encontrada' }
            });
        }


        let totalLikes = 0;
        let promedio = 0;
        let totalVotosPuntaje = 0;
        let usuarioDioLike = false;
        
        if (foto.valoraciones && foto.valoraciones.length > 0) {
            const likes = foto.valoraciones.filter(v => v.me_gusta === true);
            totalLikes = likes.length;

            if (req.session.usuario) {
                const miVoto = foto.valoraciones.find(v => v.usuario_id === req.session.usuario.id);
                if (miVoto && miVoto.me_gusta === true) {
                    usuarioDioLike = true;
                }
            }

            const puntajes = foto.valoraciones.filter(v => v.puntaje !== null);
            if (puntajes.length > 0) {
                totalVotosPuntaje = puntajes.length;
                const suma = puntajes.reduce((acc, voto) => acc + voto.puntaje, 0);
                promedio = (suma / totalVotosPuntaje).toFixed(1);
            }
        }

        let misColecciones = [];
        if (req.session.usuario) {
            misColecciones = await Coleccion.findAll({
                where: { usuario_id: req.session.usuario.id }
            });
        }

        res.render('detalleFoto', { 
            usuario: req.session.usuario,
            foto: foto,
            totalLikes,
            promedio,
            totalVotosPuntaje,
            misColecciones,
            usuarioDioLike
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
                usuario: req.session.usuario,
                mensajeAlerta: { status: 'error', text: 'El titulo es obligatorio' } 
            });
        }

        if (!imagenes_base64 || imagenes_base64.length === 0) {
            const todasLasEtiquetas = await Etiquetas.findAll();
            return res.render('nuevaFoto', { 
                etiquetas: todasLasEtiquetas,
                usuario: req.session.usuario,
                mensajeAlerta: { status: 'error', text: 'Debes subir al menos una imagen valida' } 
            });
        }

        const arrayImagenes = Array.isArray(imagenes_base64) ? imagenes_base64 : [imagenes_base64];

        const formatosPermitidos = ['data:image/jpeg', 'data:image/png', 'data:image/jpg', 'data:image/webp'];

        for (const base64Texto of arrayImagenes) {
            const tipo = base64Texto.split(';')[0];
            
            if (!formatosPermitidos.includes(tipo)) {
                const todasLasEtiquetas = await Etiquetas.findAll();
                return res.render('nuevaFoto', { 
                    etiquetas: todasLasEtiquetas,
                    usuario: req.session.usuario,
                    mensajeAlerta: { status: 'error', text: 'Formato no valido. Solo se permiten imagenes (JPG, JPEG, PNG, WEBP).' } 
                });
            }
        }

        const nuevaPublicacion = await Publicacion.create({
            usuario_id: usuarioId,
            titulo: titulo,
            descripcion: descripcion,
            estado: 'activa'
        });

        for (const base64Texto of arrayImagenes) {
            await Imagen.create({
                publicacion_id: nuevaPublicacion.id,
                url_imagen: base64Texto,
                licencia: tiene_copyright === 'si' ? 'copyright' : 'sin_copyright',
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
                usuario: req.session.usuario,
                mensajeAlerta: { 
                status: 'error',
                text: 'Hubo un error al guardar la foto, intente nuevamente'}
            });         
        } catch (e) {
            res.redirect('/');
        }
    }
};

export const darMeGusta = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const usuarioId = req.session.usuario.id;

        const foto = await Publicacion.findByPk(id_publicacion);

        if (!foto || foto.usuario_id === usuarioId) {
            return res.redirect(req.get('referer') || '/');
        }

        const [voto, created] = await Valoracion.findOrCreate({
            where: { usuario_id: usuarioId, publicacion_id: id_publicacion },
            defaults: { me_gusta: true }
        });

        if (!created) {
            await voto.update({ me_gusta: !voto.me_gusta });
        }

        if (created || voto.me_gusta) {
            await Notificacion.create({
                usuario_receptor_id: foto.usuario_id,
                usuario_generador_id: usuarioId,
                tipo_evento: 'valoracion',
                publicacion_id: id_publicacion
            });
        }

        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error en el Me gusta:", error);
        res.redirect('/');
    }
};

export const valorarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { puntaje } = req.body;
        const usuarioId = req.session.usuario.id;

        const foto = await Publicacion.findByPk(id_publicacion);

        if (!foto || foto.usuario_id === usuarioId) {
            return res.redirect(req.get('referer') || '/');
        }

        const [voto, created] = await Valoracion.findOrCreate({
            where: { usuario_id: usuarioId, publicacion_id: id_publicacion },
            defaults: { puntaje: parseInt(puntaje) }
        });

        if (!created) {
            await voto.update({ puntaje: parseInt(puntaje) });
        }

        if (created) {
            await Notificacion.create({
                usuario_receptor_id: foto.usuario_id,
                usuario_generador_id: usuarioId,
                tipo_evento: 'valoracion',
                publicacion_id: id_publicacion
            });
        }

        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error en la valoracion:", error);
        res.redirect('/');
    }
};

export const agregarComentario = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { texto } = req.body;
        const usuarioId = req.session.usuario.id;

        const foto = await Publicacion.findByPk(id_publicacion);

        if (!foto) {
            return res.status(404).send('Publicacion no encontrada');
        }

        if (!foto.comentarios_abiertos) {
            return res.status(403).send('El autor cerro los comentarios de esta publicacion');
        }

        if (texto && texto.trim() !== '') {
            await Comentarios.create({
                publicacion_id: id_publicacion,
                usuario_id: usuarioId,
                texto: texto
            });
        }

        if (foto.usuario_id !== usuarioId) {
            await Notificacion.create({
                usuario_receptor_id: foto.usuario_id,
                usuario_generador_id: usuarioId,
                tipo_evento: 'comentario',
                publicacion_id: id_publicacion
            });
        }

        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error al comentar:", error);
        res.redirect('/');
    }
};

export const denunciarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { motivo, justificacion } = req.body;
        const usuarioId = req.session.usuario.id;
        const publicacion = await Publicacion.findByPk(id_publicacion);

        if (!publicacion || publicacion.usuario_id === usuarioId) {
            return res.redirect(req.get('referer') || '/');
        }

        const denunciaPrevia = await Denuncia.findOne({
            where: {
                publicacion_id: id_publicacion,
                usuario_denunciante_id: usuarioId
            }
        });

        if (!denunciaPrevia) {
            await Denuncia.create({
                publicacion_id: id_publicacion,
                usuario_denunciante_id: usuarioId,
                motivo: motivo,
                justificacion: justificacion
            });
        }

        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error al denunciar:", error);
        res.redirect('/');
    }
};

export const mostrarFormularioEdicion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const publicacion = await Publicacion.findByPk(id_publicacion, {
            include: [{ model: Etiquetas, as: 'etiquetas' }]
        });

        if (!publicacion || publicacion.usuario_id !== req.session.usuario.id) {
            return res.redirect('/');
        }

        const cantidadDenuncias = await Denuncia.count({
            where: { publicacion_id: id_publicacion }
        });

        if (cantidadDenuncias > 0) {
            const publicacionesCompletas = await Publicacion.findAll({
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
                ]
            });

            return res.render('index', { 
                usuario: req.session.usuario,
                fotos: publicacionesCompletas,
                mensajeAlerta: { status: 'error', text: 'Esta publicacion tiene denuncias y no puede ser modificada.' }
            });
        }

        const todasLasEtiquetas = await Etiquetas.findAll();

        res.render('editarFoto', {
            usuario: req.session.usuario,
            foto: publicacion,
            etiquetas: todasLasEtiquetas
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

export const actualizarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { titulo, descripcion, etiquetas, nuevas_etiquetas } = req.body;
        
        const cantidadDenuncias = await Denuncia.count({ where: { publicacion_id: id_publicacion } });
        
        if (cantidadDenuncias === 0) {
            const publicacion = await Publicacion.findOne({
                where: { id: id_publicacion, usuario_id: req.session.usuario.id }
            });

            if (publicacion) {
                await publicacion.update({ titulo, descripcion });

                let idsEtiquetasFinales = [];

                if (etiquetas) {
                    const etiquetasArray = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
                    idsEtiquetasFinales = [...etiquetasArray];
                }

                if (nuevas_etiquetas && nuevas_etiquetas.trim() !== '') {
                    const arrayNuevas = nuevas_etiquetas.split(',').map(tag => tag.trim());
                    for (const nombreTag of arrayNuevas) {
                        if (nombreTag !== '') {
                            const [etiquetaDB] = await Etiquetas.findOrCreate({
                                where: { nombre: nombreTag }
                            });
                            idsEtiquetasFinales.push(etiquetaDB.id);
                        }
                    }
                }
                await publicacion.setEtiquetas(idsEtiquetasFinales);
            }
        }

        res.redirect(`/foto/${id_publicacion}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};


export const mostrarPerfil = async (req, res) => {
    try {
        const usuarioId = req.session.usuario.id;

        const misFotos = await Publicacion.findAll({
            where: { 
                usuario_id: usuarioId,
                estado: 'activa'
            },
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
            ],
            order: [['id', 'DESC']] 
        });

        const cantSeguidores = await Seguidor.count({ where: { usuario_seguido_id: usuarioId } });
        const cantSeguidos = await Seguidor.count({ where: { usuario_seguidor_id: usuarioId } })

        res.render('perfil', {
            usuario: req.session.usuario,
            fotos: misFotos,
            cantSeguidores,
            cantSeguidos
        });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};


export const eliminarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        await Publicacion.destroy({
            where: { 
                id: id_publicacion, 
                usuario_id: req.session.usuario.id 
            }
        });

        res.redirect('/mi-perfil');
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.redirect('/mi-perfil');
    }
};


export const denunciarComentario = async (req, res) => {
    try {
        const { id_comentario } = req.params;
        const { motivo, justificacion } = req.body;
        const usuarioId = req.session.usuario.id;
        const comentario = await Comentarios.findByPk(id_comentario);

        if (!comentario || comentario.usuario_id === usuarioId) {
            return res.redirect(req.get('referer') || '/');
        }

        const denunciaPrevia = await DenunciaComentario.findOne({
            where: { comentario_id: id_comentario, usuario_denunciante_id: usuarioId }
        });

        if (!denunciaPrevia) {
            await DenunciaComentario.create({
                comentario_id: id_comentario,
                usuario_denunciante_id: usuarioId,
                motivo,
                justificacion
            });
        }

        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error("Error al denunciar comentario:", error);
        res.redirect('/');
    }
};


export const mostrarDenunciasComentarios = async (req, res) => {
    try {
        const usuarioId = req.session.usuario.id;

        const publicaciones = await Publicacion.findAll({
            where: { usuario_id: usuarioId },
            include: [
                {
                    model: Comentarios,
                    as: 'comentarios',
                    required: true,
                    include: [
                        { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] },
                        {
                            model: DenunciaComentario,
                            as: 'denuncias',
                            required: true,
                            include: [
                                { model: Usuario, as: 'Denunciante', attributes: ['nombre_usuario'] }
                            ]
                        }
                    ]
                }
            ]
        });

        res.render('panelAutor', {
            usuario: req.session.usuario,
            publicaciones: publicaciones
        });
    } catch (error) {
        console.error("Error al cargar denuncias de comentarios:", error);
        res.redirect('/mi-perfil');
    }
};

export const eliminarComentario = async (req, res) => {
    try {
        const { id_comentario } = req.params;
        const usuarioId = req.session.usuario.id;

        const comentario = await Comentarios.findByPk(id_comentario);

        if (comentario) {
            const publicacion = await Publicacion.findByPk(comentario.publicacion_id);
            
            if (publicacion && publicacion.usuario_id === usuarioId) {
                await comentario.destroy(); 
            }
        }

        res.redirect('/mi-perfil/denuncias');
    } catch (error) {
        console.error("Error al eliminar comentario:", error);
        res.redirect('/mi-perfil/denuncias');
    }
};


export const realizarBusqueda = async (req, res) => {
    try {
        const consulta = req.query.q;
        
        if (!consulta || consulta.trim() === '') {
            return res.redirect('/');
        }

        const terminoDeBusqueda = `${consulta}%`;

        const usuariosEncontrados = await Usuario.findAll({
            where: {
                nombre_usuario: { [Op.iLike]: terminoDeBusqueda }
            },
            attributes: ['id', 'nombre_usuario']
        });

        const publicacionesEncontradas = await Publicacion.findAll({
            where: {
                estado: 'activa',
                [Op.or]: [
                    { titulo: { [Op.iLike]: terminoDeBusqueda } }
                ]
            },
            include: [
                {
                    model: Imagen,
                    as: 'imagenes',
                    where: req.session.usuario ? {} : { licencia: 'sin_copyright' },
                    required: !req.session.usuario ? true : false
                },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
            ],
            order: [['fecha_publicacion', 'DESC']]
        });

        res.render('busqueda', {
            usuario: req.session.usuario,
            consulta: consulta,
            usuarios: usuariosEncontrados,
            fotos: publicacionesEncontradas
        });

    } catch (error) {
        console.error("Error en la busqueda:", error);
        res.redirect('/');
    }
};

export const mostrarPerfilUsuarioBusqueda = async (req, res) => {
    try {
        const { nombre_usuario } = req.params;

        const usuarioObjetivo = await Usuario.findOne({ 
            where: { nombre_usuario: nombre_usuario } 
        });

        if (!usuarioObjetivo) {
            return res.redirect('/');
        }

        const publicaciones = await Publicacion.findAll({
            where: { 
                usuario_id: usuarioObjetivo.id,
                estado: 'activa'
            },
            include: [{ model: Imagen, as: 'imagenes' }]
        });

        const cantSeguidores = await Seguidor.count({ where: { usuario_seguido_id: usuarioObjetivo.id } });
        const cantSeguidos = await Seguidor.count({ where: { usuario_seguidor_id: usuarioObjetivo.id } });

        let loSigo = false;
        if (req.session.usuario) {
            const check = await Seguidor.findOne({
                where: { 
                    usuario_seguidor_id: req.session.usuario.id, 
                    usuario_seguido_id: usuarioObjetivo.id 
                }
            });
            if (check) loSigo = true;
        }

        res.render('perfilPublico', {
            usuario: req.session.usuario,
            usuarioObjetivo: usuarioObjetivo,
            fotos: publicaciones,
            cantSeguidores,
            cantSeguidos,
            loSigo
        });
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        res.redirect('/');
    }
};


export const mostrarFeedSeguidos = async (req, res) => {
    try {
        const mi_id = req.session.usuario.id;

        const seguidos = await Seguidor.findAll({
            where: { usuario_seguidor_id: mi_id },
            attributes: ['usuario_seguido_id']
        });

        const idsSeguidos = seguidos.map(s => s.usuario_seguido_id);

        if (idsSeguidos.length === 0) {
            return res.render('feedSeguidos', {
                usuario: req.session.usuario,
                fotos: []
            });
        }

        const publicacionesFeed = await Publicacion.findAll({
            where: {
                usuario_id: { [Op.in]: idsSeguidos },
                estado: 'activa'
            },
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] }
            ],
            order: [['fecha_publicacion', 'DESC']] 
        });

        res.render('feedSeguidos', {
            usuario: req.session.usuario,
            fotos: publicacionesFeed
        });

    } catch (error) {
        console.error("Error al cargar el feed:", error);
        res.redirect('/');
    }
};

export const toggleComentarios = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const usuarioId = req.session.usuario.id;

        const publicacion = await Publicacion.findByPk(id_publicacion);

        if (publicacion.usuario_id !== usuarioId) {
            return res.status(403).send('No tenes permiso para modificar esta publicacion');
        }

        publicacion.comentarios_abiertos = !publicacion.comentarios_abiertos;
await publicacion.save();

        res.redirect(`/foto/${id_publicacion}`);
        
    } catch (error) {
        console.error("Error al cambiar estado de comentarios", error);
        res.redirect('/');
    }
};