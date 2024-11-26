# Uso de Logs para Registrar la Actividad de la API
Se ha implementado un sistema de logging para registrar la actividad de la API, utilizando la librería Winston. Los logs son fundamentales para monitorear el funcionamiento de la aplicación, detectar y resolver problemas, y mantener un registro de eventos importantes.

## **Justificación de la Elección de Winston**
- **Flexibilidad y Personalización:** Permite configurar múltiples niveles de logs y formatos personalizados, adaptándose a las necesidades específicas del proyecto.
-**Transporte Múltiple:** Soporta múltiples transportes para enviar los logs a diferentes destinos, como la consola, archivos o servicios externos.
- **Integración Sencilla:** Se integra fácilmente con Express y otras herramientas del ecosistema Node.js, facilitando su implementación.
- **Comunidad Activa:** Cuenta con una amplia comunidad y documentación, lo que ayuda en la resolución de problemas y el aprendizaje.

## **Implementación en la Aplicación**
- **Archivo logger.js:** Contiene la configuración del logger, definiendo niveles de logs y formatos.
- **Niveles de Logs:**
  - error: Para errores críticos que requieren atención inmediata.
  - warn: Para situaciones potencialmente problemáticas.
  - info: Para información general sobre el funcionamiento de la aplicación.
- **Formato de Logs:** Incluye timestamp, nivel y mensaje, facilitando la lectura y análisis.

### **Integración con Express**
- **Middleware con Morgan:** Se utiliza morgan como middleware de registro de solicitudes HTTP, integrándolo con Winston para unificar los logs.
- **Logs en Controladores y Servicios:**
  - Se añaden mensajes de logs en puntos clave, como operaciones exitosas, advertencias y errores.
  - Los logs ayudan a rastrear el flujo de ejecución y a identificar rápidamente problemas.

#### **Ejemplos de Uso**
- **Registro de Eventos Importantes:**
  - Usuario registrado exitosamente.
  - Usuario inició sesión.
  - Asistencia registrada o finalizada.
- **Advertencias:**
  - Intento de acceso no autorizado.
  - Datos de entrada inválidos.
- **Errores:**
  - Fallos en la conexión a la base de datos.
  - Excepciones no controladas.
  
### **Beneficios Obtenidos**
- **Monitoreo en Tiempo Real:** Los logs proporcionan una visión en tiempo real del funcionamiento de la aplicación, permitiendo detectar anomalías rápidamente.
- **Facilidad de Depuración:** Ante un error, los logs detallados facilitan la identificación de la causa raíz y agilizan su solución.
- **Auditoría y Seguridad:** Mantener un registro de las acciones realizadas ayuda a detectar comportamientos inusuales y a reforzar la seguridad.