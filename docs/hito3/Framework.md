# Justificación Técnica del Framework Elegido para el Microservicio

Para el desarrollo del microservicio de gestión de asistencias a laboratorios, se ha elegido Node.js como plataforma de backend, utilizando el framework Express.js. Esta decisión se basa en diversas razones técnicas y prácticas que se detallan a continuación.

### **1. Node.js como Plataforma de Backend**

- **Modelo Asíncrono y No Bloqueante:** Node.js utiliza un modelo de E/S asíncrono y no bloqueante basado en eventos, lo que permite manejar múltiples solicitudes concurrentes de manera eficiente. Esto es esencial para aplicaciones que requieren alta escalabilidad y rendimiento, como es el caso de la gestión de asistencias.

- **Unificación del Lenguaje:** Al utilizar JavaScript tanto en el frontend (por ejemplo, con React) como en el backend, se facilita el desarrollo y mantenimiento del código. Esto permite una mayor cohesión en el equipo de desarrollo y reduce la curva de aprendizaje.

- **Amplio Ecosistema:** Node.js cuenta con un vasto ecosistema de módulos y paquetes disponibles a través de npm, lo que acelera el desarrollo al permitir reutilizar componentes existentes y confiables.

### **2. Express.js como Framework para el Microservicio**
- **Minimalismo y Flexibilidad:** Express.js es un framework minimalista que proporciona las herramientas esenciales para construir aplicaciones web y APIs. Su simplicidad permite tener un mayor control sobre la arquitectura de la aplicación.

- **Middleware Potente:** Express.js utiliza middleware para manejar solicitudes HTTP, autenticación, validación y otras funcionalidades. Esto permite una arquitectura modular y escalable.

- **Gran Comunidad y Soporte:** Al ser uno de los frameworks más populares para Node.js, existe una gran cantidad de recursos, tutoriales y soporte comunitario, lo que facilita la resolución de problemas y la implementación de buenas prácticas.

- **Rapidez en el Desarrollo:** Express.js permite definir rutas y manejar solicitudes de manera sencilla y rápida, lo que acelera el proceso de desarrollo.

- **Integración de Herramientas:** La facilidad para integrar herramientas como express-validator para validaciones, cors para manejo de políticas de CORS, y helmet para mejorar la seguridad, hacen de Express.js una opción robusta y segura.

### **3. Integración con PostgreSQL**
- **Módulo pg:** Se utiliza el módulo pg para interactuar con la base de datos PostgreSQL, aprovechando sus características avanzadas como transacciones, vistas y procedimientos almacenados.

- **Eficiencia en Consultas:** La naturaleza asíncrona de Node.js permite manejar operaciones con la base de datos de manera eficiente, evitando bloqueos y mejorando el rendimiento general de la aplicación.
---
