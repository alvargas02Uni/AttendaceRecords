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

# Inicializar la base de datos en Docker
db-start:
	npm run db:start --prefix backend

# Detener la base de datos en Docker
db-stop:
	npm run db:stop --prefix backend

# Ejecutar toda la configuración de desarrollo (iniciar la base de datos y los servicios)
start: db-start
	npm run dev --prefix backend &
	npm run start --prefix frontend

# Detener el entorno de desarrollo
stop: db-stop
