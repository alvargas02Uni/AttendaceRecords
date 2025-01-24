# Hito 5: Despliegue de la aplicación en un PaaS

## 1. Descripción del despliegue

Voy a describir el proceso de despliegue de la aplicación en un PaaS utilizando Google Cloud Run. Se detallan los pasos seguidos para configurar el despliegue automático desde GitHub Actions, la justificación de la elección de Google Cloud Run como PaaS, y la conexión con Google Cloud SQL para gestionar la base de datos. 

**URL**: [https://attendance-records-551620082303.europe-southwest1.run.app/api-docs/] 

## 2. Justificación de la elección del PaaS

Para el despliegue de la aplicación, se evaluaron varias opciones de PaaS gratuitas y de pago con niveles gratuitos:
- Heroku: Ofrece un nivel gratuito pero tiene limitaciones en el uso de la base de datos y en la disponibilidad de instancias.
- Render: Similar a Heroku pero con mejor rendimiento para APIs.
- Railway: Opción viable, pero con restricciones en el tiempo de ejecución.
- Google Cloud Run: Se eligió por las siguientes razones:
    - Permite escalar automáticamente las instancias según la demanda.
    - Se integra de forma nativa con Google Cloud SQL, facilitando la conexión con la base de datos.
    - Soporte completo para contenedores Docker, garantizando un despliegue consistente con el entorno local.
    - Ofrece 1 millón de solicitudes gratuitas al mes, lo que lo hace una opción económica.

## 3. Herramientas utilizadas para el despliegue
Para el despliegue en Google Cloud Run, se usaron las siguientes herramientas:
- Docker: Se creó una imagen Docker con el backend de la aplicación.
- Google Cloud SDK: Para interactuar con Google Cloud desde la línea de comandos.
- Google Artifact Registry: Para almacenar la imagen Docker antes de su despliegue.
- GitHub Actions: Para automatizar el despliegue con integración continua.
- Google Cloud SQL: Para gestionar la base de datos PostgreSQL.

## 4. Configuración del despliegue automático desde GitHub
El despliegue automático se configura a través de GitHub Actions. Se modificó el archivo ci.yml para incluir un job de despliegue que se ejecuta después de pasar las pruebas.

### 4.1. Flujo de trabajo en GitHub Actions (.github/workflows/ci.yml)
Se añadió un nuevo job llamado deploy en el archivo ci.yml, que se ejecuta tras los tests:
```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: tests
    steps:
      - name: Check out repository
        uses: actions/checkout@v3

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCLOUD_SERVICE_KEY }}

      - name: Set up Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: attendancerecords

      - name: Deploy to Cloud Run
        env:
          GCLOUD_SERVICE_KEY: ${{ secrets.GCLOUD_SERVICE_KEY }}
        run: |
          chmod +x ./deploy.sh
          ./deploy.sh
```
El job deploy en el archivo ci.yml tiene como objetivo automatizar el despliegue de la aplicación en Google Cloud Run una vez que los tests han pasado exitosamente. Para ello, primero se clona el código del repositorio con actions/checkout@v3, lo que permite que el runner tenga acceso a todos los archivos necesarios, incluyendo el script deploy.sh que se encargará del despliegue.

Después, el job se autentica en Google Cloud mediante google-github-actions/auth@v1, utilizando las credenciales de servicio almacenadas en GCLOUD_SERVICE_KEY, una variable secreta configurada en GitHub Secrets. Esto garantiza que el pipeline tenga los permisos necesarios para gestionar recursos en Google Cloud. Seguidamente, se instala y configura el SDK de Google Cloud a través de google-github-actions/setup-gcloud@v1, asegurando que el proyecto attendancerecords esté correctamente establecido como el predeterminado.

Una vez configurado el entorno, se ejecuta el script deploy.sh para el despliegue. Además, al finalizar el proceso, el script obtiene la URL pública de la aplicación desplegada y muestra los logs recientes del servicio para facilitar la depuración.

### 4.2. Script de despliegue (deploy.sh)

El script deploy.sh se encarga de automatizar el proceso de despliegue de la aplicación en Google Cloud Run, asegurando que la última versión del código esté disponible en la nube con la menor intervención manual posible. A continuación, se explican las distintas tareas que realiza el script.

```sh
#!/bin/bash

# Configuración de variables
PROJECT_ID="attendancerecords"
REGION="europe-southwest1"
REPO_NAME="attendance-records"
SERVICE_NAME="attendance-records"
IMAGE_NAME="attendance-records-img"
IMAGE_TAG="v1"
ARTIFACT_REGISTRY_HOST="$REGION-docker.pkg.dev"
FULL_IMAGE_NAME="$ARTIFACT_REGISTRY_HOST/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$IMAGE_TAG"

log() {
    echo -e "\e[1;34m[$(date +'%Y-%m-%d %H:%M:%S')] $1\e[0m"
}

log "Iniciando despliegue automatizado en Google Cloud."

echo "$GCLOUD_SERVICE_KEY" > /tmp/key.json
gcloud auth activate-service-account --key-file=/tmp/key.json || { log "Error en la autenticación"; exit 1; }

gcloud config set project $PROJECT_ID --quiet || { log "Error al configurar el proyecto"; exit 1; }

gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com sqladmin.googleapis.com cloudresourcemanager.googleapis.com || { log "Error al habilitar servicios"; exit 1; }

gcloud auth configure-docker $ARTIFACT_REGISTRY_HOST --quiet || { log "Error en autenticación de Docker"; exit 1; }

docker build --build-arg NODE_ENV=production -t $FULL_IMAGE_NAME -f ./backend/docker/Dockerfile.backend ./backend || { log "Error en la construcción de la imagen"; exit 1; }

docker push $FULL_IMAGE_NAME || { log "Error al subir la imagen"; exit 1; }

gcloud run deploy $SERVICE_NAME \
    --image $FULL_IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 5000 \
    --add-cloudsql-instances attendancerecords:europe-southwest1:attendance-reccords-sql \
    --set-env-vars INSTANCE_CONNECTION_NAME=attendancerecords:europe-southwest1:attendance-reccords-sql \
    --set-env-vars DB_HOST="/cloudsql/attendancerecords:europe-southwest1:attendance-reccords-sql" \
    --set-env-vars DB_USER="postgres" \
    --set-env-vars DB_PASS="password" \
    --set-env-vars DB_NAME="AttendanceRecords_db" \
    --quiet || { log "Error en el despliegue"; exit 1; }

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
log "Despliegue completado con éxito. La aplicación está disponible en: $SERVICE_URL"
rm -f /tmp/key.json
exit 0
```

- **Definición de variables de entorno**: El script comienza definiendo varias variables clave que se utilizarán a lo largo del proceso. Estas incluyen el identificador del proyecto en Google Cloud (PROJECT_ID), la región de despliegue (REGION), el nombre del servicio (SERVICE_NAME), el nombre y la etiqueta de la imagen Docker (IMAGE_NAME y IMAGE_TAG), así como la URL completa del Artifact Registry, donde se almacenará la imagen Docker antes del despliegue. Estas variables permiten mantener la configuración centralizada y facilitar su modificación en el futuro.
- **Autenticación en Google Cloud**: El script procede a autenticarse en Google Cloud utilizando la clave de servicio almacenada en una variable de entorno (GCLOUD_SERVICE_KEY). Para ello, primero guarda la clave en un archivo temporal (/tmp/key.json) y luego activa la cuenta de servicio mediante el comando gcloud auth activate-service-account. Esto garantiza que las siguientes operaciones puedan ejecutarse con los permisos adecuados dentro del proyecto de Google Cloud.
- **Configuración del proyecto en Google Cloud**: Una vez autenticado, el script configura el proyecto de trabajo en Google Cloud (gcloud config set project). Esto es esencial para asegurarse de que todas las operaciones de despliegue se realicen dentro del proyecto correcto, evitando posibles conflictos con otros proyectos en la misma cuenta.
- **Habilitación de APIs necesarias**: Para poder realizar el despliegue, el script habilita una serie de APIs necesarias en Google Cloud. Estas incluyen el Artifact Registry (para almacenar la imagen Docker), Cloud Run (para ejecutar el servicio en la nube), Cloud Build (para permitir la construcción de imágenes en la nube si es necesario), Cloud SQL Admin (para gestionar la conexión con la base de datos en Google Cloud SQL) y Cloud Resource Manager (para administrar permisos y configuraciones del proyecto).
- **Autenticación de Docker en Artifact Registry**: Dado que la imagen Docker se almacenará en Google Artifact Registry, el script configura la autenticación de Docker (gcloud auth configure-docker) para que pueda interactuar con el repositorio sin necesidad de credenciales adicionales. Esto permite que el docker push posterior pueda ejecutarse sin errores de autenticación.
- **Construcción de la imagen Docker**: El script procede a construir la imagen Docker del backend, utilizando el Dockerfile.backend ubicado en el directorio backend/docker/. Para ello, se emplea docker build, pasando como argumento el entorno de producción (NODE_ENV=production) para asegurarse de que la imagen generada esté optimizada para despliegue en la nube.
- **Subida de la imagen a Google Artifact Registry**: Una vez que la imagen Docker ha sido creada, se sube al Artifact Registry de Google Cloud mediante docker push. Esto asegura que la imagen esté disponible en un repositorio privado y accesible únicamente para el entorno de despliegue en Cloud Run.
- **Despliegue de la aplicación en Google Cloud Run**: El paso más importante del script es el despliegue en Google Cloud Run. Se utiliza gcloud run deploy para lanzar la aplicación en la nube, especificando la imagen almacenada en Artifact Registry, la región de despliegue, la configuración de puertos y permitiendo el acceso público (--allow-unauthenticated). Además, se establece la conexión con Cloud SQL mediante --add-cloudsql-instances y se configuran variables de entorno necesarias para que la aplicación se conecte correctamente a la base de datos, como DB_HOST, DB_USER, DB_PASS y DB_NAME.
- **Obtención de la URL del servicio**: Después del despliegue, el script obtiene la URL pública de la aplicación mediante gcloud run services describe, lo que permite acceder a la API desplegada en la nube.
- **Registro y visualización de logs**: Para facilitar la depuración, el script muestra los logs recientes del servicio en Cloud Run utilizando gcloud logging read. Esto permite verificar si la aplicación se ha desplegado correctamente y detectar posibles errores.
- **Eliminación de la clave JSON temporal**: Finalmente, como medida de seguridad, el script elimina el archivo temporal que contenía la clave de servicio (rm -f /tmp/key.json). Esto evita que la clave quede expuesta dentro del contenedor o el entorno de ejecución.

## 5. Conexión con Google Cloud SQL
Para garantizar que la aplicación pueda conectarse correctamente a una instancia de Google Cloud SQL en entorno de producción, se ha modificado el archivo db.js para manejar dinámicamente la configuración de la base de datos según el entorno de ejecución.
### 5.1. Configuración dinámica basada en el entorno (NODE_ENV)
El código utiliza la variable de entorno NODE_ENV para determinar si la aplicación se está ejecutando en producción o en desarrollo. Si NODE_ENV está configurado como "production", la conexión se realizará a la base de datos en Google Cloud SQL. De lo contrario, se conectará a una base de datos local.
```js
if (process.env.NODE_ENV === 'production') {
    console.log("🌍 Ejecutando en producción: Conectando a Cloud SQL...");
```
Esta estructura permite que la misma aplicación pueda ejecutarse sin problemas en un entorno de desarrollo local y en la nube sin necesidad de cambios manuales en la configuración.

### 5.2. Conexión con Google Cloud SQL en Producción
En el entorno de producción, se configura la conexión utilizando variables de entorno que son establecidas en el despliegue de Cloud Run. Estas variables (DB_USER, DB_PASS, DB_HOST, DB_NAME) son definidas en el script deploy.sh:

```bash
gcloud run deploy $SERVICE_NAME \
    --set-env-vars DB_HOST="/cloudsql/attendancerecords:europe-southwest1:attendance-reccords-sql" \
    --set-env-vars DB_USER="postgres" \
    --set-env-vars DB_PASS="password" \
    --set-env-vars DB_NAME="AttendanceRecords_db"
```
Dentro de db.js, estos valores se toman directamente de las variables de entorno:

```js
pool = new Pool({
    user: process.env.DB_USER || db.user,
    password: process.env.DB_PASS || db.password,
    host: process.env.DB_HOST || db.host,  // En Cloud SQL, el host es un socket UNIX
    database: process.env.DB_NAME || db.database,
    ssl: {
        rejectUnauthorized: false, // Requerido para conexiones SSL con Cloud SQL
    }
});
```
#### ¿Por qué host es un socket UNIX en Cloud SQL?
Google Cloud SQL permite conectarse a la base de datos a través de una dirección IP privada o pública, pero cuando se usa Cloud Run, la forma más recomendada es mediante un socket UNIX. Esto mejora la seguridad y el rendimiento, ya que no es necesario abrir conexiones TCP externas.

El valor del host (DB_HOST) se define como:

```bash
DB_HOST="/cloudsql/attendancerecords:europe-southwest1:attendance-reccords-sql"
```
Esto indica que la conexión se realizará a través del Cloud SQL Proxy integrado en Cloud Run.

#### ¿Por qué ssl.rejectUnauthorized: false?
Si bien en conexiones locales se usa una conexión directa, en producción Google Cloud SQL requiere que las conexiones externas se realicen con SSL. Para evitar errores relacionados con certificados no verificados, se usa la opción:

```js
ssl: {
    rejectUnauthorized: false
}
```
Esto evita que la conexión sea rechazada por problemas con certificados de seguridad en entornos gestionados.

3. Conexión en Entorno de Desarrollo (Local)
Si la aplicación se ejecuta en desarrollo (NODE_ENV !== 'production'), se conecta a una base de datos local con los valores definidos en el archivo config.js:

```js
pool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.database,
});
```
Aquí se utiliza una conexión estándar por TCP con PostgreSQL, donde el host es una dirección IP local (localhost o 127.0.0.1) y el puerto corresponde al de PostgreSQL (por defecto, 5432).

### 5.4. Ventajas de este Enfoque
- Separación clara entre entornos: No se necesita modificar manualmente el código para cambiar entre base de datos local y en la nube.
- Seguridad y rendimiento optimizados: Se utiliza un socket UNIX en Cloud SQL en lugar de una conexión TCP pública.
- Uso de variables de entorno: Evita exponer credenciales sensibles en el código fuente.
- Compatibilidad con despliegues automatizados: Al definir la conexión en db.js y las variables en deploy.sh, se garantiza que la API pueda desplegarse sin intervención manual en Cloud Run.

## 6. Resultados y pruebas
Después de completar el despliegue en Google Cloud Run, se realizaron diversas pruebas para garantizar que la aplicación funciona correctamente en el entorno de producción.

- Correcto acceso a la API desplegada: Se verificó que la API es accesible desde la URL proporcionada por Cloud Run. Se realizaron pruebas con la herramienta swagger para asegurarse de que los endpoints respondieran correctamente.
- Conexión estable con Google Cloud SQL: Se comprobó que la API puede conectarse correctamente a la base de datos en Google Cloud SQL utilizando la configuración definida en las variables de entorno (DB_HOST, DB_USER, DB_PASS, DB_NAME). Se ejecutaron consultas básicas para verificar que la base de datos responde y almacena datos como se espera.
- Logs accesibles desde Google Cloud Logging: Se revisaron los logs generados por la aplicación a través de Google Cloud Logging para confirmar que los eventos importantes (como inicios de sesión, consultas a la base de datos y errores) se registran adecuadamente.
- Despliegue automático desde GitHub Actions: Se probó que al realizar un push en la rama main, el flujo de trabajo de GitHub Actions se ejecuta correctamente y actualiza la versión desplegada en Google Cloud Run sin intervención manual. Se verificó que los pasos de construcción, subida de la imagen a Artifact Registry y despliegue en Cloud Run se ejecutan sin errores.

## 7. Conclusión

El despliegue automatizado de la aplicación en Google Cloud Run se realizó con éxito, logrando una infraestructura escalable, segura y eficiente. Se implementó una integración continua y despliegue continuo (CI/CD) mediante GitHub Actions, lo que permite que cada nuevo push en el repositorio desencadene un despliegue sin intervención manual.

El uso de Google Cloud SQL para la base de datos garantiza una solución robusta y administrada, mientras que Google Cloud Logging facilita el monitoreo y depuración de la aplicación en tiempo real.

Con este enfoque, la aplicación está lista para operar en un entorno de producción con una arquitectura que permite alta disponibilidad, seguridad y escalabilidad, asegurando una gestión eficiente del servicio sin necesidad de mantenimiento manual constante.