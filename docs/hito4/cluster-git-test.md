# Documentación del Fichero de Composición del Clúster y Validación de Tests

## Tabla de Contenidos
- [Introducción](#introducción)
- [Fichero de Composición del Clúster (docker-compose.yml)](#fichero-de-composición-del-clúster-docker-composeyml)
  - [Estructura General](#estructura-general)
  - [Detalles de Configuración](#detalles-de-configuración)
- [Pruebas del Clúster](#pruebas-del-clúster)
  - [Script de Test (test_cluster.sh)](#script-de-test-test_clustersh)
  - [Resultados de las Pruebas](#resultados-de-las-pruebas)
- [Conclusión](#conclusión)

---

## Introducción
Este documento describe la composición del clúster de contenedores utilizando Docker Compose y detalla cómo se implementan y validan las pruebas del clúster. El objetivo es garantizar la correcta configuración y funcionamiento de los servicios de la aplicación **Attendance Records**.

---

## Fichero de Composición del Clúster (docker-compose.yml)

### Estructura General
El fichero `docker-compose.yml` está diseñado para gestionar los servicios principales del clúster:

1. **db**: Servicio de base de datos utilizando PostgreSQL.
2. **logs**: Servicio de logging basado en Fluentd.
3. **backend**: Lógica de negocio de la aplicación desarrollada en Node.js.
4. **frontend**: Interfaz de usuario desarrollada en React.

Todos los servicios están conectados a una red común (`attendancerecords-network`) y utilizan volúmenes para persistencia de datos donde es necesario.

### Detalles de Configuración

1. **Base de Datos (db):**
   - Usa una imagen base de PostgreSQL 13.
   - Incluye variables de entorno (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) para la configuración dinámica.
   - Persistencia de datos a través de un volumen (`db-data`).
   - Healthcheck implementado con `pg_isready` para garantizar que el servicio esté disponible antes de que otros dependan de él.

2. **Sistema de Logs (logs):**
   - Basado en Fluentd, configurado para recibir y procesar registros desde el backend.
   - Puerto 24224 expuesto para recibir logs.
   - Healthcheck configurado con `curl` para verificar su disponibilidad.

3. **Backend:**
   - Utiliza una imagen base de Node.js 18.
   - Configurado para conectarse a la base de datos y al sistema de logs mediante variables de entorno.
   - Healthcheck para validar la disponibilidad de la API en `http://localhost:5000/api-docs`.

4. **Frontend:**
   - Basado en Node.js 18.
   - Configura dinámicamente la URL del backend mediante la variable `REACT_APP_BACKEND_URL`.
   - Healthcheck para validar que el frontend esté operativo.

---

## Pruebas del Clúster

### Script de Test (`test_cluster.sh`)
Este script automatiza la validación del clúster:

1. **Inicia los servicios del clúster:** Utiliza `docker-compose up` para levantar todos los servicios en segundo plano.
2. **Valida la disponibilidad de los servicios:**
   - Comprueba la API del backend (`http://localhost:5000/api-docs`).
   - Verifica la interfaz del frontend (`http://localhost:3000`).
   - Comprueba la disponibilidad del sistema de logs (`http://localhost:24224`).
3. **Muestra logs detallados en caso de fallo:** En caso de error, imprime los registros del servicio afectado para facilitar la depuración.
4. **Finaliza los servicios:** Limpia los contenedores y volúmenes con `docker-compose down`.

### Resultados de las Pruebas
- **Local:** Las pruebas se ejecutaron correctamente, validando que todos los servicios están funcionando según lo esperado.
- **Integración Continua:** El pipeline de GitHub Actions incluye pasos para ejecutar este script, asegurando que el clúster se configure y funcione correctamente en cada cambio del repositorio.

---

## Conclusión
El fichero `docker-compose.yml` y el script `test_cluster.sh` garantizan un despliegue reproducible y validado del clúster de contenedores. Esta configuración asegura la interoperabilidad de los servicios y facilita la detección temprana de errores durante el desarrollo y despliegue.
