# **Diseño General de la API, Rutas, Tests y Documentación**

## **Introducción**

El diseño del backend sigue un enfoque modular basado en el patrón de diseño por capas, que asegura el desacoplamiento entre la lógica de negocio, las rutas y los controladores. Este enfoque es fundamental para garantizar la mantenibilidad, escalabilidad y testabilidad de la aplicación, lo que facilita futuras modificaciones y expansiones del sistema.

La API está diseñada específicamente para gestionar las asistencias a laboratorios por parte de los estudiantes y para permitir a los administradores monitorear y gestionar estas asistencias. Además, se incluye un sistema robusto de autenticación y autorización basado en roles (`student` y `admin`), asegurando que las operaciones sensibles estén protegidas y solo sean accesibles a usuarios con los permisos adecuados.

---

## **Diseño por Capas**

### **1. Capa de Rutas**
La capa de rutas se encarga de definir los endpoints de la API y su estructura. Cada módulo tiene su propio archivo ubicado en `src/routes`, categorizados por funcionalidad (`admin`, `attendance`, `labs`, `user`). Estas rutas actúan como puntos de entrada para las solicitudes HTTP, redirigiéndolas a los controladores correspondientes.

**Ventajas:**
- Separación clara de las responsabilidades entre las rutas y la lógica de negocio.
- Facilita la comprensión del flujo del sistema al mantener los archivos organizados por funcionalidad.
- Simplifica la navegación y comprensión del código, especialmente en equipos de desarrollo.

---

### **2. Capa de Controladores**
Los controladores están ubicados en `src/controllers` y son responsables de manejar las solicitudes provenientes de las rutas. Se encargan de validar las entradas, gestionar las respuestas HTTP y delegar la lógica de negocio a los servicios.

**Ventajas:**
- Aseguran que la lógica de negocio esté separada, manteniendo el código limpio y fácil de modificar.
- Centralizan la gestión de las solicitudes y las respuestas, simplificando el manejo de errores y la implementación de middlewares.

---

### **3. Capa de Servicios (Lógica de Negocio)**

La lógica de negocio está completamente desacoplada y encapsulada en una capa de servicios ubicada en `src/services`. Esto garantiza que las operaciones críticas, como la autenticación, gestión de usuarios, asistencias y laboratorios, sean reutilizables y mantenibles.

**Ventajas:**
- **Reutilización de lógica:** Permite que múltiples controladores y rutas accedan a la misma lógica de negocio, evitando duplicación de código.
- **Separación de responsabilidades:** Los controladores no tienen lógica compleja, lo que mejora la claridad y el diseño del sistema.
- **Mantenibilidad:** Facilita las actualizaciones o modificaciones sin impacto directo en otras capas del sistema.

---

### **4. Capa de Utilidades**
La carpeta `src/util` contiene funciones auxiliares y herramientas comunes que son utilizadas por diferentes partes de la aplicación, como:
- `authMiddleware.js`: Middleware para validar la autenticación y los roles de los usuarios.
- `generateToken.js`: Función para la generación de tokens JWT, esenciales para la autenticación y autorización.

**Ventajas:**
- Promueve la modularidad y la reutilización de funciones comunes en todo el sistema.
- Simplifica la implementación de funcionalidades transversales, como la validación y el manejo de autenticación.

---

### **5. Base de Datos y Configuración**
La conexión a la base de datos PostgreSQL está centralizada en el archivo `config/db.js`, lo que asegura que la configuración sea reutilizable y fácil de administrar.

**Ventajas:**
- Centralización de la configuración de la base de datos, lo que facilita los cambios en entornos de desarrollo, pruebas y producción.
- Simplifica la conexión a la base de datos en toda la aplicación.

---

## **Tests**

La carpeta `__tests__` contiene pruebas unitarias e integraciones diseñadas para garantizar la calidad del código. Estas pruebas cubren todos los módulos principales, como la autenticación, la gestión de usuarios, las asistencias y los laboratorios. Se utilizan las siguientes herramientas:
- **Jest:** Para pruebas unitarias y de integración, asegurando que cada módulo funcione como se espera.
- **Supertest:** Para pruebas de los endpoints HTTP de la API.

**Ventajas:**
- Detecta errores antes de desplegar la aplicación en entornos de producción.
- Mejora la robustez y confiabilidad del sistema, garantizando que cada cambio esté respaldado por pruebas completas.
- Aumenta la confianza en el código, especialmente cuando se introducen nuevas funcionalidades o se refactoriza el sistema.

---

## **Documentación**

La documentación de la API se implementa utilizando **Swagger**, que genera una interfaz interactiva accesible a través del endpoint `/api-docs`. Esto permite a desarrolladores y usuarios finales explorar, probar y comprender todos los endpoints de la API de manera eficiente.

### **1. Propósito de la Documentación**
1. **Proporcionar una interfaz interactiva:** Swagger ofrece un entorno visual donde los desarrolladores pueden probar los endpoints directamente, especificando los parámetros requeridos y revisando las respuestas del servidor.
2. **Facilitar el mantenimiento del sistema:** La documentación está sincronizada con el código, reduciendo inconsistencias y asegurando que los cambios se reflejen de manera automática.
3. **Aumentar la accesibilidad:** Los desarrolladores pueden comprender y consumir la API sin necesidad de consultar el código fuente.

### **2. Organización**
La documentación incluye información detallada sobre cada endpoint:
- **Descripción de los endpoints:** Qué funcionalidad cubren y cómo usarlos.
- **Parámetros y cuerpo de la solicitud:** Especificación de las entradas requeridas.
- **Respuestas:** Códigos de estado HTTP y posibles mensajes o datos devueltos.
- **Roles y autorizaciones:** Indicación de los permisos necesarios para acceder a cada endpoint.

**Ventajas:**
- Acelera el desarrollo colaborativo, ya que los equipos de frontend y backend pueden trabajar simultáneamente con la documentación como referencia.
- Facilita la incorporación de nuevos desarrolladores al proyecto, quienes pueden comprender rápidamente la funcionalidad de la API.
- Permite pruebas rápidas y eficientes directamente desde la interfaz de Swagger.

---

## **Conclusión**

El diseño por capas, la documentación clara con Swagger y las pruebas exhaustivas garantizan un sistema modular, escalable y fácil de mantener. Este enfoque asegura que la aplicación cumpla con los más altos estándares de calidad y que sea capaz de adaptarse a futuros requerimientos sin comprometer la estabilidad del sistema.