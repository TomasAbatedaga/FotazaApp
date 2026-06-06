import { Publicacion, Denuncia, Usuario, Imagen } from '../models/index.js';

export const mostrarPanel = async (req, res) => {
    try {
        const publicaciones = await Publicacion.findAll({
            where: { estado: 'activa' },
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario, as: 'Usuario', attributes: ['nombre_usuario'] },
                { 
                    model: Denuncia, 
                    as: 'denuncias',
                    where: { estado: 'pendiente' },
                    include: [{ model: Usuario, as: 'Denunciante', attributes: ['nombre_usuario'] }]
                }
            ]
        });

        const enPeligro = publicaciones.filter(pub => pub.denuncias.length > 3);

        res.render('panelValidador', {
            usuario: req.session.usuario,
            publicaciones: enPeligro
        });
    } catch (error) {
        console.error("Error en el panel:", error);
        res.redirect('/');
    }
};

export const rechazarDenuncias = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        await Denuncia.update(
            { estado: 'rechazada' },
            { where: { publicacion_id: id_publicacion, estado: 'pendiente' } }
        );
        res.redirect('/validador/panel');
    } catch (error) {
        console.error(error);
        res.redirect('/validador/panel');
    }
};

export const darDeBaja = async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) return res.redirect('/validador/panel');

        await publicacion.update({ estado: 'inactiva' });
        await Denuncia.update(
            { estado: 'aceptada' },
            { where: { publicacion_id: id_publicacion } }
        );

        const cantidadBajadas = await Publicacion.count({
            where: { usuario_id: publicacion.usuario_id, estado: 'inactiva' }
        });

        if (cantidadBajadas >= 3) {
            await Usuario.update(
                { estado: 'inactivo' },
                { where: { id: publicacion.usuario_id } }
            );
        }

        res.redirect('/validador/panel');
    } catch (error) {
        console.error(error);
        res.redirect('/validador/panel');
    }
};