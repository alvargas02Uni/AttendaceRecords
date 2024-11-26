# **Diseño General de la API, Rutas, Tests y Documentación**

El microservicio ha sido diseñado siguiendo una arquitectura por capas que promueve la separación de responsabilidades y el desacoplamiento entre componentes. Este enfoque facilita el mantenimiento, la escalabilidad y la extensibilidad del sistema, permitiendo una gestión eficiente de la lógica de negocio y las interacciones con los clientes.

---

## **Arquitectura por Capas**

### **1. Rutas (Routes)**
- **Función:** Definen los endpoints de la API y asignan las solicitudes a los controladores correspondientes.
- **Organización:** Ubicadas en la carpeta src/routes/, las rutas están segmentadas por funcionalidad (usuarios, laboratorios, asistencias, administradores).
- **Beneficio:** Facilitan la gestión y comprensión de los puntos de entrada de la API.

### **2. Controladores (Controllers)**
- **Función:** Actúan como intermediarios entre las rutas y los servicios, procesando las solicitudes, validando datos y gestionando las respuestas HTTP.
- **Ubicación:** Carpeta src/controllers/.
- **Responsabilidad:** No contienen lógica de negocio; se enfocan en el flujo de entrada y salida de datos.

### **3.  Servicios (Services)**
- **Función:** Contienen la lógica de negocio de la aplicación, ejecutando las operaciones requeridas para cumplir con los casos de uso.
- **Ubicación:** Carpeta src/services/.
- **Desacoplamiento:** Permiten que la lógica de negocio sea independiente de las capas de presentación y datos.

### **4. Utilidades (Utils)**
- **Función:** Contienen funciones y middlewares reutilizables, como autenticación, validaciones y generación de tokens.
- **Ubicación:** Carpeta src/util/.
- **Ejemplos:** authMiddleware.js, generateToken.js, logger.js.

---

## **Documentación de la API**
- **Herramienta:** Swagger ha sido utilizado para documentar la API de manera interactiva.
- **Acceso:** La documentación está disponible en el endpoint /api-docs.
- **Contenido:**
    - Descripción de cada endpoint, incluyendo métodos HTTP y rutas.
    - Detalles de los parámetros de entrada, respuestas esperadas y códigos de estado.
    - Información sobre seguridad y autenticación requerida para cada ruta.
- **Beneficio:** Facilita la comprensión y uso de la API por parte de desarrolladores y clientes, mejorando la colaboración y eficiencia.

---

## **Desacoplamiento de la Lógica de Negocio**
- **Principio**: La lógica de negocio está separada de la lógica de la API, siguiendo el principio de responsabilidad única.
- **Implementación**: Los servicios no dependen de los controladores ni de las rutas, lo que permite reutilizarlos y testearlos de forma independiente.
- **Ventajas**:
    - **Mantenibilidad**: Facilita la actualización y mejora de la lógica de negocio sin afectar otras capas.
    - **Escalabilidad**: Permite añadir nuevas funcionalidades o modificar las existentes con mínimo impacto.
    - **Testabilidad:** Mejora la capacidad de realizar pruebas unitarias efectivas.

---

## **Seguridad y Validaciones**
- **Estrategia:**
    - Se implementa un middleware de manejo de errores que captura y procesa las excepciones no controladas.
    - Los errores se responden con códigos de estado y mensajes consistentes.
- **Logs de Errores:** Los errores se registran utilizando el sistema de logs con Winston, facilitando su análisis y resolución.
- **Beneficio:** Mejora la robustez de la aplicación y proporciona información útil para la depuración.