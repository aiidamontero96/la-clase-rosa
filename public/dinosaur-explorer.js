'use strict';
window.ROSA_DINO=(()=>{
  const real=id=>'assets/dino-explorer/real/'+id+'.webp';
  const illustrated={
    coelophysis:'assets/dino-explorer/illustrated/coelophysis-v2.webp',
    herrerasaurus:'assets/dino-explorer/illustrated/herrerasaurus-v2.webp',
    plateosaurus:'assets/dino-explorer/illustrated/plateosaurus-v2.webp',
    ichthyosaurus:'assets/dino-explorer/illustrated/ichthyosaurus-v2.webp',
    mosasaurus:'assets/dino-explorer/illustrated/mosasaurus-v2.webp'
  };
  const drawn=id=>illustrated[id]||'assets/dinos-pdi/'+id+'.webp';
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const facts={
    coelophysis:{body:'PEQUEÑO · LIGERO · COLA MUY LARGA',food:'COMÍA PEQUEÑOS ANIMALES',time:'VIVIÓ EN EL TRIÁSICO'},
    plateosaurus:{body:'CUELLO LARGO · CUERPO ROBUSTO · MANOS FUERTES',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL TRIÁSICO'},
    herrerasaurus:{body:'DOS PATAS FUERTES · COLA PARA EQUILIBRARSE',food:'COMÍA OTROS ANIMALES',time:'VIVIÓ EN EL TRIÁSICO'},
    trex:{body:'CABEZA ENORME · DOS DEDOS · PATAS MUY FUERTES',food:'COMÍA OTROS ANIMALES',time:'VIVIÓ EN EL CRETÁCICO'},
    triceratops:{body:'TRES CUERNOS · GRAN GOLA · CUATRO PATAS',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL CRETÁCICO'},
    stegosaurus:{body:'PLACAS EN EL LOMO · CUATRO PÚAS EN LA COLA',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL JURÁSICO'},
    brachiosaurus:{body:'CUELLO MUY LARGO · PATAS DELANTERAS MÁS ALTAS',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL JURÁSICO'},
    velociraptor:{body:'ERA PEQUEÑO · TENÍA PLUMAS · COLA LARGA',food:'COMÍA OTROS ANIMALES',time:'VIVIÓ EN EL CRETÁCICO'},
    ankylosaurus:{body:'CUERPO CON ARMADURA · MAZA EN LA COLA',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL CRETÁCICO'},
    diplodocus:{body:'CUELLO LARGO · COLA LARGUÍSIMA',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL JURÁSICO'},
    parasaurolophus:{body:'CRESTA LARGA · PICO ANCHO · COLA FUERTE',food:'COMÍA PLANTAS',time:'VIVIÓ EN EL CRETÁCICO'},
    spinosaurus:{body:'VELA EN LA ESPALDA · HOCICO LARGO · COLA PARA NADAR',food:'COMÍA PECES Y OTROS ANIMALES',time:'VIVIÓ EN EL CRETÁCICO'},
    ichthyosaurus:{body:'ALETAS · HOCICO LARGO · CUERPO PARA NADAR',food:'COMÍA PECES Y CALAMARES',time:'VIVIÓ EN EL JURÁSICO · ERA UN REPTIL MARINO, NO UN DINOSAURIO'},
    mosasaurus:{body:'HOCICO LARGO · CUATRO ALETAS · COLA MUY FUERTE',food:'COMÍA PECES Y OTROS ANIMALES MARINOS',time:'VIVIÓ EN EL CRETÁCICO · ERA UN REPTIL MARINO, NO UN DINOSAURIO'}
  };
  const periodData={
    triassic:{name:'TRIÁSICO',when:'PRIMERA ETAPA',summary:'APARECIERON LOS PRIMEROS DINOSAURIOS',hero:'coelophysis',ids:['coelophysis','plateosaurus','herrerasaurus'],tone:'copper',background:'assets/dino-world/triassic-landscape.webp',climate:'CALOR · TIERRA SECA · POCAS PLANTAS',introTitle:'LLEGAN LOS PRIMEROS DINOSAURIOS',introText:'MUCHOS ERAN PEQUEÑOS, RÁPIDOS Y CAMINABAN SOBRE DOS PATAS.',introIds:['coelophysis','herrerasaurus','plateosaurus']},
    jurassic:{name:'JURÁSICO',when:'ETAPA INTERMEDIA',summary:'CRECIERON LOS GRANDES CUELLOS Y LAS PLACAS',hero:'brachiosaurus',ids:['stegosaurus','brachiosaurus','diplodocus'],tone:'green',background:'assets/dino-world/jurassic-landscape.webp',climate:'LLUVIA · RÍOS · GRANDES BOSQUES',introTitle:'EL MUNDO SE VUELVE VERDE',introText:'ENTRE LOS BOSQUES VIVIERON GIGANTES DE CUELLO LARGO Y DINOSAURIOS CON PLACAS.',introIds:['stegosaurus','brachiosaurus','diplodocus']},
    cretaceous:{name:'CRETÁCICO',when:'ÚLTIMA ETAPA',summary:'APARECIERON MUCHAS FORMAS DIFERENTES Y LAS PRIMERAS FLORES',hero:'triceratops',ids:['trex','triceratops','ankylosaurus','parasaurolophus','velociraptor','spinosaurus'],tone:'gold',background:'assets/dino-world/cretaceous-landscape-v2.webp',climate:'SOL · RÍOS · APARECEN FLORES',introTitle:'CUERNOS, CRESTAS Y FLORES',introText:'HUBO DINOSAURIOS MUY DIFERENTES: GRANDES, PEQUEÑOS, CON CUERNOS O CON ARMADURA.',introIds:['triceratops','trex','velociraptor']}
  };
  const dinoMetres={coelophysis:3,plateosaurus:8,herrerasaurus:6,stegosaurus:7,brachiosaurus:22,diplodocus:25,trex:12,triceratops:9,ankylosaurus:8,parasaurolophus:10,velociraptor:2,spinosaurus:15,ichthyosaurus:3,mosasaurus:12};
  const dinoHeights={coelophysis:1,plateosaurus:2.5,herrerasaurus:1.7,stegosaurus:4,brachiosaurus:12,diplodocus:4.6,trex:4,triceratops:3,ankylosaurus:1.7,parasaurolophus:4.9,velociraptor:.55,spinosaurus:5,ichthyosaurus:1.2,mosasaurus:2};
  const marineLengths={ichthyosaurus:3,mosasaurus:12};
  const challenges={
    triassic:[
      {kind:'find',answer:'coelophysis',prompt:'BUSCA AL MÁS PEQUEÑO Y LIGERO',note:'ERA EL COELOPHYSIS. FUE PEQUEÑO, LIGERO Y MUY RÁPIDO.',options:['plateosaurus','coelophysis','herrerasaurus']},
      {kind:'count',count:2,targets:['coelophysis','plateosaurus'],prompt:'BUSCA Y ARRASTRA',note:'HAS ENCONTRADO AL COELOPHYSIS Y AL PLATEOSAURIO.'},
      {kind:'feature',answer:'plateosaurus',prompt:'¿QUIÉN TENÍA EL CUELLO MÁS LARGO?',note:'EL PLATEOSAURIO TENÍA UN CUELLO LARGO.',options:['herrerasaurus','plateosaurus','coelophysis']},
      {kind:'food',answer:'plants',dino:'plateosaurus',prompt:'¿QUÉ COMÍA EL PLATEOSAURIO?',note:'EL PLATEOSAURIO COMÍA PLANTAS.'},
      {kind:'feature',answer:'herrerasaurus',prompt:'¿QUIÉN ERA EL CAZADOR MÁS GRANDE?',note:'EL HERRERASAURIO ERA MÁS GRANDE QUE EL COELOPHYSIS.',options:['plateosaurus','coelophysis','herrerasaurus']}
    ],
    jurassic:[
      {kind:'find',answer:'stegosaurus',prompt:'BUSCA AL QUE TENÍA PLACAS',note:'ERA EL ESTEGOSAURIO. SUS PLACAS Y SU COLA CON PÚAS LO HACEN INCONFUNDIBLE.',options:['diplodocus','stegosaurus','brachiosaurus']},
      {kind:'count',count:2,targets:['stegosaurus','diplodocus'],prompt:'BUSCA Y ARRASTRA',note:'HAS ENCONTRADO AL ESTEGOSAURIO Y AL DIPLODOCUS.'},
      {kind:'feature',answer:'diplodocus',prompt:'¿QUIÉN TENÍA LA COLA MÁS LARGA?',note:'LA COLA DEL DIPLODOCUS ERA LARGUÍSIMA.',options:['brachiosaurus','stegosaurus','diplodocus']},
      {kind:'food',answer:'plants',dino:'stegosaurus',prompt:'¿QUÉ COMÍA EL ESTEGOSAURIO?',note:'EL ESTEGOSAURIO COMÍA PLANTAS.'},
      {kind:'feature',answer:'stegosaurus',prompt:'¿QUIÉN TENÍA PLACAS EN EL LOMO?',note:'EL ESTEGOSAURIO TENÍA GRANDES PLACAS EN EL LOMO.',options:['diplodocus','stegosaurus','brachiosaurus']}
    ],
    cretaceous:[
      {kind:'find',answer:'triceratops',prompt:'BUSCA AL DE TRES CUERNOS',note:'ERA EL TRICERATOPS. TRES CUERNOS Y UNA GRAN GOLA PROTEGÍAN SU CABEZA.',options:['ankylosaurus','trex','triceratops']},
      {kind:'count',count:3,targets:['trex','triceratops','velociraptor'],prompt:'BUSCA Y ARRASTRA',note:'HAS ENCONTRADO AL T. REX, AL TRICERATOPS Y AL VELOCIRAPTOR.'},
      {kind:'feature',answer:'ankylosaurus',prompt:'¿QUIÉN LLEVABA ARMADURA?',note:'EL ANQUILOSAURIO TENÍA PLACAS Y UNA MAZA EN LA COLA.',options:['parasaurolophus','ankylosaurus','triceratops']},
      {kind:'food',answer:'fish',dino:'spinosaurus',prompt:'¿QUÉ COMÍA EL ESPINOSAURIO?',note:'ENTRE SUS ALIMENTOS HABÍA PECES.'},
      {kind:'feature',answer:'parasaurolophus',prompt:'¿QUIÉN TENÍA UNA CRESTA LARGA?',note:'EL PARASAUROLOFO TENÍA UNA CRESTA LARGA HACIA ATRÁS.',options:['triceratops','parasaurolophus','ankylosaurus']}
    ]
  };
  const sortSpecies=['coelophysis','plateosaurus','stegosaurus','brachiosaurus','trex','triceratops'];
  const species=()=>window.ROSA?.dinosaurs||[];
  const byId=id=>species().find(d=>d.id===id);
  const at=index=>{const list=species();return list[((Number(index)||0)%list.length+list.length)%list.length];};
  const detail=(d,key='body')=>facts[d.id]?.[key]||d.fact.toLocaleUpperCase('es-ES');
  const dinoName=id=>(byId(id)?.short||id).toLocaleUpperCase('es-ES');
  const eraKeyFromPeriod=period=>String(period||'').toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('trias')?'triassic':String(period||'').toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('juras')?'jurassic':'cretaceous';

  function speciesButtons(active){return species().map((d,index)=>'<button type="button" data-dino-catalog="'+index+'" class="'+(d.id===active?'is-active':'')+'"><span>'+esc(d.short)+'</span></button>').join('');}
  function catalog(){const d=at(0);return '<section class="dino-observatory" data-dino-catalog-root data-index="0"><div class="dino-observatory-head"><div><span>LABORATORIO DE ESPECIES</span><h2>CONÓCELOS DE VERDAD</h2><p>UNA RECONSTRUCCIÓN REALISTA Y OTRA ILUSTRADA PARA OBSERVAR, COMPARAR Y HABLAR.</p></div><button type="button" class="button" data-action="dino" data-value="0" data-dino-project>VER EN LA PDI</button></div><nav class="dino-species-ribbon" aria-label="Elegir dinosaurio">'+speciesButtons(d.id)+'</nav>'+catalogStage(d)+'</section>';}
  function catalogStage(d){const category=d.group?' · '+d.group.toLocaleUpperCase('es-ES'):'';return '<div class="dino-catalog-stage"><div class="dino-catalog-sky" aria-hidden="true"></div><article class="dino-catalog-animal dino-catalog-real"><span>RECONSTRUCCIÓN REALISTA</span><img src="'+real(d.id)+'" alt="Reconstrucción realista de '+esc(d.short)+'"></article><div class="dino-catalog-center"><small>'+esc(d.period).toLocaleUpperCase('es-ES')+category+'</small><h3>'+esc(d.short).toLocaleUpperCase('es-ES')+'</h3><p data-dino-catalog-fact>'+esc(detail(d))+'</p><div><button type="button" data-dino-catalog-fact="body" class="is-active">SU CUERPO</button><button type="button" data-dino-catalog-fact="food">SU COMIDA</button><button type="button" data-dino-catalog-fact="time">SU ÉPOCA</button></div></div><article class="dino-catalog-animal dino-catalog-drawn"><span>VERSIÓN ILUSTRADA</span><img src="'+drawn(d.id)+'" alt="Versión ilustrada de '+esc(d.short)+'"></article></div>';}
  function scaleSpec(id){
    const height=dinoHeights[id]||2,axis=height<=1.5?2:height<=4?5:height<=6?6:15,step=axis===2?.5:axis===15?3:1,marks=[];
    for(let value=0;value<=axis+.001;value+=step)marks.push('<span style="--mark-y:'+((value/axis)*100).toFixed(2)+'%">'+String(value).replace('.',',')+' m</span>');
    return {height,axis,dinoPct:Math.max(8,height/axis*84),childPct:1.05/axis*84,marks:marks.join('')};
  }
  function viewCard(d,type){
    const realistic=type==='real',label=realistic?'RECONSTRUCCIÓN REAL':'ILUSTRACIÓN',scale=scaleSpec(d.id),marine=marineLengths[d.id];
    const measure=marine?'LONGITUD APROX. '+marine+' M':'ALTURA APROX. '+String(scale.height).replace('.',',')+' M';
    const visual=realistic?'<div class="dino-real-scale" style="--dino-height:'+scale.dinoPct+'%;--child-height:'+scale.childPct+'%"><div class="dino-scale-grid" aria-hidden="true"></div><div class="dino-height-ruler" aria-hidden="true">'+scale.marks+'</div><img class="dino-view-animal dino-scale-animal" src="'+real(d.id)+'" alt="Reconstrucción realista de '+esc(d.short)+'"><figure class="dino-scale-child"><img src="assets/dino-explorer/scale-child-v1.webp" alt="Niño de cuatro años situado junto al dinosaurio para comparar su tamaño"><figcaption>NIÑO/A DE 4 AÑOS · 1,05 M</figcaption></figure><span class="dino-scale-ground" aria-hidden="true">MISMO SUELO</span><em>'+measure+'</em></div>':'<img class="dino-view-animal" src="'+drawn(d.id)+'" alt="Ilustración infantil de '+esc(d.short)+'">';
    return '<article class="dino-view dino-view-'+type+'"><button type="button" class="dino-view-open" data-dino-focus="'+type+'"><span>'+label+'</span>'+visual+'<strong>'+(realistic?'TAMAÑO COMPARADO':'ASÍ LO ILUSTRAMOS')+'</strong><i>TOCA PARA VER A PANTALLA COMPLETA</i></button><button type="button" class="dino-focus-back" data-dino-back>← VOLVER A COMPARAR</button></article>';
  }
  function explorer(p){const d=at(p.round),index=species().indexOf(d),era=periodData[eraKeyFromPeriod(d.period)],category=d.group?' · '+d.group.toLocaleUpperCase('es-ES'):'';p.customSpeech=d.short+'. '+d.fact;return {body:'<section class="dino-explorer-pdi era-'+eraKeyFromPeriod(d.period)+'" data-dino-explorer data-index="'+index+'"><img class="dino-explorer-bg" src="'+era.background+'" alt=""><div class="dino-explorer-shade"></div><header><span>'+esc(d.period).toLocaleUpperCase('es-ES')+category+'</span><h2>'+esc(d.short).toLocaleUpperCase('es-ES')+'</h2></header><div class="dino-compare">'+viewCard(d,'real')+viewCard(d,'drawn')+'</div><aside class="dino-discovery"><p data-dino-detail-text>'+esc(detail(d))+'</p><nav><button type="button" class="is-active" data-dino-detail="body">SU CUERPO</button><button type="button" data-dino-detail="food">¿QUÉ COMÍA?</button><button type="button" data-dino-detail="time">¿CUÁNDO VIVIÓ?</button></nav></aside><button type="button" class="dino-arrow dino-prev" data-dino-step="-1" aria-label="Animal anterior">‹</button><button type="button" class="dino-arrow dino-next" data-dino-step="1" aria-label="Animal siguiente">›</button></section>',foot:''};}

  function ensureWorld(p){
    if(!Array.isArray(p.worldItems))p.worldItems=[];
    if(!Array.isArray(p.worldCompleted))p.worldCompleted=[];
    if(!Number.isInteger(p.worldRound))p.worldRound=0;
    if(!Number.isInteger(p.worldNextId))p.worldNextId=1;
    if(typeof p.worldEra!=='string'||!periodData[p.worldEra])p.worldEra='';
    if(typeof p.worldWon!=='boolean')p.worldWon=false;
    if(typeof p.worldMessage!=='string')p.worldMessage='';
    if(typeof p.worldMode!=='string')p.worldMode='periods';
    if(typeof p.worldStage!=='string')p.worldStage=p.worldEra?'challenges':'periods';
    if(!p.worldSolved||typeof p.worldSolved!=='object')p.worldSolved={triassic:[],jurassic:[],cretaceous:[]};
    for(const era of Object.keys(periodData))if(!Array.isArray(p.worldSolved[era]))p.worldSolved[era]=[];
    if(p.worldStage==='missions'&&p.worldEra){
      const next=challenges[p.worldEra].findIndex((_,index)=>!p.worldSolved[p.worldEra].includes(index));
      p.worldRound=next<0?challenges[p.worldEra].length:next;
      p.worldStage=next<0?'finished':'challenges';
    }
    if(!p.worldSortPlaced||typeof p.worldSortPlaced!=='object')p.worldSortPlaced={};
    if(!Number.isInteger(p.worldSortWrong))p.worldSortWrong=0;
    if(typeof p.worldSortSelected!=='string')p.worldSortSelected='';
  }
  function timelineCards(action='choose-era'){
    return Object.entries(periodData).map(([id,period],index)=>'<button type="button" class="dino-era-card is-'+period.tone+'" data-dw-action="'+action+'" data-world-type="'+id+'"><small>'+(index+1)+'</small><img class="dino-era-landscape" src="'+period.background+'" alt=""><img class="dino-era-hero" src="'+real(period.hero)+'" alt=""><span>'+period.when+'</span><strong>'+period.name+'</strong><i>'+period.climate+'</i></button>').join('');
  }
  function worldIntro(p){
    return '<section class="dino-world-pdi dino-world-intro" data-dino-world><img class="dino-world-bg" src="assets/dino-world/cretaceous-valley.webp" alt="Paisaje prehistórico"><div class="dino-world-veil"></div><header><span>VIAJE POR EL TIEMPO</span><h2>ELIGE UNA ETAPA</h2></header><div class="dino-era-timeline">'+timelineCards()+'</div><button type="button" class="dino-sort-entry" data-dw-action="open-sort"><span>RETO FINAL</span><strong>CADA DINOSAURIO A SU ETAPA</strong><small>3 ZONAS · CONTADORES VERDE Y ROJO</small></button>'+(p.worldCompleted.length?'<p class="dino-era-progress">COMPLETADAS · '+p.worldCompleted.map(id=>periodData[id].name).join(' · ')+'</p>':'')+'</section>';
  }
  function periodPrelude(p){
    const era=periodData[p.worldEra];
    const animals=era.introIds.map(id=>{const length=dinoMetres[id]||1,size=length<=3?'small':length>=15?'giant':'medium',label=size==='small'?'PEQUEÑO':size==='giant'?'GIGANTE':'MEDIANO';return '<figure class="is-'+size+'"><img src="'+real(id)+'" alt="'+esc(dinoName(id))+'"><figcaption><strong>'+esc(dinoName(id))+'</strong><small>'+label+'</small></figcaption></figure>';}).join('');
    const sequence=Object.entries(periodData).map(([id,period],index)=>'<b class="'+(id===p.worldEra?'is-current':'')+'"><em>'+(index+1)+'</em>'+period.name+'</b>').join('<span>→</span>');
    return '<section class="dino-world-pdi dino-era-prelude era-'+p.worldEra+' is-'+era.tone+'" data-dino-world><img class="dino-world-bg" src="'+era.background+'" alt="Paisaje del '+era.name.toLocaleLowerCase('es-ES')+'"><div class="dino-world-veil"></div><div class="dino-era-sequence">'+sequence+'<small>'+era.when+'</small></div><article class="dino-era-story"><span>'+era.climate+'</span><h2>'+era.introTitle+'</h2><p>'+era.introText+'</p></article><div class="dino-era-animals">'+animals+'</div><div class="dino-era-size-note">PEQUEÑO · MEDIANO · GIGANTE</div><div class="dino-era-start"><button type="button" data-dw-action="change-era">← OTRA ETAPA</button><button type="button" data-dw-action="start-era">EMPEZAR LOS 5 RETOS →</button></div></section>';
  }
  function animalScale(id,ids){const max=Math.max(...ids.map(value=>dinoMetres[value]||1));return (0.48+0.52*(dinoMetres[id]||1)/max).toFixed(2);}
  function optionCard(id,index,challenge,p){const won=p.worldWon&&id===challenge.answer;return '<button type="button" class="dino-challenge-option '+(won?'is-answer':'')+'" data-dw-action="answer" data-world-type="'+id+'" aria-label="Opción '+(index+1)+'"><span class="dino-option-number">'+(index+1)+'</span><img style="--animal-scale:'+animalScale(id,challenge.options)+'" src="'+real(id)+'" alt="">'+(won?'<strong>'+esc(dinoName(id))+'</strong>':'')+'</button>';}
  function countSourceCard(id,p){const used=p.worldItems.some(item=>item.type===id),ids=periodData[p.worldEra].ids;return '<button type="button" class="dino-challenge-option dino-drag-source '+(used?'is-used':'')+'" data-world-source="'+id+'" data-world-type="'+id+'" aria-label="Arrastra '+esc(dinoName(id))+'" '+(used?'disabled':'')+'><img style="--animal-scale:'+animalScale(id,ids)+'" src="'+real(id)+'" alt=""><strong>'+esc(dinoName(id))+'</strong><span>'+(used?'COLOCADO':'ARRASTRA')+'</span></button>';}
  function missionMap(p){
    const era=periodData[p.worldEra],rounds=challenges[p.worldEra],solved=p.worldSolved[p.worldEra],labels=[['OBSERVA','ENCUENTRA LA PISTA'],['REÚNE','ARRASTRA AL PAISAJE'],['COMPARA','MIRA LOS TAMAÑOS'],['ALIMENTA','ELIGE SU COMIDA'],['DESCUBRE','BUSCA EL RASGO']];
    const cards=rounds.map((challenge,index)=>{const done=solved.includes(index),preview=challenge.dino||(['plants','fish'].includes(challenge.answer)?era.ids[index%era.ids.length]:challenge.answer)||era.ids[index%era.ids.length];return '<button type="button" class="dino-mission-card kind-'+challenge.kind+' '+(done?'is-done':'')+'" data-dw-action="choose-mission" data-world-type="'+index+'"><b>'+(index+1)+'</b><img src="'+real(preview)+'" alt=""><span>'+labels[index][0]+'</span><strong>'+labels[index][1]+'</strong><small>'+(done?'✓ COMPLETADO':'TOCA PARA JUGAR')+'</small></button>';}).join('');
    return '<section class="dino-world-pdi dino-mission-map era-'+p.worldEra+' is-'+era.tone+'" data-dino-world><img class="dino-world-bg" src="'+era.background+'" alt="Paisaje del '+era.name.toLocaleLowerCase('es-ES')+'"><div class="dino-world-veil"></div><header><span>'+era.name+' · '+era.climate+'</span><h2>ELIGE UN RETO</h2><p>'+solved.length+' DE 5 COMPLETADOS</p></header><div class="dino-mission-path" aria-hidden="true"></div><main class="dino-mission-board">'+cards+'</main><footer class="dino-challenge-footer"><button type="button" data-dw-action="change-era">← CAMBIAR ETAPA</button><button type="button" data-dw-action="repeat-intro">VER LA EXPLICACIÓN</button><p class="dino-world-status">PUEDES ELEGIRLOS EN EL ORDEN QUE QUIERAS</p></footer></section>';
  }
  function challengeStage(challenge,p){
    if(challenge.kind==='count')return '<div class="dino-count-palette">'+periodData[p.worldEra].ids.map(id=>countSourceCard(id,p)).join('')+'</div>';
    if(challenge.kind==='food')return '<div class="dino-food-stage"><div class="dino-food-animal"><img src="'+real(challenge.dino)+'" alt=""><strong>'+esc(dinoName(challenge.dino))+'</strong></div><div class="dino-food-options"><button type="button" data-dw-action="answer" data-world-type="plants"><img src="assets/vocab-child/tree.webp" alt=""><strong>PLANTAS</strong></button><button type="button" data-dw-action="answer" data-world-type="fish"><img src="assets/vocab-child/fish.webp" alt=""><strong>PECES Y OTROS ANIMALES</strong></button></div></div>';
    return '<div class="dino-option-grid">'+challenge.options.map((id,index)=>optionCard(id,index,challenge,p)).join('')+'</div>';
  }
  function pieceMarkup(item){const ids=periodData[speciesPeriod(item.type)]?.ids||[item.type];return '<button type="button" class="dino-world-piece" data-world-piece="'+item.id+'" style="--x:'+item.x+'%;--y:'+item.y+'%;--piece-scale:'+animalScale(item.type,ids)+'" aria-label="'+esc(dinoName(item.type))+'. Arrastra para mover"><img src="'+real(item.type)+'" alt=""><span>'+esc(dinoName(item.type))+'</span></button>';}
  function successPanel(p,challenge){const remaining=5-new Set([...p.worldSolved[p.worldEra],p.worldRound]).size;return '<div class="dino-challenge-success" role="status"><span aria-hidden="true">✓</span><strong>'+esc(challenge.note)+'</strong><button type="button" data-dw-action="next">'+(remaining?'SIGUIENTE RETO · QUEDAN '+remaining:'TERMINAR LA ETAPA')+'</button></div>';}
  function speciesPeriod(id){return Object.keys(periodData).find(period=>periodData[period].ids.includes(id))||'';}
  function sortCard(id,p){const selected=p.worldSortSelected===id;return '<button type="button" class="dino-sort-card '+(selected?'is-selected':'')+'" data-sort-dino="'+id+'" data-world-type="'+id+'"><img src="'+real(id)+'" alt=""><strong>'+esc(dinoName(id))+'</strong><span>ARRASTRA</span></button>';}
  function sortBin(id,p){const period=periodData[id],placed=sortSpecies.filter(dino=>p.worldSortPlaced[dino]===id);return '<button type="button" class="dino-sort-bin is-'+period.tone+'" style="--era-bg:url('+period.background+')" data-sort-bin="'+id+'" data-dw-action="sort-drop" data-world-type="'+id+'"><span>'+period.climate+'</span><strong>'+period.name+'</strong><div>'+placed.map(dino=>'<img src="'+real(dino)+'" alt="'+esc(dinoName(dino))+'">').join('')+'</div><small>'+placed.length+' COLOCADOS</small></button>';}
  function sortWorld(p){
    const correct=Object.keys(p.worldSortPlaced).length,finished=correct===sortSpecies.length;
    return '<section class="dino-world-pdi dino-world-sort" data-dino-world><img class="dino-world-bg" src="assets/dino-world/cretaceous-valley.webp" alt="Paisaje prehistórico"><div class="dino-world-veil"></div><header><span>RETO DE CLASIFICACIÓN</span><h2>CADA DINOSAURIO A SU ETAPA</h2></header><div class="dino-sort-score"><b class="is-correct">✓ '+correct+' BIEN</b><b class="is-wrong">× '+p.worldSortWrong+' A REVISAR</b></div><div class="dino-sort-pool">'+sortSpecies.filter(id=>!p.worldSortPlaced[id]).map(id=>sortCard(id,p)).join('')+'</div><div class="dino-sort-bins">'+Object.keys(periodData).map(id=>sortBin(id,p)).join('')+'</div><footer class="dino-challenge-footer"><button type="button" data-dw-action="change-era">← VOLVER A LAS ETAPAS</button><button type="button" data-dw-action="sort-restart">EMPEZAR DE NUEVO</button><p class="dino-world-status">'+esc(p.worldMessage||'ARRASTRA CADA DINOSAURIO HASTA SU ETAPA')+'</p></footer>'+(finished?'<div class="dino-challenge-success"><span>✓</span><strong>HAS COLOCADO LOS SEIS DINOSAURIOS EN SU ETAPA</strong><button type="button" data-dw-action="change-era">VOLVER A LAS ETAPAS</button></div>':'')+'</section>';
  }
  function worldFinished(p){const era=periodData[p.worldEra],allDone=Object.keys(periodData).every(id=>p.worldCompleted.includes(id));return '<section class="dino-world-pdi dino-world-finish era-'+p.worldEra+'" data-dino-world><img class="dino-world-bg" src="'+era.background+'" alt="Paisaje prehistórico"><div class="dino-world-veil"></div><div class="dino-world-finish-card"><span>'+era.name+'</span><h2>5 RETOS COMPLETADOS</h2><img src="'+real(era.hero)+'" alt=""><p>'+era.summary+'</p><div><button type="button" data-dw-action="restart">REPETIR ESTA ETAPA</button><button type="button" data-dw-action="change-era">'+(allDone?'VER LAS TRES ETAPAS':'VIAJAR A OTRA ETAPA')+'</button><button type="button" data-dw-action="open-sort">RETO FINAL · ORDENAR POR ETAPAS</button></div></div></section>';}
  function world(p){
    ensureWorld(p);if(p.worldMode==='sort')return {body:sortWorld(p),foot:''};if(!p.worldEra)return {body:worldIntro(p),foot:''};if(p.worldStage==='era-intro')return {body:periodPrelude(p),foot:''};if(p.worldStage==='finished')return {body:worldFinished(p),foot:''};
    const rounds=challenges[p.worldEra];if(p.worldRound>=rounds.length)return {body:worldFinished(p),foot:''};
    const challenge=rounds[p.worldRound],era=periodData[p.worldEra],count=challenge.kind==='count'?p.worldItems.length:0;
    const dots=rounds.map((_,index)=>'<i class="'+(index<p.worldRound?'is-done':index===p.worldRound?'is-now':'')+'"></i>').join('');
    const targets=challenge.kind==='count'?'<div class="dino-count-targets"><span>BUSCAMOS</span><strong>'+challenge.targets.map(dinoName).join(' · ')+'</strong></div>':'';
    return {body:'<section class="dino-world-pdi dino-world-challenge era-'+p.worldEra+' is-'+era.tone+' kind-'+challenge.kind+'" data-dino-world><img class="dino-world-bg" src="'+era.background+'" alt="Paisaje del '+era.name.toLocaleLowerCase('es-ES')+'"><div class="dino-world-veil"></div><header><span>'+era.name+'</span><div class="dino-round-dots" aria-label="Reto '+(p.worldRound+1)+' de '+rounds.length+'">'+dots+'</div><h2>'+challenge.prompt+'</h2></header>'+targets+(challenge.kind==='count'?'<div class="dino-count-meter"><b>'+count+'</b><span>DE</span><b>'+challenge.count+'</b></div>':'')+'<main class="dino-challenge-main">'+challengeStage(challenge,p)+'</main>'+(challenge.kind==='count'?'<div class="dino-count-pieces" data-world-canvas>'+p.worldItems.map(pieceMarkup).join('')+'</div>':'')+'<footer class="dino-challenge-footer"><button type="button" data-dw-action="change-era">← CAMBIAR ETAPA</button>'+(challenge.kind==='count'?'<button type="button" data-dw-action="undo" '+(!p.worldItems.length?'disabled':'')+'>DESHACER</button>':'')+'<p class="dino-world-status" role="status" aria-live="polite">'+esc(p.worldMessage||(challenge.kind==='count'?'LEE LOS NOMBRES Y ARRASTRA SOLO LOS QUE BUSCAMOS':'OBSERVA LAS FORMAS Y TOCA TU RESPUESTA'))+'</p></footer>'+(p.worldWon?successPanel(p,challenge):'')+'</section>',foot:''};
  }
  function projection(p){if(['dino','dino-ficha'].includes(p.kind))return explorer(p);if(p.kind==='dino-world')return world(p);return null;}
  function renderProjection(){if(typeof projectionRender==='function')projectionRender();}
  function updateCatalog(root,index){const d=at(index);root.dataset.index=String(index);root.querySelectorAll('[data-dino-catalog]').forEach((button,i)=>button.classList.toggle('is-active',i===Number(index)));const stage=root.querySelector('.dino-catalog-stage'),fresh=document.createElement('template');fresh.innerHTML=catalogStage(d);stage.replaceWith(fresh.content.firstElementChild);const play=root.querySelector('[data-dino-project]');play.dataset.value=String(index);}
  let active=null,drag=null,dragInstalled=false,ignoreWorldClick=0;
  function installDrag(){if(dragInstalled)return;dragInstalled=true;document.addEventListener('pointerdown',worldPointerDown);document.addEventListener('pointermove',worldPointerMove,{passive:false});document.addEventListener('pointerup',worldPointerUp);document.addEventListener('pointercancel',worldPointerUp);}
  function init(p){active=p;if(p.kind==='dino-world'){window.ROSA_AULA?.stopVoice?.();installDrag();ensureWorld(p);}}
  function setWorldMessage(text){active.worldMessage=text;const node=document.querySelector('.dino-world-status');if(node)node.textContent=text;}
  function completeChallenge(){active.worldWon=true;active.worldMessage='';renderProjection();}
  function resetChallenge(){active.worldItems=[];active.worldNextId=1;active.worldWon=false;active.worldMessage='';}
  function chooseAnswer(value){const challenge=challenges[active.worldEra][active.worldRound];if(value===challenge.answer){completeChallenge();return;}setWorldMessage(challenge.kind==='food'?'MIRA DE NUEVO QUÉ COMÍA ESTE DINOSAURIO':'OBSERVA OTRA VEZ Y PRUEBA CON OTRA RESPUESTA');}
  function addCountDino(type,x,y){
    const challenge=challenges[active.worldEra][active.worldRound];if(challenge.kind!=='count'||active.worldWon)return;
    if(!periodData[active.worldEra].ids.includes(type))return;
    if(challenge.targets&&!challenge.targets.includes(type)){setWorldMessage('ESE NO ESTÁ EN LA LISTA. BUSCA OTRO.');return;}
    if(active.worldItems.some(item=>item.type===type)){setWorldMessage('ESE YA ESTÁ. ELIGE OTRO DINOSAURIO DIFERENTE.');return;}
    const current=active.worldItems.length;if(current>=challenge.count)return;
    const positions=[[24,52],[51,48],[78,54]],position=positions[current]||[50,50],safeX=Number.isFinite(x)?Math.max(18,Math.min(82,x)):position[0],safeY=Number.isFinite(y)?Math.max(28,Math.min(70,y)):position[1];active.worldItems.push({id:active.worldNextId++,type,x:safeX,y:safeY});
    if(current+1===challenge.count){completeChallenge();return;}active.worldMessage='YA HAY '+(current+1)+'. FALTAN '+(challenge.count-current-1);renderProjection();
  }
  function placeSortedDino(type,period){
    if(!sortSpecies.includes(type)||!periodData[period]||active.worldSortPlaced[type])return;
    if(speciesPeriod(type)===period){active.worldSortPlaced[type]=period;active.worldSortSelected='';active.worldMessage='MUY BIEN. ESTÁ EN SU ETAPA.';renderProjection();return;}
    active.worldSortWrong++;active.worldSortSelected='';active.worldMessage='ESA NO ES SU ETAPA. VUELVE A INTENTARLO.';renderProjection();
  }
  function actWorld(action,type){
    if(active?.kind!=='dino-world')return;
    if(action==='choose-era'){active.worldMode='periods';active.worldEra=type;active.worldSolved[type]=[];active.worldStage='era-intro';active.worldRound=0;resetChallenge();renderProjection();return;}
    if(action==='start-era'){active.worldStage='challenges';active.worldRound=0;resetChallenge();renderProjection();return;}
    if(action==='choose-mission'){active.worldStage='challenges';active.worldRound=Math.max(0,Math.min(4,Number(type)||0));resetChallenge();renderProjection();return;}
    if(action==='repeat-intro'){active.worldStage='era-intro';resetChallenge();renderProjection();return;}
    if(action==='change-era'){active.worldMode='periods';active.worldEra='';active.worldStage='periods';active.worldRound=0;resetChallenge();renderProjection();return;}
    if(action==='open-sort'){active.worldMode='sort';active.worldEra='';active.worldWon=false;active.worldSortSelected='';active.worldMessage='';renderProjection();return;}
    if(action==='sort-restart'){active.worldSortPlaced={};active.worldSortWrong=0;active.worldSortSelected='';active.worldMessage='';renderProjection();return;}
    if(action==='sort-drop'){if(active.worldSortSelected)placeSortedDino(active.worldSortSelected,type);return;}
    if(action==='restart'){active.worldSolved[active.worldEra]=[];active.worldStage='era-intro';active.worldRound=0;resetChallenge();renderProjection();return;}
    if(action==='answer'){chooseAnswer(type);return;}
    if(action==='undo'){active.worldItems.pop();active.worldWon=false;active.worldMessage='PUEDES VOLVER A AÑADIRLO';renderProjection();return;}
    if(action==='next'){
      if(!active.worldSolved[active.worldEra].includes(active.worldRound))active.worldSolved[active.worldEra].push(active.worldRound);
      const next=challenges[active.worldEra].findIndex((_,index)=>!active.worldSolved[active.worldEra].includes(index));
      const finished=next<0;
      if(finished&&!active.worldCompleted.includes(active.worldEra))active.worldCompleted.push(active.worldEra);
      active.worldStage=finished?'finished':'challenges';
      if(!finished)active.worldRound=next;
      resetChallenge();renderProjection();
    }
  }
  document.addEventListener('click',event=>{
    const catalogButton=event.target.closest?.('[data-dino-catalog]');if(catalogButton?.dataset?.dinoCatalog!==undefined){const root=catalogButton.closest?.('[data-dino-catalog-root]');if(root){event.preventDefault();updateCatalog(root,Number(catalogButton.dataset.dinoCatalog));}return;}
    const catalogFact=event.target.closest?.('[data-dino-catalog-fact]');if(catalogFact?.dataset?.dinoCatalogFact){const root=catalogFact.closest?.('[data-dino-catalog-root]'),d=at(root?.dataset.index),key=catalogFact.dataset.dinoCatalogFact;if(root&&d&&key){root.querySelector('[data-dino-catalog-fact]:not(button)').textContent=detail(d,key);root.querySelectorAll('button[data-dino-catalog-fact]').forEach(button=>button.classList.toggle('is-active',button===catalogFact));}return;}
    const fact=event.target.closest?.('[data-dino-detail]');if(fact?.dataset?.dinoDetail){const root=fact.closest?.('[data-dino-explorer]'),d=at(root?.dataset.index);if(root&&d){root.querySelector('[data-dino-detail-text]').textContent=detail(d,fact.dataset.dinoDetail);root.querySelectorAll('[data-dino-detail]').forEach(button=>button.classList.toggle('is-active',button===fact));}return;}
    const back=event.target.closest?.('[data-dino-back]');if(back){const root=back.closest?.('[data-dino-explorer]');if(root)root.removeAttribute('data-focus');return;}
    const focus=event.target.closest?.('[data-dino-focus]');if(focus?.dataset?.dinoFocus){const root=focus.closest?.('[data-dino-explorer]');if(root)root.dataset.focus=focus.dataset.dinoFocus;return;}
    const step=event.target.closest?.('[data-dino-step]');if(step?.dataset?.dinoStep&&active&&['dino','dino-ficha'].includes(active.kind)){active.round=(active.round+Number(step.dataset.dinoStep)+species().length)%species().length;renderProjection();return;}
    const countSource=event.target.closest?.('[data-world-source]');if(countSource?.dataset?.worldSource){if(Date.now()>=ignoreWorldClick)setWorldMessage('ARRÁSTRALO HASTA EL PAISAJE');return;}
    const sortDino=event.target.closest?.('[data-sort-dino]');if(sortDino?.dataset?.sortDino){if(Date.now()<ignoreWorldClick)return;active.worldSortSelected=sortDino.dataset.sortDino;document.querySelectorAll('[data-sort-dino]').forEach(node=>node.classList.toggle('is-selected',node===sortDino));setWorldMessage('AHORA TOCA SU ETAPA O ARRASTRA HASTA ELLA');return;}
    const worldAction=event.target.closest?.('[data-dw-action]');if(worldAction?.dataset?.dwAction){if(Date.now()<ignoreWorldClick)return;event.preventDefault();event.stopImmediatePropagation?.();actWorld(worldAction.dataset.dwAction,worldAction.dataset.worldType);}
  },true);
  function dragGhost(node){const ghost=node.cloneNode(true);ghost.classList.add('dino-drag-ghost');ghost.removeAttribute('data-dw-action');ghost.removeAttribute('data-sort-dino');ghost.removeAttribute('data-world-source');document.body.appendChild(ghost);return ghost;}
  function worldPointerDown(event){
    if(active?.kind!=='dino-world'||active.worldWon)return;
    const source=event.target.closest?.('[data-world-source]');
    if(source?.dataset?.worldSource&&!source.disabled){event.preventDefault();source.setPointerCapture?.(event.pointerId);drag={kind:'source',node:source,ghost:dragGhost(source),type:source.dataset.worldSource,canvas:document.querySelector('[data-world-canvas]'),pointer:event.pointerId,startX:event.clientX,startY:event.clientY,moved:false};return;}
    const sortNode=event.target.closest?.('[data-sort-dino]');
    if(sortNode?.dataset?.sortDino){event.preventDefault();sortNode.setPointerCapture?.(event.pointerId);drag={kind:'sort',node:sortNode,ghost:dragGhost(sortNode),type:sortNode.dataset.sortDino,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,moved:false};return;}
    const node=event.target.closest?.('[data-world-piece]'),canvas=node?.dataset?.worldPiece?node.closest?.('[data-world-canvas]'):null;
    if(!node?.dataset?.worldPiece||!canvas)return;const item=active.worldItems.find(entry=>String(entry.id)===String(node.dataset.worldPiece));if(!item)return;
    event.preventDefault();node.setPointerCapture?.(event.pointerId);drag={kind:'piece',node,canvas,item,pointer:event.pointerId};
  }
  function worldPointerMove(event){
    if(!drag||event.pointerId!==drag.pointer)return;event.preventDefault();
    if(drag.kind==='piece'){const rect=drag.canvas.getBoundingClientRect();drag.item.x=Math.max(18,Math.min(82,(event.clientX-rect.left)/rect.width*100));drag.item.y=Math.max(28,Math.min(70,(event.clientY-rect.top)/rect.height*100));drag.node.style.setProperty('--x',drag.item.x+'%');drag.node.style.setProperty('--y',drag.item.y+'%');return;}
    drag.moved=drag.moved||Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>8;drag.ghost.style.left=event.clientX+'px';drag.ghost.style.top=event.clientY+'px';
  }
  function worldPointerUp(event){
    if(!drag||event.pointerId!==drag.pointer)return;const current=drag;drag=null;current.node.releasePointerCapture?.(event.pointerId);
    if(current.ghost)current.ghost.remove();if(!current.moved)return;
    ignoreWorldClick=Date.now()+500;
    if(current.kind==='source'&&current.canvas){const rect=current.canvas.getBoundingClientRect();if(event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom){const x=(event.clientX-rect.left)/rect.width*100,y=(event.clientY-rect.top)/rect.height*100;addCountDino(current.type,x,y);}else setWorldMessage('LLÉVALO DENTRO DEL PAISAJE.');return;}
    if(current.kind==='sort'){const bin=document.elementFromPoint?.(event.clientX,event.clientY)?.closest?.('[data-sort-bin]');if(bin?.dataset?.sortBin)placeSortedDino(current.type,bin.dataset.sortBin);else setWorldMessage('SUÉLTALO DENTRO DE UNA ETAPA.');}
  }
  return {catalog,projection,init};
})();
