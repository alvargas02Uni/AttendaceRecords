# Configuración del Entorno de Desarrollo para Attendance Records

Este documento proporciona una guía detallada sobre la configuración del entorno de desarrollo para el proyecto **Attendance Record**. Aquí se explican los pasos seguidos para configurar todas las herramientas necesarias, desde Git hasta las tecnologías backend y frontend que se utilizarán en este proyecto.

## Tabla de Contenidos
- [Instalación de Git](#instalación-de-git)
- [Configuración de Git](#configuración-de-git)
- [Creación de Par de Claves SSH y Subida a GitHub](#creación-de-par-de-claves-ssh-y-subida-a-github)
- [Instalación de PostgreSQL](#instalación-de-postgresql)
- [Instalación de Node.js y Express](#instalación-de-nodejs-y-express)
- [Instalación de React](#instalación-de-react)

## Instalación de Git
1. **Descargar Git**: Descargue la versión más reciente de [Git](https://git-scm.com/downloads) desde su página oficial.
2. **Instalación**: Siga los pasos del asistente para instalar Git en su sistema operativo.

Verifique la instalación ejecutando el siguiente comando en la terminal:

```bash
$ git --version
```

Este comando debe devolver la versión instalada de Git.

## Configuración de Git
Para personalizar los commits y relacionarlos con su perfil de GitHub, es necesario configurar su nombre y correo electrónico. Ejecute los siguientes comandos en la terminal:

```bash
$ git config --global user.name "Su Nombre"
$ git config --global user.email "su_correo@ejemplo.com"
```

Esta configuración asegura que cada commit tenga la información correcta del autor.

## Creación de Par de Claves SSH y Subida a GitHub
1. **Generar Par de Claves SSH**:

   Ejecute el siguiente comando para generar un par de claves SSH:

   ```bash
   $ ssh-keygen -t rsa -b 4096 -C "su_correo@ejemplo.com"
   ```

   Durante el proceso, presione `Enter` para aceptar la ubicación predeterminada y opcionalmente, agregue una frase de seguridad para mayor protección.

2. **Subir Clave Pública a GitHub**:

   Copie la clave pública generada:

   ```bash
   $ cat ~/.ssh/id_rsa.pub
   ```

   Vaya a su cuenta de [GitHub](https://github.com/settings/keys), seleccione **New SSH Key** y pegue la clave pública en el campo correspondiente.

## Instalación de PostgreSQL
1. **Descargar e Instalar PostgreSQL**: Vaya al sitio oficial de [PostgreSQL](https://www.postgresql.org/download/) y descargue la versión apropiada para su sistema operativo.
2. **Configurar PostgreSQL**: Durante la instalación, configure el nombre de usuario y contraseña del administrador de la base de datos (por defecto suele ser `postgres`).
3. **Crear Base de Datos**: Una vez instalado, abra `psql` y cree la base de datos para el proyecto ejecutando:

   ```sql
   CREATE DATABASE attendance_records;
   ```

## Instalación de Node.js y Express
1. **Descargar Node.js**: Descargue la versión LTS de [Node.js](https://nodejs.org/en/download/) desde el sitio oficial.
2. **Instalar Node.js**: Siga los pasos del asistente para instalar Node.js, que incluirá `npm` (Node Package Manager).
3. **Inicializar el Proyecto Backend**:

   Navegue al directorio del proyecto y ejecute:

   ```bash
   $ npm init -y
   ```

4. **Instalar Express**:

   Luego instale Express para manejar las rutas del backend:

   ```bash
   $ npm install express
   ```

## Instalación de React
1. **Crear Proyecto con Create React App**: Utilice `create-react-app` para generar la estructura inicial del frontend.

   Navegue al directorio del proyecto y ejecute:

   ```bash
   $ npx create-react-app frontend
   ```

2. **Instalar Dependencias Necesarias**: Instale `react-router-dom` para la navegación entre páginas en la aplicación.

   ```bash
   $ npm install react-router-dom
   ```
