# Uso de Logs para Registrar la Actividad de la API

## **1. Introducción a la Implementación de Logs**

En esta sección se ha implementado un sistema de logs para registrar la actividad de la API con el objetivo de mejorar la trazabilidad, la auditoría y la capacidad de resolución de problemas del sistema. Para esto, se ha elegido el framework **Winston**, que es una de las herramientas más populares y potentes para la gestión de logs en aplicaciones Node.js. A continuación, se explicarán las razones para la elección de Winston y los cambios realizados en los controladores para integrar el sistema de logging.

## **2. Justificación de la Elección de Winston**

### **Características Clave de Winston:**
- **Popularidad y Soporte**: Winston es ampliamente utilizado en el ecosistema Node.js y cuenta con una gran comunidad que brinda soporte y mejoras continuas. Esto asegura la estabilidad y una fácil integración.
- **Versatilidad**: Winston permite la creación de múltiples niveles de log (info, warn, error, etc.), lo cual es fundamental para categorizar los diferentes tipos de eventos que se registran.
- **Transporte y Almacenamiento Flexible**: Winston permite definir múltiples transportes para almacenar logs, ya sea en la consola, en archivos locales, o incluso en servicios de registro remotos. Esto facilita el monitoreo tanto en entornos de desarrollo como de producción.
- **Manejo de Niveles de Log**: Permite especificar diferentes niveles de severidad (como `info`, `warn`, `error`), lo cual es esencial para priorizar los eventos registrados.

### **Objetivos de la Implementación:**
- **Auditoría**: Registrar las actividades críticas, como intentos de inicio de sesión, registros de usuarios y actualizaciones de datos.
- **Resolución de Problemas**: Identificar rápidamente el origen de errores y fallos en la API.
- **Monitoreo**: Proporcionar información detallada sobre el estado del sistema, incluyendo acciones correctas y alertas de posibles problemas.

## **3. Integración de Winston en la API**

### **3.1 Cambios Realizados en `server.js`**
- Se ha integrado Winston como la herramienta principal de logs.
- Se ha configurado **morgan** para que utilice Winston como transporte, de modo que todos los registros de las solicitudes HTTP también se registren.
- Se han añadido registros con **nivel `info`** al iniciar el servidor y al exponer la documentación de Swagger.

### **3.2 Cambios en los Controladores para Registrar Actividades**

Cada controlador ha sido modificado para incluir registros con Winston en puntos críticos del flujo de trabajo. A continuación, se detallan las modificaciones por controlador:

#### **3.2.1 Admin Controller**
- **Registro de Administrador**:
  - Se añade un log **nivel `warn`** si se intentó registrar un administrador con datos inválidos.
  - Se añade un log **nivel `info`** al registrar un administrador con éxito.
  - En caso de error, se registra con **nivel `error`**.
  
- **Login de Administrador**:
  - Se añade un log **nivel `info`** al iniciar sesión correctamente.
  - Un **nivel `warn`** se utiliza para los intentos de login fallidos.

- **Obtener y Actualizar Administradores**:
  - Se utiliza **nivel `info`** para consultas exitosas y actualizaciones.
  - **Nivel `error`** se utiliza para errores que ocurren durante estas operaciones.

#### **3.2.2 Attendance Controller**
- **Registro y Finalización de Asistencia**:
  - Se añade un log **nivel `info`** cuando un estudiante registra o finaliza una asistencia correctamente.
  - En caso de error, se añade un log **nivel `error`**.
  - Se añade **nivel `warn`** si la entrada no es válida, como la falta del `lab_id`.

- **Obtener Todas las Asistencias y Asistencia por Usuario**:
  - **Nivel `info`** para las consultas exitosas.
  - **Nivel `error`** para problemas en el proceso de consulta.

#### **3.2.3 Labs Controller**
- **Operaciones CRUD sobre Laboratorios**:
  - **Nivel `warn`** para entradas no válidas, como la falta de `lab_name` o IDs incorrectos.
  - **Nivel `info`** se utiliza cuando los laboratorios son creados, actualizados, obtenidos o eliminados correctamente.
  - En caso de error, se añade un log **nivel `error`**.

#### **3.2.4 User Controller**
- **Registro y Login de Usuario**:
  - **Nivel `warn`** para intentos de registro o login con datos incorrectos.
  - **Nivel `info`** cuando el registro o login es exitoso.
  - **Nivel `error`** para fallos en el proceso.

- **Obtener y Actualizar Perfil de Usuario**:
  - **Nivel `info`** cuando se obtiene o actualiza el perfil exitosamente.
  - **Nivel `error`** en caso de problemas durante la consulta o actualización.

## **4. Ventajas de la Implementación**

### **4.1 Mejora de la Trazabilidad**
Los logs añadidos en los controladores permiten obtener información detallada sobre cada acción importante en la API. Esto facilita la trazabilidad de las operaciones de los usuarios, así como de cualquier cambio en los datos de la aplicación.

### **4.2 Detección Temprana de Errores**
Los niveles de log `warn` y `error` se utilizan para identificar problemas que puedan surgir, como intentos de acceder a recursos sin permisos o entradas de datos incorrectas. Gracias a estos logs, se pueden identificar y corregir problemas antes de que se conviertan en fallos graves.

### **4.3 Auditoría y Seguridad**
Al registrar los intentos de login y las actualizaciones de datos, se mejora la seguridad de la aplicación, permitiendo monitorear posibles intentos de acceso no autorizados y otras acciones sospechosas.

## **5. Conclusión**

La implementación de **Winston** como sistema de logs en la API ha mejorado significativamente la capacidad de monitoreo y auditoría del sistema. Con registros detallados en cada uno de los controladores, la aplicación se ha vuelto más robusta frente a problemas y proporciona una mejor visibilidad sobre el uso y funcionamiento de cada una de las funcionalidades.

Esta implementación no solo mejora la seguridad y capacidad de resolución de problemas, sino que también facilita el mantenimiento y la colaboración dentro del equipo de desarrollo, proporcionando un registro claro y detallado de las acciones que ocurren dentro de la API.
