#!/bin/bash

# Construye e inicia el clúster
docker-compose up -d --build

echo "Ejecutando tests del backend en el contenedor..."
docker exec attendacerecords_backend_1 npm test

# Limpia los servicios
echo "Limpiando el clúster..."
docker-compose down
