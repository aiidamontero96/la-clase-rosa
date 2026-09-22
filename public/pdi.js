'use strict';

// Original, repeatable activities. A round keeps its pictures and answer while
// children look, hide the model, or try another choice.
window.ROSA_PDI = (() => {
  const games = [
    ['parejas', 'Busca su pareja', '🐱', 'Mira el modelo y toca el dibujo que es igual.', 'Lógica'],
    ['cantidades', 'Un número, muchos dibujos', '🍎', 'Elige el grupo que tiene la cantidad indicada, del 1 al 6.', 'Matemáticas'],
    ['comparar', '¿Dónde hay más?', '⚖️', 'Compara dos grupos: unas veces buscamos más y otras, menos.', 'Matemáticas'],
    ['juntar', 'Juntamos y contamos', '🍓', 'Junta dos pequeños grupos y cuenta cuántos hay en total.', 'Matemáticas'],
    ['siguiente', 'El tren de los números', '🚂', 'Completa el siguiente vagón de una secuencia hasta el 6.', 'Matemáticas'],
    ['tamanos', 'Grande, pequeño', '🐘', 'Compara tres dibujos y encuentra el mayor o el menor.', 'Matemáticas'],
    ['vocales', 'Empieza por…', 'AE', 'La maestra dice la palabra y buscamos su primera vocal.', 'Lenguaje'],
    ['silabas', 'Palabras con palmadas', '👏', 'Di la palabra despacio y acompaña sus sílabas con palmas.', 'Lenguaje'],
    ['colores', 'El color escondido', '🎨', 'Observa el color del modelo y encuentra otro igual.', 'Lógica'],
    ['orden', 'Recuerda el lugar', '🧠', 'Mira tres dibujos, tápalos y recuerda cuál estaba en cada lugar.', 'Lógica'],
    ['posiciones', 'Arriba y abajo', '🎈', 'Observa dos dibujos y señala el que está arriba o abajo.', 'Lógica'],
    ['asociaciones', '¿Qué necesitamos?', '☂️', 'Escucha una situación cotidiana y elige el objeto que ayuda.', 'Lenguaje'],
    ['nombre-inicial', '¿De quién es la inicial?', 'A', 'Mira una letra y elige el nombre de la clase que empieza por ella.', 'Lenguaje'],
    ['nombre-letras', 'Contamos las letras', '123', 'Cuenta las letras de los nombres de la clase, sin contar los espacios.', 'Matemáticas'],
    ['nombre-compara', 'Nombres largos y cortos', '↔', 'Compara dos nombres y descubre cuál tiene más o menos letras.', 'Lógica'],
    ['fechas-especiales', 'El año en nuestra clase', '🎉', 'Halloween, Navidad, Paz, Andalucía y otros momentos del curso.', 'Asamblea'],
    ['disfraces', '¿De qué voy disfrazado?', '🎭', 'Aparece un disfraz real al azar y elegimos su nombre entre tres respuestas.', 'Carnaval'],
    ['dino-vocabulario', 'Vocabulario dinosaurio', '🦕 A', 'Descubre palabras del mundo de los dinosaurios con imágenes grandes.', 'Proyecto'],
    ['dino-buscar', 'Busca el dinosaurio', '🔎🦕', 'Escucha el nombre y localiza el dinosaurio correcto.', 'Proyecto'],
    ['dino-patas', 'Dos o cuatro patas', '2 · 4', 'Observa cómo caminaba cada dinosaurio y elige dos o cuatro patas.', 'Proyecto'],
    ['dino-movimiento', 'Muévete como un dinosaurio', '↟🦖', 'Retos corporales breves para caminar, estirar y rugir jugando.', 'Proyecto'],
    ['completa-dino', 'Completa la frase', '___', 'Descubre la palabra que falta en una frase sobre cada dinosaurio.', 'Proyecto'],
    ['relaciona-vocabulario', 'Une vocabulario', '🔗', 'Relaciona imágenes y palabras del vocabulario elegido.', 'Lenguaje'],
    ['relaciona-cantidades', 'UNE CANTIDADES', '🔗 123', 'UNE CADA GRUPO DE PUNTOS CON SU NÚMERO.', 'Matemáticas'],
    ['numero-vecino', 'EL NÚMERO VECINO', '4 ? 6', 'DESCUBRE EL NÚMERO ANTERIOR O POSTERIOR.', 'Matemáticas'],
    ['sumando-falta', 'EL SUMANDO QUE FALTA', '3 + ? = 7', 'COMPLETA SUMAS VISUALES CON UNA CANTIDAD ESCONDIDA.', 'Matemáticas'],
    ['rimas', 'PALABRAS QUE RIMAN', '🎵', 'ESCUCHA Y ENCUENTRA DOS PALABRAS QUE TERMINAN PARECIDO.', 'Lenguaje'],
    ['consonante-inicial', 'PRIMERA CONSONANTE', 'M P S', 'ESCUCHA UNA PALABRA Y ELIGE SU LETRA INICIAL.', 'Lenguaje'],
    ['intruso-categorias', 'EL INTRUSO DE LA CATEGORÍA', '◈', 'DESCUBRE QUÉ ELEMENTO NO PERTENECE AL GRUPO.', 'Lógica'],
    ['patrones-avanzados', 'PATRONES AVANZADOS', '● ■ ▲', 'CONTINÚA PATRONES DE TRES ELEMENTOS Y DOBLES REPETICIONES.', 'Lógica'],
    ['problemas-visuales', 'PEQUEÑOS PROBLEMAS', '🧠 123', 'RESUELVE SITUACIONES DE AÑADIR Y QUITAR CON DIBUJOS.', 'Matemáticas']
  ];
  const objects = [
    ['🐱', 'gato'], ['🍎', 'manzana'], ['🚗', 'coche'], ['🧸', 'oso de peluche'],
    ['🐸', 'rana'], ['🌸', 'flor'], ['⚽', 'balón'], ['🦋', 'mariposa'],
    ['🐟', 'pez'], ['🎈', 'globo'], ['🍓', 'fresa'], ['🐰', 'conejo']
  ];
  const vowelWords = [
    ['🐝', 'ABEJA', 'A'], ['🐘', 'ELEFANTE', 'E'], ['🏝️', 'ISLA', 'I'],
    ['🐻', 'OSO', 'O'], ['🍇', 'UVAS', 'U'], ['💍', 'ANILLO', 'A'],
    ['⭐', 'ESTRELLA', 'E'], ['🧲', 'IMÁN', 'I'], ['👁️', 'OJO', 'O'], ['🦄', 'UNICORNIO', 'U']
  ];
  const syllableWords = [
    ['☀️', 'SOL', ['sol']], ['🏠', 'CASA', ['ca', 'sa']],
    ['⚽', 'PELOTA', ['pe', 'lo', 'ta']], ['🦋', 'MARIPOSA', ['ma', 'ri', 'po', 'sa']],
    ['🐟', 'PEZ', ['pez']], ['🌙', 'LUNA', ['lu', 'na']],
    ['🍎', 'MANZANA', ['man', 'za', 'na']], ['🐘', 'ELEFANTE', ['e', 'le', 'fan', 'te']],
    ['🍞', 'PAN', ['pan']], ['🦆', 'PATO', ['pa', 'to']],
    ['👞', 'ZAPATO', ['za', 'pa', 'to']], ['🚲', 'BICICLETA', ['bi', 'ci', 'cle', 'ta']]
  ];
  const colors = [
    ['rojo', '#e04444'], ['azul', '#3578cf'], ['amarillo', '#f6c53b'],
    ['verde', '#419263'], ['naranja', '#ed913c'], ['morado', '#9256bf']
  ];
  const situations = [
    ['🌧️', 'Está lloviendo. ¿Qué abrimos para cubrirnos?', ['☂️', 'paraguas'], [['📚', 'libros'], ['🖌️', 'pincel']], 'El paraguas nos cubre de la lluvia.'],
    ['🦷', 'Vamos a limpiar los dientes. ¿Qué usamos?', ['🪥', 'cepillo de dientes'], [['🧸', 'peluche'], ['🖍️', 'cera de colores']], 'Nos cepillamos los dientes con un cepillo.'],
    ['🎨', 'Queremos pintar con témpera. ¿Qué usamos?', ['🖌️', 'pincel'], [['🧦', 'calcetines'], ['🔑', 'llave']], 'El pincel nos ayuda a pintar con témpera.'],
    ['🌱', 'La planta necesita agua. ¿Qué le llevamos?', ['💧', 'agua'], [['⚽', 'balón'], ['📚', 'libros']], 'Las plantas necesitan agua para vivir.'],
    ['🚪', 'La puerta está cerrada con llave. ¿Qué la abre?', ['🔑', 'llave'], [['🖍️', 'cera de colores'], ['🍎', 'manzana']], 'Usamos la llave para abrir la cerradura.'],
    ['🦶', 'Vamos a caminar por la calle. ¿Qué nos ponemos en los pies?', ['👟', 'zapatillas'], [['🧤', 'guantes'], ['🧢', 'gorra']], 'Las zapatillas protegen nuestros pies.'],
    ['🥣', 'Hay sopa en el plato. ¿Con qué la comemos?', ['🥄', 'cuchara'], [['✏️', 'lápiz'], ['🧩', 'pieza de puzle']], 'La cuchara nos ayuda a comer la sopa.'],
    ['🖐️', 'Vamos a lavarnos las manos. Además de agua, ¿qué usamos?', ['🧼', 'jabón'], [['🎈', 'globo'], ['🚗', 'coche']], 'Nos lavamos las manos con agua y jabón.']
  ];
  const students=window.ROSA.students;
  const specialDays=[
    ['🎃','Halloween','¿Qué podemos decorar con puntos como Yayoi Kusama?',['Calabaza','Copo de nieve','Libro'],'Calabaza','Podemos observar la forma de una calabaza y transformarla con puntos.'],
    ['🎄','Navidad','¿Qué forma se repite en una guirnalda de bolas?',['Círculo','Triángulo','Línea'],'Círculo','Las bolas nos permiten crear series de colores y tamaños.'],
    ['🕊️','Día de la Paz','¿Qué gesto ayuda a cuidar la paz en clase?',['Escuchar','Empujar','Gritar'],'Escuchar','Escuchar, pedir turno y reparar también construyen paz.'],
    ['💚','Día de Andalucía','¿Qué colores vemos en la bandera de Andalucía?',['Verde y blanco','Rojo y azul','Morado y amarillo'],'Verde y blanco','La bandera de Andalucía combina verde y blanco.'],
    ['🎭','Carnaval','¿Qué podemos usar para transformarnos jugando?',['Disfraz','Cepillo de dientes','Cuchara'],'Disfraz','El disfraz permite imaginar personajes y expresarnos con el cuerpo.'],
    ['🌷','Primavera','¿Qué cambio podemos observar en el patio?',['Nuevas flores','Muñecos de nieve','Hojas secas solamente'],'Nuevas flores','En primavera podemos observar brotes, flores, insectos y días más largos.'],
    ['📚','Día del Libro','¿Qué hacemos antes de pasar una página?',['Mirarla y escuchar','Arrancarla','Pintarla siempre'],'Mirarla y escuchar','Miramos, escuchamos y pasamos las páginas con cuidado.'],
    ['☀️','Fin de curso','¿Qué podemos recordar juntos?',['Lo que aprendimos','Solo los errores','Nada'],'Lo que aprendimos','Al final del curso recordamos descubrimientos, juegos y momentos compartidos.']
  ];
  const costumes=[
    ['vampiro','VAMPIRO'],['diablo','DIABLO'],['esqueleto','ESQUELETO'],['astronauta','ASTRONAUTA'],
    ['bombero','BOMBERO'],['abeja','ABEJA'],['dinosaurio','DINOSAURIO'],['payaso','PAYASO'],
    ['pinocho','PINOCHO'],['policia','POLICÍA'],['rana','RANA'],['arbol','ÁRBOL'],
    ['platano','PLÁTANO'],['burro','BURRO'],['cangrejo','CANGREJO'],['elefante','ELEFANTE'],['flamenca','FLAMENCA']
  ];
  const dinoVocabulary=[
    ['FÓSIL','UNA HUELLA O UN HUESO MUY ANTIGUO.','triceratops'],
    ['PALEONTÓLOGO','INVESTIGA FÓSILES Y LA VIDA DEL PASADO.','stegosaurus'],
    ['HERBÍVORO','DINOSAURIO QUE COMÍA PLANTAS.','brachiosaurus'],
    ['CARNÍVORO','DINOSAURIO QUE COMÍA OTROS ANIMALES.','trex'],
    ['CRESTA','PARTE ALTA DE LA CABEZA.','parasaurolophus'],
    ['PLACAS','PIEZAS DURAS SOBRE EL LOMO.','stegosaurus'],
    ['CUERNO','PUNTA DURA QUE LE AYUDABA A DEFENDERSE.','triceratops'],
    ['GARRA','UÑA LARGA Y CURVADA.','velociraptor'],
    ['HUEVO','DE AQUÍ NACÍAN LAS CRÍAS.','ankylosaurus']
  ];
  const dinoMovements=[
    ['trex','CAMINA CON PASOS GRANDES Y PESADOS.'],['brachiosaurus','ESTIRA EL CUELLO MUY ALTO PARA ALCANZAR HOJAS.'],
    ['velociraptor','CORRE EN TU SITIO CON PASOS PEQUEÑOS Y RÁPIDOS.'],['triceratops','PON TRES DEDOS COMO CUERNOS Y AVANZA DESPACIO.'],
    ['stegosaurus','HAZ UNA FILA DE PLACAS CON TUS MANOS SOBRE LA ESPALDA.'],['ankylosaurus','MUEVE UNA COLA IMAGINARIA DE UN LADO A OTRO.'],
    ['diplodocus','ALARGA LOS BRAZOS COMO UN CUELLO Y UNA COLA MUY LARGOS.'],['spinosaurus','ABRE LOS BRAZOS COMO UNA GRAN VELA.']
  ];
  const rhymeGroups=[
    [['🐱','GATO'],['🦆','PATO'],['🍎','MANZANA'],['☀️','SOL']],
    [['🐸','RANA'],['🛏️','CAMA'],['🌙','LUNA'],['🐟','PEZ']],
    [['🦁','LEÓN'],['🚚','CAMIÓN'],['🏠','CASA'],['🌸','FLOR']],
    [['🐭','RATÓN'],['⚽','BALÓN'],['🍞','PAN'],['👞','ZAPATO']],
    [['🐟','PEZ'],['👣','PIES'],['🦋','MARIPOSA'],['🚗','COCHE']],
    [['🍓','FRESA'],['🪑','MESA'],['🐰','CONEJO'],['⭐','ESTRELLA']]
  ];
  const consonantWords=[['🐱','GATO','G'],['🐶','PERRO','P'],['🏠','CASA','C'],['☀️','SOL','S'],['🌙','LUNA','L'],['🦋','MARIPOSA','M'],['🍓','FRESA','F'],['🚲','BICICLETA','B'],['🐸','RANA','R'],['🎈','GLOBO','G'],['🦆','PATO','P'],['🧸','MUÑECO','M']];
  const categoryGroups=[
    {name:'ANIMALES',items:[['🐱','GATO'],['🐶','PERRO'],['🐰','CONEJO']],odd:['🚗','COCHE']},
    {name:'FRUTAS',items:[['🍎','MANZANA'],['🍌','PLÁTANO'],['🍓','FRESA']],odd:['🪑','SILLA']},
    {name:'TRANSPORTES',items:[['🚗','COCHE'],['🚲','BICICLETA'],['🚌','AUTOBÚS']],odd:['🌸','FLOR']},
    {name:'ROPA',items:[['👕','CAMISETA'],['🧦','CALCETÍN'],['🧢','GORRA']],odd:['🥄','CUCHARA']},
    {name:'MUEBLES',items:[['🪑','SILLA'],['🛏️','CAMA'],['🛋️','SOFÁ']],odd:['🐟','PEZ']},
    {name:'COMIDA',items:[['🍞','PAN'],['🧀','QUESO'],['🥕','ZANAHORIA']],odd:['✏️','LÁPIZ']}
  ];
  const advancedPatterns=[
    {unit:['🔴','🔵','🟡'],shown:5},
    {unit:['🟩','🟩','🟨'],shown:5},
    {unit:['⭐','🌙','🌙'],shown:6},
    {unit:['🔺','🔵','🔺','🟢'],shown:7},
    {unit:['🍎','🍎','🍌','🍌'],shown:7},
    {unit:['🌸','🍃','🌸','☀️'],shown:6}
  ];

  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const at = (items, n) => items[n % items.length];
  const icon = (item, cls = '') => '<span class="pdi-emoji '+cls+'" role="img" aria-label="'+esc(item[1])+'">'+item[0]+'</span>';
  const collection = (item, amount) => '<span class="pdi-collection">'+Array.from({length:amount}, () => icon(item)).join('')+'</span>';
  const option = (value, label) => ({value:String(value), label});
  const numbers = (answer, max = 6) => [...new Set([answer, Math.max(1, answer - 1), Math.min(max, answer + 1), 1, max])].slice(0, 3).map(value => option(value, String(value)));
  const colorDisc = color => '<span class="pdi-color" style="--disc:'+color[1]+'" role="img" aria-label="'+color[0]+'"></span>';
  const pictureWord = word => '<div class="pdi-word">'+icon(word)+'<strong>'+esc(word[1])+'</strong></div>';
  const dinoPicture = dino => '<img class="pdi-dino-image" src="assets/dinos-pdi/'+esc(dino.id||dino)+'.webp" width="544" height="544" alt="'+esc(dino.short||dino)+'">';

  function round(kind, number = 0, hidden = false, level = 2, payload = null) {
    const n = Math.max(0, Math.floor(Number(number) || 0));
    level = [1, 2, 3, 4].includes(Number(level)) ? Number(level) : 2;
    const max = [3, 6, 10, 12][level - 1];
    const item = at(objects, n);
    const vocabPool=payload?.theme?window.ROSA_CLASSROOM?.vocabThemes?.[payload.theme]:null;
    const vocabAt=index=>vocabPool?.[((index%vocabPool.length)+vocabPool.length)%vocabPool.length];
    const vocabImage=item=>'<img class="pdi-vocab-image" src="'+item.src+'" width="150" height="150" alt="'+esc(item.label)+'">';
    let prompt, visual = '', options, answer, explanation, needsReveal = false;

    if (kind === 'parejas') {
      prompt = '¿Cuál es igual al modelo?';
      const model=vocabAt(n), pool=vocabPool||objects;
      visual = '<div class="pdi-model">'+(model?vocabImage(model):icon(item))+'</div>';
      const offsets=(vocabPool?[0,1,2,3,4]:[0,3,7,9,11]).slice(0,[2,3,4,5][level-1]);
      options = offsets.map(offset => {const other = vocabAt(n+offset)||at(pool,n+offset); return option(other.id||other[1], model?vocabImage(other):icon(other));});
      answer = model?.id||item[1];
      explanation = 'Has encontrado dos dibujos iguales.';
    } else if (kind === 'cantidades') {
      const minimum = [1, 2, 4, 7][level - 1];
      const amount = minimum + n % (max - minimum + 1);
      prompt = 'Busca el grupo con esta cantidad';
      visual = '<div class="pdi-number">'+amount+'</div>';
      options = numbers(amount,max).map(value => option(value.value, collection(item, Number(value.value))));
      answer = amount;
      explanation = 'En ese grupo hay '+amount+'. Podemos contarlos señalando uno a uno.';
    } else if (kind === 'comparar') {
      const low = n % (max - 1) + 1, high = low + 1 + Math.floor(n / (max - 1)) % (max - low);
      const more = Math.floor(n / 2) % 2 === 0;
      prompt = '¿Dónde hay '+(more ? 'más' : 'menos')+'?';
      options = [low, high].map(value => option(value, collection(item, value)));
      answer = more ? high : low;
      explanation = high+' es más que '+low+'. '+low+' es menos que '+high+'.';
    } else if (kind === 'juntar') {
      const left = level===1?1:n % (level>=3?5:3) + 1, right = level===1?n%2+1:level>=3?Math.floor(n/5)%(max-left)+1:Math.floor(n/3)%3+1;
      prompt = 'Si los juntamos, ¿cuántos hay?';
      visual = '<div class="pdi-sum"><div>'+collection(item, left)+'</div><span aria-label="y">+</span><div>'+collection(item, right)+'</div></div>';
      answer = left + right;
      options = numbers(answer,max);
      explanation = left+' y '+right+' juntos hacen '+answer+'.';
    } else if (kind === 'siguiente') {
      const start = n % (max - 2) + 1;
      prompt = '¿Qué número viene después?';
      visual = '<div class="pdi-train"><span aria-hidden="true">🚂</span>'+[start, start + 1, '?'].map(value => '<span class="pdi-wagon">'+value+'</span>').join('')+'</div>';
      answer = start + 2;
      options = numbers(answer,max);
      explanation = 'Contamos: '+start+', '+(start + 1)+', '+answer+'.';
    } else if (kind === 'tamanos') {
      const big = n % 2 === 0;
      prompt = 'Toca el dibujo más '+(big ? 'grande' : 'pequeño');
      options = ['pequeño', 'mediano', 'grande'].map((size, i) => option(size, '<span class="pdi-size-frame">'+icon(item, 'pdi-size-'+i)+'</span>'));
      answer = big ? 'grande' : 'pequeño';
      explanation = 'Es el mismo dibujo, pero este es el más '+answer+'.';
    } else if (kind === 'vocales') {
      const word = at(vowelWords, n), vowels = ['A', 'E', 'I', 'O', 'U'];
      prompt = 'Escucha la palabra. ¿Por qué vocal empieza?';
      visual = level===4?'<div class="pdi-word">'+icon(word)+'</div>':pictureWord(word);
      answer = word[2];
      options = [0, 1, 3].map(offset => {const vowel = at(vowels, vowels.indexOf(answer) + offset);return option(vowel, vowel);});
      explanation = word[1]+' empieza por '+answer+'. La decimos despacito.';
    } else if (kind === 'silabas') {
      const word = at(level===1?syllableWords.filter(w=>w[2].length<=2):syllableWords, n);
      prompt = 'Di la palabra con palmas. ¿Cuántas das?';
      visual = level===4?'<div class="pdi-word"><span class="prompt-symbol" aria-hidden="true">🔊</span></div>':level===3?'<div class="pdi-word">'+icon(word)+'</div>':pictureWord(word);
      answer = word[2].length;
      options = [answer,...[1,2,3,4].filter(value=>value!==answer)].slice(0,[2,3,4,4][level-1]).map(value => option(value, '<span class="pdi-claps"><span>'+value+'</span><span aria-hidden="true">'+Array(value).fill('👏').join('')+'</span></span>'));
      explanation = word[2].join(' · ').toUpperCase()+': '+answer+(answer === 1 ? ' palmada.' : ' palmadas.');
    } else if (kind === 'colores') {
      const color = at(colors, n);
      prompt = 'Busca el mismo color';
      visual = '<div class="pdi-model">'+colorDisc(color)+'</div>';
      options = [0,2,4,1,3].slice(0,[2,3,4,5][level-1]).map(offset => {const other = at(colors, n + offset);return option(other[0], colorDisc(other));});
      answer = color[0];
      explanation = 'Los dos son de color '+answer+'. ¿Ves algo de ese color en clase?';
    } else if (kind === 'orden') {
      const pool=vocabPool||objects,offsets=vocabPool?[0,1,2,3]:[0,4,8,10],trio=offsets.map(offset=>at(pool,n+offset)).slice(0,[2,3,3,4][level-1]),isVocab=Boolean(vocabPool),image=obj=>isVocab?vocabImage(obj):icon(obj);
      const places=trio.length===2?['el primero','el último']:trio.length===3?['el primero','en el medio','el último']:['el primero','el segundo','el tercero','el último'];
      const place = trio.length===4?(n%2===0?0:3):n%trio.length;
      needsReveal = !hidden;
      prompt = hidden ? '¿Qué dibujo estaba '+places[place]+'?' : 'Mira los dibujos, de izquierda a derecha';
      visual = '<div class="pdi-order">'+trio.map((obj, index) => '<span class="pdi-order-card">'+(level<=2?'<small>'+(index + 1)+'</small>':'')+(hidden ? '<span class="pdi-mystery" aria-label="Dibujo tapado">?</span>' : image(obj))+'</span>').join('')+'</div>';
      options = trio.map(obj => option(obj.id||obj[1], image(obj)));
      answer = trio[place].id||trio[place][1];
      explanation = 'El dibujo de '+answer+' estaba '+places[place]+'.';
    } else if (kind === 'posiciones') {
      const upper = item, lower = at(objects, n + 5), above = n % 2 === 0;
      prompt = '¿Qué dibujo está '+(above ? 'arriba' : 'abajo')+'?';
      visual = '<div class="pdi-position"><div>'+icon(upper)+'</div><div>'+icon(lower)+'</div></div>';
      options = [upper, lower].map(obj => option(obj[1], icon(obj)));
      answer = (above ? upper : lower)[1];
      explanation = 'El dibujo de '+answer+' está '+(above ? 'arriba' : 'abajo')+'.';
    } else if (kind === 'asociaciones') {
      const situation = at(situations, n);
      prompt = situation[1];
      visual = '<div class="pdi-model">'+icon([situation[0], 'Pista de la situación'])+'</div>';
      const associationPool=[situation[2],...situation[3],at(situations,n+1)[3][0],at(situations,n+2)[3][1]];
      options = associationPool.slice(0,[2,3,4,5][level-1]).map(obj => option(obj[1], icon(obj)));
      answer = situation[2][1];
      explanation = situation[4];
    } else if(kind==='nombre-inicial'){
      const student=at(students,n),initial=student[0].toLocaleUpperCase('es-ES');
      prompt='¿De quién es la inicial? ¿Qué nombre empieza por '+initial+'?';
      visual='<div class="pdi-name-initial">'+initial+'</div>';
      const others=students.filter(name=>name!==student&&name[0].toLocaleUpperCase('es-ES')!==initial);
      const rotatedOthers=[...others.slice(n%others.length),...others.slice(0,n%others.length)];
      options=[student,...rotatedOthers.slice(0,[1,2,3,4][level-1])].map(name=>option(name,name));
      answer=student;explanation=student+' empieza por '+initial+'.';
    } else if(kind==='nombre-letras'){
      const pool=level===1?students.filter(name=>[...name.replace(/\s/g,'')].length<=6):students,student=at(pool,n),amount=[...student.replace(/\s/g,'')].length;
      prompt='¿Cuántas letras tiene '+student.toLocaleUpperCase('es-ES')+'?';
      visual='<div class="pdi-name-model">'+esc(student.toLocaleUpperCase('es-ES'))+'</div>'+(level>=3?'':'<div class="pdi-name-dots">'+Array.from({length:amount},()=>'<span></span>').join('')+'</div>');
      options=[...new Set([amount,Math.max(1,amount-1),amount+1,Math.max(1,amount-2),amount+2])].slice(0,[2,3,4,5][level-1]).map(value=>option(value,String(value)));answer=amount;explanation=student+' tiene '+amount+' letras. Tocamos una marca por cada letra.';
    } else if(kind==='nombre-compara'){
      const first=at(students,n);let second=at(students,n+1);let guard=0;
      while([...first.replace(/\s/g,'')].length===[...second.replace(/\s/g,'')].length&&guard++<students.length)second=at(students,n+guard+1);
      const third=at(students,n+5),names=level===4?[first,second,third]:[first,second],length=name=>[...name.replace(/\s/g,'')].length,firstLength=length(first),secondLength=length(second),longer=n%2===0;
      prompt='¿Qué nombre tiene '+(longer?'más':'menos')+' letras?';
      visual='<div class="pdi-name-compare">'+names.map(name=>'<span>'+esc(name.toLocaleUpperCase('es-ES'))+(level===1?'<small><b>'+length(name)+'</b>'+Array.from({length:length(name)},()=>'<i></i>').join('')+'</small>':level===2?'<small>'+Array.from({length:length(name)},()=>'<i></i>').join('')+'</small>':'')+'</span>').join('')+'</div>';
      options=names.map(name=>option(name,name));answer=names.reduce((best,name)=>longer?(length(name)>length(best)?name:best):(length(name)<length(best)?name:best));explanation=names.map(name=>name+' tiene '+length(name)+' letras').join(' y ')+'.';
    } else if(kind==='nombre-falta'){
      const total=[2,3,4,5][level-1],group=Array.from({length:total},(_,i)=>at(students,n+i)),missing=n%total;
      needsReveal=!hidden;prompt=hidden?'¿Qué nombre falta?':'Mira y nombra de izquierda a derecha';
      visual='<div class="pdi-name-memory">'+group.map((name,i)=>'<span>'+(hidden&&i===missing?'?':esc(name.toLocaleUpperCase('es-ES')))+'</span>').join('')+'</div>';
      options=group.map(name=>option(name,name));answer=group[missing];explanation='Faltaba '+answer+'.';
    } else if(kind==='numero-vecino'){
      const limit=[5,10,20,30][level-1],before=n%2===1,current=before?2+n%(limit-1):1+n%(limit-1);
      prompt=before?'¿QUÉ NÚMERO VA JUSTO ANTES?':'¿QUÉ NÚMERO VA JUSTO DESPUÉS?';
      visual='<div class="pdi-neighbor"><span>?</span><span>'+current+'</span></div>';if(!before)visual='<div class="pdi-neighbor"><span>'+current+'</span><span>?</span></div>';
      answer=before?current-1:current+1;const candidates=[answer,Math.max(0,answer-1),Math.min(limit,answer+1),before?current+1:Math.max(0,current-1)];options=[...new Set(candidates)].slice(0,[2,3,4,4][level-1]).map(value=>option(value,String(value)));explanation='EL NÚMERO VECINO ES '+answer+'.';
    } else if(kind==='sumando-falta'){
      const limit=[5,8,10,15][level-1],total=3+n%(limit-2),known=1+(Math.floor(n/2)%(total-1)),missing=total-known;
      prompt='¿QUÉ CANTIDAD FALTA PARA COMPLETAR LA SUMA?';visual='<div class="pdi-missing-sum"><span>'+collection(item,known)+'</span><b>+</b><strong>?</strong><b>=</b><em>'+total+'</em></div>';
      answer=missing;const candidates=[missing,Math.max(0,missing-1),missing+1,Math.min(limit,missing+2)];options=[...new Set(candidates)].slice(0,[2,3,4,4][level-1]).map(value=>option(value,String(value)));explanation=known+' Y '+missing+' HACEN '+total+'.';
    } else if(kind==='rimas'){
      const group=at(rhymeGroups,n),model=group[0],correct=group[1],available=[correct,...group.slice(2),at(rhymeGroups,n+1)[2]];
      prompt='¿QUÉ PALABRA RIMA CON '+model[1]+'?';visual=level===4?'<div class="pdi-word">'+icon(model)+'</div>':pictureWord(model);answer=correct[1];options=available.slice(0,[2,3,4,4][level-1]).map(word=>option(word[1],icon(word)+(level===4?'':'<strong>'+word[1]+'</strong>')));explanation=model[1]+' Y '+correct[1]+' TERMINAN PARECIDO.';
    } else if(kind==='consonante-inicial'){
      const word=at(consonantWords,n),letters=[word[2],at(consonantWords,n+3)[2],at(consonantWords,n+5)[2],at(consonantWords,n+7)[2]];
      prompt='¿POR QUÉ CONSONANTE EMPIEZA '+word[1]+'?';visual=level===4?'<div class="pdi-word">'+icon(word)+'</div>':pictureWord(word);answer=word[2];options=[...new Set(letters)].slice(0,[2,3,4,4][level-1]).map(letter=>option(letter,letter));explanation=word[1]+' EMPIEZA POR '+word[2]+'.';
    } else if(kind==='intruso-categorias'){
      const group=at(categoryGroups,n),count=[2,3,4,4][level-1],shown=[...group.items.slice(0,count-1),group.odd];
      prompt=level===4?'¿CUÁL NO PERTENECE AL MISMO GRUPO?':'¿CUÁL NO PERTENECE AL GRUPO DE '+group.name+'?';visual=level===4?'':'<div class="pdi-category-label">'+group.name+'</div>';answer=group.odd[1];options=shown.map(entry=>option(entry[1],icon(entry)+(level===4?'':'<strong>'+entry[1]+'</strong>')));explanation=group.odd[1]+' NO PERTENECE AL GRUPO DE '+group.name+'.';
    } else if(kind==='patrones-avanzados'){
      const pattern=at(advancedPatterns,n),shown=pattern.shown-(level===4?1:0),sequence=Array.from({length:shown},(_,i)=>pattern.unit[i%pattern.unit.length]),nextToken=pattern.unit[shown%pattern.unit.length],distractors=[nextToken,...pattern.unit.filter(token=>token!==nextToken),'⬛','🔷'];
      prompt='OBSERVA EL PATRÓN. ¿QUÉ VIENE DESPUÉS?';visual='<div class="pdi-advanced-pattern">'+sequence.map(token=>'<span>'+token+'</span>').join('')+'<strong>?</strong></div>';answer=nextToken;options=[...new Set(distractors)].slice(0,[2,3,4,4][level-1]).map(token=>option(token,'<span class="pdi-pattern-option">'+token+'</span>'));explanation='EL PATRÓN SE REPITE. AHORA VIENE '+nextToken+'.';
    } else if(kind==='problemas-visuales'){
      const limit=[5,8,10,12][level-1],remove=n%2===1,start=remove?3+n%(limit-2):1+n%Math.max(1,limit-3),change=1+Math.floor(n/2)%Math.max(1,remove?start-1:limit-start),result=remove?start-change:start+change;
      prompt=remove?'HABÍA '+start+' Y SE FUERON '+change+'. ¿CUÁNTOS QUEDAN?':'HABÍA '+start+' Y LLEGARON '+change+'. ¿CUÁNTOS HAY AHORA?';visual='<div class="pdi-story-problem"><span>'+collection(item,start)+'</span><b>'+(remove?'−':'+')+'</b><span>'+collection(item,change)+'</span></div>';answer=result;const candidates=[result,Math.max(0,result-1),result+1,Math.min(limit,result+2)];options=[...new Set(candidates)].slice(0,[2,3,4,4][level-1]).map(value=>option(value,String(value)));explanation=remove?start+' MENOS '+change+' SON '+result+'.':start+' MÁS '+change+' SON '+result+'.';
    } else if(kind==='dino-vocabulario'){
      const word=at(dinoVocabulary,n),alternatives=[word,at(dinoVocabulary,n+3),at(dinoVocabulary,n+6),at(dinoVocabulary,n+1),at(dinoVocabulary,n+4)];prompt='¿QUÉ PALABRA ES?';visual='<div class="pdi-dino-word">'+dinoPicture(word[2])+'<div>'+(level<=2?'<p>'+word[1]+'</p>':'')+'</div></div>';
      options=alternatives.slice(0,[2,3,4,5][level-1]).map(item=>option(item[0],item[0]));answer=word[0];explanation='¡ES '+word[0]+'! '+word[1];
    } else if(kind==='dino-buscar'){
      const dinos=window.ROSA.dinosaurs,target=at(dinos,n),offsets=[0,3,6,1,4].slice(0,[2,3,4,5][level-1]).map(v=>at(dinos,n+v));prompt='BUSCA AL '+target.short.toLocaleUpperCase('es-ES');
      visual='<p class="pdi-dino-clue">'+esc(target.clue.toLocaleUpperCase('es-ES'))+'</p>';options=offsets.map(d=>option(d.id,dinoPicture(d)+'<span>'+esc(d.short.toLocaleUpperCase('es-ES'))+'</span>'));answer=target.id;explanation='¡ES EL '+target.short.toLocaleUpperCase('es-ES')+'! '+target.fact.toLocaleUpperCase('es-ES');
    } else if(kind==='dino-patas'){
      const dinos=window.ROSA.dinosaurs.filter(d=>d.id!=='parasaurolophus'),dino=at(dinos,n),two=['trex','velociraptor','spinosaurus'].includes(dino.id);prompt='¿CAMINABA SOBRE DOS O CUATRO PATAS?';visual='<div class="pdi-dino-single">'+dinoPicture(dino)+'<strong>'+esc(dino.short.toLocaleUpperCase('es-ES'))+'</strong></div>';
      options=[option('DOS','DOS PATAS'),option('CUATRO','CUATRO PATAS')];answer=two?'DOS':'CUATRO';explanation=dino.short.toLocaleUpperCase('es-ES')+' CAMINABA HABITUALMENTE SOBRE '+(two?'DOS':'CUATRO')+' PATAS.';
    } else if(kind==='dino-movimiento'){
      const movement=at(dinoMovements,n),movements=[movement,at(dinoMovements,n+3),at(dinoMovements,n+5),at(dinoMovements,n+7)];prompt='¿CÓMO NOS MOVEMOS COMO ESTE DINOSAURIO?';visual='<div class="pdi-movement">'+dinoPicture(movement[0])+(level===1?'<p>'+movement[1]+'</p>':'')+'</div>';
      options=movements.slice(0,[2,2,3,4][level-1]).map(item=>option(item[1],item[1]));answer=movement[1];explanation='¡SÍ! AHORA LO HACEMOS TODOS: '+movement[1];
    } else if(kind==='fechas-especiales'){
      const day=at(specialDays,n);prompt=day[2];visual='<div class="pdi-special-day"><span>'+day[0]+'</span><strong>'+day[1]+'</strong></div>';
      const dayChoices=[...day[3],at(specialDays,n+1)[3][1],at(specialDays,n+2)[3][2]].filter((value,index,list)=>list.indexOf(value)===index);
      options=dayChoices.slice(0,[2,3,4,5][level-1]).map(value=>option(value,value));answer=day[4];explanation=day[5];
    } else if(kind==='disfraces'){
      const costume=at(costumes,n),costumeChoices=[costume,at(costumes,n+5),at(costumes,n+11),at(costumes,n+3),at(costumes,n+8)];
      prompt='¿DE QUÉ VA DISFRAZADO?';
      visual='<figure class="pdi-costume"><img src="assets/costumes/'+costume[0]+'.webp" width="620" height="660" alt="Persona disfrazada de '+costume[1].toLocaleLowerCase('es-ES')+'"><figcaption>IMÁGENES APORTADAS POR LA MAESTRA · INFANITY Y TESOROS BRILLANTES</figcaption></figure>';
      options=costumeChoices.slice(0,[2,3,4,5][level-1]).map(item=>option(item[1],item[1]));
      answer=costume[1];explanation='ES UN DISFRAZ DE '+costume[1]+'.';
    } else if(kind==='completa-dino'){
      const dinosArr=window.ROSA.dinosaurs,dino=at(dinosArr,n),diets=['Herbívoro','Carnívoro'];
      prompt='Completa la frase sobre el '+dino.short;
      visual='<div class="pdi-dino-single">'+dinoPicture(dino)+'<p class="pdi-complete-sentence">El '+esc(dino.short)+' era <span class="pdi-blank">____</span>.</p></div>';
      options=diets.map(d=>option(d,d));
      answer=dino.diet;
      explanation='EL '+dino.short.toLocaleUpperCase('es-ES')+' ERA '+dino.diet.toLocaleUpperCase('es-ES')+'.';
    } else {
      return null;
    }
    if(level===1 && kind!=='disfraces' && options.length>2){const wrong=options.find(o=>o.value!==String(answer));options=options.filter(o=>o.value===String(answer)||o===wrong);}
    if(level>=3 && ['cantidades','juntar','siguiente'].includes(kind)){
      const extra=Array.from({length:max},(_,i)=>i+1).find(value=>!options.some(o=>o.value===String(value)));
      options.push(option(extra,kind==='cantidades'?collection(item,extra):String(extra)));
    }
    if(level>=3 && kind==='vocales')options=['A','E','I','O','U'].map(v=>option(v,v));
    // Change the correct button's location between turns, without moving it on a retry.
    const offset = (n + Math.floor(n / 3)) % options.length;
    options = [...options.slice(offset), ...options.slice(0, offset)];
    return {prompt, visual, options, answer:String(answer), explanation, needsReveal};
  }
  return {games, round};
})();
