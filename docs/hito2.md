# Integración Continua

## Índice
1. [Elección y Configuración del Gestor de Tareas](#elección-y-configuración-del-gestor-de-tareas)
2. [Elección de la Biblioteca de Aserciones y Test Runner](#elección-de-la-biblioteca-de-aserciones-y-test-runner)
3. [Integración de Pruebas con Herramientas de Construcción del Proyecto](#integración-de-pruebas-con-herramientas-de-construcción-del-proyecto)
4. [Sistema Online de Pruebas e Integración Continua](#sistema-online-de-pruebas-e-integración-continua)
5. [Implementación y Ejecución de Tests](#implementación-y-ejecución-de-tests)

---

## 1. Elección y Configuración del Gestor de Tareas

Para la gestión de tareas en este proyecto, tanto en el backend (Node.js) como en el frontend (React), he optado por utilizar `npm scripts`. Este enfoque permite unificar el control de las distintas fases de desarrollo, pruebas y despliegue sin necesidad de configuraciones adicionales, aprovechando la flexibilidad de `npm` para ejecutar comandos de construcción, pruebas y control de calidad en un solo lugar.

- **Uniformidad**: `npm scripts` está completamente integrado en el ecosistema de Node.js, permitiendo la ejecución de tareas de forma nativa en ambos entornos. Esto facilita que cualquier colaborador pueda manejar el proyecto de manera intuitiva y sin curva de aprendizaje adicional.
- **Eficiencia**: Los scripts en `npm` eliminan la necesidad de herramientas adicionales para gestionar procesos comunes (como pruebas, linting, y formateo), lo que reduce la complejidad en el flujo de desarrollo.
- **Automatización**: Permite configurar tareas automatizadas para la integración continua y asegurar la consistencia de código y el éxito de las pruebas antes del despliegue.

### Configuración en `backend/package.json`

```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "build": "react-scripts build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "db:start": "docker-compose up -d",
    "db:stop": "docker-compose down",
    "ci:test": "npm run lint && npm run test"
}
```

- **`start`**: Ejecuta node server.js para iniciar el servidor en modo producción.
- **`dev`**: Ejecuta nodemon server.js, iniciando el servidor en modo desarrollo y reiniciándolo automáticamente al detectar cambios. nodemon es ideal para desarrollo porque reduce la necesidad de reiniciar manualmente.
- **`test`**: Ejecuta jest --coverage para correr todas las pruebas y generar un informe de cobertura. La cobertura permite identificar las áreas del código que no están siendo probadas, garantizando una mejor calidad del software.
- **`build`**: Usa react-scripts build para compilar la aplicación en una versión optimizada para producción (este script puede no ser necesario en el backend, por lo que podría ser revisado).
- **`lint`**: Ejecuta eslint . para verificar la calidad del código en el proyecto. Esto ayuda a mantener un estilo consistente y a detectar errores comunes.
- **`format`**: Ejecuta prettier --write ., aplicando un formato uniforme en el código para mejorar la legibilidad y reducir las diferencias en el estilo de código.
- **`db:start`** y **`db:stop`**: Utilizan docker-compose up -d y docker-compose down para iniciar y detener la base de datos en contenedores Docker. Esto simplifica la gestión de la base de datos en el entorno de desarrollo.
- **`ci:test`**: Ejecuta lint seguido de test, asegurando que el código esté limpio y pase todas las pruebas antes de que se permita desplegar, lo cual es clave en entornos de CI.

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --watchAll=false",
    "eject": "react-scripts eject",
    "lint": "eslint .",
    "format": "prettier --write .",
    "ci:test": "npm run lint && npm run test"
}
```

- **`start`**: Ejecuta react-scripts start para iniciar el servidor de desarrollo de React, lo que permite ver los cambios en tiempo real.
- **`build`**: Usa react-scripts build para compilar la aplicación. Esto genera archivos minificados y optimizados para una mejor performance en el despliegue.
- **`test`**: Ejecuta react-scripts test --watchAll=false para correr todas las pruebas sin que el comando se quede en espera.
- **`eject`**: Usa react-scripts eject para extraer la configuración de Create React App y personalizar el entorno de desarrollo. 
- **`lint`**: Ejecuta eslint, ayudando a mantener un código limpio y libre de errores.
- **`format`**: Ejecuta prettier --write . para formatear el código automáticamente, asegurando un estilo consistente.
- **`ci:test`**: Ejecuta lint y test, útil en la integración continua para verificar que tanto el estilo como las pruebas sean correctas antes del despliegue.

#### Configuración de Jest
En ambos `package.json`, Jest está configurado con una sección `jest` específica:
- **transformIgnorePatterns**: Asegura que las dependencias específicas, como `axios` y `@mui/material`, sean transformadas y probadas adecuadamente.
- **testMatch**: Define la estructura de los archivos de prueba, buscando aquellos que se encuentren en carpetas `__tests__` o que terminen en `.test.js`.

---

## 2. Elección de la Biblioteca de Aserciones y Test Runner

**Herramienta Elegida**: `Jest`

Para realizar las pruebas en el proyecto, tanto en el backend como en el frontend, se ha elegido `Jest` como biblioteca de aserciones y test runner principal. Jest proporciona un entorno robusto y altamente configurable para realizar pruebas unitarias y de integración, asegurando calidad del código y simplificando la detección de errores.

- **Todo-en-Uno**: Jest no solo es una biblioteca de aserciones, sino que también incluye un test runner, simplificando la configuración y el pipeline de pruebas. Esto evita la necesidad de herramientas adicionales para ejecutar y organizar las pruebas.
- **Potencia y Facilidad**: Jest ofrece una API intuitiva y extensa que permite realizar pruebas complejas de manera eficiente, con funcionalidades avanzadas como mocks, stubs y snapshots, que facilitan la simulación de dependencias y la verificación del comportamiento de la aplicación.
- **Soporte BDD/TDD**: Jest permite implementar tanto el desarrollo basado en comportamiento como el desarrollo basado en pruebas, proporcionando flexibilidad en el enfoque de pruebas. Esto permite escribir pruebas antes de implementar la funcionalidad o probar el comportamiento de la aplicación en su conjunto.
- **Compatibilidad**: Jest es ideal para proyectos JavaScript ya que funciona bien tanto en el backend con Node.js como en el frontend con React. Esto asegura una experiencia de pruebas unificada en toda la aplicación, evitando la necesidad de configurar múltiples herramientas de prueba para cada parte del proyecto.

### Configuración e Implementación
La configuración de Jest se ha realizado en los archivos `package.json` del backend y del frontend, con ajustes específicos para cada entorno y utilizando la estructura de carpetas `/__tests__/` para organizar los archivos de prueba.

---

## 3. Integración de Pruebas con Herramientas de Construcción del Proyecto

Para estandarizar y simplificar la ejecución de tareas en el proyecto, se ha configurado un archivo `Makefile` que centraliza los comandos comunes, como pruebas, linting, compilación y gestión de la base de datos. Esto permite al entorno de CI ejecutar estas tareas de manera consistente y rápida, sin tener que recordar múltiples comandos.

### Makefile

El `Makefile` está diseñado para facilitar la ejecución de las tareas tanto en el backend como en el frontend. A continuación se detalla la configuración de cada tarea en el archivo:

```makefile
test-backend:
	npm run test --prefix backend

test-frontend:
	npm run test --prefix frontend

test: test-backend test-frontend

lint-backend:
	npm run lint --prefix backend

lint-frontend:
	npm run lint --prefix frontend

lint: lint-backend lint-frontend

build-frontend:
	npm run build --prefix frontend

db-start:
	npm run db:start --prefix backend

db-stop:
	npm run db:stop --prefix backend

start: db-start
	npm run dev --prefix backend &
	npm run start --prefix frontend

stop: db-stop
```
### Descripción de los Comandos
- **`test-backend` y `test-frontend`**: Ejecutan los tests en el backend y el frontend respectivamente, utilizando Jest.
- **`test`**: Ejecuta los tests en ambos entornos (backend y frontend) de forma secuencial, permitiendo validar el proyecto completo con un solo comando (`make test`).
- **`lint-backend` y `lint-frontend`**: Ejecutan ESLint en el backend y el frontend para verificar el estilo de código y asegurar consistencia.
- **`lint`**: Ejecuta el linting en ambos entornos. Este comando es particularmente útil en CI para garantizar que todo el código cumpla con los estándares antes de las pruebas o del despliegue.
- **`build-frontend`**: Compila el frontend en una versión optimizada para producción. Esto genera los archivos necesarios para el despliegue del frontend.
- **`db-start` y `db-stop`**: Inician y detienen la base de datos en Docker. Esto facilita la gestión del entorno de desarrollo, permitiendo levantar y desmontar la base de datos con un solo comando.
- **`start`**: Inicia todo el entorno de desarrollo, levantando tanto la base de datos como los servidores de backend y frontend. Esto permite a los desarrolladores lanzar todo el proyecto localmente con un solo comando.
- **`stop`**: Detiene la base de datos y el entorno de desarrollo completo, asegurando que todos los servicios se cierren adecuadamente.

### Justificación del Enfoque
- **Uniformidad**: Utilizar un `Makefile` estandariza la ejecución de comandos en todos los entornos, facilitando que las tareas se realicen de forma uniforme en desarrollo y en CI. Los comandos se ejecutan de la misma manera, ya sea en local o en los pipelines de integración continua, lo que minimiza posibles errores o diferencias entre entornos.
- **Flexibilidad**: El `Makefile` permite combinar tareas fácilmente, como ejecutar pruebas y linting en un solo paso, o levantar todo el entorno de desarrollo con un solo comando (`make start`). Esto agiliza el flujo de trabajo.
- **Facilidad de Uso**: Con comandos como `make test`, `make lint`, o `make start`, se puede ejecutar las tareas más comunes sin tener que recordar o ejecutar múltiples comandos de npm. Esto simplifica el flujo de trabajo y reduce la complejidad.
- **Compatibilidad con CI**: Al centralizar las tareas en el `Makefile`, se facilita la integración con herramientas de CI, ya que el pipeline solo necesita llamar a los comandos definidos en el `Makefile`, garantizando que se mantenga el mismo flujo de trabajo y validación en cada push o pull request.

---

## 4. Sistema Online de Pruebas e Integración Continua

**Herramienta Elegida**: GitHub Actions

He elegido GitHub Actions como el sistema de integración continua debido a su integración nativa con GitHub, su flexibilidad para configurar flujos de trabajo complejos, y su escalabilidad para gestionar pruebas, linting y despliegue en un solo entorno. La automatización de GitHub Actions permite que cada push o pull request a la rama `main` dispare un conjunto de acciones automatizadas para asegurar la calidad del código y su preparación para el despliegue.

- **Integración Nativa**: GitHub Actions está directamente integrado con GitHub, lo que simplifica la configuración inicial y facilita la conexión con otros servicios de GitHub, como los secrets para variables de entorno y credenciales sensibles.
- **Flexibilidad y Escalabilidad**: Permite definir workflows personalizados en un archivo YAML para ejecutar tareas en paralelo o en secuencia, adaptándose a las necesidades de pruebas, linting y despliegue del proyecto. Además, es escalable, permitiendo agregar o modificar jobs a medida que el proyecto crece o los requerimientos cambian.
- **Paralelización**: Los tests del backend y el frontend se ejecutan en paralelo, optimizando el tiempo total del pipeline y mejorando la eficiencia en CI.
- **Soporte de Servicios**: Permite levantar servicios auxiliares como PostgreSQL, necesarios para los tests de backend, asegurando que todas las dependencias del entorno de pruebas estén correctamente configuradas.

### Configuración del Pipeline

El archivo `.github/workflows/ci.yml` define el flujo de trabajo de CI en GitHub Actions. Este pipeline está dividido en dos jobs principales: `backend-tests` y `frontend-tests`, que se ejecutan en paralelo para optimizar el tiempo.

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      db:
        image: postgres:latest
        options: >-
          --health-cmd="pg_isready -U postgres"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
        env:
          POSTGRES_USER: ${{ secrets.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
          POSTGRES_DB: ${{ secrets.POSTGRES_DB }}
        ports:
          - 5432:5432

    steps:
      - name: Check out repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm install

      - name: Run Backend Linter
        working-directory: ./backend
        run: npm run lint

      - name: Run Backend Tests
        working-directory: ./backend
        env:
          POSTGRES_USER: ${{ secrets.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
          POSTGRES_DB: ${{ secrets.POSTGRES_DB }}
          POSTGRES_PORT: ${{ secrets.POSTGRES_PORT }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          POSTGRES_HOST: localhost
        run: npm run test

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm install

      - name: Run Frontend Linter
        working-directory: ./frontend
        run: npm run lint

      - name: Run Frontend Tests
        working-directory: ./frontend
        run: npm run test
```

- **Eventos de Disparo**: El pipeline se activa automáticamente en cada `push` o `pull request` a la rama `main`, asegurando que cualquier cambio en la rama principal del proyecto pase por las pruebas de CI.
- **Jobs en Paralelo**:
  - `backend-tests` y `frontend-tests` se ejecutan en paralelo para reducir el tiempo total de CI.
  - Esta configuración permite detectar rápidamente problemas en cualquier parte de la aplicación (backend o frontend) sin tener que esperar la finalización de ambos jobs.
- **Servicio de PostgreSQL**:
  - En `backend-tests`, se levanta un contenedor de PostgreSQL como servicio para que el backend pueda ejecutar pruebas de base de datos.
  - La configuración incluye un chequeo de salud (`--health-cmd="pg_isready -U postgres"`) para asegurarse de que el servicio de PostgreSQL esté listo antes de iniciar las pruebas.
  - Las credenciales de PostgreSQL y otras variables sensibles (`JWT_SECRET`) se gestionan a través de **GitHub Secrets**, asegurando la seguridad y evitando la exposición de datos sensibles en el repositorio.
- **Pasos del Pipeline**:
  - **Check out Repository**: Usa la acción `actions/checkout@v3` para clonar el repositorio en el entorno de ejecución.
  - **Set up Node.js**: Configura Node.js en la versión 18 usando `actions/setup-node@v3`.
  - **Instalar Dependencias**: Ejecuta `npm install` en el directorio correspondiente (backend o frontend) para instalar las dependencias necesarias.
  - **Linting**: Ejecuta el linter (`npm run lint`) en cada job para asegurar la consistencia del estilo de código antes de ejecutar las pruebas.
  - **Ejecución de Pruebas**: Ejecuta las pruebas unitarias con `npm run test`, donde se valida el código y se genera un informe de cobertura en el backend.

---

## 5. Implementación y Ejecución de Tests

Se han implementado pruebas exhaustivas para validar aspectos clave de la lógica de negocio, cubriendo las funcionalidades esenciales y asegurando que el sistema responde correctamente en casos de uso normales y excepcionales.

### Backend

Las pruebas de backend verifican funcionalidades críticas en las rutas de autenticación, administración de usuarios y control de asistencia. Los tests aseguran que las operaciones con datos sensibles y las reglas de acceso sean respetadas.

- **Pruebas de Autenticación (`user.test.js` y `admin.test.js`)**:
  - **Registro y Login de Usuarios**: Verifica que el registro y el inicio de sesión respondan correctamente para datos válidos e inválidos, incluyendo pruebas para credenciales incorrectas, duplicación de usuarios, y errores de servidor.
  - **Protección de Rutas**: Asegura que solo los usuarios autenticados puedan acceder a información sensible, como el perfil del usuario, y que los usuarios sin autenticación reciban respuestas de error adecuadas.
  - **Autenticación de Administradores**: Comprueba el acceso y gestión de cuentas de administrador, incluyendo el registro de nuevos administradores y la actualización de sus datos.

- **Pruebas de Asistencia (`attendance.test.js`)**:
  - **Registro y Finalización de Asistencia**: Valida que un estudiante pueda registrar y finalizar su asistencia, asegurando que no se permita más de una asistencia activa por usuario.
  - **Acceso Basado en Rol**: Verifica que las rutas de asistencia solo permitan el acceso a estudiantes y que los administradores no puedan registrar asistencia.
  - **Obtener Asistencias Activas**: Comprueba que los estudiantes puedan visualizar su asistencia activa y que los administradores puedan acceder al historial de asistencias de todos los usuarios.

- **Pruebas de Gestión de Laboratorios (`labs.test.js`)**:
  - **CRUD de Laboratorios**: Pruebas para la creación, actualización, eliminación y obtención de laboratorios. Asegura que solo los administradores tengan permisos para modificar los datos de los laboratorios y que los estudiantes puedan consultarlos.
  - **Manejo de Errores**: Incluye pruebas de validación, tales como la verificación del formato de los ID de laboratorio y la existencia del laboratorio antes de su modificación o eliminación.
  - **Asociación con Registros de Asistencia**: Verifica que no se pueda eliminar un laboratorio si tiene registros de asistencia asociados, garantizando la integridad de los datos.

### Frontend

Las pruebas de frontend aseguran que los componentes React se rendericen correctamente y respondan adecuadamente a las interacciones del usuario. Se utiliza `Jest` junto con `React Testing Library` para validar el comportamiento de la interfaz.

#### Componentes Probados

- **`App` Component**:
  - **Prueba de Bienvenida**: Verifica que el mensaje de bienvenida "Welcome to the Attendance Management System" se muestra correctamente en la pantalla de inicio, asegurando que la interfaz se carga como se espera.
- **`Dashboard` Tests (`dashboard.test.js`)**:
  - **`AttendanceRecords` Component**: 
    - **Renderización de Registros**: Comprueba que los registros de asistencia se muestran correctamente con datos de ejemplo, incluyendo el nombre del estudiante, el laboratorio y la hora de inicio y fin.
    - **Indicador de Carga**: Valida que, cuando `loading` es `true`, se muestre un indicador de carga (spinner) para informar al usuario que los datos están en proceso de carga.
  - **`UserStatistics` Component**:
    - **Estadísticas de Usuarios**: Verifica que el componente muestra correctamente las estadísticas del usuario, tales como el total de usuarios, la edad promedio y la distribución de género. Estas pruebas aseguran que la información relevante esté visible y organizada en la interfaz.

- **`Login` Component (`login.test.js`)**:
  - **Formulario de Inicio de Sesión**:
    - **Prueba de Envío de Formulario**: Simula el llenado del formulario de login y verifica que, al enviar los datos, la aplicación realiza la solicitud correcta para autenticar al usuario. Esta prueba garantiza que el flujo de autenticación funcione correctamente y que la API de login sea llamada con los datos correctos.
    - **Manejo de Errores**: Prueba el escenario en el que las credenciales son incorrectas, simulando una respuesta de error de la API y verificando que se muestre un mensaje de error adecuado en la interfaz ("Incorrect password"). Esto asegura que el usuario recibe retroalimentación clara cuando se produce un error en el inicio de sesión.

Estas pruebas proporcionan una cobertura sólida del sistema y permiten identificar problemas en el backend y en la interfaz. La integración de `Jest` y `React Testing Library` facilita la ejecución de estas pruebas en cada fase del desarrollo y asegura que tanto el backend como el frontend cumplan con los requisitos de calidad y funcionalidad esperados.
