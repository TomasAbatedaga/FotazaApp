import { Mensaje, Publicacion, Usuario } from '../models/index.js';
import { Op } from 'sequelize';

export const meInteresa = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const interesadoId = req.session.usuario.id;

        const publicacion = await Publicacion.findByPk(id_publicacion);
        
        if (!publicacion || publicacion.usuario_id === interesadoId) {
            return res.redirect('/');
        }

        const contactoPrevio = await Mensaje.findOne({
            where: {
                emisor_id: interesadoId,
                receptor_id: publicacion.usuario_id,
                publicacion_id: id_publicacion
            }
        });

        if (!contactoPrevio) {
            await Mensaje.create({
                emisor_id: interesadoId,
                receptor_id: publicacion.usuario_id,
                publicacion_id: id_publicacion,
                texto: `Hola, estoy interesado en tu publicacion "${publicacion.titulo}".`
            });
        }

        res.redirect('/mensajes');
        
    } catch (error) {
        console.error("Error al enviar Me Interesa:", error);
        res.redirect('/');
    }
};


export const mostrarMensajes = async (req, res) => {
    try {
        const usuarioId = req.session.usuario.id;

        const mensajes = await Mensaje.findAll({
            where: {
                [Op.or]: [
                    { emisor_id: usuarioId },
                    { receptor_id: usuarioId }
                ]
            },
            include: [
                { model: Usuario, as: 'Emisor', attributes: ['nombre_usuario', 'email'] },
                { model: Usuario, as: 'Receptor', attributes: ['nombre_usuario', 'email'] }
            ],
            order: [['fecha_envio', 'DESC']]
        });

        res.render('mensajes', {
            usuario: req.session.usuario,
            mensajes: mensajes
        });
    } catch (error) {
        console.error("Error al cargar mensajes:", error);
        res.redirect('/');
    }
};

export const responderMensaje = async (req, res) => {
    try {
        const { receptor_id, texto } = req.body;
        const emisor_id = req.session.usuario.id;

        if (texto && texto.trim() !== '') {
            await Mensaje.create({
                emisor_id: emisor_id,
                receptor_id: receptor_id,
                publicacion_id: null,
                texto: texto
            });
        }
        res.redirect('/mensajes');
    } catch (error) {
        console.error("Error al responder:", error);
        res.redirect('/mensajes');
    }
};