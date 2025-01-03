# Proyecto de Despliegue en la Nube: Attendance Records Webapp

## Tabla de Contenidos
- [Descripción del Proyecto](#descripción)
- [Configuración del Entorno](#configuración-del-entorno)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Documentación del Hito 2](#integracion-continua)
- [Documentación del Hito 3](#documentación-del-proyecto)
- [Documentación del Hito 4](#documentación-del-hito-4)
- [Licencia](#licencia)

## Descripción
Este proyecto tiene como objetivo desarrollar una webapp para la gestión académica de un departamento de una Universidad en Dinamarca. Todo surge por la necesidad de este de actualizarse y dar a conocer a los estudiantes la funcionalidad que ofrece para utilizar los laboratorios. El registro de asistencia anteriormente se realizaba de manera manual mediante papel, lo cual era ineficiente y poco práctico. Se solicitó el uso de nuevas tecnologías para ahorrar papel y facilitar el trabajo a los responsables de estos laboratorios. Aquí es donde surge **Attendance Record**, una webapp que diferencia entre usuarios estudiantes y administradores, permitiendo a los estudiantes registrar su asistencia a los laboratorios y a los administradores monitorear y gestionar los laboratorios.

### Problema a Resolver
La gestión manual del registro de asistencia en los laboratorios del departamento era un proceso que consumía tiempo y recursos, tanto para los estudiantes como para los administradores. El uso de papel y el registro manual también aumentaban el riesgo de errores, pérdida de información, y falta de transparencia. **Attendance Record** tiene como objetivo modernizar este proceso mediante el uso de una aplicación web intuitiva y accesible, proporcionando una solución eficiente y sostenible que beneficie a todas las partes involucradas.

### Historias de Usuario
Para definir las funcionalidades del sistema, se han desarrollado las siguientes historias de usuario:

1. **Como estudiante**, quiero poder ver una lista de laboratorios disponibles y registrar mi asistencia a un laboratorio específico, para facilitar mi acceso y uso de estos recursos.
2. **Como administrador**, quiero tener una vista de tablero donde pueda monitorear la asistencia de los estudiantes a los laboratorios, para asegurarme de que los laboratorios se están utilizando correctamente y tener control sobre el uso de recursos.
3. **Como administrador**, quiero poder crear, editar y eliminar laboratorios para gestionar los recursos de manera eficiente y asegurarse de que la información esté actualizada.

### Producto Mínimo Viable (MVP)
El producto mínimo viable de **Attendance Record** incluye:

- Un sistema de autenticación que permita diferenciar entre usuarios estudiantes y administradores.
- Una interfaz para que los estudiantes puedan ver los laboratorios disponibles y registrar su asistencia.
- Un tablero para los administradores donde puedan monitorear las asistencias y gestionar los laboratorios (crear, editar y eliminar).

### Beneficios del Despliegue en la Nube
El despliegue de **Attendance Record** en la nube ofrece varios beneficios, entre los cuales destacan:

- **Accesibilidad**: Los estudiantes y administradores pueden acceder a la aplicación desde cualquier lugar y en cualquier momento, facilitando el uso de los recursos del departamento.
- **Escalabilidad**: La infraestructura en la nube permite escalar la aplicación según la demanda, asegurando un buen rendimiento incluso si aumenta el número de usuarios.
- **Mantenimiento Simplificado**: El despliegue en la nube facilita la actualización y mantenimiento de la aplicación sin interrumpir el servicio para los usuarios.

## Tecnologías Utilizadas
En este proyecto se han utilizado las siguientes tecnologías:

- **Base de Datos: PostgreSQL**
  - Se ha elegido PostgreSQL debido a su robustez y su capacidad para manejar grandes cantidades de datos de manera eficiente. Es una base de datos relacional que permite gestionar de forma óptima la información de usuarios, laboratorios y registros de asistencia.
- **Backend: Node.js con Express**
  - Node.js con Express se ha utilizado para desarrollar el backend debido a su capacidad para manejar múltiples solicitudes simultáneamente de manera eficiente. Express proporciona una estructura flexible y rápida para crear API RESTful, facilitando la conexión entre el frontend y la base de datos.
- **Frontend: React**
  - React se ha seleccionado para el desarrollo del frontend debido a su eficiencia y capacidad para crear interfaces de usuario dinámicas y reactivas. React facilita la creación de componentes reutilizables, lo cual mejora la mantenibilidad y escalabilidad del proyecto.

## Configuración del Entorno
Para configurar el entorno de desarrollo, sigue las instrucciones en [environment_setup.md](./docs/environment_setup.md).

## Integración Continua del Hito 2
Toda la documentación sobre como se ha implementado la Integracion Continua puede verse [aquí](./docs//hito2.md).

## Documentación del Hito 3

Para obtener más detalles sobre el proyecto, puedes consultar los siguientes documentos:

- [Justificación Técnica del Framework Elegido para el Microservicio](./docs/hito3/Framework.md)
- [Diseño General de la API, Rutas, y Documentación](./docs/hito3/Diseño.md)
- [Uso de Logs para Registrar la Actividad de la API](./docs/hito3/Logs.md)
- [Pruebas Implementadas para Garantizar la Calidad de la API](./docs/hito3/Tests.md)

## Documentación del Hito 4

Para este hito, se han documentado los siguientes aspectos:

- [Documentación del Clúster de Contenedores](./docs/hito4/cluster-contenedores.md)
- [Implementación y Ejecución del Test del Clúster](./docs/hito4/cluster-git-test.md)

## Licencia
Este proyecto utiliza la licencia [MIT](./LICENSE).

## Contacto
Si tienes alguna pregunta o sugerencia, por favor abre un [issue](https://github.com/alvargas02Uni/AttendaceRecords/issues).
