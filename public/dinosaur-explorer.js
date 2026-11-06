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
    triassic:{name:'TRIÁSICO',tone:'copper',background:'assets/dino-world/triassic-landscape.webp'},
    jurassic:{name:'JURÁSICO',tone:'green',background:'assets/dino-world/jurassic-landscape.webp'},
    cretaceous:{name:'CRETÁCICO',tone:'gold',background:'assets/dino-world/cretaceous-landscape-v2.webp'}
  };
  const documentary={
    triassic:{
      label:'Los primeros dinosaurios',
      dates:'Hace unos 252–201 millones de años',
      intro:'Casi todas las tierras estaban unidas en un gran continente llamado Pangea. En muchas regiones hacía calor y había estaciones secas. Durante esta etapa aparecieron los primeros dinosaurios. Algunos eran pequeños y corrían sobre dos patas. Otros, como el Plateosaurio, ya eran mucho más grandes. También había reptiles que nadaban en el mar y otros que volaban.',
      scenes:[
        {id:'triasico-eoraptor',title:'Eoraptor',habitat:'Dinosaurio terrestre',when:'Hace unos 230 millones de años',where:'Noroeste de la actual Argentina',
          text:'Era uno de los primeros dinosaurios. Tenía un cuerpo ligero, una cola larga y era mucho más pequeño que un Plateosaurio. Se movía sobre dos patas por una llanura recorrida por ríos.',
          alt:'Reconstrucción de un Eoraptor pequeño que camina sobre tierra seca junto a vegetación baja.'},
        {id:'triasico-plateosaurio',title:'Plateosaurio',habitat:'Dinosaurio terrestre',when:'Triásico tardío, hace más de 200 millones de años',where:'La actual Europa central',
          text:'Ya había dinosaurios bastante grandes. El Plateosaurio comía plantas y tenía un cuello largo, muy distinto del de los pequeños cazadores. Era un pariente temprano de los grandes dinosaurios de cuello largo del Jurásico.',
          alt:'Reconstrucción de dos Plateosaurios de cuello largo sobre suelo firme, cerca de coníferas.'},
        {id:'triasico-coelophysis',title:'Coelophysis',habitat:'Dinosaurio terrestre',when:'Triásico tardío, hace más de 200 millones de años',where:'El actual Nuevo México, en Estados Unidos',
          text:'Este cazador tenía patas finas, un hocico estrecho y una cola larga que le ayudaba a equilibrarse. En Nuevo México se han encontrado fósiles de muchos Coelophysis.',
          alt:'Reconstrucción de dos Coelophysis esbeltos caminando por una llanura seca.'},
        {id:'triasico-shonisaurus',title:'Shonisaurus',habitat:'Reptil marino',when:'Triásico tardío, hace unos 230 millones de años',where:'El mar que cubría la actual Nevada, en Estados Unidos',
          text:'Era un reptil marino enorme. Nadaba con sus aletas y tenía un hocico largo. Como respiraba aire, subía a la superficie.',
          alt:'Reconstrucción de un Shonisaurus de hocico largo nadando bajo el agua.'},
        {id:'triasico-eudimorfodon',title:'Eudimorfodón',habitat:'Reptil volador',when:'Triásico tardío',where:'La costa de lo que hoy es el norte de Italia',
          text:'Era un pterosaurio pequeño con una cola larga. Sus alas eran de piel fina y las usaba para volar sobre la costa.',
          alt:'Reconstrucción de un Eudimorfodón con alas de membrana y cola larga en vuelo.'}
      ]
    },
    jurassic:{
      label:'Bosques, mares y alas',
      dates:'Hace unos 201–145 millones de años',
      intro:'Pangea empezó a separarse y se abrieron nuevos mares. En tierra crecían bosques de coníferas y helechos donde vivían dinosaurios gigantes. Vamos a viajar también bajo el agua y por el cielo. Allí encontraremos reptiles marinos y voladores que vivieron en lugares y momentos distintos del Jurásico.',
      scenes:[
        {id:'jurasico-bosque',title:'Diplodocus y Estegosaurio',habitat:'Dinosaurios terrestres',when:'Jurásico tardío, hace unos 150 millones de años',where:'El actual oeste de Norteamérica',
          text:'El Diplodocus tenía un cuello largo y una cola finísima en la punta. El Estegosaurio se reconoce por las placas de su espalda y las púas de su cola. Los dos comían plantas.',
          alt:'Reconstrucción de un Diplodocus y un Estegosaurio sobre suelo firme, en un bosque de coníferas y helechos.'},
        {id:'jurasico-plesiosaurio',title:'Plesiosaurio',habitat:'Reptil marino',when:'Jurásico temprano, hace unos 200 millones de años',where:'Mares del actual sur de Inglaterra',
          text:'Era un reptil que vivía en el mar. Usaba cuatro aletas para nadar y subía a respirar aire. Su cuello largo terminaba en una cabeza pequeña. Se han encontrado esqueletos fósiles en la costa inglesa.',
          alt:'Reconstrucción de un Plesiosaurio de cuello largo nadando bajo la superficie con cuatro aletas.'},
        {id:'jurasico-pterodactilo',title:'Pterodáctilo',habitat:'Reptil volador',when:'Jurásico tardío, hace unos 150 millones de años',where:'Lagunas de la actual Baviera, en Alemania',
          text:'El Pterodáctilo era un pterosaurio pequeño. Cada ala era una membrana sostenida por un dedo muy largo. Los fósiles conservados en la caliza nos ayudan a conocer cómo era su cuerpo.',
          alt:'Reconstrucción de un Pterodáctilo con alas de membrana volando sobre antiguas lagunas.'},
        {id:'jurasico-braquiosaurio',title:'Braquiosaurio',habitat:'Dinosaurio terrestre',when:'Jurásico tardío, hace unos 150 millones de años',where:'El actual oeste de Norteamérica',
          text:'El Braquiosaurio comía plantas. Tenía las patas delanteras más largas que las traseras. Con su cuello podía alcanzar las ramas altas.',
          alt:'Reconstrucción de un Braquiosaurio sobre suelo firme junto a las ramas altas de una conífera.'},
        {id:'jurasico-arqueopterix',title:'Arqueoptérix',habitat:'Dinosaurio con plumas',when:'Jurásico tardío, hace unos 150 millones de años',where:'Islas de la actual Alemania',
          text:'Era pequeño y tenía plumas, como las aves de hoy. También tenía dientes y una cola larga con huesos. Sus fósiles conservan la forma de las plumas.',
          alt:'Reconstrucción de un Arqueoptérix con alas y cola larga cubiertas de plumas.'}
      ]
    },
    cretaceous:{
      label:'Flores, cuernos y grandes reptiles',
      dates:'Hace unos 145–66 millones de años',
      intro:'Los continentes siguieron separándose y se extendieron las plantas con flores. Hubo dinosaurios con cuernos, grandes cazadores terrestres y reptiles adaptados al mar o al vuelo. Al final del Cretácico, el impacto de un asteroide cambió la vida en la Tierra. De los dinosaurios, sobrevivió el linaje de las aves.',
      scenes:[
        {id:'cretacico-tierra',title:'Triceratops y T. rex',habitat:'Dinosaurios terrestres',when:'Final del Cretácico, hace unos 67 millones de años',where:'Llanuras del actual oeste de Norteamérica',
          text:'El Triceratops comía plantas. Tenía tres cuernos y una gran gola detrás de la cabeza. En aquella región vivía también el Tyrannosaurus rex, un gran cazador con mandíbulas poderosas.',
          alt:'Reconstrucción de Triceratops en una llanura de suelo firme, con un T. rex lejos al fondo.'},
        {id:'cretacico-mosasaurio',title:'Mosasaurio',habitat:'Reptil marino',when:'Cretácico tardío, hace más de 66 millones de años',where:'Mares que cubrían zonas de la actual Europa',
          text:'El Mosasaurio era un reptil marino emparentado con los lagartos. Sus aletas y su cola lo ayudaban a nadar. Cazaba peces y otros animales marinos. Como el Plesiosaurio, necesitaba salir a respirar.',
          alt:'Reconstrucción de un Mosasaurio nadando por debajo de la superficie, con un banco de peces al fondo.'},
        {id:'cretacico-pteranodon',title:'Pteranodon',habitat:'Reptil volador',when:'Cretácico tardío, hace más de 80 millones de años',where:'Mar interior de la actual Norteamérica',
          text:'Era un pterosaurio de alas enormes. Tenía un pico sin dientes y una cresta que sobresalía detrás de la cabeza. Podía planear sobre un mar que atravesaba el centro de Norteamérica.',
          alt:'Reconstrucción de un Pteranodon planeando sobre el mar, con el pico y la cresta visibles.'},
        {id:'cretacico-anquilosaurio',title:'Anquilosaurio',habitat:'Dinosaurio terrestre',when:'Final del Cretácico, hace más de 66 millones de años',where:'El actual oeste de Norteamérica',
          text:'Comía plantas. Tenía placas duras en el lomo, como una armadura, y al final de la cola llevaba una gran maza.',
          alt:'Reconstrucción de un Anquilosaurio de cuatro patas con placas y una maza al final de la cola.'},
        {id:'cretacico-paquicefalosaurio',title:'Paquicefalosaurio',habitat:'Dinosaurio terrestre',when:'Final del Cretácico, hace más de 66 millones de años',where:'El actual oeste de Norteamérica',
          text:'Caminaba sobre dos patas. Su cabeza tenía una cúpula de hueso grueso, redonda como un casco. Esa forma permite reconocerlo.',
          alt:'Reconstrucción de un Paquicefalosaurio de perfil con la cúpula de la cabeza visible.'}
      ]
    }
  };
  const dinoHeights={coelophysis:1,plateosaurus:2.5,herrerasaurus:1.7,stegosaurus:4,brachiosaurus:12,diplodocus:4.6,trex:4,triceratops:3,ankylosaurus:1.7,parasaurolophus:4.9,velociraptor:.55,spinosaurus:5,ichthyosaurus:1.2,mosasaurus:2};
  const marineLengths={ichthyosaurus:3,mosasaurus:12};
  const species=()=>window.ROSA?.dinosaurs||[];
  const byId=id=>species().find(d=>d.id===id);
  const at=index=>{const list=species();return list[((Number(index)||0)%list.length+list.length)%list.length];};
  const detail=(d,key='body')=>d[key]||facts[d.id]?.[key]||d.fact.toLocaleUpperCase('es-ES');
  const eraKeyFromPeriod=period=>String(period||'').toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('trias')?'triassic':String(period||'').toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes('juras')?'jurassic':'cretaceous';

  const projectGroups={
    especies:{title:'12 dinosaurios',heading:'Elige un dinosaurio',kicker:'Laboratorio de especies',
      ids:['coelophysis','plateosaurus','pachycephalosaurus','trex','triceratops','stegosaurus','brachiosaurus','velociraptor','ankylosaurus','diplodocus','parasaurolophus','spinosaurus']},
    marinos:{title:'Reptiles marinos',heading:'Elige un reptil marino',kicker:'El mar prehistórico',ids:['plesiosaurus','mosasaurus']},
    voladores:{title:'Reptiles voladores',heading:'Elige un reptil volador',kicker:'El cielo prehistórico',ids:['pterodactylus','pteranodon']}
  };
  const projectAnimals={
    pachycephalosaurus:{short:'Paquicefalosaurio',period:'Cretácico',body:'CRÁNEO ABOMBADO · DOS PATAS',food:'COMÍA PLANTAS',time:'VIVIÓ AL FINAL DEL CRETÁCICO',metres:3},
    plesiosaurus:{short:'Plesiosaurio',period:'Jurásico',body:'CUELLO LARGO · CUATRO ALETAS',food:'COMÍA PECES Y OTROS ANIMALES PEQUEÑOS DEL MAR',time:'VIVIÓ A PRINCIPIOS DEL JURÁSICO',metres:3},
    pterodactylus:{short:'Pterodáctilo',period:'Jurásico',body:'ALAS DE MEMBRANA · DIENTES FINOS',food:'CAZABA PEQUEÑAS PRESAS',time:'VIVIÓ AL FINAL DEL JURÁSICO',metres:1.06,wings:true},
    pteranodon:{short:'Pteranodon',period:'Cretácico',body:'CRESTA LARGA · PICO SIN DIENTES',food:'COMÍA PECES',time:'VIVIÓ EN EL CRETÁCICO',metres:6,wings:true}
  };
  const projectGroup=key=>Object.hasOwn(projectGroups,key)?key:'especies';
  const projectAnimal=id=>projectAnimals[id]?{id,...projectAnimals[id]}:byId(id);
  const projectAnimalAt=(key,index)=>projectAnimal(projectGroups[projectGroup(key)].ids[index]||projectGroups[projectGroup(key)].ids[0]);
  function speciesButtons(group,active,projector=false){
    const action=projector?'data-project-species':'data-dino-catalog';
    return projectGroups[group].ids.map((id,index)=>{
      const d=projectAnimal(id),current=d.id===active;
      return '<button type="button" '+action+'="'+index+'" class="'+(current?'is-active':'')+'"'+
      (projector?'':' aria-pressed="'+current+'"')+
      (!projector&&group==='especies'?' data-action="dino-project-species" data-species-group="'+group+'" data-species-detail data-value="'+index+'" aria-haspopup="dialog"':'')+'><img src="'+real(d.id)+'" alt="" loading="lazy"><span>'+esc(d.short)+'</span></button>';
    }).join('');
  }
  function catalogHeading(group,action=''){
    const spec=projectGroups[group];
    return '<div class="dino-observatory-head"><div><span>'+esc(spec.kicker)+'</span><h2>'+
      (group==='especies'?'CONÓCELOS DE VERDAD':esc(spec.title))+'</h2><p>'+
      esc(spec.heading.toLocaleUpperCase('es-ES'))+' PARA OBSERVARLO DE CERCA.</p></div>'+action+'</div>';
  }
  function catalog(key){
    const group=projectGroup(key),spec=projectGroups[group],d=projectAnimalAt(group,0);
    return '<section class="dino-observatory" data-dino-catalog-root data-species-group="'+group+'" data-index="0">'+
      catalogHeading(group,'<button type="button" class="button" data-action="dino-project-species" data-species-group="'+group+'" data-value="0" data-dino-project>VER EN LA PDI</button>')+
      '<nav class="dino-species-ribbon dino-species-tiles" aria-label="'+esc(spec.heading)+'">'+speciesButtons(group,d.id)+'</nav>'+catalogStage(d)+'</section>';
  }
  const catalogFacts=[['body','SU CUERPO'],['food','SU COMIDA'],['time','SU ÉPOCA']];
  function catalogStage(d,projector=false,fact='body'){
    const facts=catalogFacts.map(([key,label])=>{
      const selected=key===fact;
      return '<button type="button" data-dino-catalog-fact="'+key+'"'+(selected?' class="is-active"':'')+' aria-pressed="'+selected+'">'+label+'</button>';
    }).join('');
    return '<div class="dino-catalog-stage dino-project-stage">'+
      '<div class="dino-catalog-animal dino-catalog-real"><span>RECONSTRUCCIÓN REALISTA</span>'+
      '<img src="'+real(d.id)+'" alt="Reconstrucción realista de '+esc(d.short)+'"></div>'+
      '<div class="dino-catalog-center"><small>'+esc(d.period).toLocaleUpperCase('es-ES')+'</small>'+
      '<h3>'+esc(d.short).toLocaleUpperCase('es-ES')+'</h3><p data-dino-catalog-fact aria-live="polite">'+esc(detail(d,fact))+'</p>'+
      '<div>'+facts+'</div>'+
      (projector?'<button type="button" class="dino-size-button" data-project-species-view="scale">LO COMPARAMOS CON NOSOTROS</button>':'')+'</div></div>';
  }
  function projectSpecies(p){
    const group=projectGroup(p.payload.projectSpecies),spec=projectGroups[group],d=projectAnimalAt(group,p.round),view=p.projectSpeciesView??(p.payload.inlineSpecies?'detail':undefined);
    if(view==='scale'){
      p.customSpeech='Comparamos el tamaño de '+d.short+' con el de un niño.';
      return {body:'<section class="dino-explorer-pdi dino-project-scale" data-focus="real" aria-label="¿Cuánto mide '+esc(d.short)+'?">'+
        '<div class="dino-compare">'+(d.metres||marineLengths[d.id]?projectMeasure(d):viewCard(d,'real',true))+'</div></section>',foot:''};
    }
    const frame='<section class="dino-explorer-pdi dino-observatory dino-project-species" data-species-group="'+group+'"';
    if(view==='detail'){
      p.customSpeech=d.short+'. '+(d.fact||d.body);
      return {body:frame+' data-dino-catalog-root data-index="'+p.round+'">'+
        '<button type="button" class="dino-species-back" '+(p.payload.inlineSpecies?'data-action="close-projection"':'data-project-species-view="catalog"')+'>← '+esc(spec.title)+'</button>'+
        catalogStage(d,true)+'</section>',foot:''};
    }
    p.customSpeech=spec.heading+' para verlo de cerca.';
    return {body:frame+' data-dino-project-gallery data-dino-catalog-root data-index="'+p.round+'">'+catalogHeading(group)+
      '<nav class="dino-species-tiles dino-species-grid" aria-label="'+esc(spec.heading)+'">'+speciesButtons(group,d.id,true)+'</nav>'+
      catalogStage(d,false,p.catalogFact??p.payload.catalogFact)+'</section>',foot:''};
  }
  function projectMeasure(d){
    const metres=d.metres||marineLengths[d.id],child=1.05,max=Math.max(metres,child);
    const label=d.wings?'ENVERGADURA':'LONGITUD',format=value=>value.toLocaleString('es-ES')+' m';
    return '<article class="dino-view dino-view-real dino-project-measure"><div class="dino-view-open">'+
      '<h2>¿Cuánto mide '+esc(d.short)+'?</h2><div class="dino-measure-images"><img src="'+real(d.id)+'" alt=""><img src="assets/dino-explorer/scale-child-v1.webp" alt=""></div>'+
      '<div class="dino-measure-bars"><div><strong>'+label+' APROX. · '+format(metres)+'</strong><i style="width:'+(metres/max*100)+'%" aria-hidden="true"></i></div>'+
      '<div><strong>ALTURA DEL NIÑO DE REFERENCIA · '+format(child)+'</strong><i style="width:'+(child/max*100)+'%" aria-hidden="true"></i></div></div></div>'+
      '<button type="button" class="dino-focus-back" data-project-species-view="detail">← VOLVER A '+esc(d.short).toLocaleUpperCase('es-ES')+'</button></article>';
  }
  function scaleSpec(id){
    const height=dinoHeights[id]||2,axis=height<=1.5?2:height<=4?5:height<=6?6:15,step=axis===2?.5:axis===15?3:1,marks=[];
    for(let value=0;value<=axis+.001;value+=step)marks.push('<span style="--mark-y:'+((value/axis)*100).toFixed(2)+'%">'+String(value).replace('.',',')+' m</span>');
    return {height,axis,dinoPct:Math.max(8,height/axis*84),childPct:1.05/axis*84,marks:marks.join('')};
  }
  function viewCard(d,type,projector=false){
    const realistic=type==='real',label=realistic?'RECONSTRUCCIÓN REAL':'ILUSTRACIÓN',scale=scaleSpec(d.id),marine=marineLengths[d.id];
    const measure=marine?'LONGITUD APROX. '+marine+' M':'ALTURA APROX. '+String(scale.height).replace('.',',')+' M';
    const visual=realistic?'<div class="dino-real-scale" style="--dino-height:'+scale.dinoPct+'%;--child-height:'+scale.childPct+'%"><div class="dino-scale-grid" aria-hidden="true"></div><div class="dino-height-ruler" aria-hidden="true">'+scale.marks+'</div><img class="dino-view-animal dino-scale-animal" src="'+real(d.id)+'" alt="Reconstrucción realista de '+esc(d.short)+'"><figure class="dino-scale-child"><img src="assets/dino-explorer/scale-child-v1.webp" alt="Niño de cuatro años situado junto al dinosaurio para comparar su tamaño"><figcaption>NIÑO/A DE 4 AÑOS · 1,05 M</figcaption></figure><span class="dino-scale-ground" aria-hidden="true">MISMO SUELO</span><em>'+measure+'</em></div>':'<img class="dino-view-animal" src="'+drawn(d.id)+'" alt="Ilustración infantil de '+esc(d.short)+'">';
    if(projector)return '<article class="dino-view dino-view-real"><div class="dino-view-open"><span>¿CUÁNTO MIDE '+esc(d.short).toLocaleUpperCase('es-ES')+'?</span>'+visual+
      '</div><button type="button" class="dino-focus-back" data-project-species-view="detail">← VOLVER A '+esc(d.short).toLocaleUpperCase('es-ES')+'</button></article>';
    return '<article class="dino-view dino-view-'+type+'"><button type="button" class="dino-view-open" data-dino-focus="'+type+'"><span>'+label+'</span>'+visual+'<strong>'+(realistic?'TAMAÑO COMPARADO':'ASÍ LO ILUSTRAMOS')+'</strong><i>TOCA PARA VER A PANTALLA COMPLETA</i></button><button type="button" class="dino-focus-back" data-dino-back>← VOLVER A COMPARAR</button></article>';
  }
  function explorer(p){const d=at(p.round),index=species().indexOf(d),era=periodData[eraKeyFromPeriod(d.period)],category=d.group?' · '+d.group.toLocaleUpperCase('es-ES'):'';p.customSpeech=d.short+'. '+d.fact;return {body:'<section class="dino-explorer-pdi era-'+eraKeyFromPeriod(d.period)+'" data-dino-explorer data-index="'+index+'"><img class="dino-explorer-bg" src="'+era.background+'" alt=""><div class="dino-explorer-shade"></div><header><span>'+esc(d.period).toLocaleUpperCase('es-ES')+category+'</span><h2>'+esc(d.short).toLocaleUpperCase('es-ES')+'</h2></header><div class="dino-compare">'+viewCard(d,'real')+viewCard(d,'drawn')+'</div><aside class="dino-discovery"><p data-dino-detail-text>'+esc(detail(d))+'</p><nav><button type="button" class="is-active" data-dino-detail="body">SU CUERPO</button><button type="button" data-dino-detail="food">¿QUÉ COMÍA?</button><button type="button" data-dino-detail="time">¿CUÁNDO VIVIÓ?</button></nav></aside><button type="button" class="dino-arrow dino-prev" data-dino-step="-1" aria-label="Animal anterior">‹</button><button type="button" class="dino-arrow dino-next" data-dino-step="1" aria-label="Animal siguiente">›</button></section>',foot:''};}

  const vocabIcon=name=>'assets/vocab-child/'+name+'.webp';
  const fieldNotes={
    'triasico-eoraptor':{
      topic:'Cómo se movía',question:'¿Sobre cuántas patas caminaba el Eoraptor?',answer:0,
      choices:[['Dos patas','2'],['Cuatro patas','4']],
      explain:'Sobre dos patas. Mira cómo las patas traseras sostienen el cuerpo y la cola le ayuda a equilibrarse.',
      hint:'Mira las patas que tocan el suelo. ¿Dónde están las patas delanteras?'
    },
    'triasico-plateosaurio':{
      topic:'Alimentación',question:'¿Qué buscaba el Plateosaurio entre las ramas?',answer:1,
      choices:[['Peces',vocabIcon('fish')],['Hojas y otras plantas',vocabIcon('herb')]],
      explain:'Hojas y otras plantas. Decimos que el Plateosaurio era herbívoro porque comía plantas.',
      hint:'Sigue con la vista su cuello. ¿Hasta dónde llega su boca en la escena?'
    },
    'triasico-coelophysis':{
      topic:'Alimentación',question:'¿Qué buscaba para comer el Coelophysis?',answer:0,
      choices:[['Animales pequeños',''],['Hojas y brotes',vocabIcon('seedling')]],
      explain:'Cazaba animales pequeños. El Coelophysis era carnívoro y sus dientes afilados le ayudaban a sujetar lo que atrapaba.',
      hint:'Piensa en sus dientes afilados. ¿Para qué le servirían a un cazador?'
    },
    'jurasico-bosque':{
      topic:'Observa su cuerpo',question:'¿Quién tiene una fila de placas sobre el lomo?',answer:1,
      choices:[['Diplodocus',real('diplodocus')],['Estegosaurio',real('stegosaurus')]],
      explain:'El Estegosaurio. Sus placas lo distinguen del Diplodocus, que tiene un cuello y una cola muy largos. Los dos comían plantas.',
      hint:'Busca al animal que está detrás. Fíjate en las formas que sobresalen por encima de su espalda.'
    },
    'jurasico-plesiosaurio':{
      topic:'Vida en el mar',question:'¿Qué tenía que hacer el Plesiosaurio para respirar?',answer:0,
      choices:[['Subir a la superficie',vocabIcon('wind')],['Quedarse bajo el agua',vocabIcon('wave')]],
      explain:'Subía a la superficie para respirar aire. Sus cuatro aletas le servían para nadar.',
      hint:'El Plesiosaurio tenía pulmones. Mira arriba en la escena y busca el lugar donde el agua se junta con el aire.'
    },
    'jurasico-pterodactilo':{
      topic:'Cómo se movía',question:'¿Por dónde se desplazaba con sus alas el Pterodáctilo?',answer:1,
      choices:[['Bajo el agua',vocabIcon('wave')],['Por el aire',vocabIcon('wind')]],
      explain:'Por el aire. Sus alas de membrana le permitían volar sobre las lagunas.',
      hint:'Busca el agua abajo y después mira la altura a la que está volando.'
    },
    'cretacico-tierra':{
      topic:'Alimentación',question:'De estos dos dinosaurios, ¿cuál comía plantas?',answer:1,
      choices:[['T. rex',real('trex')],['Triceratops',real('triceratops')]],
      explain:'El Triceratops era herbívoro. Cortaba la vegetación con su pico. El T. rex era carnívoro.',
      hint:'Mira el hocico del animal que tiene tres cuernos. Su pico le servía para arrancar plantas.'
    },
    'cretacico-mosasaurio':{
      topic:'Alimentación',question:'¿Qué podía cazar el Mosasaurio en este mar?',answer:0,
      choices:[['Peces',vocabIcon('fish')],['Hojas de los árboles',vocabIcon('tree')]],
      explain:'Peces y otros animales marinos. Sus mandíbulas le ayudaban a atraparlos.',
      hint:'Mira el grupo de animales pequeños que nada en el fondo de la imagen.'
    },
    'cretacico-pteranodon':{
      topic:'Alimentación',question:'¿Qué alimento podía encontrar el Pteranodon al volar sobre el mar?',answer:1,
      choices:[['Brotes de plantas',vocabIcon('seedling')],['Peces',vocabIcon('fish')]],
      explain:'Peces. Se han encontrado restos de peces en el interior de fósiles de Pteranodon.',
      hint:'Mira debajo de sus alas. ¿Qué animales podría encontrar en esa gran extensión de agua?'
    },
    'triasico-shonisaurus':{
      topic:'Mira su cabeza',question:'¿Cómo era el hocico del Shonisaurus?',answer:0,
      choices:[['Largo y estrecho',''],['Corto y redondo','']],
      explain:'Largo y estrecho. Mira la punta del hocico y sigue la línea hasta el ojo.',
      hint:'Fíjate en la cabeza. ¿La punta del hocico está cerca o lejos del ojo?'
    },
    'triasico-eudimorfodon':{
      topic:'Mira su cola',question:'¿Qué ves detrás del Eudimorfodón?',answer:1,
      choices:[['Una maza',''],['Una cola larga','']],
      explain:'Una cola larga y fina. Se distingue detrás del cuerpo mientras vuela.',
      hint:'Busca la línea fina que sale por detrás de sus patas.'
    },
    'jurasico-braquiosaurio':{
      topic:'Alimentación',question:'¿Qué podía alcanzar con su cuello?',answer:0,
      choices:[['Ramas altas',vocabIcon('tree')],['Peces del agua',vocabIcon('fish')]],
      explain:'Ramas altas. Con sus patas delanteras largas y su cuello, llegaba a hojas que quedaban muy arriba.',
      hint:'Mira dónde está su boca. ¿Está cerca de las ramas o debajo del agua?'
    },
    'jurasico-arqueopterix':{
      topic:'Mira sus alas',question:'¿Qué cubría las alas del Arqueoptérix?',answer:1,
      choices:[['Placas duras',''],['Plumas','']],
      explain:'Plumas. Mira cómo se superponen en el ala. En la cola también tenía plumas.',
      hint:'Mira el borde de un ala. ¿Ves formas finas como las de las aves que conocemos?'
    },
    'cretacico-anquilosaurio':{
      topic:'Mira su cola',question:'¿Qué tenía al final de la cola?',answer:0,
      choices:[['Una maza redonda',''],['Un abanico de plumas','']],
      explain:'Una maza redonda. Era una parte de hueso, grande y pesada, al final de la cola.',
      hint:'Sigue la cola desde el cuerpo hasta la punta. Fíjate en su forma.'
    },
    'cretacico-paquicefalosaurio':{
      topic:'Mira su cabeza',question:'¿Dónde estaba su cúpula de hueso?',answer:1,
      choices:[['En la cola',''],['En la cabeza','']],
      explain:'En la cabeza. Busca la parte redonda que parece un casco.',
      hint:'Mira por encima de los ojos. ¿Qué forma tiene la parte de arriba?'
    }
  };
  const eraOrder=Object.keys(documentary);
  const documentaryImage=scene=>'assets/dino-world/documental/'+scene.id+'.webp';

  function eraButton(action,value,text,css=''){
    return '<button type="button" class="'+css+'" data-dw-action="'+action+'" data-world-type="'+value+'">'+text+'</button>';
  }

  function eraCards(projector){
    return eraOrder.map((id,index)=>{
      const chapter=documentary[id],period=periodData[id];
      const action=projector?'data-dw-action="choose-era" data-world-type':'data-action="dino-era-open" data-value';
      return '<button type="button" class="dino-documentary-card tone-'+period.tone+'" '+action+'="'+id+'">'+
        '<img src="'+documentaryImage(chapter.scenes[0])+'" alt="" width="1440" height="810">'+
        '<span class="dino-documentary-card-copy"><small>CAPÍTULO '+(index+1)+'</small>'+
        '<strong>'+period.name+'</strong><span>'+esc(chapter.label)+'</span>'+
        '<small>'+esc(chapter.dates)+'</small></span></button>';
    }).join('');
  }

  function stages(){
    return '<section class="panel dino-documentary-index"><header><span class="eyebrow">PROYECTO DINOSAURIOS</span>'+
      '<h2>Viaje por las tres etapas</h2><p>Tres capítulos ilustrados para descubrir cómo cambió la Tierra y qué animales vivieron en ella.</p>'+
      '<button type="button" class="button" data-action="dino-era-open" data-value="">Ver en la PDI</button></header>'+
      '<div class="dino-documentary-grid">'+eraCards(false)+'</div></section>';
  }

  function chapterIntro(chapter,period,index){
    const scenes=chapter.scenes.map((scene,i)=>eraButton('documentary-page',i+1,
      '<img src="'+documentaryImage(scene)+'" alt="" width="1440" height="810">'+
      '<strong>'+esc(scene.title)+'</strong><small>'+esc(scene.habitat)+'</small>','dino-documentary-preview')).join('');
    return '<header class="dino-documentary-intro"><span class="dino-documentary-eyebrow">CAPÍTULO '+(index+1)+' DE '+eraOrder.length+'</span>'+
      '<h2 tabindex="-1">'+period.name+'</h2><p class="dino-documentary-dates">'+esc(chapter.dates)+'</p>'+
      '<p>'+esc(chapter.intro)+'</p></header><nav class="dino-documentary-grid" aria-label="Escenas del capítulo">'+scenes+'</nav>';
  }

  function observation(scene){
    const note=fieldNotes[scene.id];
    const choices=note.choices.map(([label,icon],index)=>{
      const visual=icon.includes('/')?'<img src="'+esc(icon)+'" alt="" width="44" height="44">':
        (icon?'<span class="dino-observation-number" aria-hidden="true">'+esc(icon)+'</span>':'');
      return '<button type="button" data-documentary-answer="'+index+'" aria-pressed="false">'+visual+esc(label)+'</button>';
    }).join('');
    return '<section class="dino-observation" data-dino-observation="'+scene.id+'" aria-label="Observa y descubre">'+
      '<span class="dino-documentary-eyebrow">Observa y descubre · '+esc(note.topic)+'</span>'+
      '<h3 id="dino-observation-question">'+esc(note.question)+'</h3>'+
      '<div class="dino-observation-choices" role="group" aria-labelledby="dino-observation-question">'+choices+'</div>'+
      '<p class="dino-observation-feedback" role="status" aria-atomic="true">Toca una opción para descubrir la pista.</p></section>';
  }

  function revealObservation(button){
    const panel=button.closest('[data-dino-observation]');
    const note=fieldNotes[panel.dataset.dinoObservation];
    const match=Number(button.dataset.documentaryAnswer)===note.answer;
    panel.querySelectorAll('[data-documentary-answer]').forEach(choice=>{
      choice.setAttribute('aria-pressed',String(choice===button));
      choice.classList.toggle('is-discovery',choice===button&&match);
    });
    panel.querySelector('[role="status"]').textContent=match?note.explain:note.hint;
  }

  function scenePage(scene){
    const image=documentaryImage(scene);
    return '<figure class="dino-documentary-film"><div class="dino-documentary-panorama" style="--scene-image:url('+image+')">'+
      '<img src="'+image+'" alt="'+esc(scene.alt)+'" width="1440" height="810"></div>'+
      '<figcaption><div class="dino-documentary-caption"><span class="dino-documentary-eyebrow">'+esc(scene.habitat)+'</span>'+
      '<h2 tabindex="-1">'+esc(scene.title)+'</h2><p class="dino-documentary-dates">'+esc(scene.when)+' · '+esc(scene.where)+'</p>'+
      '<p>'+esc(scene.text)+'</p></div>'+observation(scene)+'</figcaption></figure>';
  }

  function chapterCover(era,previousPage){
    const period=periodData[era],chapter=documentary[era],cover=chapter.scenes[0];
    return {body:'<section class="dino-world-pdi dino-documentary dino-chapter-cover tone-'+period.tone+'" data-dino-world>'+
      '<header class="dino-documentary-intro"><span class="dino-documentary-eyebrow">PRÓXIMA PARADA · CAPÍTULO '+(eraOrder.indexOf(era)+1)+'</span>'+
      '<h2 tabindex="-1">'+period.name+'</h2><p class="dino-documentary-dates">'+esc(chapter.dates)+'</p>'+
      '<p>'+esc(chapter.label)+'</p></header>'+
      '<div class="dino-documentary-panorama" style="--scene-image:url('+documentaryImage(cover)+')">'+
      '<img src="'+documentaryImage(cover)+'" alt="'+esc(cover.alt)+'" width="1440" height="810"></div>'+
      '<footer class="dino-documentary-footer">'+eraButton('documentary-page',previousPage,'← Última escena')+
      '<span>¿LISTOS PARA VIAJAR?</span>'+eraButton('choose-era',era,'Entrar en el '+period.name+' →','is-next')+'</footer></section>',foot:''};
  }

  function world(p){
    const era=p.documentaryEra??(Object.hasOwn(documentary,p.payload?.era)?p.payload.era:'');
    if(!era)return {body:'<section class="dino-world-pdi dino-documentary dino-documentary-menu" data-dino-world>'+
      '<header class="dino-documentary-intro"><span class="dino-documentary-eyebrow">PROYECTO DINOSAURIOS</span>'+
      '<h2 tabindex="-1">Viaje por las tres etapas</h2><p>Elige un capítulo para empezar.</p></header>'+
      '<nav class="dino-documentary-grid" aria-label="Capítulos">'+eraCards(true)+'</nav></section>',foot:''};

    const chapter=documentary[era],period=periodData[era],index=eraOrder.indexOf(era);
    const page=p.documentaryPage??0,last=page===chapter.scenes.length;
    if(p.documentaryCover)return chapterCover(p.documentaryCover,page);
    const pages=['Introducción',...chapter.scenes.map(scene=>scene.title)];
    const pager=pages.map((label,i)=>'<button type="button" data-dw-action="documentary-page" data-world-type="'+i+
      '" aria-label="'+esc(label)+'"'+(i===page?' aria-current="step"':'')+'>'+(i+1)+'</button>').join('');
    const previous=page?eraButton('documentary-page',page-1,'← Anterior'):eraButton('choose-era','','← Capítulos');
    const next=!last?eraButton('documentary-page',page+1,page?'Siguiente escena →':'Ver la primera escena →','is-next'):
      index+1<eraOrder.length?eraButton('documentary-cover',eraOrder[index+1],'Siguiente etapa →','is-next'):
      eraButton('choose-era','','Volver a los capítulos','is-next');
    return {body:'<section class="dino-world-pdi dino-documentary tone-'+period.tone+' '+(page?'is-scene':'is-chapter')+'" data-dino-world>'+
      '<div class="dino-documentary-top">'+eraButton('choose-era','','Capítulos')+
      '<span>'+period.name+'</span><nav aria-label="Páginas del capítulo">'+pager+'</nav></div>'+
      (page?scenePage(chapter.scenes[page-1]):chapterIntro(chapter,period,index))+
      '<footer class="dino-documentary-footer">'+previous+'<span>'+esc(pages[page])+' · '+(page+1)+' de '+pages.length+'</span>'+next+
      '</footer></section>',foot:''};
  }
  function projection(p){if(p.kind==='dino'&&p.payload?.projectSpecies)return projectSpecies(p);if(['dino','dino-ficha'].includes(p.kind))return explorer(p);if(p.kind==='dino-world')return world(p);return null;}
  function renderProjection(){if(typeof projectionRender==='function')projectionRender();}
  function updateCatalog(root,index){const d=projectAnimalAt(root.dataset.speciesGroup,index);root.dataset.index=String(index);root.querySelectorAll('[data-dino-catalog]').forEach(button=>{const current=Number(button.dataset.dinoCatalog)===index;button.classList.toggle('is-active',current);button.setAttribute('aria-pressed',String(current));});const stage=root.querySelector('.dino-catalog-stage'),fresh=document.createElement('template');fresh.innerHTML=catalogStage(d);stage.replaceWith(fresh.content.firstElementChild);const play=root.querySelector('[data-dino-project]');play.dataset.value=String(index);}
  let active=null;
  function init(p){active=p;if(p.kind==='dino-world')window.ROSA_AULA?.stopVoice?.();}
  function actWorld(action,type){
    if(active?.kind!=='dino-world')return;
    if(action==='choose-era'){
      if(type&&!Object.hasOwn(documentary,type))return;
      active.documentaryEra=type;
      active.documentaryPage=0;
      active.documentaryCover='';
    }else if(action==='documentary-cover'){
      if(!Object.hasOwn(documentary,type))return;
      active.documentaryCover=type;
    }else if(action==='documentary-page'){
      const era=active.documentaryEra??active.payload?.era;
      const page=Number(type);
      if(!Object.hasOwn(documentary,era)||!Number.isInteger(page)||page<0||page>documentary[era].scenes.length)return;
      active.documentaryPage=page;
      active.documentaryCover='';
    }else return;
    renderProjection();
    document.querySelector('.dino-documentary h2')?.focus({preventScroll:true});
  }
  document.addEventListener('click',event=>{
    const projectButton=event.target.closest?.('[data-project-species],[data-project-species-view]');
    if(projectButton&&active?.kind==='dino'&&active.payload?.projectSpecies){
      const choice=projectButton.dataset.projectSpecies;
      if(choice!==undefined){
        if(active.round!==Number(choice))active.catalogFact='body';
        active.round=Number(choice);
        active.projectSpeciesView='detail';
      }
      else active.projectSpeciesView=projectButton.dataset.projectSpeciesView;
      renderProjection();
      return;
    }
    const catalogButton=event.target.closest?.('[data-dino-catalog]');if(catalogButton?.dataset?.dinoCatalog!==undefined){const root=catalogButton.closest?.('[data-dino-catalog-root]');if(root){event.preventDefault();updateCatalog(root,Number(catalogButton.dataset.dinoCatalog));}return;}
    const catalogFact=event.target.closest?.('button[data-dino-catalog-fact]');
    if(catalogFact){
      const root=catalogFact.closest('[data-dino-catalog-root]');
      if(!root)return;
      const key=catalogFact.dataset.dinoCatalogFact,d=projectAnimalAt(root.dataset.speciesGroup,Number(root.dataset.index));
      if(root.hasAttribute('data-dino-project-gallery')&&active?.payload?.projectSpecies)active.catalogFact=key;
      root.querySelector('[data-dino-catalog-fact]:not(button)').textContent=detail(d,key);
      root.querySelectorAll('button[data-dino-catalog-fact]').forEach(button=>{
        const current=button===catalogFact;
        button.classList.toggle('is-active',current);
        button.setAttribute('aria-pressed',String(current));
      });
      return;
    }
    const fact=event.target.closest?.('[data-dino-detail]');if(fact?.dataset?.dinoDetail){const root=fact.closest?.('[data-dino-explorer]'),d=at(root?.dataset.index);if(root&&d){root.querySelector('[data-dino-detail-text]').textContent=detail(d,fact.dataset.dinoDetail);root.querySelectorAll('[data-dino-detail]').forEach(button=>button.classList.toggle('is-active',button===fact));}return;}
    const back=event.target.closest?.('[data-dino-back]');if(back){const root=back.closest?.('[data-dino-explorer]');if(root)root.removeAttribute('data-focus');return;}
    const focus=event.target.closest?.('[data-dino-focus]');if(focus?.dataset?.dinoFocus){const root=focus.closest?.('[data-dino-explorer]');if(root)root.dataset.focus=focus.dataset.dinoFocus;return;}
    const step=event.target.closest?.('[data-dino-step]');if(step?.dataset?.dinoStep&&active&&['dino','dino-ficha'].includes(active.kind)){active.round=(active.round+Number(step.dataset.dinoStep)+species().length)%species().length;renderProjection();return;}
    const documentaryAnswer=event.target.closest?.('[data-documentary-answer]');
    if(documentaryAnswer){
      revealObservation(documentaryAnswer);
      return;
    }
    const worldAction=event.target.closest?.('[data-dw-action]');
    if(worldAction){
      event.preventDefault();
      event.stopImmediatePropagation?.();
      actWorld(worldAction.dataset.dwAction,worldAction.dataset.worldType);
    }
  },true);
  return {catalog,stages,projection,init};
})();
