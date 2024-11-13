# Makefile para el Proyecto Backend y Frontend

# Test Backend
test-backend:
	npm run test --prefix backend

# Test Frontend
test-frontend:
	npm run test --prefix frontend

# Ejecutar todos los tests (backend y frontend)
test: test-backend test-frontend

# Lint Backend
lint-backend:
	npm run lint --prefix backend

# Lint Frontend
lint-frontend:
	npm run lint --prefix frontend

# Ejecutar linting en ambos (backend y frontend)
lint: lint-backend lint-frontend

# Construir el Frontend
build-frontend:
	npm run build --prefix frontend

# Iniciar y detener la base de datos usando Docker Compose
db-start:
	docker-compose -f backend/docker-compose.yml up -d db

db-stop:
	docker-compose -f backend/docker-compose.yml down

# Ejecutar toda la configuración de desarrollo (iniciar base de datos y servicios)
start: db-start
	npm run dev --prefix backend &
	npm run start --prefix frontend

# Detener el entorno de desarrollo
stop: db-stop
