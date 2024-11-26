# Pruebas Implementadas para Garantizar la Calidad de la API
Las pruebas son esenciales para asegurar el correcto funcionamiento de la API y la calidad del software. Se han implementado pruebas unitarias y de integración utilizando Jest y Supertest, cubriendo los diferentes componentes y funcionalidades de la aplicación.

## **Jest**
- **Descripción:** Framework de testing en JavaScript que permite escribir y ejecutar pruebas de manera sencilla y eficiente.
- **Características:**
    - Soporte para pruebas asíncronas.
    - Generación de informes de cobertura.
    - Mocking de módulos y funciones.

## **Supertest**
- **Descripción:** Librería que facilita la realización de pruebas de integración sobre aplicaciones Express, permitiendo realizar solicitudes HTTP simuladas.
- **Características:**
    - Soporta métodos HTTP estándar (GET, POST, PUT, DELETE).
    - Verificación de códigos de estado, encabezados y cuerpos de respuesta.

## **Tipos de Pruebas Realizadas**
### **Pruebas Unitarias**
- **Objetivo:** Validar el comportamiento de funciones y métodos individuales en aislamiento.
- **Cobertura:**
    - Servicios: Se prueban las funciones de lógica de negocio, asegurando que manejan correctamente los datos y errores.
    - Utilidades: Funciones auxiliares como generación de tokens y validaciones.
- **Estrategia:**
    - Se utilizan mocks para simular dependencias externas como la base de datos.
    - Se verifican diferentes escenarios, incluyendo casos límite y entradas inválidas.
### **Pruebas de Integración**
- **Objetivo:** Validar la interacción entre los diferentes componentes de la aplicación y el manejo de solicitudes HTTP.
- **Cobertura:**
    - Rutas y Controladores: Se realizan solicitudes a los endpoints de la API, verificando respuestas y comportamiento.
    - Middlewares: Se prueban las funcionalidades de autenticación y autorización, asegurando que protegen adecuadamente las rutas.
- **Estrategia:**
    - Se inicializa la aplicación en modo de prueba.
    - Se simulan solicitudes HTTP con diferentes datos y encabezados.
    - Se verifica el manejo de errores y la consistencia de las respuestas.

## **Casos de Prueba Destacados**
- **Usuarios:**
    - Registro con datos válidos e inválidos.
    - Inicio de sesión con credenciales correctas e incorrectas.
    - Acceso a rutas protegidas sin autenticación.
- **Administradores:**
    - Registro y actualización de administradores.
    - Gestión de usuarios y laboratorios con permisos adecuados.
- **Asistencias:**
    - Registro y finalización de asistencias.
    - Consulta de asistencias por usuario y globalmente.
- **Laboratorios:**
    - Creación, obtención, actualización y eliminación de laboratorios.
    - Manejo de errores al interactuar con laboratorios inexistentes.

## **Resultados de las Pruebas**
- **Cobertura Alta:** Las pruebas cubren la mayoría de las funcionalidades críticas de la aplicación.
- **Ejecución Exitosa:** Todas las pruebas pasan correctamente, indicando que la API funciona según lo esperado.
- **Detección de Errores:** Durante el desarrollo, las pruebas ayudaron a identificar y corregir errores, mejorando la calidad del código.
