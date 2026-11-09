# Revisión v3: imágenes con sentido, PDF y pintura

Base: parche de cuaderno de anillas v2 ya aplicado. Esta entrega añade una revisión incremental; no elimina los cambios anteriores ni publica la web.

- 30 explicaciones revisadas: la pregunta apunta a una parte, una característica o una relación presente en su imagen. Se retira la fotografía del fósil en bloque como recurso genérico.
- 51 imágenes distintas entre explicaciones, retos y pintura. La prueba detecta también duplicados binarios con nombres diferentes. El rastro de conteo repite deliberadamente una marca dentro de una única actividad.
- Las portadas usan números de cuaderno; no duplican las fotografías de las lecciones.
- RESUMEN recupera las diez láminas originales completas. Cada una se amplía dentro del cuaderno y tiene un PDF independiente de descarga. Se mantiene la ilustración original del documento, aunque las actividades nuevas usen fotos o reconstrucciones realistas.
- Semana 1: cuatro animales, dos de ellos T. rex en posturas distintas. Se pintan enteros al tocar; los distractores no se colorean. Semanas 5 y 7: pintura de un único animal distinto.
- Se conservan siete propuestas de dibujo libre/guiado: paisaje, longitudes, jardín, nido, huella, luz y museo. Desaparecen los rodeos arbitrarios de huesos o placas.
- Continúan las palabras de la pizarra guiada, los retornos de las tres etapas y Seño como última página.

Los modelos SVG son representaciones para contar, comparar o razonar, no fotografías. La paleta de pintura es artística: no afirma el color real de los animales. Las selecciones, el color y los trazos se conservan al cambiar de página durante la misma carga de la web; no se guardan tras recargar el navegador.

## Aplicación local (WSL)

```bash
parche="/mnt/c/Users/acastrom/Downloads/la-clase-rosa-cuaderno-coherente-v3.patch"
git apply --check "$parche" && git apply "$parche"
node scripts/check-dino-route.cjs
npm run dev -- --host 0.0.0.0
```

Aplicar una sola vez sobre v2. Si la comprobación falla, conservar los cambios y revisar la diferencia; no ejecutar `git checkout .` para forzarlo.

## Registro de imágenes y preguntas

### Semana 1: ¡Han aparecido huellas!

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| NUESTROS PIES DEJAN MARCAS | Marca de un pie humano en arena | BUSCA EL TALÓN Y LOS DEDOS EN ESTA MARCA. |
| UNA PISTA CON TRES DEDOS | Modelo de huella con tres dedos | CUENTA LAS PUNTAS. ¿TIENE LA MISMA FORMA QUE TU PIE? |
| LOS HUESOS NOS DAN PISTAS | Esqueleto montado de Triceratops | SEÑALA LA CABEZA Y LAS PATAS QUE VES. |

Dibujo: ELIGE UN COLOR Y PINTA SOLO LOS DOS T. REX.

### Semana 2: Viajamos millones de años atrás

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| PRIMERO: TRIÁSICO | TRIASICO EORAPTOR | OBSERVA SUS DOS PATAS TRASERAS. VAMOS A CONOCER SU ETAPA. |
| DESPUÉS: JURÁSICO | JURASICO BOSQUE | BUSCA EL CUELLO QUE LLEGA HASTA LAS RAMAS. |
| AL FINAL: CRETÁCICO | CRETACICO TIERRA | OBSERVA SU CABEZA CON CUERNOS. ENTRAMOS EN SU MUNDO. |

Dibujo: DIBUJA UN RÍO, HELECHOS Y UN LUGAR PARA DESCANSAR.

### Semana 3: Gigantes y pequeñitos

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| UN CUERPO LIGERO | TRIASICO COELOPHYSIS | ¿QUÉ PATAS TOCAN EL SUELO EN ESTA ESCENA? |
| UN CUELLO MUY ALTO | JURASICO BRAQUIOSAURIO | SIGUE SU CUELLO DESDE EL CUERPO HASTA LA CABEZA. |
| UNA COLA LARGUÍSIMA | Diplodocus | COMPARA SU COLA CON UNA PATA EN ESTA MISMA IMAGEN. |

Dibujo: DESDE LAS DOS MARCAS, DIBUJA UN CUELLO LARGO Y OTRO CORTO.

### Semana 4: ¡A comer, dinosaurios!

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| PLANTAS PARA COMER | Helechos actuales | BUSCA LAS HOJAS. ¿SON TODAS IGUALES DE GRANDES? |
| UN DIENTE CON PUNTAS | Diente fósil de T. rex | MIRA SU PUNTA Y LOS BORDES. ¿PARECE UNA HOJA? |
| OTRO COMEDOR DE PLANTAS | Plateosaurio | OBSERVA SU CUELLO Y SUS PATAS. IMITA SU POSTURA. |

Dibujo: DIBUJA TRES PLANTAS DISTINTAS PARA UN HERBÍVORO.

### Semana 5: Dientes, cuernos y colas

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| CUERNOS EN LA CABEZA | Cráneo fósil de Triceratops | BUSCA EL CUERNO QUE SE VE MÁS LARGO. ALGUNOS QUEDAN OCULTOS DE LADO. |
| PLACAS EN EL LOMO | Estegosaurio | SIGUE LA FILA DE PLACAS: ¿ESTÁN EN EL LOMO O EN LAS PATAS? |
| UNA MAZA EN LA COLA | Anquilosaurio | SEÑALA EL EXTREMO DE SU COLA. ¿ES FINO O GRUESO? |

Dibujo: PINTA EL PAQUICEFALOSAURIO Y SEÑALA SU CASCO.

### Semana 6: Un huevo misterioso

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| HUEVOS DEL PASADO | Huevos fosilizados de dinosaurio | OBSERVA SU FORMA. SON FÓSILES: DE ELLOS YA NO NACERÁ UNA CRÍA. |
| OBSERVAMOS UN NIDO ACTUAL | Nido actual de ave con huevos | ¿QUÉ HAY ALREDEDOR DE LOS HUEVOS? LOS NIDOS DE DINOSAURIO NO ERAN TODOS IGUALES. |
| TAMBIÉN FUERON CRÍAS | Copia de un esqueleto de Maiasaura joven | SEÑALA SU CABEZA Y SU COLA. ¿QUÉ HA CAMBIADO EN TI AL CRECER? |

Dibujo: DIBUJA UN NIDO Y COLOCA TRES HUEVOS DENTRO.

### Semana 7: Cielo y mar prehistóricos

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| ALETAS PARA NADAR | JURASICO PLESIOSAURIO | BUSCA SUS ALETAS. MUEVE TUS BRAZOS COMO SI NADARAS. |
| ALAS PARA VOLAR | JURASICO PTERODACTILO | SIGUE EL BORDE DE UN ALA. ¿VES PLUMAS O UNA MEMBRANA? |
| UN DINOSAURIO DE HOY | Gorrión actual | BUSCA UNA PLUMA Y EL PICO EN LA FOTOGRAFÍA. |

Dibujo: ELIGE UN COLOR PARA EL ICTIOSAURIO. DESPUÉS SEÑALA SUS ALETAS.

### Semana 8: Detectives del pasado

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| UNA HUELLA EN LA ROCA | Huella fósil conservada en una roca | BUSCA LA MARCA DE LOS DEDOS EN ESTA HUELLA FÓSIL. |
| UN YACIMIENTO | Yacimiento de huesos de dinosaurios en una roca | OBSERVA EL SUELO ROCOSO. ¿POR QUÉ NO DEBEMOS PISAR LOS HALLAZGOS? |
| EL MUSEO NOS ENSEÑA | Esqueleto de T. rex expuesto en un museo | BUSCA EL CRÁNEO Y LAS COSTILLAS QUE SE VEN EN LA FOTO. |

Dibujo: DIBUJA UNA HUELLA CON TRES DEDOS. PUEDES SEGUIR LA GUÍA.

### Semana 9: El gran misterio

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| UN GRAN IMPACTO | Representación del impacto de Chicxulub | ESTA IMAGEN IMAGINA EL IMPACTO: NO ES UNA FOTOGRAFÍA. |
| LAS PLANTAS NECESITAN LUZ | Hojas actuales iluminadas por el sol | EN ESTA FOTO ACTUAL, BUSCA LAS HOJAS QUE RECIBEN MÁS LUZ. |
| LAS AVES CONTINUARON | Pluma de un ave actual | MIRA SU EJE CENTRAL Y SUS DOS LADOS. LAS AVES SON DINOSAURIOS VIVOS. |

Dibujo: DIBUJA UNA PLANTA, EL SOL Y LOS RAYOS QUE LLEGAN A SUS HOJAS.

### Semana 10: ¡Somos expertos!

| Explicación | Evidencia | Pregunta de observación |
|---|---|---|
| SABEMOS OBSERVAR | Parasaurolofo | DESCRIBE SU CRESTA SIN DECIR EL NOMBRE DEL ANIMAL. |
| SABEMOS COMPARAR | Velociraptor | ¿QUÉ PARTE TE RECUERDA A UN AVE? ¿QUÉ PARTE ES DIFERENTE? |
| SABEMOS EXPLICAR | CRETACICO PTERANODON | CUÉNTASELO A UN COMPAÑERO: ¿POR QUÉ NO LO PONEMOS CON LOS REPTILES MARINOS? |

Dibujo: DIBUJA TU DINOSAURIO FAVORITO CON UNA PISTA PARA RECONOCERLO.

## Validación

Prueba de 100 páginas y 20 retos, respuestas correctas/incorrectas, imágenes sin duplicación entre actividades, 10 PDF disponibles, pintura selectiva, deshacer, borrado, conservación de estado y límites de navegación. Se comprueba que los PDF conservan el tamaño y las instrucciones de composición de cada página original; únicamente se optimiza su imagen para descarga. La revisión visual incluye el recorrido completo de escritorio y tamaños reducidos.

## Recurso creado

`public/assets/route-notebook-v3/trex-dos.webp`: reconstrucción generada con la herramienta integrada de imágenes, convertida a WebP con transparencia. Prompt: un T. rex adulto aislado, realista, de perfil hacia la izquierda, postura relajada, cuerpo completo, dos brazos cortos de dos dedos, cola extendida, sin texto ni fondo, para distinguir dos ejemplares en un juego de colorear. No representa colores científicamente confirmados.
