import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Rol, Usuario, Etiquetas, Publicacion, Imagen, Comentarios, Valoracion, Denuncia, Seguidor } from '../models/index.js'; 

export const sembrarDatos = async () => {
    try {
        console.log("🌱 Plantando la semilla de datos...");

        const pathImg1 = path.resolve('./scripts/imgPrueba/1.txt');
        const pathImg2 = path.resolve('./scripts/imgPrueba/2.txt');
        const pathImg3 = path.resolve('./scripts/imgPrueba/3.txt')
        
        let base64Real1 = '';
        let base64Real2 = '';
        let base64Real3 = '';

        try {
            base64Real1 = fs.readFileSync(pathImg1, 'utf-8');
            base64Real2 = fs.readFileSync(pathImg2, 'utf-8');
            base64Real3 = fs.readFileSync(pathImg3, 'utf-8');
            console.log("Imágenes de prueba leídas correctamente.");
        } catch (err) {
            console.error("Atención: No se encontraron los archivos 1.txt o 2.txt en scripts/imgPruebas/");
        }

        const passwordHasheada = await bcrypt.hash('123456', 10);

        const roles = await Rol.bulkCreate([
            { nombre: 'usuario' },
            { nombre: 'validador' },
            { nombre: 'admin' }
        ], { returning: true });

        console.log("✔️ Roles creados.");

        const usuarios = await Usuario.bulkCreate([
            { nombre_usuario: 'admin', email: 'admin@test.com', password: passwordHasheada, rol_id: roles[1].id },
            { nombre_usuario: 'tomas', email: 'tomas@test.com', password: passwordHasheada, rol_id: roles[0].id },
            { nombre_usuario: 'daniel', email: 'daniel@test.com', password: passwordHasheada, rol_id: roles[0].id },
            { nombre_usuario: 'facundo', email: 'facundo@test.com', password: passwordHasheada, rol_id: roles[0].id },
            { nombre_usuario: 'lucas', email: 'lucas@test.com', password: passwordHasheada, rol_id: roles[0].id }
        ], { returning: true });

        console.log("5 Usuarios creados.");

        const etiquetas = await Etiquetas.bulkCreate([
            { nombre: 'F1' }, 
            { nombre: 'Mascotas' }, 
            { nombre: 'Autos' },
            { nombre: 'Amor' },
            { nombre: 'Pasion' }
        ], { returning: true });

        console.log("Etiquetas creadas.");

        const pub1 = await Publicacion.create({ 
            usuario_id: usuarios[1].id, 
            titulo: 'Porsche 911 Rexy', 
            descripcion: 'Auto de carrea para IMSA.' 
        });

        const pub2 = await Publicacion.create({ 
            usuario_id: usuarios[2].id, 
            titulo: 'Mi perro', 
            descripcion: 'Esta con cara rara.' 
        });

        const pub3 = await Publicacion.create({ 
            usuario_id: usuarios[3].id, 
            titulo: 'F1 Mercedes', 
            descripcion: 'Auto de formula 1 del equipo de mercedes.' 
        });

        console.log("Publicaciones creadas.");

        await Imagen.bulkCreate([
            { publicacion_id: pub1.id, url_imagen: base64Real3, licencia: 'sin_copyright' },
            { publicacion_id: pub3.id, url_imagen: base64Real2, licencia: 'sin_copyright' },
            { publicacion_id: pub2.id, url_imagen: base64Real1, licencia: 'copyright', marca_agua: 'Copyright_Prueba2' }
        ]);

        await pub1.setEtiquetas([etiquetas[2].id, etiquetas[4].id]);
        await pub2.setEtiquetas([etiquetas[1].id, etiquetas[3].id]);
        await pub3.setEtiquetas([etiquetas[0].id, etiquetas[2].id, etiquetas[4].id]);

        console.log("Imágenes reales y etiquetas vinculadas.");

        await Comentarios.create({ 
            publicacion_id: pub1.id, 
            usuario_id: usuarios[2].id, 
            texto: 'Tremendo auto.' 
        });

        await Valoracion.create({
            publicacion_id: pub1.id,
            usuario_id: usuarios[2].id,
            me_gusta: true,
            puntaje: 5
        });

        console.log("Comentarios y valoraciones creados.");

        await Denuncia.bulkCreate([
            { publicacion_id: pub3.id, usuario_denunciante_id: usuarios[1].id, motivo: 'Contenido Inapropiado', justificacion: 'La foto está borrosa y no cumple las normas.' },
            { publicacion_id: pub3.id, usuario_denunciante_id: usuarios[2].id, motivo: 'Derechos de Autor', justificacion: 'Esta imagen fue robada de otra página.' },
            { publicacion_id: pub3.id, usuario_denunciante_id: usuarios[4].id, motivo: 'Otro', justificacion: 'No me parece adecuada para esta plataforma.' },
            { publicacion_id: pub3.id, usuario_denunciante_id: usuarios[0].id, motivo: 'Spam', justificacion: 'Spam.' }
        ]);

        console.log("4 Denuncias generadas para la pub3.");

        await Seguidor.create({ 
            usuario_seguido_id: usuarios[1].id, 
            usuario_seguidor_id: usuarios[2].id 
        });

        console.log("Semilla de datos plantada con éxito!");
    } catch (error) {
        console.error("Error al sembrar los datos:", error);
        throw error; 
    }
};