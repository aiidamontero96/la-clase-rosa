'use strict';
window.ROSA_SHEETS=(()=>{
  const PLAY=window.ROSA_PLAY,roster=window.ROSA.students;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const CONTENT=window.ROSA_SHEET_CONTENT;
  if(!CONTENT)throw new Error('ROSA_SHEET_CONTENT no está cargado.');
  const asset=(file,label)=>({src:'assets/vocab-child/'+file+'.webp',label});
  const symbolAsset=(hex,label)=>({src:'assets/symbols/'+hex+'.png',label});
  const colorItem=(label,color)=>({label,color});
  const outlineSrc=CONTENT.outlineSrc;
  Object.assign(PLAY.themes,CONTENT.playThemes);
  const LANGUAGE_BANKS=CONTENT.vocabulary;
  const LETTER_SETS=CONTENT.letterSets;
  const CASE_SETS=CONTENT.caseSets;
  const SHAPE_COLORS=CONTENT.shapeColors;
  const schoolGlyph=CONTENT.schoolGlyph;
  const ui={mode:'numeros',nameType:'repasar',dinoType:'conocer',dinoId:'trex',dinoCount:4,thinkType:'intruso',student:'',customText:'',theme:'Naturaleza',level:1,ink:'color',seed:0,cutouts:false,number:3,numberType:'cantidad',shapeType:'reconocer',traceType:'caminos',polyType:'torres',polyCount:4,langType:'silabas',langSet:'MPS',caseSet:'inicio',langTheme:'Animales',langCount:4};
  const select=(label,key,values)=>'<label class="field"><span>'+label+'</span><select data-studio-setting="'+key+'">'+values.map(v=>'<option value="'+esc(v[0])+'"'+(String(ui[key])===String(v[0])?' selected':'')+'>'+esc(v[1])+'</option>').join('')+'</select></label>';
  const img=(item,cls='')=>{
    if(item?.color){
      const inkClass=ui.ink==='color'?'is-color':'is-outline';
      return '<span class="'+cls+' vocab-color-chip '+inkClass+'" style="--chip:'+esc(item.color)+'" role="img" aria-label="'+esc(item.label)+'"></span>';
    }
    return '<img class="'+cls+'" src="'+esc(ui.ink==='coloring'?outlineSrc(item.src):item.src)+'" alt="'+esc(item.label)+'">';
  };
  function controls(){
    const ink=select('Impresión','ink',[['color','A todo color'],['bn','Blanco y negro'],['coloring','Solo contorno · para colorear']]);
    if(ui.mode==='numeros')return select('Número protagonista','number',Array.from({length:10},(_,i)=>[i+1,i+1]))+select('Actividad','numberType',[['cantidad','Repasar, contar y dibujar'],['contar','Contar colecciones'],['completar','Completar hasta el número']])+ink;
    if(ui.mode==='formas')return select('Actividad','shapeType',[['reconocer','Reconocer y rodear'],['dibujar','Repasar y dibujar']])+ink;
    if(ui.mode==='trazos')return select('Actividad','traceType',[['caminos','Caminos rectos y curvos'],['patrones','Continúo el trazo']])+ink;
    if(ui.mode==='nombre')return select('Alumno o alumna','student',[...roster.filter(Boolean).map(n=>[n,n]),['__custom__','Otro nombre o palabra…']])+(ui.student==='__custom__'?'<label class="field"><span>Escribe el nombre o la palabra</span><input type="text" maxlength="30" value="'+esc(ui.customText)+'" data-studio-custom placeholder="Por ejemplo: ROSA"></label>':'')+select('Modelo de ficha','nameType',[['repasar','Repasar y copiar'],['inicial','Mi inicial'],['letras','Construyo mi nombre'],['contar','¿Cuántas letras tiene?']])+ink;
    if(ui.mode==='lenguaje'){
      if(ui.langType==='repasa-minusculas')ui.langType='silabas';
      const base=select('Actividad','langType',[
        ['silabas','Letras y sílabas'],
        ['mayus-minus','Une mayúscula y minúscula'],
        ['contar-letras','Cuenta las letras'],
        ['completar-palabras','Completa palabras'],
        ['vocal-falta','Completa la vocal'],
        ['letra-inicial','Letra inicial'],
        ['letra-final','Letra final'],
        ['imagen-palabra','Une imagen y palabra']
      ]);
      if(ui.langType==='silabas')return base+select('Letras','langSet',Object.keys(LETTER_SETS).map(k=>[k,LETTER_SETS[k].join(' · ')]))+ink;
      if(ui.langType==='mayus-minus')return base+select('Grupo de letras','caseSet',[
        ['vocales','Vocales'],['inicio','M · P · S · L · T · N'],['amplia','D · C · R · B · F · G'],['mezcla','Mezcla inicial']
      ])+ink;
      return base+select('Vocabulario','langTheme',CONTENT.languageThemeNames.map(v=>[v,v]))+select('Actividades por folio','langCount',[[4,'4 actividades · grandes'],[6,'6 actividades · medianas'],[8,'8 actividades · compactas']])+ink;
    }
    if(ui.mode==='policubos'){if(ui.polyType==='restas')ui.polyType='torres';return select('Tipo de ficha','polyType',[['torres','Torres de policubos'],['sumas','Sumas con policubos']])+select('Actividades por folio','polyCount',[[4,'4 actividades · grandes'],[6,'6 actividades · medianas'],[8,'8 actividades · compactas']])+ink;}
    if(ui.mode==='dino'){
      const activity=select('Actividad','dinoType',[['conocer','El dinosaurio y su huella'],['relacionar','Une dinosaurio y huella'],['camino','Sigue sus huellas'],['encuentra','Encuentra su huella'],['contar','Cuenta sus huellas']]);
      if(ui.dinoType==='relacionar')return activity+select('Parejas por folio','dinoCount',[[4,'4 parejas · grandes'],[6,'6 parejas · medianas'],[8,'8 parejas · compactas']])+ink;
      return activity+select('Dinosaurio','dinoId',window.ROSA.dinosaurs.map(d=>[d.id,d.short]))+(ui.dinoType==='conocer'?'':select('Nivel','level',[[1,'Primeros pasos'],[2,'Practicamos'],[3,'Un reto más']]))+ink;
    }
    return select('Actividad','thinkType',[['intruso','Encuentra el intruso'],['sombras','Une con su sombra'],['busca','Busca y rodea'],['clasifica','Clasifica en dos grupos']])+select('Vocabulario','theme',CONTENT.themeNames.map(v=>[v,v]))+ink;
  }
  function panel(){if(!ui.student)ui.student=roster[0];return '<section class="panel studio-panel"><div class="studio-intro"><div><span class="eyebrow">GENERADORES PERSONALIZADOS</span><h2>Fichas con un propósito</h2><p>Elige qué practicar. Después ajusta dos o tres opciones y prepara tu A4.</p></div><span class="tag">Listas para usar · sin recortar</span></div><div class="studio-simple-picker">'+select('1. ¿Qué quieres trabajar?','mode',[['numeros','Números y cantidades'],['formas','Formas y series'],['nombre','Nombre y letras'],['lenguaje','Lenguaje · letras, sílabas y palabras'],['pensar','Atención visual'],['trazos','Trazos y caminos'],['dino','Huellas de dinosaurios'],['policubos','Policubos']])+'</div><div class="studio-workspace"><div class="studio-controls">'+controls()+(ui.mode==='pensar'&&ui.thinkType==='clasifica'?'<label class="check-label"><input type="checkbox" data-studio-cutouts'+(ui.cutouts?' checked':'')+'> Incluir piezas recortables</label>':'')+'<div class="studio-actions"><button type="button" data-action="studio-shuffle" class="secondary">↻ Cambiar ejercicios</button><button type="button" data-action="studio-print">Preparar impresión</button></div></div><div class="studio-preview" aria-label="Vista previa">'+sheet()+'</div></div></section>';}
  function header(title,instruction){return '<header><strong>La Clase Rosa · '+esc(title)+'</strong><span>'+esc(instruction)+'</span></header>';}
  function studentNameField(){
    return '<div class="studio-student-name"><strong>NOMBRE</strong><img class="studio-start-hand" src="assets/brand/mano-inicio-nombre.png" alt="Empieza aquí" width="96" height="96"><span aria-hidden="true"></span></div>';
  }
  function studentDateBrand(){
    return '<div class="studio-date-field studio-date-full"><strong>FECHA</strong><span aria-hidden="true"></span></div>';
  }
  function nameSheet(){const chosen=ui.student==='__custom__'?ui.customText:ui.student,name=(chosen||'MI NOMBRE').toLocaleUpperCase('es-ES'),letters=[...name.replace(/\s/g,'')],initial=letters[0]||'A';let body='';
    if(ui.nameType==='repasar')body='<h2>Repaso mi nombre y después lo escribo</h2>'+Array.from({length:3},(_,i)=>'<div class="trace-name" style="--fade:'+(0.25+i*.12)+'">'+esc(name)+'</div>').join('')+'<div class="copy-line"></div><div class="copy-line"></div>';
    else if(ui.nameType==='inicial')body='<h2>Mi nombre empieza por…</h2><div class="initial-letter">'+esc(initial)+'</div><p>Repasa la letra con el dedo y decórala con puntos.</p><div class="letter-hunt">'+[initial,'A','M',initial,'S','E',initial,'O'].sort((a,b)=>(a.charCodeAt(0)+ui.seed)%7-(b.charCodeAt(0)+ui.seed)%7).map(l=>'<span class="'+(l===initial?'target':'')+'">'+esc(l)+'</span>').join('')+'</div>';
    else if(ui.nameType==='letras')body='<h2>Construyo mi nombre</h2><div class="name-model">'+esc(name)+'</div><div class="letter-boxes">'+letters.map(l=>'<span>'+esc(l)+'</span>').join('')+'</div><p>Ahora copia cada letra mirando el modelo.</p><div class="letter-boxes empty">'+letters.map(()=>'<span></span>').join('')+'</div>';
    else body='<h2>¿Cuántas letras tiene mi nombre?</h2><div class="name-model">'+esc(name)+'</div><div class="letter-boxes">'+letters.map(l=>'<span>'+esc(l)+'</span>').join('')+'</div><p>Cuenta las casillas y escribe el número.</p><div class="answer-number"></div><p class="draw-prompt">Dibuja tantas marcas como letras tiene tu nombre.</p><div class="drawing-space"></div>';
    return header('Mi nombre','Miro, repaso y lo intento a mi ritmo.')+'<main>'+body+'</main>';
  }

  function languageItems(shortOnly=false){
    const bank=LANGUAGE_BANKS[ui.langTheme]||LANGUAGE_BANKS.Animales;
    const count=[4,6,8].includes(Number(ui.langCount))?Number(ui.langCount):4;
    const source=shortOnly?bank.filter(entry=>entry.letters<=6):bank;
    const safe=source.length?source:bank;
    return Array.from({length:count},(_,i)=>safe[(i+(Number(ui.seed)||0))%safe.length]);
  }
  function syllableLettersSheet(){
    const letters=LETTER_SETS[ui.langSet]||LETTER_SETS.MPS;
    const vowels=['A','E','I','O','U'];
    return header('Letras y sílabas','Une la consonante con cada vocal. Repasa y vuelve a escribir.')+
      '<main class="language-main language-syllables">'+letters.map(letter=>
        '<section class="lang-syllable-row"><strong class="lang-source-letter">'+letter+'</strong><div class="lang-syllable-options">'+
        vowels.map(v=>'<div><span class="lang-vowel">'+v+'</span><b class="lang-arrow">→</b><span class="lang-trace-syllable">'+letter+v+'</span><i class="lang-write-circle"></i></div>').join('')+
        '</div></section>').join('')+'</main>';
  }
  function caseMatchSheet(){
    const letters=CASE_SETS[ui.caseSet]||CASE_SETS.inicio;
    const shift=Math.max(1,((Number(ui.seed)||0)+2)%letters.length);
    const right=letters.map((_,i)=>letters[(i+shift)%letters.length]);

    return header('Mayúscula y minúscula','Une cada letra mayúscula con su letra minúscula.')+
      '<main class="language-main match-sheet case-match-sheet match-count-'+letters.length+'">'+
        '<div class="match-heading"><strong>MAYÚSCULA</strong><span></span><strong>MINÚSCULA</strong></div>'+
        '<div class="match-list">'+letters.map((letter,i)=>
          '<div class="match-row case-match-row">'+
            '<div class="case-symbol case-upper-symbol"><span>'+(i+1)+'</span><strong>'+letter+'</strong></div>'+
            '<div class="match-draw-space" aria-hidden="true"></div>'+
            '<div class="case-symbol case-lower-symbol">'+schoolGlyph(right[i])+'</div>'+
          '</div>'
        ).join('')+
        '</div>'+
      '</main>';
  }
  function letterCountOptions(entry,index){
    const total=entry.letters;
    const values=[Math.max(1,total-1),total,total+1,total+2];
    const unique=[...new Set(values)];
    while(unique.length<4)unique.push(unique.at(-1)+1);
    const shift=(index+(Number(ui.seed)||0))%4;
    return unique.slice(shift).concat(unique.slice(0,shift));
  }
  function letterCountSheet(){
    const items=languageItems(true);
    return header('Cuenta las letras',ui.langTheme+' · Nombra la palabra y cuenta sus letras.')+
      '<main class="language-main letter-count-sheet letter-count-'+items.length+'">'+
      items.map((entry,i)=>'<article class="letter-count-card"><span class="lang-word-number">'+(i+1)+'</span><strong>'+esc(entry.word)+'</strong><div class="letter-count-options">'+letterCountOptions(entry,i).map(n=>'<span>'+n+'</span>').join('')+'</div></article>').join('')+
      '</main>';
  }
  function wordBoxes(entry,index){
    const letters=[...entry.word.replace(/[^A-ZÁÉÍÓÚÜÑ]/g,'')];
    return '<div class="lang-word-boxes">'+letters.map((letter,i)=>{
      const show=letters.length<=3?i===0:(i===0||i===letters.length-1||((i+index+(Number(ui.seed)||0))%3===0));
      return '<span class="'+(show?'given':'blank')+'">'+(show?esc(letter):'')+'</span>';
    }).join('')+'</div>';
  }
  function completeWordsSheet(){
    const items=languageItems();
    return header('Completa las palabras',ui.langTheme+' · Mira el dibujo y escribe las letras que faltan.')+
      '<main class="language-main lang-word-grid lang-count-'+items.length+'">'+
      items.map((entry,i)=>'<article class="lang-word-card"><span class="lang-word-number">'+(i+1)+'</span>'+img(entry.item,'lang-word-picture')+wordBoxes(entry,i)+'</article>').join('')+
      '</main>';
  }
  const vowels='AEIOUÁÉÍÓÚÜ';
  function missingVowelWord(entry,index){
    const letters=[...entry.word];
    const positions=letters.map((l,i)=>vowels.includes(l)?i:-1).filter(i=>i>=0);
    const pos=positions.length?positions[(index+(Number(ui.seed)||0))%positions.length]:Math.min(1,letters.length-1);
    return '<div class="missing-vowel-word">'+letters.map((l,i)=>i===pos?'<span class="vowel-gap"></span>':'<strong>'+esc(l)+'</strong>').join('')+'</div>';
  }
  function missingVowelSheet(){
    const items=languageItems(true);
    return header('Completa la vocal',ui.langTheme+' · Mira el dibujo y escribe la vocal que falta.')+
      '<main class="language-main lang-mini-grid lang-count-'+items.length+'">'+
      items.map((entry,i)=>'<article class="lang-mini-card">'+img(entry.item,'lang-mini-picture')+missingVowelWord(entry,i)+'<div class="vowel-choices">'+['A','E','I','O','U'].map(v=>'<span>'+v+'</span>').join('')+'</div></article>').join('')+
      '</main>';
  }
  function distractorLetters(correct,index){
    const alphabet='AEIOUMPSLTNDCRBFG';
    const out=[correct];
    for(let i=0;out.length<3;i++){
      const c=alphabet[(i+index+(Number(ui.seed)||0)*2)%alphabet.length];
      if(!out.includes(c))out.push(c);
    }
    const shift=(index+(Number(ui.seed)||0))%out.length;
    return out.slice(shift).concat(out.slice(0,shift));
  }
  function edgeLetterSheet(kind){
    const items=languageItems(true);
    const initial=kind==='initial';
    const title=initial?'Letra inicial':'Letra final';
    const instruction=initial?'¿Con qué letra empieza?':'¿Con qué letra termina?';
    const markedWord=entry=>{
      const letters=[...entry.word];
      const focus=initial?0:letters.length-1;
      return letters.map((letter,index)=>index===focus?'<em class="edge-focus-letter">'+esc(letter)+'</em>':esc(letter)).join('');
    };
    return header(title,ui.langTheme+' · '+instruction)+
      '<main class="language-main lang-mini-grid edge-letter-grid lang-count-'+items.length+'">'+
      items.map((entry,i)=>{
        const correct=initial?entry.initial:entry.final;
        const cue=initial
          ? '<div class="edge-word-cue edge-initial"><span class="edge-arrow" aria-hidden="true">→</span><strong>'+markedWord(entry)+'</strong></div>'
          : '<div class="edge-word-cue edge-final"><strong>'+markedWord(entry)+'</strong><span class="edge-arrow" aria-hidden="true">←</span></div>';
        return '<article class="lang-mini-card edge-letter-card">'+img(entry.item,'lang-mini-picture')+cue+
          '<div class="letter-choice-row">'+distractorLetters(correct,i).map(l=>'<span>'+esc(l)+'</span>').join('')+'</div></article>';
      }).join('')+'</main>';
  }
  function imageWordSheet(){
    const items=languageItems(true);
    const words=items.map(x=>x.word);
    return header('Imagen y palabra',ui.langTheme+' · Une cada dibujo con su palabra.')+
      '<main class="language-main vocab-match-sheet match-count-'+items.length+'">'+
        '<div class="vocab-match-list">'+items.map((entry,i)=>{
          const word=words[(i+2+(Number(ui.seed)||0))%words.length];
          return '<div class="vocab-match-row"><div>'+img(entry.item,'vocab-match-picture')+'</div><span class="match-draw-space"></span><strong>'+esc(word)+'</strong></div>';
        }).join('')+'</div>'+
      '</main>';
  }
  function lowercaseTraceSheet(){
    const letters=CASE_SETS[ui.caseSet]||CASE_SETS.inicio;

    return header('Repaso minúsculas','Sigo el modelo con el dedo y después lo repaso y lo intento sola/o.')+
      '<main class="language-main lowercase-trace-grid">'+letters.map((letter,i)=>
        '<article class="lowercase-trace-card">'+
          '<span>'+(i+1)+'</span>'+
          '<div class="school-trace-model">'+schoolGlyph(letter,'school-model-letter')+'</div>'+
          '<div class="school-trace-copy">'+
            schoolGlyph(letter,'school-trace-letter')+
            schoolGlyph(letter,'school-trace-letter')+
          '</div>'+
          '<i class="school-write-line"></i>'+
        '</article>'
      ).join('')+
      '</main>';
  }
  function languageSheet(){
    if(ui.langType==='mayus-minus')return caseMatchSheet();
    if(ui.langType==='contar-letras')return letterCountSheet();
    if(ui.langType==='completar-palabras')return completeWordsSheet();
    if(ui.langType==='vocal-falta')return missingVowelSheet();
    if(ui.langType==='letra-inicial')return edgeLetterSheet('initial');
    if(ui.langType==='letra-final')return edgeLetterSheet('final');
    if(ui.langType==='imagen-palabra')return imageWordSheet();
    return syllableLettersSheet();
  }
  const footprint=(id,cls='')=>'<img class="footprint '+cls+'" src="assets/dino-footprints/'+esc(id)+(ui.ink==='coloring'?'-outline':'')+'.webp" alt="Huella reconstruida de '+esc(id)+'">';
  function dinoMatchSheet(){
    const count=[4,6,8].includes(Number(ui.dinoCount))?Number(ui.dinoCount):4;
    const all=window.ROSA.dinosaurs;
    const chosen=Array.from({length:count},(_,i)=>all[(i+(Number(ui.seed)||0))%all.length]);
    const shift=count===4?1:count===6?2:3;
    const right=chosen.map((_,i)=>chosen[(i+shift)%count]);
    const dinoPicture=info=>{
      const index=Math.max(0,all.findIndex(d=>d.id===info.id));
      return img(PLAY.themes.Dinosaurios[index],'dino-match-picture');
    };
    return header('Dinosaurios y huellas',count+' parejas · Une cada dinosaurio con su huella.')+
      '<main class="dino-match-sheet match-sheet match-count-'+count+'">'+
        '<div class="match-heading dino-match-heading"><strong>DINOSAURIOS</strong><span></span><strong>HUELLAS</strong></div>'+
        '<div class="match-list">'+chosen.map((info,i)=>
          '<div class="match-row dino-match-row">'+
            '<div class="dino-match-cell dino-match-left"><span class="dino-match-number">'+(i+1)+'</span>'+dinoPicture(info)+'<strong>'+esc(info.short)+'</strong></div>'+
            '<div class="match-draw-space" aria-hidden="true"></div>'+
            '<div class="dino-match-cell dino-match-right">'+footprint(right[i].id,'dino-match-footprint')+'</div>'+
          '</div>'
        ).join('')+'</div>'+
      '</main>';
  }
  function dinoSheet(){const level=Number(ui.level)||1,index=Math.max(0,window.ROSA.dinosaurs.findIndex(d=>d.id===ui.dinoId)),info=window.ROSA.dinosaurs[index],dino=PLAY.themes.Dinosaurios[index];let body='';
    if(ui.dinoType==='relacionar')return dinoMatchSheet();
    if(ui.dinoType==='conocer')body='<h2>'+esc(info.short)+' y su tipo de huella</h2><div class="dino-footprint-pair">'+img(dino,'dino-goal')+footprint(info.id,'footprint-large')+'</div><p>Observa sus dedos y repasa el contorno.</p><div class="trace-paths"><span></span><span></span></div>';
    else if(ui.dinoType==='camino'){const total=[5,8,11][level-1];body='<h2>Sigue las huellas del '+esc(info.short)+'</h2><div class="footprint-path">'+Array.from({length:total},(_,i)=>footprint(info.id,i%2?'flip':'')).join('')+'</div>'+img(dino,'dino-goal')+'<div class="trace-paths"><span></span><span></span></div>';}
    else if(ui.dinoType==='encuentra'){const others=window.ROSA.dinosaurs.filter(d=>d.id!==info.id),choices=[info,...Array.from({length:[2,5,8][level-1]},(_,i)=>others[(i+ui.seed)%others.length])].sort((a,b)=>(a.id.charCodeAt(0)+ui.seed)%7-(b.id.charCodeAt(0)+ui.seed)%7);body='<h2>Rodea la huella del '+esc(info.short)+'</h2>'+img(dino,'dino-clue')+'<div class="footprint-find">'+choices.map(d=>footprint(d.id)).join('')+'</div>';}
    else body='<h2>Cuenta las huellas del '+esc(info.short)+'</h2><div class="count-footprints">'+Array.from({length:4},(_,r)=>'<div><span>'+Array.from({length:Math.min(6,r+2+level)},()=>footprint(info.id)).join('')+'</span><i></i></div>').join('')+'</div>';
    return header('Huellas y dinosaurios','Cada dinosaurio aparece con un tipo de huella reconstruida para el aula.')+'<main>'+body+'</main>';
  }
  function thinkSheet(){const theme=PLAY.themes[ui.theme]||PLAY.themes.Naturaleza,other=PLAY.themes.Dinosaurios,at=i=>theme[(i+ui.seed)%theme.length],key=x=>x.src||x.color||x.label,out=i=>{const item=at(i),alternatives=theme.filter(x=>key(x)!==key(item));return alternatives[(i+ui.seed)%alternatives.length]||item;};let body='';
    if(ui.thinkType==='intruso')body='<h2>Rodea el dibujo diferente en cada fila</h2><div class="intruder-rows">'+Array.from({length:4},(_,r)=>{const pos=(r+ui.seed)%4;return '<div>'+Array.from({length:4},(_,i)=>img(i===pos?out(r):at(r),'think-picture')).join('')+'</div>';}).join('')+'</div>';
    else if(ui.thinkType==='sombras')body='<h2>Une cada dibujo con su sombra</h2><div class="shadow-match"><div>'+Array.from({length:4},(_,i)=>img(at(i),'think-picture')).join('')+'</div><div>'+Array.from({length:4},(_,i)=>img(at((i+2)%4),'think-picture shadow')).join('')+'</div></div>';
    else if(ui.thinkType==='busca'){const target=at(0);body='<h2>Busca y rodea todos los '+esc(target.label.toLocaleLowerCase('es-ES'))+'</h2><div class="visual-search">'+Array.from({length:20},(_,i)=>img(i%5===0?target:at(i+1),'think-picture')).join('')+'</div><p>¿Cuántos has encontrado?</p><div class="answer-number"></div>';}
    else body='<h2>Clasifica: '+esc(theme[0].label)+' / dinosaurios</h2><div class="classify-boxes"><div><strong>'+esc(theme[0].label)+'</strong></div><div><strong>Dinosaurios</strong></div></div>'+(ui.cutouts?'<div class="classify-cutouts">'+Array.from({length:6},(_,i)=>img(i%2?out(i):theme[0],'think-picture')).join('')+'</div>':'<div class="drawing-space"><p>Dibuja o escribe una marca en cada grupo.</p></div>');
    return header('Observo y pienso',ui.theme+' · Primero miro, después decido.')+'<main>'+body+'</main>';
  }

  const SHAPE_NAMES=['círculo','cuadrado','triángulo','rectángulo'];
  function geo(n,trace=false){
    const i=((Number(n)||0)%SHAPE_NAMES.length+SHAPE_NAMES.length)%SHAPE_NAMES.length;
    const shapes=[
      '<circle cx="40" cy="40" r="27"/>',
      '<rect x="13" y="13" width="54" height="54" rx="2"/>',
      '<path d="M40 10 L70 68 H10 Z"/>',
      '<rect x="8" y="22" width="64" height="36" rx="2"/>'
    ];
    const fill=trace||ui.ink!=='color'?'none':SHAPE_COLORS[i%SHAPE_COLORS.length];
    const stroke=trace?'#777':'#222';
    return '<svg viewBox="0 0 80 80" class="worksheet-shape shape-'+i+'" role="img" aria-label="'+SHAPE_NAMES[i]+'"><g fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"'+(trace?' stroke-dasharray="3 4"':'')+'>'+shapes[i]+'</g></svg>';
  }
  const dots=(n,offset=0)=>'<span class="worksheet-dots">'+Array.from({length:n},(_,i)=>'<i style="--dot-color:'+SHAPE_COLORS[(i+offset)%SHAPE_COLORS.length]+'"></i>').join('')+'</span>';
  function numberSheet(){const n=Math.max(1,Math.min(10,Number(ui.number)||3));let body='';
    if(ui.numberType==='cantidad')body='<h2>REPASA EL '+n+'</h2><div class="number-trace">'+Array.from({length:4},()=>'<span>'+n+'</span>').join('')+'</div><h2>CUENTA Y RODEA '+n+' PUNTOS</h2>'+dots(n+2)+'<h2>DIBUJA '+n+' MARCAS</h2><div class="drawing-space"></div><h2>LO INTENTO SOLO</h2><div class="letter-boxes empty"><span></span><span></span><span></span></div>';
    else if(ui.numberType==='contar')body='<h2>CUENTA Y ESCRIBE CUÁNTOS HAY</h2><div class="number-exercises">'+Array.from({length:5},(_,i)=>'<div>'+dots((i+ui.seed)%n+1)+'<b></b></div>').join('')+'</div>';
    else body='<h2>DIBUJA LOS PUNTOS QUE FALTAN HASTA '+n+'</h2><div class="number-exercises">'+Array.from({length:4},(_,i)=>'<div>'+dots((i+ui.seed)%n)+'<span class="complete-number-space"></span><strong>'+n+'</strong></div>').join('')+'</div>';
    return header('Números y cantidades','Toco cada punto una sola vez. Dibujo y cuento para comprobar.')+'<main>'+body+'</main>';
  }
  function shapeSheet(){
    if(!['reconocer','dibujar'].includes(ui.shapeType))ui.shapeType='reconocer';
    let body='';
    const total=SHAPE_NAMES.length;
    if(ui.shapeType==='reconocer'){
      body='<h2>RODEA LAS FORMAS IGUALES AL MODELO</h2><div class="shape-recognize-list">'+Array.from({length:4},(_,r)=>{
        const target=(r+ui.seed)%total;
        const candidates=[target,(target+1)%total,(target+2)%total,target,(target+3)%total,target];
        return '<div class="shape-recognize-row"><strong class="shape-model">'+geo(target)+'</strong><span class="shape-recognize-divider" aria-hidden="true"></span><div class="shape-candidates">'+candidates.map(i=>geo(i)).join('')+'</div></div>';
      }).join('')+'</div>';
    }else{
      body='<h2>REPASA Y DIBUJA OTRA AL LADO</h2><div class="shape-exercises shape-draw-exercises">'+Array.from({length:4},(_,r)=>{const i=(r+ui.seed)%total;return '<div>'+geo(i,true)+geo(i,true)+'<span class="complete-number-space"></span></div>';}).join('')+'</div><p>INVENTA UN DIBUJO CON ESTAS FORMAS.</p><div class="drawing-space"></div>';
    }
    return header('Formas','Círculo, cuadrado, triángulo y rectángulo. Observo antes de dibujar.')+'<main>'+body+'</main>';
  }
  function traceSheet(){const paths=['M20 40 H680','M20 45 Q100 0 180 45 T340 45 T500 45 T680 45','M20 55 L100 15 L180 55 L260 15 L340 55 L420 15 L500 55 L580 15 L680 55','M20 50 Q60 0 100 50 T180 50 T260 50 T340 50 T420 50 T500 50 T580 50 T680 50'];return header('Trazos y caminos','Primero sigo el camino con el dedo. Después uso una cera.')+'<main><h2>'+ (ui.traceType==='caminos'?'DEL PUNTO HASTA LA META':'CONTINÚA EL CAMINO')+'</h2><div class="trace-exercises">'+paths.map((d,i)=>'<svg viewBox="0 0 710 80" role="img" aria-label="Camino '+(i+1)+'"><circle cx="20" cy="'+(i===0?40:i===1?45:i===2?55:50)+'" r="6" fill="#222"/><path d="'+d+'" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="5 7"'+(ui.traceType==='patrones'?' pathLength="100"':'')+'/>'+(ui.traceType==='patrones'?'<rect x="360" y="0" width="340" height="80" fill="white"/>':'')+'<path d="M695 10 V70" stroke="#222" stroke-width="2"/></svg>').join('')+'</div><h2>AHORA INVENTA UN CAMINO</h2><div class="drawing-space"></div></main>';}

  const POLY_COLORS=[
    ['pink','#f15a9b'],['blue','#3f8fe8'],['orange','#ff9636'],['green','#28b96f'],
    ['yellow','#ffd83d'],['purple','#8d55cc'],['red','#f04444'],['cyan','#39c5d5']
  ];
  const polyRand=(i,offset=0)=>{
    let x=((Number(ui.seed)||0)+1)*73856093 ^ (i+1)*19349663 ^ (offset+1)*83492791;
    x=Math.imul(x^(x>>>13),1274126177);
    return (x^(x>>>16))>>>0;
  };
  const polyColor=(i,offset=0)=>POLY_COLORS[polyRand(i,offset)%POLY_COLORS.length];
  const polyCube=(color)=>'<span class="poly-cube poly-'+esc(color[0])+'" style="--cube-color:'+esc(color[1])+'" aria-hidden="true"></span>';
  const polyGroup=(n,color)=>'<span class="poly-group">'+Array.from({length:n},()=>polyCube(color)).join('')+'</span>';
  const polyNum=(i,offset,min,max)=>min+(polyRand(i+17,offset+31)%(max-min+1));
  const POLY_SUM_PAIRS=Array.from({length:5},(_,ai)=>Array.from({length:5},(_,bi)=>[ai+1,bi+1])).flat();
  const POLY_REST_PAIRS=Array.from({length:6},(_,ai)=>{
    const a=ai+3;
    return Array.from({length:a-1},(_,bi)=>[a,bi+1]);
  }).flat();
  function polyPair(kind,i){
    const list=kind==='sum'?POLY_SUM_PAIRS:POLY_REST_PAIRS;
    const step=kind==='sum'?7:5;
    const base=polyRand(kind==='sum'?101:211,7)%list.length;
    return list[(base+i*step)%list.length];
  }

  function polyTowerCard(i){
    const targets=Array.from({length:4},(_,j)=>{
      const color=polyColor(i*2,j);
      const amount=polyNum(i,j,2,8);
      return '<div class="poly-tower-target">'+polyCube(color)+'<strong>'+amount+'</strong></div>';
    }).join('');
    return '<article class="poly-card poly-tower-card"><span class="poly-card-number">'+(i+1)+'</span><div class="poly-tower-targets">'+targets+'</div></article>';
  }

  function polySumCard(i){
    const [a,b]=polyPair('sum',i);
    const ca=polyColor(i,0),cb=polyColor(i,3);
    return '<article class="poly-card poly-op-card"><span class="poly-card-number">'+(i+1)+'</span>'+ 
      '<div class="poly-math-layout">'+
        '<div class="poly-operand">'+polyGroup(a,ca)+'<i class="poly-number-box"></i></div>'+ 
        '<b class="poly-math-sign">+</b>'+ 
        '<div class="poly-operand">'+polyGroup(b,cb)+'<i class="poly-number-box"></i></div>'+ 
        '<b class="poly-math-equals">=</b>'+ 
        '<div class="poly-result-column"><span class="poly-result-spacer"></span><i class="poly-result-box"></i></div>'+ 
      '</div></article>';
  }
  function polySubtractCard(i){
    const [a,b]=polyPair('rest',i);
    const color=polyColor(i,1);
    return '<article class="poly-card poly-op-card"><span class="poly-card-number">'+(i+1)+'</span>'+ 
      '<div class="poly-math-layout">'+
        '<div class="poly-operand">'+polyGroup(a,color)+'<i class="poly-number-box"></i></div>'+ 
        '<b class="poly-math-sign">−</b>'+ 
        '<div class="poly-operand">'+polyGroup(b,color)+'<i class="poly-number-box"></i></div>'+ 
        '<b class="poly-math-equals">=</b>'+ 
        '<div class="poly-result-column"><span class="poly-result-spacer"></span><i class="poly-result-box"></i></div>'+ 
      '</div></article>';
  }
  function policubosSheet(){
    const count=[4,6,8].includes(Number(ui.polyCount))?Number(ui.polyCount):4;
    const type=['torres','sumas'].includes(ui.polyType)?ui.polyType:'torres';
    const title={torres:'TORRES DE POLICUBOS',sumas:'SUMAS CON POLICUBOS',restas:'RESTAS CON POLICUBOS'}[type];
    const instruction={
      torres:'Mira el color y el número. Construye cada torre con esa cantidad de piezas.',
      sumas:'Cuenta los policubos, suma y escribe el resultado.',
      restas:'Cuenta, quita y descubre cuántos quedan.'
    }[type];
    const headerLine={
      torres:'Torres · '+count+' actividades',
      sumas:'Sumas · '+count+' actividades',
      restas:'Restas · '+count+' actividades'
    }[type];
    const cards=Array.from({length:count},(_,i)=>type==='torres'?polyTowerCard(i):type==='sumas'?polySumCard(i):polySubtractCard(i)).join('');
    return header('Policubos',headerLine+' · '+({color:'Color',bn:'Blanco y negro',coloring:'Solo contorno'}[ui.ink]||'Color'))+
      '<main class="poly-main poly-'+type+' poly-count-'+count+'"><div class="poly-title"><h2>'+title+'</h2><p>'+instruction+'</p></div><div class="poly-grid">'+cards+'</div></main>';
  }

  function sheet(){
    const inkClass=ui.ink==='bn'?'studio-bn':ui.ink==='coloring'?'studio-outline':'studio-color';
    const content=ui.mode==='numeros'?numberSheet():ui.mode==='formas'?shapeSheet():ui.mode==='trazos'?traceSheet():ui.mode==='nombre'?nameSheet():ui.mode==='lenguaje'?languageSheet():ui.mode==='dino'?dinoSheet():ui.mode==='policubos'?policubosSheet():thinkSheet();
    return '<section class="studio-sheet '+inkClass+'">'+studentNameField()+content+studentDateBrand()+'</section>';
  }
  function printHTML(){return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="'+esc(new URL('.',location.href).href)+'"><title>Mi ficha · La Clase Rosa</title><link rel="stylesheet" href="school-script.css?rev=4"><link rel="stylesheet" href="sheet-studio.css?rev=29"><style>@page{size:A4 portrait;margin:0}</style></head><body class="studio-print-document"><div class="studio-print-tools"><button onclick="window.print()">Imprimir / Guardar PDF</button><button class="back" onclick="if(window.opener&&!window.opener.closed){window.opener.focus();window.close()}else{history.back()}">← Volver a la app</button></div>'+sheet()+'</body></html>';}
  function openPrint(){const win=window.open('','_blank');if(!win){window.toast?.('Permite la ventana de impresión y vuelve a intentarlo.');return;}win.document.open();win.document.write(printHTML());win.document.close();}
  function refresh(){window.render?.();}
  function handle(action,value){if(action==='studio-mode'){ui.mode=value;refresh();return true;}if(action==='studio-shuffle'){ui.seed++;refresh();return true;}if(action==='studio-print'){openPrint();return true;}return false;}
  function change(target){if(target.dataset.studioCustom!==undefined){ui.customText=target.value.trim().slice(0,30);refresh();return true;}if(target.dataset.studioSetting){const key=target.dataset.studioSetting;if(key in ui){ui[key]=['level','polyCount','dinoCount','langCount'].includes(key)?Number(target.value):target.value;refresh();}return true;}if(target.dataset.studioCutouts!==undefined){ui.cutouts=target.checked;refresh();return true;}return false;}
  return {ui,panel,sheet,printHTML,handle,change,getRoster:()=>[...roster]};
})();
