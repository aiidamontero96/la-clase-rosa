# Carga de imágenes

Base: master fa060c22b557a7b822bc1ff175e4a55c48843a26, consultado el 9 de noviembre de 2026.

- Diez miniaturas de 480 × 320 como máximo para las tarjetas. Compresión WebP de calidad 95. Los originales no cambian y se siguen usando dentro del cuaderno. Las miniaturas son versiones reducidas, no copias idénticas en píxeles.
- Portadas: 736.230 bytes originales frente a 367.932 bytes en miniaturas, un 50 % menos si se descargan las diez. No es una medida de velocidad real de la conexión.
- Dos primeras portadas inmediatas y las restantes con carga diferida del navegador. Primera portada con prioridad alta.
- Se prepara una página del cuaderno o hasta dos del cuento, secuencialmente, después de terminar la carga de las imágenes actuales y una pausa de 400 ms. Se omite con ahorro de datos o conexión 2G y no se precargan orígenes externos.
- Se conservan URLs estables y la caché HTTP habitual. Sin service worker nuevo ni política personalizada de caducidad: en GitHub Pages no se cambian las cabeceras HTTP desde este parche.
- El workflow informa del peso de public y sus archivos mayores y limita la ejecución a veinte minutos. No cancela automáticamente despliegues en curso.

## Despliegues revisados

Los primeros intentos de las ejecuciones 42615547004 y 42613579103 subieron el artefacto en 10 y 14 segundos, respectivamente, y quedaron esperando en syncing_files durante unos 4 y 7 minutos antes de la cancelación manual. Ambos segundos intentos terminaron correctamente. El código no consta como causa del atasco. El árbol publicado tiene 4.326 archivos, unos 397 MB. El tamaño puede influir pero no explica por sí solo el atasco.

## Comprobación

Sintaxis de los tres JS, diez miniaturas con sus prioridades, precarga posterior a la imagen visible, dos descargas secuenciales, exclusión de ahorro de datos y 2G, y descarte de navegación antigua. Sin medición de mejora de latencia ni prueba en la PDI física.
