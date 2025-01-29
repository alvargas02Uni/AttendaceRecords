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

# Función para logs con timestamp
log() {
    echo -e "\e[1;34m[$(date +'%Y-%m-%d %H:%M:%S')] $1\e[0m"
}

log "Iniciando despliegue automatizado en Google Cloud."

# 1. Autenticación en Google Cloud usando el contenido de la clave JSON desde una variable de entorno
log "Autenticando en Google Cloud..."
echo "$GCLOUD_SERVICE_KEY" > /tmp/key.json
gcloud auth activate-service-account --key-file=/tmp/key.json || { log "Error en la autenticación"; exit 1; }

# 2. Configuración del proyecto
log "Configurando el proyecto $PROJECT_ID..."
gcloud config set project $PROJECT_ID --quiet || { log "Error al configurar el proyecto"; exit 1; }

# 3. Habilitar servicios necesarios
log "Habilitando APIs requeridas..."
gcloud services enable \
    artifactregistry.googleapis.com \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    sqladmin.googleapis.com \
    cloudresourcemanager.googleapis.com || { log "Error al habilitar servicios"; exit 1; }

# 4. Autenticación en Artifact Registry
log "Autenticando Docker con Artifact Registry..."
gcloud auth configure-docker $ARTIFACT_REGISTRY_HOST --quiet || { log "Error en autenticación de Docker"; exit 1; }

# 5. Construcción de la imagen Docker
log "Construyendo imagen Docker..."
docker build --build-arg NODE_ENV=production -t $FULL_IMAGE_NAME -f ./backend/docker/Dockerfile.backend ./backend || { log "Error en la construcción de la imagen"; exit 1; }

# 6. Subida de la imagen a Artifact Registry
log "Subiendo imagen a Artifact Registry..."
docker push $FULL_IMAGE_NAME || { log "Error al subir la imagen"; exit 1; }

# 7. Despliegue en Cloud Run
log "Desplegando en Google Cloud Run..."
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
    --set-env-vars JWT_SECRET="eiwhcue74874293gcysabcs" \
    --quiet || { log "Error en el despliegue"; exit 1; }

# 8. Obtener la URL del servicio
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
log "Despliegue completado con éxito. La aplicación está disponible en: $SERVICE_URL"

# 9. Mostrar logs recientes de Cloud Run
log "Mostrando logs del servicio..."
gcloud logging read "resource.labels.service_name=$SERVICE_NAME" --limit 10 --format json || log "No se encontraron logs."

# 10. Limpiar la clave JSON temporal
rm -f /tmp/key.json

exit 0
