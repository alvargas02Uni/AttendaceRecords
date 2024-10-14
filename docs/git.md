# Buenas Prácticas en el Uso de Git para Attendance Records 

Este documento describe las buenas prácticas a seguir para el uso de Git durante el desarrollo del proyecto **Attendance Records**. Aplicar estas buenas prácticas ayudará a mantener una estructura clara, facilitará la colaboración y mejorará la calidad del código y la documentación del proyecto.

## Índice
- [Estructura de Commits](#estructura-de-commits)
- [Uso de Issues y Milestones](#uso-de-issues-y-milestones)
- [Buenas Prácticas para Commits](#buenas-prácticas-para-commits)
- [Uso del Archivo .gitignore](#uso-del-archivo-gitignore)
- [Ramas de Trabajo](#ramas-de-trabajo)
- [Rebase y Merge](#rebase-y-merge)

## Estructura de Commits

Los commits deben ser descriptivos y abarcar una sola funcionalidad o tarea. Cada commit debe tener un mensaje claro que describa qué cambios se han realizado y cuál es el objetivo de dichos cambios.

## Uso de Issues y Milestones

Cada tarea debe ser creada como un **issue** en el repositorio y se debe asignar a un **milestone** adecuado. Al finalizar una tarea, el commit relacionado debe incluir la referencia a la issue, indicando que se cierra.

- Utiliza **issues** para organizar el trabajo y documentar problemas o mejoras.
- Los **milestones** se deben usar para agrupar issues bajo un objetivo común, como completar un hito del proyecto.

## Buenas Prácticas para Commits

- **Commits atómicos**: Cada commit debe tener un objetivo claro y modificar solo aquello relacionado con dicho objetivo. Esto permite revertir cambios individuales si es necesario sin afectar el resto del proyecto.
- **Realizar commits frecuentemente**: Realizar commits frecuentes asegura que los cambios estén guardados y permite un mejor seguimiento del avance del proyecto.
- **Mensajes claros**: Los mensajes de los commits deben ser claros y concisos. Debe ser una línea resumen que no supere los 50 caracteres. 
- **No subir código roto**: Antes de hacer un commit, asegúrate de que el código está funcionando. No hagas commits de código con errores sintácticos o que no pase las pruebas básicas.

## Uso del Archivo .gitignore

El archivo `.gitignore` se usa para excluir del repositorio aquellos archivos y carpetas que no deben ser versionados. Esto incluye archivos generados automáticamente, credenciales, y bibliotecas que se instalan mediante gestores de paquetes. Algunos ejemplos comunes para incluir en `.gitignore` para este proyecto son:

```
# dependencies
/frontend/node_modules
/backend/node_modules/
...

# testing
/frontend/coverage

# production
/frontend/build

# misc
/frontend/.DS_Store
/backend/.env
...
```

Este archivo ayuda a evitar que archivos sensibles o innecesarios se suban al repositorio, manteniendo el proyecto limpio y seguro.

## Ramas de Trabajo

Trabajar siempre en ramas de desarrollo diferentes a `main`. Utilizar ramas dedicadas para cada funcionalidad o corrección de errores facilita la revisión y pruebas antes de ser integradas al código principal.

### Convención de Nombres para las Ramas
- **feature/énfasis-en-la-funcionalidad**: Para funcionalidades nuevas (por ejemplo, `feature/login-authentication`).
- **fix/énfasis-en-la-correción**: Para correcciones de errores (por ejemplo, `fix/header-alignment`).
- **hotfix/énfasis-en-la-correción-crítica**: Para correcciones urgentes en la rama principal (`hotfix/critical-bug`).

## Rebase y Merge

- Realiza un **rebase** antes de fusionar una rama al `main` para mantener un historial limpio. Esto ayuda a evitar commits redundantes de tipo "merge" y facilita el seguimiento de cambios.
- Cuando una rama esté lista para ser fusionada, realiza un **pull request** para facilitar la revisión de código.

Adoptar estas prácticas contribuye a un desarrollo más ordenado, eficiente y colaborativo, mejorando la calidad y mantenibilidad del proyecto **Attendance Records Webapp**.

