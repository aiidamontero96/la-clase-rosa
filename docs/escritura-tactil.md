# Escritura táctil en los recuadros de asistencia

Los recuadros usan canvas con dibujo incremental: cada entrada pinta solo los nuevos segmentos, evitando reconstruir una ruta SVG cada vez. La medida del área se calcula al iniciar el trazo, no por cada muestra táctil. Se bloquean los gestos del navegador en el área de escritura y se usa pointerrawupdate cuando está disponible en contexto seguro, con pointermove como alternativa.

Se mantiene el modelo de trazos existente para reconstruir los números al cambiar de pantalla. El tamaño del lienzo se ajusta a la pantalla con densidad de hasta 2x. Los observadores y eventos se limpian al volver a montar los recuadros. Se ignora un segundo dedo mientras otro está escribiendo y se conserva el punto final al levantarlo.

Aplicar el parche y ejecutar python3 scripts/activate-pdi-writing.py para renovar la versión del JS sin sustituir los ajustes locales de index.html.

Comprobaciones: sintaxis JS y simulación de 500 muestras táctiles sin lecturas de geometría por muestra; segundo dedo, punto final, restauración de trazos, borrado, cancelación y alternativa pointermove. Falta comprobar la latencia real en la PDI física: el parche corrige el trabajo realizado por la web, pero no mide el controlador o hardware del panel.
