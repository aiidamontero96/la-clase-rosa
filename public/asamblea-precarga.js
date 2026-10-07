/* Prepara el siguiente paso sin bloquear ni ocultar la pantalla actual. */
(() => {
  'use strict';
  const base='assets/asamblea-ligera/', ready=new Map(), pending=new Set();
  let generation=0,key='',timer;
  const paths=(folder,names)=>names.map(name=>base+folder+'/'+name+'.webp?rev=1');
  function plan(){
    const dialog=document.getElementById('projector'),main=dialog?.querySelector('.projection-main');
    if(dialog?.open&&main){
      const kind=main.dataset.game,count=Boolean(main.querySelector('.count-story'));
      const month=new Date().getMonth(),season=['invierno','invierno','primavera','primavera','primavera','verano','verano','verano','otono','otono','otono','invierno'][month];
      const next={encargado:paths('asistencia-tren',['locomotora']).concat(paths('asamblea-infantil',['clase'])),asistencia:count?paths('weekdays',['lunes','martes','miercoles','jueves','viernes']):paths('asamblea-infantil',['clase','casa']),'dia-semana':paths('calendario-cuento',[season]),calendario:paths('estaciones-cuento',['primavera','verano','otono','invierno']),estacion:paths('cielo-panoramico',['sol']),tiempo:paths('emociones-cuento',['personajes']),emociones:paths('rutinas-libro',['libro','flor']),numero:paths('rutinas-libro',['libro']),letra:[]};
      return {key:kind+(count?'/count':''),urls:next[kind]||[],main};
    }
    const home=document.querySelector('.home-assembly-actions');
    return home?{key:'home',urls:paths('encargados',['saludos','luces','material','jabon']).concat(['assets/scenes/classroom.webp']),main:null}:{key:'other',urls:[],main:null};
  }
  async function warm(url,token){
    url=new URL(url,document.baseURI).href;
    if(ready.has(url)||pending.has(url))return;
    while(pending.size>=2){await new Promise(resolve=>setTimeout(resolve,50));if(token!==undefined&&token!==generation)return;}
    if(ready.has(url)||pending.has(url)||(token!==undefined&&token!==generation))return;
    pending.add(url);const image=new Image();image.decoding='async';image.fetchPriority='low';
    await new Promise(resolve=>{let finished=false;const done=ok=>{if(finished)return;finished=true;clearTimeout(deadline);image.onload=image.onerror=null;pending.delete(url);if(ok){ready.set(url,image);while(ready.size>12)ready.delete(ready.keys().next().value);}resolve();};const deadline=setTimeout(()=>done(false),12000);image.onload=()=>{if(typeof image.decode==='function')image.decode().then(()=>done(true),()=>done(true));else done(true);};image.onerror=()=>done(false);image.src=url;});
  }
  async function currentReady(main,token){
    if(!main)return;
    await Promise.all([...main.querySelectorAll('img[src]')].map(img=>new Promise(resolve=>{
      const timer=setTimeout(resolve,12000);
      const decoded=typeof img.decode==='function'?img.decode():new Promise(done=>{if(img.complete)done();else{img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});}});
      decoded.catch(()=>{}).then(()=>{clearTimeout(timer);resolve();});
    })));
    const urls=[];
    for(const node of main.querySelectorAll('.calendar-story,.weather-scene,.routine-book-spread,.emotion-book-character')){
      const bg=getComputedStyle(node).backgroundImage,match=bg.match(/url\(["']?([^"')]+)["']?\)/);if(match)urls.push(match[1]);
    }
    await Promise.all([...new Set(urls)].map(url=>warm(url,token)));
  }
  function refresh(force=false){
    const p=plan();if(p.key===key&&!force)return;key=p.key;const token=++generation;clearTimeout(timer);
    if(document.hidden||navigator.connection?.saveData||!p.urls.length)return;
    timer=setTimeout(async()=>{
      await currentReady(p.main,token);
      const run=async()=>{for(const url of p.urls){if(token!==generation||document.hidden)return;await warm(url,token);}};
      if(token!==generation)return;
      if('requestIdleCallback' in window)requestIdleCallback(()=>{if(token===generation)void run();},{timeout:1500});else void run();
    },0);
  }
  const observer=new MutationObserver(()=>refresh());
  for(const id of ['contenido','projection-content']){const node=document.getElementById(id);if(node)observer.observe(node,{childList:true});}
  const dialog=document.getElementById('projector');if(dialog)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',()=>refresh(true));
  window.ROSA_ASSEMBLY_PRELOAD={report:()=>({step:key,ready:[...ready.keys()],pending:[...pending]})};
  // Caché persistente exclusivamente para las ilustraciones ligeras.
  if('serviceWorker' in navigator&&window.isSecureContext){
    const url=new URL('asamblea-imagenes-sw.js',document.baseURI),scope=new URL('./',url).href;
    navigator.serviceWorker.getRegistration(scope).then(existing=>{
      const worker=existing?.active||existing?.waiting||existing?.installing;
      if(worker&&new URL(worker.scriptURL).pathname!==url.pathname)return;
      return navigator.serviceWorker.register(url.href,{scope,updateViaCache:'none'});
    }).catch(()=>{});
  }
  refresh();
})();
