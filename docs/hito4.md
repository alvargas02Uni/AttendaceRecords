# Documentación del Hito 4: Despliegue y Validación del Clúster de Contenedores

## Tabla de Contenidos
- [Introducción](#introducción)
- [Estructura del Clúster de Contenedores](#estructura-del-clúster-de-contenedores)
  - [Justificación de la Estructura](#justificación-de-la-estructura)
  - [Configuración de los Contenedores](#configuración-de-los-contenedores)
- [Dockerfile del Backend](#dockerfile-del-backend)
- [Fichero de Composición del Clúster (docker-compose.yml)](#fichero-de-composición-del-clúster-docker-composeyml)
- [Pruebas del Clúster y CI/CD](#pruebas-del-clúster-y-cicd)
  - [Script de Pruebas del Clúster (test_cluster.sh)](#script-de-pruebas-del-clúster-test_clustersh)
  - [Pipeline de CI/CD](#pipeline-de-cicd)
- [Conclusión](#conclusión)

---

## Introducción

En este hito, se documenta el despliegue de un clúster de contenedores y su validación mediante pruebas automáticas y una configuración de CI/CD. Este enfoque asegura modularidad, escalabilidad y mantenimiento simplificado de la aplicación **Attendance Records**.

---

## Estructura del Clúster de Contenedores

### Justificación de la Estructura
El clúster incluye cuatro servicios principales que cumplen funciones críticas en la aplicación:

1. **Base de Datos (PostgreSQL):** Gestión de datos relacionales como usuarios, laboratorios y asistencias.
2. **Sistema de Logs (Fluentd):** Centralización de registros para facilitar el monitoreo y la depuración.
3. **Backend (Node.js):** Implementa la lógica de negocio y expone una API RESTful.
4. **Frontend (React):** Proporciona una interfaz de usuario dinámica y moderna.

Esta separación permite escalabilidad e independencia entre componentes, facilitando su mantenimiento y mejora.

---

### Configuración de los Contenedores

#### Base de Datos (PostgreSQL)
- **Imagen Base:** PostgreSQL 13, elegida por su robustez y rendimiento en sistemas relacionales.
- **Configuración:**
  - Variables de entorno para credenciales y nombre de la base de datos.
  - Persistencia mediante un volumen (`db-data`).
  - `Healthcheck` con `pg_isready` para verificar disponibilidad.

#### Sistema de Logs (Fluentd)
- **Imagen Base:** Fluentd 1.15-debian-1, seleccionada por su flexibilidad en la gestión de logs.
- **Configuración:**
  - Puerto 24224 expuesto para recibir registros.
  - `Healthcheck` con `curl` para validar su operatividad.

#### Backend (Node.js)
- **Imagen Base:** Node.js 18, adecuada para manejar múltiples solicitudes concurrentes.
- **Configuración:**
  - Variables de entorno para conectar con la base de datos y el sistema de logs.
  - `Healthcheck` para verificar la API en `http://localhost:5000/api-docs`.

#### Frontend (React)
- **Imagen Base:** Node.js 18, elegida por su compatibilidad con herramientas de desarrollo modernas.
- **Configuración:**
  - Variable `REACT_APP_BACKEND_URL` para definir dinámicamente la URL del backend.
  - `Healthcheck` para garantizar su funcionalidad antes de exponerlo.

---

## Dockerfile del Backend

### Descripción
El Dockerfile del backend se basa en Node.js 18 y está diseñado para ser eficiente y reproducible.

- **Estructura:**
  - Define el directorio de trabajo (`/app`).
  - Copia las dependencias y el código fuente al contenedor.
  - Instala las dependencias con `npm install`.
  - Expone el puerto 5000 para el servicio.
  - Inicia la aplicación con `npm start`.

### Justificación
El uso de Node.js 18 garantiza un entorno moderno y optimizado para aplicaciones de alto rendimiento. El diseño del Dockerfile asegura que el contenedor sea liviano y fácilmente replicable.

---

## Fichero de Composición del Clúster (docker-compose.yml)

El archivo `docker-compose.yml` orquesta los servicios del clúster, definiendo cómo interactúan entre ellos y con el entorno.

### Características Principales
- **Servicios:**
  - **db:** Configuración dinámica mediante variables de entorno y persistencia mediante volúmenes.
  - **logs:** Recepción y procesamiento de registros.
  - **backend:** Lógica de negocio con dependencia de `db` y `logs`.
  - **frontend:** Interfaz gráfica con dependencia del `backend`.
- **Redes:** Todos los servicios están conectados a la red `attendancerecords-network` para comunicación interna.
- **Healthchecks:** Implementados en todos los servicios para validar su disponibilidad antes de iniciar dependencias.

---

## Pruebas del Clúster y CI/CD

### Script de Pruebas del Clúster (`test_cluster.sh`)

#### Funcionalidad
1. **Inicio de Servicios:** Levanta el clúster con `docker-compose up -d`.
2. **Validación de Servicios:**
   - Comprueba el backend en `http://localhost:5000/api-docs`.
   - Verifica el frontend en `http://localhost:3000`.
   - Valida el sistema de logs en `http://localhost:24224`.
3. **Gestión de Errores:** En caso de fallos, imprime los logs del servicio afectado.
4. **Limpieza:** Finaliza los servicios con `docker-compose down`.

### Pipeline de CI/CD

#### Descripción
El pipeline definido en `ci.yml` automatiza la validación del clúster en cada `push` o `pull_request`.

#### Pasos Clave
1. **Preparación del Entorno:**
   - Instalación de Docker Compose.
   - Creación de un archivo `.env` con las credenciales necesarias.
2. **Inicio y Validación del Clúster:**
   - Levanta los servicios con `docker-compose up`.
   - Ejecuta `test_cluster.sh` para validar el funcionamiento.
3. **Pruebas Unitarias:**
   - Ejecuta linters y pruebas en el backend y frontend para garantizar calidad de código.
4. **Limpieza:** Finaliza y elimina los servicios con `docker-compose down`.

---

## Conclusión

La documentación y configuración del clúster aseguran un despliegue escalable, mantenible y probado. El enfoque modular permite futuras mejoras y una integración sin interrupciones en entornos de producción.
