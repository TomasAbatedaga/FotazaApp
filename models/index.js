import sequelize from '../config/db.js';

import Usuario from './Usuario.js';
import Publicacion from './Publicacion.js';
import Imagen from './Imagen.js';
import Comentarios from './Comentarios.js';
import Valoracion from './Valoracion.js';
import Denuncia from './Denuncia.js';
import Coleccion from './Coleccion.js';
import Etiquetas from './Etiquetas.js';
import Mensaje from './Mensaje.js';
import Seguidores from './Seguidores.js';

// Usuario 1...N Publicacion 
Usuario.hasMany(Publicacion, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Publicacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Publicacion 1...N Imagen
Publicacion.hasMany(Imagen, { foreignKey: 'publicacion_id', onDelete: 'CASCADE' });
Imagen.belongsTo(Publicacion, { foreignKey: 'publicacion_id' });

// Imagen 1...N Comentario
Imagen.hasMany(Comentarios, { foreignKey: 'imagen_id', onDelete: 'CASCADE' });
Comentarios.belongsTo(Imagen, { foreignKey: 'imagen_id' });

// Usuario 1...N Comentario
Usuario.hasMany(Comentarios, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Comentarios.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Imagen 1...N Valoracion
Imagen.hasMany(Valoracion, { foreignKey: 'imagen_id', onDelete: 'CASCADE' });
Valoracion.belongsTo(Imagen, { foreignKey: 'imagen_id' });

// Usuario 1...N Valoracion
Usuario.hasMany(Valoracion, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Valoracion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Usuario 1...N Coleccion
Usuario.hasMany(Coleccion, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Coleccion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Usuario 1...N Denuncia
Usuario.hasMany(Denuncia, { foreignKey: 'usuario_denunciante_id' });
Denuncia.belongsTo(Usuario, { foreignKey: 'usuario_denunciante_id' });

// Publicacion N...M Coleccion
Coleccion.belongsToMany(Publicacion, { 
    through: 'coleccion_publicaciones', 
    foreignKey: 'coleccion_id',
    timestamps: false 
});
Publicacion.belongsToMany(Coleccion, { 
    through: 'coleccion_publicaciones', 
    foreignKey: 'publicacion_id',
    timestamps: false 
});

// Publicacion N...M Etiqueta
Publicacion.belongsToMany(Etiquetas, { 
    through: 'publicacion_etiquetas', 
    foreignKey: 'publicacion_id',
    timestamps: false 
});
Etiquetas.belongsToMany(Publicacion, { 
    through: 'publicacion_etiquetas', 
    foreignKey: 'etiqueta_id',
    timestamps: false 
});

// Usuario 1...N Mensaje (es doble porque una es para emisor y otro para receptor)
Usuario.hasMany(Mensaje, { as: 'MensajesEnviados', foreignKey: 'emisor_id', onDelete: 'CASCADE' });
Usuario.hasMany(Mensaje, { as: 'MensajesRecibidos', foreignKey: 'receptor_id', onDelete: 'CASCADE' });
Mensaje.belongsTo(Usuario, { as: 'Emisor', foreignKey: 'emisor_id' });
Mensaje.belongsTo(Usuario, { as: 'Receptor', foreignKey: 'receptor_id' });


// Usuario N...M Usuario (es doble porque una es para seguidores y otro para seguidos)
Usuario.belongsToMany(Usuario, { 
    as: 'Seguidores', 
    through: Seguidores, 
    foreignKey: 'usuario_seguido_id', 
    otherKey: 'usuario_seguidor_id' 
});
Usuario.belongsToMany(Usuario, { 
    as: 'Seguidos', 
    through: Seguidores, 
    foreignKey: 'usuario_seguidor_id', 
    otherKey: 'usuario_seguido_id' 
});

export {
    sequelize,
    Usuario,
    Publicacion,
    Imagen,
    Comentarios,
    Valoracion,
    Denuncia,
    Coleccion,
    Etiquetas,
    Mensaje,
    Seguidores
};