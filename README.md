# 📸 Fotaza 2 - Trabajo Práctico Integrador (Web 2)

Aplicación web desarrollada como Trabajo Práctico Integrador. Es una plataforma de publicación, valoración y gestión de fotografías, que incluye distintos roles de usuario, sistema de denuncias, favoritos y filtros combinados, renderizada completamente desde el lado del servidor.

---

## 🚀 Despliegue en Producción
La aplicación se encuentra desplegada y funcionando en un servidor real:
* **URL de la App:** [link]

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Node.js, Express.js
* **Motor de Plantillas:** Pug
* **Base de Datos:** PostgreSQL
* **ORM:** Sequelize
* **Autenticación y Sesiones:** express-session, bcrypt
* **Frontend:** HTML5, CSS (Plantillas nativas)

---

## 💻 Instalación y Ejecución Local

Para correr este proyecto en un entorno local, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone [TU_LINK_DE_GITHUB]
cd FotazaApp
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno (.env)
Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:
```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=admin
DB_NAME=FotazaApp
DB_PORT=5432
SESSION_SECRET=claveSecretaSession
```

### 4. Base de Datos
* Crea una base de datos en PostgreSQL llamada **FotazaApp**.
* Ejecutar: `run db:init` para crear las tablas y la seed de prueba


### 5. Ejecutar la aplicación
```bash
npm start
```
> La app estará disponible en http://localhost:3000

---

## 👥 Usuarios de Prueba

Para evaluar la aplicación, se adjuntan los siguientes usuarios pre-cargados con distintos roles:

* 🛡️ **Usuario Administrador / Validador:**
  * **Usuario:** [admin, Rol(validador)]
  * **Email:** [admin@test.com]
  * **Contraseña:** [123456]
  * **Permisos:** Acceso al panel de validador, dar de baja publicaciones, desestimar/rechazar denuncias.

* 👤 **Usuario Estándar 1:**
  * **Usuario:** [tomas, Rol(usuario)]
  * **Email:** [tomas@test.com]
  * **Contraseña:** [123456]
  * **Permisos:** Subir fotos, dar likes, comentar, puntuar con estrellas, crear colecciones/favoritos, denunciar.

* 👤 **Usuario Estándar 2:**
  * **Usuario:** [daniel, Rol(usuario)]
  * **Email:** [daniel@test.com]
  * **Contraseña:** [123456]
  * **Permisos:** Subir fotos, dar likes, comentar, puntuar con estrellas, crear colecciones/favoritos, denunciar.

  * 👤 **Usuario Estándar 3:**
  * **Usuario:** [facundo, Rol(usuario)]
  * **Email:** [facundo@test.com]
  * **Contraseña:** [123456]
  * **Permisos:** Subir fotos, dar likes, comentar, puntuar con estrellas, crear colecciones/favoritos, denunciar.

  * 👤 **Usuario Estándar 3:**
  * **Usuario:** [lucas, Rol(usuario)]
  * **Email:** [lucas@test.com]
  * **Contraseña:** [123456]
  * **Permisos:** Subir fotos, dar likes, comentar, puntuar con estrellas, crear colecciones/favoritos, denunciar.

---

## 📋 Informe de Desarrollo: Problemas y Soluciones
  
**Gestión y Renderizado de Imágenes**

**Problema:** Durante las pruebas iniciales, se detectaron errores de carga y enlaces rotos al intentar renderizar imágenes en las vistas utilizando URLs externas, lo que afectaba la correcta visualización de las publicaciones.

**Solución:** Se refactorizó la lógica de almacenamiento para procesar y guardar las imágenes en formato Base64. Al almacenar las imágenes como cadenas de texto (TEXT) directamente en la base de datos
