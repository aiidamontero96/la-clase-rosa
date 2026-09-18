'use strict';
window.ROSA_PLAY=(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dinos=window.ROSA.dinosaurs;
  const picture=(src,label,cls='')=>'<img class="'+cls+'" src="'+src+'" alt="'+esc(label)+'" draggable="false">';
  const outlineSrc=src=>src.replace(/(\.[a-z0-9]+)$/i,'-outline$1');
  const printPicture=(item,label,cls,ink)=>picture(ink==='coloring'?outlineSrc(item.src):item.src,label,cls);
  const symbol=(emoji,label)=>({src:'assets/symbols/'+[...emoji].map(c=>c.codePointAt(0).toString(16)).join('-')+'.png',label});
  const themes={
    Dinosaurios:dinos.map(d=>({src:'assets/dinos-pdi/'+d.id+'.webp',label:d.short})),
    Animales:[['🐱','Gato'],['🦆','Pato'],['🐰','Conejo'],['🐟','Pez'],['🦋','Mariposa'],['🦕','Dinosaurio']].map(v=>symbol(...v)),
    Frutas:[['🍎','Manzana'],['🍊','Naranja'],['🍇','Uvas']].map(v=>symbol(...v)),
    Aula:[['✏️','Lápiz'],['📚','Libros'],['✂️','Tijeras'],['🧸','Peluche'],['⚽','Balón'],['🚗','Coche']].map(v=>symbol(...v))
  };
  // Original tales: every choice leads to a complete, distinct ending.
  const stories=[
    {id:'lila',title:'Lila y el huevo viajero',cover:'assets/dinos-pdi/triceratops.webp',description:'Un cuento imaginado de dinosaurios, pistas y ayuda mutua.',nodes:{
      inicio:{text:'Lila encuentra un huevo junto al camino. «Alguien debe de estar buscándolo», piensa. Antes de tocarlo, mira a su alrededor. ¿Dónde buscamos a su familia?',choices:[['🌳','Junto al árbol','arbol'],['🐾','Siguiendo las huellas','huellas']]},
      arbol:{text:'Bajo el árbol descansa un dinosaurio de cuello largo. Ha oído una llamada cerca de las flores. Lila quiere avisar de que ha encontrado el huevo. ¿Cómo lo hacemos?',choices:[['👋','Pedimos ayuda','ayuda'],['🎵','Cantamos suavemente','cancion']]},
      huellas:{text:'Las huellas llegan hasta un charco. Al otro lado hay una familia buscando su huevo. Lila los ve, pero ellos aún no la han visto. ¿Cómo los avisamos?',choices:[['🙋','Levantamos las manos','manos'],['💬','Los llamamos desde aquí','llamada']]},
      ayuda:{text:'El dinosaurio llama a la familia y los acompaña hasta el huevo. Lila espera a su lado. «Gracias por ayudarnos», dicen. Entre todos preparan un lugar tranquilo para descansar.',question:'¿A quién podemos pedir ayuda nosotros?'},
      cancion:{text:'La canción de Lila llega hasta las flores. La familia se acerca y reconoce su huevo. Lila les enseña su canción y todos la repiten muy bajito. El camino se llena de voces amigas.',question:'¿Inventamos una canción para despedirnos?'},
      manos:{text:'Lila mueve las manos despacio. La familia la ve y vuelve por el sendero que rodea el charco. Encuentran el huevo y dan las gracias con un abrazo de dinosaurio imaginario.',question:'¿De qué maneras podemos dar las gracias?'},
      llamada:{text:'«¡Estamos aquí!», llama Lila. La familia escucha y sigue su voz hasta el huevo. Después dibujan juntos una señal en el camino para poder volver a encontrarse.',question:'¿Cómo sería la señal que dibujaríamos?'}
    }},
    {id:'semilla',title:'La semilla de nuestra clase',cover:'assets/symbols/1f331.png',description:'Decidimos juntos cómo cuidar una pequeña semilla.',nodes:{
      inicio:{text:'En una caja aparece una semilla diminuta. La clase quiere cuidarla y observar qué ocurre. Tenemos tierra y un recipiente. ¿Dónde preparamos su rincón?',choices:[['🪟','Cerca de la ventana','ventana'],['🌳','En un rincón del patio','patio']]},
      ventana:{text:'La semilla ya está en la tierra, junto a la luz. Cada día podemos observarla sin sacarla de su sitio. ¿Cómo nos organizamos para cuidarla?',choices:[['🗓️','Hacemos turnos','turnos'],['👀','La observamos juntos','miramos']]},
      patio:{text:'Buscamos un lugar del patio que podamos visitar. La tierra está preparada. Queremos recordar dónde plantamos la semilla. ¿Qué ponemos a su lado?',choices:[['🪧','Una pequeña señal','cartel'],['🪨','Un círculo de piedras','piedras']]},
      turnos:{text:'La clase prepara turnos para mirar la tierra y regar cuando hace falta. Pasan muchos días. Una mañana aparece un brote. Lo dibujamos y compartimos la alegría de verlo crecer.',question:'¿Qué encargo te gustaría tener?'},
      miramos:{text:'Cada mañana observamos juntos el recipiente. Unos días parece que nada cambia. Seguimos cuidándolo. Después de muchos días, asoman dos hojitas y descubrimos que esperar también forma parte del cuidado.',question:'¿Qué otras cosas necesitan tiempo?'},
      cartel:{text:'Dibujamos una semilla en la señal. Así todos saben dónde está y la cuidan al pasar. Con agua, luz y tiempo aparece un brote. Añadimos una hoja al dibujo del cartel.',question:'¿Qué dibujaríamos cuando la planta creciera más?'},
      piedras:{text:'Colocamos las piedras alrededor, dejando espacio para crecer. Visitamos el rincón y cuidamos la tierra. Muchos días después vemos un brote. Las piedras nos ayudan a encontrarlo sin pisarlo.',question:'¿Cómo cuidamos los seres vivos del patio?'}
    }},
    {id:'mochila',title:'La mochila de los sonidos',cover:'assets/symbols/1f4da.png',description:'Escuchamos, imitamos y elegimos el final de una visita.',nodes:{
      inicio:{text:'Nora lleva una mochila con un libro vacío. Quiere llenarlo de sonidos que pueda recordar. Al salir escucha dos pistas. ¿Cuál seguimos primero?',choices:[['🐱','Un miau suave','gato'],['🦆','Un cuac junto al agua','pato']]},
      gato:{text:'Un gato está al sol. Dice «miau» y se estira. Nora escucha desde un poquito más lejos para no molestarlo. ¿Cómo guardamos este sonido en nuestro libro?',choices:[['✏️','Dibujamos al gato','dibujo'],['👏','Inventamos un ritmo','ritmo']]},
      pato:{text:'Un pato dice «cuac, cuac». Nora escucha dos sonidos. El agua hace un ruido suave al moverse. ¿Qué sonido queremos recordar?',choices:[['🦆','La voz del pato','voz'],['💧','El sonido del agua','agua']]},
      dibujo:{text:'Nora dibuja al gato y escribe con ayuda la palabra MIAU. Al volver a clase enseña el dibujo. Todos recuerdan el sonido y cuentan cuándo han visto un gato.',question:'¿Cómo dibujarías un sonido?'},
      ritmo:{text:'Nora inventa dos palmas suaves y una pausa para recordar al gato. En clase enseña el ritmo. Cada compañero añade un gesto y juntos crean una pequeña canción.',question:'¿Repetimos dos palmas y una pausa?'},
      voz:{text:'Nora dibuja un pato y dos círculos: uno por cada «cuac». En clase señala los círculos y todos repiten los sonidos. Su libro ya tiene una página que se puede mirar y escuchar.',question:'¿Cuántos círculos dibujarías para tres sonidos?'},
      agua:{text:'Nora mueve suavemente las manos y hace «shhh» para recordar el agua. Al volver, la clase inventa gestos para el viento, la lluvia y el mar. El libro vacío se convierte en un libro de recuerdos.',question:'¿Qué sonido tranquilo te gusta escuchar?'}
    }}
  ];
  const gameCatalog=[
    ['puzzle','Puzles de dinosaurios','🧩','Coloca cada pieza en su lugar: 4, 6 o 9 piezas.','Lógica'],
    ['ordenar-piezas','Ordena de pequeño a grande','📏','Coloca los dibujos en orden de tamaño.','Matemáticas'],
    ['cestas','Llenamos la cesta','🧺','Lleva a la cesta justo la cantidad de frutas que pide.','Matemáticas'],
    ['cuento','Elige nuestro cuento','📖','Tres historias originales con caminos y finales diferentes.','Lenguaje'],
    ['sorpresa','La caja sorpresa','🎁','Una pregunta, una adivinanza, un movimiento o un reto breve.','Asamblea']
  ];
  function pieces(kind,n=0,level=2){
    const count=[3,6,10][level-1],placed={},art=themes.Dinosaurios[n%dinos.length];
    if(kind==='puzzle'){
      const cols=level===3?3:2,rows=level===1?2:3,total=cols*rows;
      return {kind,prompt:'Coloca cada pieza en su lugar',cols,rows,art,goal:total,placed,pieces:Array.from({length:total},(_,i)=>({id:String(i),slot:String(i),label:'Pieza '+(i+1)}))};
    }
    if(kind==='ordenar-piezas'){
      const total=[2,3,5][level-1];
      return {kind,prompt:'Ordena los dibujos de pequeño a grande',art,goal:total,placed,pieces:Array.from({length:total},(_,i)=>({id:String(i),slot:String(i),label:'Tamaño '+(i+1)+' de '+total,size:36+i*(76/(total-1))}))};
    }
    if(kind==='cestas'){
      const goal=n%count+1,item=themes.Frutas[n%3];
      return {kind,prompt:'Pon '+goal+(goal===1?' fruta':' frutas')+' en la cesta',art:item,goal,placed,pieces:Array.from({length:goal+2},(_,i)=>({id:String(i),slot:'0',label:item.label+' '+(i+1)}))};
    }
    return null;
  }
  function pieceArt(game,piece){
    if(game.kind==='puzzle'){
      const i=Number(piece.id),x=(i%game.cols)/(game.cols-1)*100,y=Math.floor(i/game.cols)/(game.rows-1)*100;
      return '<span class="puzzle-fragment" role="img" aria-label="'+esc(piece.label)+'" style="background-image:url('+game.art.src+');background-size:'+game.cols*100+'% '+game.rows*100+'%;background-position:'+x+'% '+y+'%"></span>';
    }
    return picture(game.art.src,piece.label,game.kind==='cestas'?'fruit-piece':'size-piece')+(game.kind==='ordenar-piezas'?'<span class="sr-only">'+esc(piece.label)+'</span>':'');
  }
  const movements=['Estiramos los brazos hacia el cielo y los bajamos despacio. Podemos hacerlo sentados.','Hacemos tres palmas suaves y después una pausa.','Movemos las manos como si fueran mariposas.','Nos hacemos pequeños como una semilla y nos estiramos como una planta.','Dibujamos un círculo en el aire con un dedo.','Movemos los hombros arriba y abajo tres veces.','Imaginamos que somos árboles y movemos las ramas con el viento.','Saludamos con una mano, con la otra y con las dos.','Tocamos nuestra cabeza y después nuestros hombros.','Hacemos una cara de sorpresa y después una cara tranquila.','Imaginamos que sostenemos una nube: abrimos y cerramos las manos despacio.','Damos dos pasos en el sitio o dos toques suaves sobre las piernas.'];
  const quick=['Busca algo que tenga forma de círculo y señálalo.','Nombra algo que podamos encontrar en el patio.','Enseña con los dedos una cantidad y deja que la clase la descubra.','Piensa en una palabra que empiece como ABEJA.','Nombra dos cosas que sirven para pintar.','Haz un gesto para que adivinemos una acción.','Escoge dos objetos y cuenta en qué se parecen.','Di una palabra y acompáñala con palmadas.','Busca con la mirada algo azul.','Inventamos un saludo para toda la clase.','Piensa en algo que sea pequeño y algo que sea grande.','Di una manera de ayudar a un compañero.'];
  function surprise(n,type='mezcla'){
    const types=['adivinanza','movimiento','pregunta','reto'],kind=types.includes(type)?type:types[n%4],index=type==='mezcla'?Math.floor(n/4):n;
    if(kind==='adivinanza'){const r=window.ROSA.riddles[index%window.ROSA.riddles.length];return {kind,title:'Escucha las pistas',icon:'💬',text:r[0],answer:r[1]};}
    if(kind==='pregunta'){const questions=Object.values(window.ROSA.questionGroups).flat();return {kind,title:'Una pregunta para conversar',icon:'💭',text:questions[index%questions.length]};}
    return {kind,title:kind==='movimiento'?'Movemos el cuerpo':'Un reto pequeño',icon:kind==='movimiento'?'🙌':'⭐',text:(kind==='movimiento'?movements:quick)[index%12]};
  }
  function printCards(settings){
    const theme=themes[settings.theme]||themes.Dinosaurios,total=[4,6,12].includes(settings.count)?settings.count:6,max=[3,6,10].includes(settings.max)?settings.max:6;
    const cards=[];
    for(let i=0;i<total;i++){
      const index=settings.type==='memory'?Math.floor(i/2):i,item=theme[(index+(settings.seed||0))%theme.length],amount=settings.type==='contar'&&max===10?10:(i+(settings.seed||0))%max+1;
      let inner='';
      if(settings.type==='contar')inner='<h3>¿Cuántos hay?</h3><div class="print-collection" style="--columns:'+Math.min(amount,amount<=4?2:amount<=6?3:4)+';--rows:'+Math.ceil(amount/(amount<=4?2:amount<=6?3:4))+'">'+Array.from({length:amount},()=>printPicture(item,item.label,'',settings.ink)).join('')+'</div><div class="write-number" aria-label="Escribe la cantidad"></div>';
      else if(settings.type==='series'){
        const pattern=['AB','AAB','ABC'].includes(settings.pattern)?settings.pattern:'AB';
        const chars=pattern.repeat(4).slice(0,6).split('');
        inner='<h3>Continúa la serie</h3><div class="print-series">'+chars.map((c,j)=>j>=4?'<span class="print-hole" aria-label="Espacio para completar"></span>':printPicture(theme[(c.charCodeAt(0)-65+i+(settings.seed||0))%theme.length],'Modelo','',settings.ink)).join('')+'</div>';
      }else if(settings.type==='memory')inner='<div class="print-memory-group">'+Array.from({length:1+Math.floor(index/theme.length)},()=>printPicture(item,item.label,'',settings.ink)).join('')+'</div>';
      else inner=printPicture(item,item.label,'print-main-picture',settings.ink)+(settings.type==='tarjetas'?'<strong>'+esc(item.label.toLocaleUpperCase('es-ES'))+'</strong>':'');
      cards.push('<article class="custom-print-card">'+inner+'</article>');
    }
    if(settings.type==='memory'){
      // Separate each duplicate pair while preserving exactly two of every card.
      return [...cards.filter((_,i)=>i%2===0),...cards.filter((_,i)=>i%2===1).reverse()];
    }
    return cards;
  }
  function printSheets(settings,onlyPage=null){
    const cards=printCards(settings),countTen=settings.type==='contar'&&settings.max===10,perPage=countTen?3:({grande:4,mediana:6,pequena:12}[settings.size]||6);
    const label={contar:'Contamos',memory:'Parejas para jugar',series:'Series para completar',tarjetas:'Tarjetas de vocabulario'}[settings.type]||'Tarjetas';
    const pages=[];
    for(let i=0;i<cards.length;i+=perPage){if(onlyPage!==null&&i/perPage!==onlyPage)continue;pages.push('<section class="print-sheet '+(settings.ink==='bn'?'print-bn':settings.ink==='coloring'?'print-outline':'')+'"><header><strong>La Clase Rosa · '+label+'</strong><span>'+esc(settings.theme)+' · '+(i/perPage+1)+' / '+Math.ceil(cards.length/perPage)+'</span></header><div class="custom-print-grid '+(countTen?'count-ten':'size-'+(settings.size||'mediana'))+'">'+cards.slice(i,i+perPage).join('')+'</div><footer>Infantil · '+(settings.type==='series'?'Completa los huecos dibujando o usando tus piezas guardadas.':'Recorta las tarjetas con ayuda de una persona adulta.')+'</footer></section>');}
    return pages.join('');
  }
  return {gameCatalog,stories,themes,pieces,pieceArt,surprise,printCards,printSheets,picture};
})();
