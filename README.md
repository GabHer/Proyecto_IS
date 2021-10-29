# Proyecto_IS
Desarrollo de una aplicación que permita realizar la gestión de eventos académicos.

Épica
---
- Nombre de la épica: Sistema para la gestión de eventos académicos.
- Dueño de la épica: EduEvents
- Descripción:
    - ¿Para quién?: ?
    - ¿Qué?: Ofrecer eventos, conferencias y talleres
    - ¿La solución?: Facilitar la organización de eventos académicos, virtuales o presenciales.
    - ¿Cómo se logra?: Es una plataforma que siempre está disponible al servicio de sus usuarios.
    - Valor del negocio: Pone al alcance del público en general ofrece expertos que impartan temáticas.
-  Indicadores clave: 
    - Usuarios no registrados
    - Usuarios registrados (Encargados, expectadores, organizadores).

Funcionalidades Principales
-----

- Registrar la mayor cantidad de usuarios.
- Ofrecer Eventos.
- Ofrecer Conferencias o talleres.
- Otorgar diplomas de participación.
- Generar pdfs con la organización de los eventos.
- Mostrar estadísticas de asistencias.
- Ver perfiles.
- Inscribirse en conferencias, eventos y talleres.

Requerimientos funcionales
-----
Requisitos funcionales
- RF1. La aplicación debe permitir el registro de usuarios. Para el registro la aplicación debe solicitar nombre, institución que representa, formación académica, correo electrónico, descripción e intereses y fotografía (todo carácter obligatorio).
- RF2. La aplicación debe solicitar el inicio de sesión con cuenta de usuario válida para acceder a los recursos que ofrece la misma.
- RF3. La aplicación debe mostrar una lista de los eventos, esta lista puede verse por los usuarios inscritos o no pero el detalle solo se muestra a los inscritos.
- RF4. Debe presentarse un buscador de eventos que pueda filtrarlos según Nombre de evento, fecha o estado:
a. Activo: el evento ya inicio y aún no ha finalizado.
b. Inactivo: el evento aún no ha iniciado.
c. Cerrado: el evento finalizo
- RF5. La aplicación debe permitir a los usuarios inscribirse a una conferencia o taller mientras esta no haya finalizado.
- RF6. Cada evento debe poder contener conferencias o talleres, lo cuales serán registrados por el organizador.
- RF7. La aplicación debe poder generar un PDF con la organización de los eventos detallando nombre, descripción, fotografía principal, y una línea del tiempo con los horarios y lugares de las conferencias o talleres.
- RF8. Los usuarios registrados deben poder generar varios eventos dentro de la aplicación.
- RF9. La aplicación debe permitir ingresar los detalles del evento (fecha de inicio y una fecha final, nombre, institución, descripción).
- RF10. La aplicación debe permitir limitar o no la cantidad de participantes a las conferencias o talleres.
- RF11. La aplicación debe dar opción de subir varias imágenes de publicidad del evento.
- RF 12. En caso de ser un evento privado se debe subir una lista blanca de los usuarios que podrán inscribirse en las conferencias y talleres (puede subir a la aplicación una lista en algún formato).
- RF 13. El organizador de un evento puede eliminarlo (lo mismo con los talleres o conferencias).
- RF 14. Cada taller o conferencia tendrá un encargado el cual será asignado por el organizador.
- RF 15. Todos los usuarios que tengan acceso a los eventos deben poder visualizar el perfil de los encargados de las conferencias y talleres.
- RF 16. Cada usuario puede modificar su perfil.
- RF 17. La aplicación debe permitir inscribirse a una conferencia o taller mientras esta no haya finalizado.
- RF 18. La aplicación debe permitir ingresar los detalles de las conferencias o talleres (fecha y hora inicial, fecha y hora final, encargado, nombre, descripción, lugar o enlace de esta).
- RF 19. Los encargados podrán ser seleccionados de todos los usuarios inscritos en la aplicación.
- RF 20. La aplicación debe permitir al organizador de un evento llevar un control de las asistencias a las conferencias o talleres y generar listas de asistencias en PDF.
- RF 21. El sistema le enviará un correo electrónico al encargado de la conferencia o taller, para que este sepa que fue seleccionado para llevar a cabo ese cargo.
- RF 22. El sistema permitirá que el organizador pueda visualizar estadísticas, por ejemplo, el total de personas que asistieron a cierto evento
- RF 23. El sistema le permitirá al organizador generar diplomas de participación para las personas que asistieron a dichas conferencias o talleres. Para realizar esto tomará en cuenta los datos del la conferencia o taller y pedirá los nombres y los cargos de las personas que firmaran los diplomas.
- RF 24. El sistema permitirá programar múltiples conferencias o talleres a la misma fecha y hora, pero debe controlar restricciones a los usuarios que estén inscritos o que estén a cargo de estas para que no puedan estar en dos al mismo tiempo.
- RF 25. Un usuario puede cancelar su inscripción a una conferencia o taller mientras esta aun no esté finalizada.
- RF 26. El sistema enviará un correo electrónico al usuario, confirmando su inscripción a la conferencia o taller en el cual se haya registrado.
