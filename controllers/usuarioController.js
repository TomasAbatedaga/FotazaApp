import { Seguidor } from '../models/index.js';

export const toggleSeguir = async (req, res) => {
    try {
        const usuario_a_seguir_id = parseInt(req.params.id);
        const mi_id = req.session.usuario.id;
        const paginaAnterior = req.get('referer') || '/';

        if (usuario_a_seguir_id === mi_id) {
            return res.redirect(paginaAnterior);
        }

        const relacionExistente = await Seguidor.findOne({
            where: {
                usuario_seguidor_id: mi_id,
                usuario_seguido_id: usuario_a_seguir_id
            }
        });

        if (relacionExistente) {
            await relacionExistente.destroy();
        } else {
            await Seguidor.create({
                usuario_seguidor_id: mi_id,
                usuario_seguido_id: usuario_a_seguir_id
            });
        }

        res.redirect(paginaAnterior);
    } catch (error) {
        console.error("Error al seguir usuario:", error);
        res.redirect('/');
    }
};