# Documentación del Hito 4: Despliegue del Clúster de Contenedores

## Tabla de Contenidos
- [Introducción](#introducción)
- [Justificación de la Estructura del Clúster](#justificación-de-la-estructura-del-clúster)
- [Configuración de los Contenedores](#configuración-de-los-contenedores)
  - [Base de Datos (PostgreSQL)](#base-de-datos-postgresql)
  - [Sistema de Logs (Fluentd)](#sistema-de-logs-fluentd)
  - [Backend (Node.js)](#backend-nodejs)
  - [Frontend (React)](#frontend-react)
- [Dockerfile de la Lógica de la Aplicación](#dockerfile-de-la-lógica-de-la-aplicación)
- [Conclusión](#conclusión)

---

## Introducción
En este hito, se documenta el despliegue de un clúster de contenedores utilizando Docker y Docker Compose para la aplicación **Attendance Records**. Este despliegue asegura la modularidad, escalabilidad y facilidad de mantenimiento de los diferentes servicios que componen la aplicación.

---

## Justificación de la Estructura del Clúster

El clúster incluye cuatro servicios principales:

1. **Base de Datos (PostgreSQL):** Almacena datos relacionales como usuarios, laboratorios y asistencias.
2. **Sistema de Logs (Fluentd):** Centraliza los registros de actividad del backend.
3. **Backend (Node.js):** Implementa la lógica de negocio y expone una API RESTful.
4. **Frontend (React):** Proporciona una interfaz de usuario moderna y reactiva.

Esta configuración permite que cada componente sea independiente, escalable y fácil de mantener.

---

## Configuración de los Contenedores

### Base de Datos (PostgreSQL)
- **Contenedor Base:** PostgreSQL 13, seleccionado por su robustez y capacidad para gestionar datos relacionales.
- **Configuración:**
  - Variables de entorno para usuario, contraseña y nombre de la base de datos.
  - Volúmenes para persistencia de datos.
  - Healthcheck para verificar la disponibilidad del servicio con `pg_isready`.

### Sistema de Logs (Fluentd)
- **Contenedor Base:** Fluentd 1.15-debian-1, elegido por su flexibilidad en la gestión de logs.
- **Configuración:**
  - Puerto 24224 expuesto para recibir registros.
  - Healthcheck para garantizar que el servicio esté operativo usando `curl`.

### Backend (Node.js)
- **Contenedor Base:** Node.js 18, ideal para construir aplicaciones con alta concurrencia.
- **Configuración:**
  - Variables de entorno para conectar con el sistema de logs y la base de datos.
  - Healthcheck que valida la disponibilidad del backend mediante `curl` hacia la documentación de la API.

### Frontend (React)
- **Contenedor Base:** Node.js 18, elegido por su compatibilidad con herramientas de desarrollo modernas.
- **Configuración:**
  - Variable de entorno que define la URL del backend.
  - Healthcheck y dependencia del backend para asegurar que el frontend solo se inicie si el backend está saludable.

---

## Dockerfile de la Lógica de la Aplicación

### Backend (Node.js)
- **Base:** Imagen de Node.js 18.
- **Configuración:**
  - Define el directorio de trabajo (`/app`).
  - Copia los archivos de configuración y código al contenedor.
  - Instala dependencias mediante `npm install`.
  - Expone el puerto 5000 para el servicio.
  - Inicia la aplicación con `npm start`.

### Justificación
El uso de Node.js permite manejar múltiples solicitudes simultáneas de manera eficiente. La estructura del Dockerfile asegura que el contenedor sea liviano, reproducible y fácil de mantener.

---

## Conclusión
El diseño del clúster y la configuración de los contenedores aseguran un despliegue escalable y mantenible para la aplicación **Attendance Records**. La modularidad lograda permite futuras mejoras y facilita la integración con otras herramientas y servicios.
