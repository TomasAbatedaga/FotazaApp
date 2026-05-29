import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';

export const registrarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email: email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Este email ya esta registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseniaHasheada = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({
            nombre_usuario: nombre_usuario,
            email: email,
            password: contraseniaHasheada, 
            rol: 'usuario',
            estado: 'activo'
        });

        res.status(201).json({ 
            mensaje: 'Usuario registrado con exito', 
            usuario_id: nuevoUsuario.id 
        });

    } catch (error) {
        console.error('Error al registrar el usuario, ', error);
        res.status(500).json({ error: 'Hubo un problema al procesar el registro' });
    }
};

export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email: email } });
        
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe.' });
        }

        const contraseniaValida = await bcrypt.compare(password, usuario.password);
        
        if (!contraseniaValida) {
            return res.status(401).json({ error: 'Contrasenia incorrecta' });
        }
        // creo la cookie para guardar el usuario
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre_usuario,
            rol: usuario.rol
        };

        return res.redirect('/');

    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        res.status(500).json({ error: 'Hubo un problema al procesar el login.' });
    }
};