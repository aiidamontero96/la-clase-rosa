'use strict';
(() => {
  const art={
    classroom:'assets/dinosaur-classroom/aula-preview.webp',
    playground:'video/dinosaurios/patio-dinosaurio-poster.webp',
    triassic:'assets/dino-world/expedicion-triasico.webp',
    jurassic:'assets/dino-world/documental/jurasico-bosque.webp',
    cretaceous:'assets/dino-world/documental/cretacico-tierra.webp',
    little:'assets/dino-world/documental/triasico-coelophysis.webp',
    giant:'assets/dino-world/documental/jurasico-braquiosaurio.webp',
    marine:'assets/dino-world/documental/jurasico-plesiosaurio.webp',
    flying:'assets/dino-world/documental/jurasico-pterodactilo.webp',
    triceratops:'assets/dino-explorer/real/triceratops.webp',
    stegosaurus:'assets/dino-explorer/real/stegosaurus.webp',
    trex:'assets/dino-explorer/real/trex.webp',
    ankylosaurus:'assets/dino-explorer/real/ankylosaurus.webp',
    footprint:'assets/dino-footprints/trex.webp'
  };
  const weeks=[
    {
      title:'¡Han aparecido huellas!', theme:'Tras la primera pista', words:'HUELLA · DINOSAURIO · INVESTIGAR',
      intro:'En La Clase Rosa encontramos huellas sobre las mesas. Después vimos un vídeo de un dinosaurio en clase y otro de varios dinosaurios en el patio. ¿Qué pistas nos dejaron?',
      look:'SEÑALA UNA HUELLA EN LA LÁMINA. ¿CUÁNTAS PUNTAS VES?',
      activities:[
        ['touch','La huella gemela','Compara formas','track',[
          ['¿QUÉ HUELLA TIENE LAS MISMAS TRES PUNTAS?', 'track', [['Huella redonda','round-track'],['Huella de tres dedos','track'],['Huella de dos dedos','split-track']],1,'¡COINCIDEN! LAS DOS TIENEN TRES PUNTAS.'],
          ['¿QUÉ HUELLA TIENE DOS MARCAS SEPARADAS?', 'split-track', [['Huella de dos dedos','split-track'],['Huella redonda','round-track'],['Huella de tres dedos','track']],0,'¡LA ENCONTRASTE! LAS DOS MARCAS ESTÁN SEPARADAS.']
        ]],
        ['hands','Reconstruimos el misterio','Cuenta lo que pasó','playground','Papel, lápices y tres hojas para el mural.',[
          'DIBUJAD LAS HUELLAS QUE APARECIERON SOBRE LAS MESAS.',
          'RECORDAD LOS VÍDEOS. ¿QUÉ VIMOS PRIMERO EN CLASE? ¿Y DESPUÉS EN EL PATIO?',
          'ORDENAD TRES DIBUJOS EN EL MURAL. UN EQUIPO CUENTA LA HISTORIA SEÑALANDO CADA PISTA.'
        ],['track','classroom','playground']]
      ]
    },{
      title:'Viajamos millones de años atrás', theme:'El tiempo de los dinosaurios', words:'TRIÁSICO · JURÁSICO · CRETÁCICO',
      intro:'El Triásico fue primero. Después llegó el Jurásico y al final, el Cretácico. Durante todo ese tiempo cambiaron los paisajes y vivieron animales diferentes.',
      look:'BUSCA LOS TRES NOMBRES EN LA LÁMINA.',
      activities:[
        ['explore','Ventanas al pasado','Abre un paisaje','triassic','TOCA UN PAISAJE PARA DESCUBRIR SU ETAPA.',[
          ['Triásico','triassic','TRIÁSICO · APARECEN LOS PRIMEROS DINOSAURIOS.'],
          ['Jurásico','jurassic','JURÁSICO · VIVIERON GIGANTES DE CUELLO LARGO.'],
          ['Cretácico','cretaceous','CRETÁCICO · VIVIÓ EL TRICERATOPS.']
        ]],
        ['hands','Tres paisajes en el suelo','Camina por las etapas','jurassic','Tres cartulinas y figuras de dinosaurios.',[
          'COLOCAD TRES ISLAS EN EL SUELO. CADA ISLA SERÁ UNA ETAPA.',
          'DEJAD A COELOPHYSIS EN EL TRIÁSICO, AL BRAQUIOSAURIO EN EL JURÁSICO Y A TRICERATOPS EN EL CRETÁCICO.',
          'HACED EL VIAJE PASO A PASO. AL LLEGAR A CADA ISLA, DECID SU NOMBRE Y SALUDAD A SU DINOSAURIO.'
        ],['little','giant','triceratops']]
      ]
    },{
      title:'Gigantes y pequeñitos', theme:'Tamaño y patas', words:'GIGANTE · PEQUEÑO · LARGO · PATA',
      intro:'Había dinosaurios pequeños como Coelophysis y gigantes como el Braquiosaurio. Unos caminaban sobre dos patas y otros sobre cuatro.',
      look:'BUSCA UN DINOSAURIO PEQUEÑO Y UNO GRANDE. ¿QUÉ VES EN SUS PATAS?',
      activities:[
        ['touch','Dos patas o cuatro','Mira antes de tocar','giant',[
          ['¿QUIÉN CAMINABA SOBRE CUATRO PATAS?', null,[['Coelophysis','little'],['Braquiosaurio','giant']],1,'¡BRAQUIOSAURIO! SOSTENÍA SU CUERPO SOBRE CUATRO PATAS.'],
          ['¿QUIÉN SE MOVÍA SOBRE DOS PATAS?', null,[['Braquiosaurio','giant'],['Coelophysis','little']],1,'¡COELOPHYSIS! USABA LAS DOS PATAS TRASERAS PARA MOVERSE.']
        ]],
        ['hands','Una cola, muchos pasos','Compara longitudes','giant','Dos cuerdas de distinta longitud y cinta de papel.',[
          'PONED LAS DOS CUERDAS CON EL INICIO EN LA MISMA MARCA.',
          'CAMINAD JUNTO A CADA CUERDA CONTANDO PASOS PEQUEÑOS. ¿EN CUÁL CABEN MÁS?',
          'PONED EL DIBUJO DEL GIGANTE JUNTO A LA CUERDA LARGA Y EL DEL PEQUEÑO JUNTO A LA CORTA.'
        ],['measure','little','giant']]
      ]
    },{
      title:'¡A comer, dinosaurios!', theme:'Plantas, carne y dientes', words:'HERBÍVORO · CARNÍVORO · DIENTES',
      intro:'Algunos dinosaurios, como Triceratops, comían plantas. Otros, como T. rex, comían carne. La forma de los dientes nos ayuda a averiguar cómo comían.',
      look:'ENCUENTRA LAS PLANTAS Y LA CARNE. ¿QUIÉN SE COMERÍA CADA COSA?',
      activities:[
        ['touch','El menú de los dinosaurios','Elige qué come cada uno','leaf',[
          ['¿QUÉ COMÍA EL TRICERATOPS?', 'triceratops',[['Plantas','leaf'],['Carne','meat']],0,'¡PLANTAS! EL TRICERATOPS ERA HERBÍVORO.'],
          ['¿QUÉ COMÍA EL T. REX?', 'trex',[['Plantas','leaf'],['Carne','meat']],1,'¡CARNE! EL T. REX ERA CARNÍVORO.']
        ]],
        ['trace','Repasa los dientes','Dibuja sobre la guía','tooth',[
          ['REPASA EL DIENTE ANCHO Y EL DIENTE EN PUNTA.','M 160 141 Q 163 94 222 107 Q 247 118 272 104 Q 321 93 331 140 Q 333 168 310 214 Q 304 274 281 276 L 250 226 Q 242 210 231 226 L 204 275 Q 183 284 181 242 Q 178 200 164 173 Z M 476 121 Q 531 79 594 108 Q 642 128 603 188 Q 568 235 505 278 Q 524 221 493 194 Q 444 158 476 121 Z']
        ]]
      ]
    },{
      title:'Dientes, cuernos y colas', theme:'Cada cuerpo tiene sus pistas', words:'CUERNO · PLACA · COLA · GARRA',
      intro:'Triceratops tenía cuernos, Estegosaurio tenía placas en el lomo y Anquilosaurio tenía una maza al final de la cola. La forma del cuerpo nos ayuda a reconocerlos.',
      look:'SEÑALA LOS CUERNOS, LAS PLACAS Y LA COLA DE MAZA.',
      activities:[
        ['touch','¿De quién es esa pista?','Reconoce las partes del cuerpo','stegosaurus',[
          ['¿QUIÉN TIENE PLACAS EN EL LOMO?',null,[['Triceratops','triceratops'],['Estegosaurio','stegosaurus'],['Anquilosaurio','ankylosaurus']],1,'¡ESTEGOSAURIO! MIRA LA FILA DE PLACAS DEL LOMO.'],
          ['¿QUIÉN TIENE UNA MAZA AL FINAL DE LA COLA?',null,[['Anquilosaurio','ankylosaurus'],['Triceratops','triceratops'],['Estegosaurio','stegosaurus']],0,'¡ANQUILOSAURIO! SU COLA PODÍA AYUDARLE A DEFENDERSE.'],
          ['¿QUIÉN TIENE CUERNOS EN LA CARA?',null,[['Estegosaurio','stegosaurus'],['Anquilosaurio','ankylosaurus'],['Triceratops','triceratops']],2,'¡TRICERATOPS! TENÍA TRES CUERNOS.']
        ]],
        ['trace','Dibuja un cuerno y una placa','Dos contornos para repasar','triceratops',[
          ['REPASA EL CUERNO DEL TRICERATOPS.','M 235 275 Q 385 224 538 80 Q 524 206 426 268 Q 333 317 235 275 Z'],
          ['REPASA UNA PLACA DEL ESTEGOSAURIO.','M 242 279 Q 259 179 405 69 Q 505 165 526 279 Z']
        ]]
      ]
    },{
      title:'Un huevo misterioso', theme:'Del nido a la vida adulta', words:'HUEVO · NIDO · CRÍA · CRECER',
      intro:'Los dinosaurios nacían de huevos. Algunas especies construían nidos. Al salir del huevo, la cría era pequeña y crecía poco a poco.',
      look:'ENCUENTRA UN HUEVO ENTERO Y UNA CRÍA SALIENDO DEL CASCARÓN.',
      activities:[
        ['touch','¿Quién está naciendo?','Mira el cascarón','hatch',[
          ['TOCA LA CRÍA QUE SALE DEL CASCARÓN.',null,[['Huevo cerrado','egg'],['Cría','hatch']],1,'¡AHÍ ESTÁ LA CRÍA! ACABA DE SALIR DEL HUEVO.']
        ]],
        ['trace','Completa el nido','Repasa el huevo que falta','nest',[
          ['REPASA EL CONTORNO DEL HUEVO.','M 380 59 C 330 59 260 155 260 218 C 260 285 308 316 380 316 C 452 316 500 285 500 218 C 500 155 430 59 380 59 Z']
        ]]
      ]
    },{
      title:'Cielo y mar prehistóricos', theme:'Animales de tierra, agua y aire', words:'VOLAR · NADAR · PLUMAS · REPTIL',
      intro:'En el Jurásico vivían dinosaurios en tierra. También había otros reptiles. El Plesiosaurio nadaba en el mar y el Pterodáctilo volaba.',
      look:'BUSCA UN ANIMAL CON ALETAS Y OTRO CON ALAS.',
      activities:[
        ['touch','Tierra, agua y aire','Relaciona cada animal con su entorno','marine',[
          ['¿DÓNDE NADABA EL PLESIOSAURIO?', 'marine',[['En el cielo','sky'],['En el mar','sea'],['En tierra','land']],1,'¡EN EL MAR! USABA SUS ALETAS PARA NADAR.'],
          ['¿POR DÓNDE VOLABA EL PTERODÁCTILO?', 'flying',[['En tierra','land'],['Por el cielo','sky'],['En el mar','sea']],1,'¡POR EL CIELO! ERA UN REPTIL VOLADOR.'],
          ['¿POR DÓNDE CAMINABA EL BRAQUIOSAURIO?', 'giant',[['En tierra','land'],['En el mar','sea'],['Por el cielo','sky']],0,'¡EN TIERRA! ERA UN DINOSAURIO TERRESTRE.']
        ]],
        ['hands','Alas, aletas y patas','Muévete según la pista','flying','Tres espacios marcados en el suelo para tierra, mar y aire.',[
          'MIRAD LAS PATAS, LAS ALETAS Y LAS ALAS DE LOS TRES ANIMALES.',
          'AL OÍR BRAQUIOSAURIO, CAMINAD. CON PLESIOSAURIO, NADAD CON LOS BRAZOS. CON PTERODÁCTILO, ABRID LAS ALAS.',
          'UNA PERSONA ELIGE UN GESTO. EL GRUPO ADIVINA EL ANIMAL Y EL LUGAR POR DONDE SE MOVÍA.'
        ],['giant','marine','flying']]
      ]
    },{
      title:'Detectives del pasado', theme:'Huellas, fósiles y museos', words:'FÓSIL · HUESO · EXCAVAR · MUSEO',
      intro:'Las huellas y los huesos que se conservan en las rocas son pistas del pasado. Los paleontólogos los estudian y los museos los muestran.',
      look:'SEÑALA DOS PISTAS QUE PODRÍA ESTUDIAR UNA PALEONTÓLOGA.',
      activities:[
        ['touch','Pistas en la roca','Reconoce una huella','fossil',[
          ['TOCA LA HUELLA QUE QUEDÓ EN LA ROCA.',null,[['Huella','footprint'],['Huevo','egg']],0,'¡UNA HUELLA! PUEDE CONSERVARSE EN LA ROCA MUCHO TIEMPO.']
        ]],
        ['trace','La espiral del fósil','Repasa el dibujo de la roca','fossil',[
          ['REPASA LA ESPIRAL DESDE EL PUNTO VERDE.','M 402 167 C 366 141 325 164 338 202 C 361 250 456 224 459 166 C 463 80 316 72 274 161 C 217 276 365 340 511 264']
        ]]
      ]
    },{
      title:'El gran misterio', theme:'La Tierra cambió', words:'ASTEROIDE · CAMBIO · AVE · EXTINCIÓN',
      intro:'Hace muchísimo tiempo cayó un asteroide. El ambiente cambió mucho y desaparecieron muchos animales, incluidos los dinosaurios no avianos. Las aves sobrevivieron.',
      look:'BUSCA EL ASTEROIDE Y EL AVE. ¿QUÉ CAMBIOS VES EN EL DIBUJO DE LA TIERRA?',
      activities:[
        ['touch','Una pista del espacio','Reconoce el asteroide','asteroid',[
          ['TOCA EL ASTEROIDE.',null,[['Ave','bird'],['Asteroide','asteroid']],1,'¡EL ASTEROIDE! DESPUÉS DEL IMPACTO CAMBIÓ EL AMBIENTE.']
        ]],
        ['hands','La luz y las plantas','Representa qué cambió','cloud','Una linterna, un papel translúcido y una planta o su dibujo.',[
          'ILUMINAD LA PLANTA CON LA LINTERNA. IMAGINAD QUE LA LINTERNA ES EL SOL.',
          'PONED EL PAPEL ENTRE LA LUZ Y LA PLANTA. EL PAPEL REPRESENTA EL POLVO EN EL AIRE. ¿LLEGA TANTA LUZ?',
          'CONTAD QUÉ CAMBIÓ Y PENSAD QUÉ LES PODRÍA PASAR A LAS PLANTAS SI LES LLEGASE MENOS LUZ DURANTE MUCHO TIEMPO.'
        ],['leaf','cloud','bird']]
      ]
    },{
      title:'¡Somos expertos!', theme:'Nuestro museo de clase', words:'DINOSAURIO · FÓSIL · HUELLA · EXPERTO',
      intro:'Ya sabemos comparar huellas, hablar de la comida de los dinosaurios y reconocer animales del cielo y el mar. Ahora nos toca enseñárselo a otras personas.',
      look:'ELIGE UN DIBUJO DE LA LÁMINA Y CUENTA ALGO QUE APRENDISTE.',
      activities:[
        ['touch','Las tres pistas del museo','Recuerda lo que aprendiste','museum',[
          ['¿QUÉ PISTA NOS DEJA UN ANIMAL AL CAMINAR?',null,[['Una huella','track'],['Un huevo','egg'],['Una planta','leaf']],0,'¡UNA HUELLA! PODEMOS OBSERVAR SU FORMA.'],
          ['¿QUÉ COMÍA EL TRICERATOPS?', 'triceratops',[['Carne','meat'],['Plantas','leaf']],1,'¡PLANTAS! ERA HERBÍVORO.'],
          ['¿CUÁL DE ESTOS ANIMALES TENÍA ALETAS?',null,[['Pterodáctilo','flying'],['Plesiosaurio','marine'],['Braquiosaurio','giant']],1,'¡PLESIOSAURIO! LAS ALETAS LE AYUDABAN A NADAR.']
        ]],
        ['hands','Abrimos el museo','Prepara una visita en equipo','museum','Dibujos, huellas, figuras y trabajos de las semanas anteriores.',[
          'HACED TRES MESAS: DINOSAURIOS, REPTILES DEL CIELO Y DEL MAR, Y PISTAS DEL PASADO.',
          'ELEGID UNA PIEZA POR PAREJAS. ENSAYAD: «ESTO ES…», «LO SABEMOS PORQUE…».',
          'ABRID EL MUSEO. CADA PAREJA ENSEÑA SU PIEZA Y RESPONDE A UNA PREGUNTA DE LOS VISITANTES.'
        ],['triceratops','marine','fossil']]
      ]
    }
  ];

  const icons={
    track:'<path fill="#9c5d39" d="M60 112C47 104 26 92 16 67c-5-12 2-17 10-9l20 19L52 28c2-14 14-14 16 0l6 49 20-19c8-8 15-3 10 9-10 25-31 37-44 45z"/>',
    'round-track':'<path fill="#9c5d39" d="M28 83c0-20 15-33 32-33s32 13 32 33-15 29-32 29-32-9-32-29z"/><g fill="#9c5d39"><circle cx="22" cy="53" r="9"/><circle cx="43" cy="34" r="9"/><circle cx="77" cy="34" r="9"/><circle cx="98" cy="53" r="9"/></g>',
    'split-track':'<path fill="#9c5d39" d="M53 103C27 108 16 75 23 43c2-10 10-17 18-6 13 18 15 39 12 66zm14 0c26 5 37-28 30-60-2-10-10-17-18-6-13 18-15 39-12 66z"/>',
    measure:'<path d="M20 43h80M20 77h48" stroke="#ab6146" stroke-width="9" stroke-linecap="round"/><path d="M20 27v68m80-68v32M68 63v29" stroke="#43352e" stroke-width="4" stroke-linecap="round"/>',
    leaf:'<path fill="#68a66a" d="M28 100C7 53 36 29 101 21c-5 52-30 86-68 81z"/><path d="M22 110Q39 78 83 42M51 72l-2-21m9 15l20 1" fill="none" stroke="#285d3e" stroke-width="5" stroke-linecap="round"/>',
    meat:'<path fill="#f6e4bf" d="M73 68l22 16a9 9 0 1 1 8 13 9 9 0 1 1-13-3L65 79z"/><path fill="#cc675b" d="M77 80c-14 13-40 8-53-11-10-15-10-34 5-43 21-13 51-3 61 16 8 17-1 28-13 38z"/><path fill="none" stroke="#f3bca3" stroke-width="5" d="M71 68c-12 9-29 4-36-8-6-10-4-19 6-23 14-5 32 2 36 13 3 7-1 14-6 18z"/>',
    tooth:'<path fill="#fff7dd" stroke="#aa7851" stroke-width="4" d="M14 46q6-17 18-13l8 3 8-3q14-3 16 14c1 10-5 15-7 34-1 13-8 17-13-5q-4-12-8 0c-5 23-12 18-14 6-1-17-10-25-8-36zm59-6q17-19 34-5c10 10-4 38-25 63q8-22-6-40c-4-6-5-12-3-18z"/>',
    egg:'<path fill="#fbe3a6" stroke="#ba865f" stroke-width="4" d="M23 78c0-27 23-59 37-59s37 32 37 59c0 24-16 34-37 34S23 102 23 78z"/><g fill="#c28b61" opacity=".5"><circle cx="49" cy="48" r="5"/><circle cx="74" cy="62" r="6"/><circle cx="47" cy="83" r="6"/><circle cx="69" cy="92" r="4"/></g>',
    hatch:'<path fill="#d59863" d="M29 66l-5-18 16 4-3-22 16 9 4-20 15 10-18 29z"/><path fill="#77a871" d="M38 81C25 58 37 22 64 22c24 0 39 14 37 31-2 14-17 19-35 15l-2 19z"/><circle cx="77" cy="42" r="4" fill="#223c34"/><path fill="#fbe3a6" stroke="#ba865f" stroke-width="4" d="M20 68l20 12 12-10 13 14 15-12 21 6c0 22-13 35-40 35-25 0-41-14-41-45z"/>',
    nest:'<path fill="#fbe3a6" stroke="#ba865f" stroke-width="3" d="M29 67c0-36 27-46 34-8 7-37 33-30 34 8z"/><path fill="#ab7142" d="M9 65q51 24 102 0c-3 28-23 43-51 43S13 93 9 65z"/><path d="M19 77l43 23 36-21M28 89l52-4m-37 20l38-13" fill="none" stroke="#e7ac68" stroke-width="4" stroke-linecap="round"/>',
    sky:'<circle cx="83" cy="36" r="17" fill="#f8c970"/><path fill="#88b6d0" d="M15 82c0-13 13-20 23-16 2-18 31-22 37-4 22-3 30 27 8 31H33c-11 0-18-4-18-11z"/>',
    sea:'<path fill="#64aaa9" d="M8 48q13-16 26 0t26 0 26 0 26 0v41q0 13-15 13H23Q8 102 8 89z"/><path d="M16 70q11-10 22 0t22 0 22 0 22 0M22 87q9-9 19 0t19 0 19 0 19 0" fill="none" stroke="#e2f8ee" stroke-width="4"/>',
    land:'<path fill="#8cb77b" d="M6 95l29-50 25 28 20-42 34 64z"/><path d="M6 95h108" stroke="#9e6745" stroke-width="7" stroke-linecap="round"/>',
    fossil:'<path fill="#deb082" d="M11 82c-5-18 7-34 23-38 9-20 41-28 63-11 17 13 19 40 6 56-18 22-81 24-92-7z"/><path d="M82 78C58 99 32 80 39 62c5-14 27-20 39-7 9 10-5 24-16 19-8-4-4-12 3-12" fill="none" stroke="#8f5a3d" stroke-width="5" stroke-linecap="round"/>',
    brush:'<path stroke="#985d42" stroke-width="12" stroke-linecap="round" d="M54 63l43-42"/><path fill="#b9c8c6" d="M40 61l16-14 17 16-16 15z"/><path fill="#dfae67" d="M40 61c-20 0-15 19-31 30 23 14 44 4 48-13z"/>',
    museum:'<path fill="#bf8963" d="M9 43l51-24 51 24v8H9zm3 54h96v11H12z"/><path stroke="#bf8963" stroke-width="10" d="M23 53v42m25-42v42m24-42v42m25-42v42"/><path fill="#f3d79a" d="M55 39a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"/>',
    asteroid:'<path fill="#e69555" d="M29 65L99 15 77 47l31-10-43 51z"/><path fill="#8a766b" d="M19 63l21-14 26 10 8 22-12 23-27 4-18-17z"/><path fill="#b9a294" d="M28 73l12-9 12 7-5 12-14 2zm20 21 8-8 10 5-9 10z"/>',
    cloud:'<circle cx="78" cy="42" r="22" fill="#e8b45a"/><path fill="#a59a9a" d="M12 76c-3-13 8-23 21-23 6-20 34-24 46-4 27-7 41 27 17 39H27q-13 0-15-12z"/><path d="M25 99h55m-39 10h62" stroke="#b4a698" stroke-width="4" stroke-linecap="round"/>',
    bird:'<path fill="#6e9cac" d="M14 73c13 4 24 3 35-4 6-9 5-26 20-31 13-5 27 3 29 16l13 6-14 6c-2 16-11 29-33 30-15 0-37-6-50-23z"/><path fill="#aac6c5" d="M74 70C49 72 33 59 24 50c4 22 17 39 38 36z"/><circle cx="83" cy="53" r="3" fill="#243d42"/>'
  };
  const upper=text=>text.toLocaleUpperCase('es-ES');
  const slide=index=>'assets/dino-route/semana-'+(index+1)+'.webp';
  function visual(key){
    if(art[key])return '<img class="route-art'+(art[key].includes('/real/')||key==='footprint'?' route-cutout':'')+'" src="'+art[key]+'" alt="">';
    return '<svg class="route-art route-symbol" aria-hidden="true" viewBox="0 0 120 120">'+icons[key]+'</svg>';
  }
  const button=(label,action,value='',className='')=>'<button type="button" class="'+className+'" data-action="dino-route-'+action+'" data-value="'+value+'">'+label+'</button>';
  function hub(){
    return '<section class="dino-route-hub"><header class="route-hero"><div><span class="route-eyebrow">CUADERNO DE CAMPO · INFANTIL 4 AÑOS</span><h2>Ruta del trimestre</h2><p>Diez semanas para investigar, jugar y preparar nuestro museo.</p></div></header>'+
      '<ol class="route-weeks">'+weeks.map((week,index)=>'<li>'+button(
        '<span class="route-cover"><img loading="lazy" width="1491" height="1055" src="'+slide(index)+'" alt=""><b>SEMANA '+String(index+1).padStart(2,'0')+'</b></span>'+
        '<span class="route-card-copy"><small>'+upper(week.theme)+'</small><strong>'+upper(week.title)+'</strong><span>ABRIR EN LA PDI <span aria-hidden="true">→</span></span></span>',
        'open',index,'route-week-card')+'</li>').join('')+'</ol></section>';
  }
  function project(p){
    const index=p.round,week=weeks[index],session=p.routeSession??={view:-1,step:0,result:null};
    const {view,step,result}=session;
    const activity=week.activities[view];
    const tabs=[['LÁMINA',-1],['ACTIVIDAD 1',0],['ACTIVIDAD 2',1]].map(([label,value])=>
      '<button type="button" data-action="dino-route-view" data-value="'+value+'" aria-pressed="'+(view===value)+'">'+label+'</button>').join('');
    let stage,foot='';
    if(!activity){
      stage='<div class="route-lesson"><figure><img src="'+slide(index)+'" width="1491" height="1055" alt="Lámina de la semana '+(index+1)+'. '+week.title+'"></figure>'+
        '<aside><span class="route-eyebrow">'+upper(week.theme)+'</span><p>'+upper(week.intro)+'</p><strong>'+week.look+'</strong><small>'+week.words+'</small>'+
        '<div class="route-activity-list">'+week.activities.map(([kind,title,hint,key],i)=>button(
          visual(key)+'<span><small>'+upper(hint)+'</small><b>'+upper(title)+'</b></span><span aria-hidden="true">→</span>',
          'view',i,'route-activity-link')).join('')+'</div></aside></div>';
      foot=(index>0?button('← SEMANA '+index,'open',index-1,'route-prev'):'')+(index<weeks.length-1?button('SEMANA '+(index+2)+' →','open',index+1,'route-next'):'');
    }else{
      const [kind,title,hint,key,task,items,ending]=activity;
      if(kind==='hands'){
        const instruction=items[step];
        stage='<div class="route-workshop"><figure>'+visual(ending[step])+'</figure><div class="route-workshop-copy"><span class="route-eyebrow">PASO '+(step+1)+' DE '+items.length+'</span>'+
          '<h3 tabindex="-1">'+instruction+'</h3><p class="route-materials"><strong>MATERIALES</strong> '+upper(task)+'</p></div></div>';
        if(step>0)foot+=button('← PASO ANTERIOR','step',step-1,'route-prev');
        foot+=step<items.length-1?button('SIGUIENTE PASO →','step',step+1,'route-next'):button('VOLVER A LA LÁMINA','view',-1,'route-next');
      }else if(kind==='trace'){
        const [prompt,path]=task[step];
        stage='<div class="route-trace'+(key==='nest'?' route-trace-nest':'')+'"><h3 tabindex="-1">'+prompt+'</h3>'+
          '<svg class="route-drawing" viewBox="0 0 760 370" role="img" aria-label="Guía de dibujo para repasar con el dedo o el lápiz">'+
          '<path class="route-trace-guide" d="'+path+'"/><g class="route-trace-ink"></g></svg></div>';
        foot=button('BORRAR TRAZO','erase',0,'route-prev')+
          (step+1<task.length?button('SIGUIENTE TRAZO →','step',step+1,'route-next'):button('VOLVER A LA LÁMINA','view',-1,'route-next'));
      }else if(kind==='explore'){
        stage='<div class="route-game"><h3 tabindex="-1">'+task+'</h3><div class="route-options" style="--options:'+items.length+'">'+
          items.map(([label,image],i)=>button(visual(image)+'<span>'+upper(label)+'</span>','answer',i,result?.choice===i?'is-right':'')).join('')+
          '</div><p class="route-feedback" role="status" aria-live="polite">'+(items[result?.choice]?.[2]||'PUEDES ABRIR LAS VENTANAS EN CUALQUIER ORDEN.')+'</p></div>';
        foot=button('ACTIVIDAD 2 →','view',1,'route-next');
      }else{
        const [prompt,clue,choices,answer,success]=task[step];
        const solved=result?.correct;
        stage='<div class="route-game'+(clue?' has-clue':'')+'"><h3 tabindex="-1">'+prompt+'</h3>'+
          (clue?'<figure class="route-clue"><figcaption>PISTA</figcaption>'+visual(clue)+'</figure>':'')+
          '<div class="route-options" style="--options:'+choices.length+'">'+choices.map(([label,image],i)=>{
            const right=solved&&i===answer,wrong=result?.choice===i&&!result.correct;
            return '<button type="button" data-action="dino-route-answer" data-value="'+i+'" class="'+(right?'is-right':wrong?'is-wrong':'')+'"'+(solved?' aria-disabled="true"':'')+'>'+
              visual(image)+'<span>'+upper(label)+'</span>'+(right||wrong?'<b aria-hidden="true">'+(right?'✓':'↻')+'</b>':'')+'</button>';
          }).join('')+'</div><p class="route-feedback'+(solved?' is-right':result?' is-wrong':'')+'" role="status" aria-live="polite">'+
          (solved?success:result?'MIRA OTRA VEZ Y PRUEBA CON OTRA IMAGEN.':'TOCA UNA IMAGEN.')+'</p></div>';
        if(solved){
          if(step<task.length-1)foot+=button('SIGUIENTE PISTA →','step',step+1,'route-next');
          else foot+=button(view===0?'ACTIVIDAD 2 →':'VOLVER A LA LÁMINA','view',view===0?1:-1,'route-next');
          foot+=button('REPETIR','view',view,'route-prev');
        }
      }
    }
    return '<section class="route-pdi"><header><button type="button" data-action="close-projection">← VOLVER A LA RUTA</button><span class="route-eyebrow">SEMANA '+(index+1)+' DE '+weeks.length+'</span>'+
      '<nav aria-label="PARTES DE LA SEMANA">'+tabs+'</nav></header><h2 tabindex="-1">'+upper(activity?activity[1]:week.title)+'</h2>'+stage+
      '<footer>'+foot+'</footer></section>';
  }
  function update(p,action,value){
    const session=p.routeSession;
    if(!session)return false;
    if(action==='view'&&[-1,0,1].includes(value)){
      Object.assign(session,{view:value,step:0,result:null});
      return true;
    }
    const activity=weeks[p.round].activities[session.view];
    if(!activity)return false;
    const [kind,,,,task,items]=activity;
    if(action==='erase')return kind==='trace';
    if(action==='step'){
      if(kind==='explore')return false;
      const count=(kind==='hands'?items:task).length;
      if(!Number.isInteger(value)||value<0||value>=count)return false;
      Object.assign(session,{step:value,result:null});
      return true;
    }
    if(action!=='answer'||!Number.isInteger(value)||value<0)return false;
    if(kind==='explore'&&value<items.length){
      session.result={choice:value};
      return true;
    }
    if(kind!=='touch')return false;
    const [,,choices,answer]=task[session.step];
    if(value>=choices.length||session.result?.correct)return false;
    session.result={choice:value,correct:value===answer};
    return true;
  }
  function mount(root){
    const board=root.querySelector('.route-drawing');
    if(!board)return;
    const svgNS='http://www.w3.org/2000/svg';
    const guide=board.querySelector('.route-trace-guide'),start=guide.getPointAtLength(0);
    const marker=document.createElementNS(svgNS,'circle');
    marker.setAttribute('cx',start.x);
    marker.setAttribute('cy',start.y);
    marker.setAttribute('r',9);
    marker.classList.add('route-trace-start');
    guide.after(marker);
    const ink=board.querySelector('.route-trace-ink');
    let pointer=null,line;
    function addPoint(event){
      const point=board.createSVGPoint();
      point.x=event.clientX;
      point.y=event.clientY;
      const local=point.matrixTransform(board.getScreenCTM().inverse());
      line.points.appendItem(local);
      return local;
    }
    board.addEventListener('pointerdown',event=>{
      if(pointer!==null||event.button!==0)return;
      pointer=event.pointerId;
      board.setPointerCapture(pointer);
      line=document.createElementNS(svgNS,'polyline');
      ink.append(line);
      const first=addPoint(event);
      const dot=board.createSVGPoint();
      dot.x=first.x+.1;
      dot.y=first.y+.1;
      line.points.appendItem(dot);
    });
    board.addEventListener('pointermove',event=>{if(event.pointerId===pointer)addPoint(event);});
    for(const name of ['pointerup','pointercancel','lostpointercapture']){
      board.addEventListener(name,event=>{if(event.pointerId===pointer)pointer=null;});
    }
  }
  window.ROSA_DINO_ROUTE={hub,project,update,mount,count:weeks.length};
})();
