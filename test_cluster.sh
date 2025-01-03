#!/bin/bash

# Inicia el clúster
docker-compose up -d

echo "Esperando a que los servicios estén listos..."
sleep 20

# Verifica que todos los contenedores están levantados
echo "Verificando estado de los contenedores..."
docker-compose ps

# Test de conectividad al backend
echo "Testeando el backend..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api-docs)
if [ "$BACKEND_RESPONSE" -eq 200 ]; then
  echo "✅ Backend está funcionando correctamente"
else
  echo "❌ Backend no responde como se esperaba"
  exit 1
fi

# Test de conectividad al frontend
echo "Testeando el frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_RESPONSE" -eq 200 ]; then
  echo "✅ Frontend está funcionando correctamente"
else
  echo "❌ Frontend no responde como se esperaba"
  exit 1
fi

# Test de conectividad a los logs
echo "Testeando el sistema de logs..."
LOGS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:24224)
if [ "$LOGS_RESPONSE" -eq 200 ]; then
  echo "✅ Sistema de logs funcionando correctamente"
else
  echo "❌ Sistema de logs no responde como se esperaba"
  exit 1
fi

# Finaliza los servicios
echo "Deteniendo y limpiando los servicios..."
docker-compose down

echo "Todas las pruebas del clúster pasaron exitosamente."
