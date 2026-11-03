# El diario de La Clase Rosa

Diario privado de una sola clase. La maestra publica texto, fotos, vídeos y audio; las familias solo leen. Sin comentarios ni registro público.

## Acceso

- `/`: acceso de las familias mediante cuentas creadas por la maestra.
- `/panel`: panel de maestra. Usa el inicio de sesión de ChatGPT de la propietaria y comprueba en servidor la identidad autenticada contra `TEACHER_EMAIL`.
- La contraseña temporal de una familia se muestra una sola vez; en el primer acceso debe cambiarla. Las contraseñas se almacenan con PBKDF2-SHA256 y sal individual, nunca en texto plano.
- Sesiones de familias de siete días, token aleatorio almacenado como SHA256, cookie HttpOnly/Secure/SameSite. Restablecer una contraseña o desactivar una cuenta revoca sus sesiones.

## Datos

D1 `DB` guarda usuarios, sesiones, límites de acceso, publicaciones y metadatos. R2 `BUCKET` guarda archivos privados. Las rutas de archivos validan la sesión y la publicación en cada solicitud; los borradores y archivos sin publicar solo son visibles para la maestra.

Hasta 12 adjuntos por publicación y 40 MB por archivo. Tipos aceptados: JPEG, PNG, WebP, MP4, MOV, WebM, MP3, OGG y WAV. El servidor comprueba la firma del archivo. Los vídeos/audio admiten solicitudes HTTP Range.

Las tablas se crean mediante la migración de `drizzle/`, no durante las solicitudes.

## Validación y construcción

```sh
node scripts/check-diary.mjs
```

Los tests usan SQLite en memoria y almacenamiento de objetos simulado, sin modificar producción. No hay cuentas o publicaciones de ejemplo en producción. La grabación de voz requiere HTTPS y permiso de micrófono del navegador. Se permite adjuntar una grabación externa si el navegador no admite MediaRecorder.

## Operación

Configurar `TEACHER_EMAIL` como secreto del entorno de Sites. No guardar credenciales ni contenidos familiares en Git. No reutilizar el acceso visual de la web pública como mecanismo de autorización del diario.

## Relación con la web principal

Esta carpeta incorpora el código completo del diario al repositorio de La Clase Rosa. GitHub Pages continúa sirviendo exclusivamente `public/`. El código del servidor y las migraciones quedan fuera de esa carpeta.

El diario se ejecuta en un alojamiento con Worker, D1 y R2. En la publicación actual, el alojamiento del diario usa Sites; el inicio de sesión de la maestra utiliza las cabeceras de identidad verificadas de esa plataforma. No deben aceptarse esas cabeceras de clientes sin un proveedor que las valide y sustituya. Las familias usan cuentas y sesiones gestionadas por el diario.

El código no contiene contraseñas de familias, datos del alumnado, archivos subidos ni el valor de `TEACHER_EMAIL`. Los registros y adjuntos viven exclusivamente en la base de datos y el almacenamiento privado del servidor.

La dirección del diario puede conectarse a un subdominio propio configurando el alojamiento y los registros DNS correspondientes. Cambiar el dominio no convierte GitHub Pages en un servidor de autenticación.
