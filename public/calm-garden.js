'use strict';
(() => {
  const asset='assets/calm-garden/';
  const animals=[
    ['mariposa','Mariposa',39,39,6,'flutter'],
    ['petirrojo','Petirrojo',93,23,6,'flight'],
    ['conejo','Conejo',41,82,10,'hop'],
    ['rana','Rana',74,78,7,'jump'],
    ['erizo','Erizo',55,87,10,'amble'],
    ['pato','Pato',88,81,10,'swim'],
    ['zorro','Zorro',13,83,14,'amble'],
    ['cervatillo','Cervatillo',62,72,12,'trot'],
    ['ardilla','Ardilla',29,80,8,'scamper'],
    ['leon','León',35,59,13,'amble'],
    ['tigre','Tigre',20,62,13,'prowl'],
    ['cebra','Cebra',52,54,12,'trot'],
    ['elefante','Elefante',70,54,13,'stride'],
    ['jirafa','Jirafa',83,55,11,'stride']
  ];
  const sensitivities=[[.0008,1.45,.0007],[.0018,1.85,.0015],[.004,2.45,.0035]];
  const quietSeconds=20;
  const calibrationSeconds=1.5;
  let current=null;

  function page(nav){
    return '<div class="page-head"><div><span class="eyebrow">PIZARRA DIGITAL · CALMA</span><h1>Jardín de la calma</h1></div></div>'+nav+
      '<section class="calm-preview"><div><span class="eyebrow">UN RATITO DE SILENCIO</span><h2>ELIGE TU ESCENA</h2>'+
      '<nav class="calm-links" aria-label="Escenas de calma">'+
      '<a class="button" href="https://www.shysafari.com/" target="_blank" rel="noopener noreferrer">Shy Safari · Dinosaurios ↗</a>'+
      '<a class="button" href="https://shushmeter.com/es/aquarium" target="_blank" rel="noopener noreferrer">Acuario ↗</a>'+
      '</nav><p>En Shy Safari, elige la escena prehistórica. Para empezar, permite el micrófono si te lo pide el navegador.</p></div></section>';
  }

  function markup(){
    return `<section class="calm-pdi">
      <header><button type="button" data-action="close-projection">← VOLVER</button>
        <h2>JARDÍN DE LA CALMA</h2><span class="calm-counter"><b data-calm-count>0</b> / ${animals.length} ANIMALES</span></header>
      <div class="calm-stage-space"><figure class="calm-stage">
        <img class="calm-landscape" src="${asset}jardin.webp" alt="Jardín ilustrado con un estanque, hierba y flores">
        ${animals.map(([id,label,x,y,width,motion])=>`<div class="calm-resident calm-${id} calm-motion-${motion}" aria-hidden="true"
          style="--x:${x}%;--y:${y}%;--size:${width}%"><img class="calm-animal" src="${asset+id}.webp" alt="${label}"></div>`).join('')}
        <span class="calm-foreground calm-willow" aria-hidden="true"></span>
        <span class="calm-foreground calm-reeds" aria-hidden="true"></span>
        <div class="calm-welcome"><strong>¿QUIÉN VENDRÁ AL JARDÍN?</strong><p>HACEMOS SILENCIO PARA QUE SE ACERQUEN.</p></div>
      </figure></div>
      <footer>
        <button type="button" data-calm-mic>ACTIVAR MICRÓFONO</button>
        <div class="calm-feedback"><p data-calm-status role="status">El micrófono solo mide el volumen en esta pantalla.</p>
          <div class="calm-meter" aria-hidden="true"><span></span></div><span class="calm-wait" data-calm-wait aria-hidden="true"></span></div>
        <label class="calm-sensitivity">SENSIBILIDAD
          <select data-calm-sensitivity><option value="0">Alta</option><option value="1" selected>Media</option><option value="2">Baja</option></select>
        </label>
      </footer>
    </section>`;
  }

  function paint(session){
    const {count,icons,root,mode}=session;
    root.dataset.calmMode=mode;
    root.querySelector('[data-calm-count]').textContent=count;
    icons.forEach((icon,i)=>{
      const visible=i<count,wasVisible=icon.classList.contains('is-visible');
      if(visible===wasVisible)return;
      icon.classList.toggle('is-visible',visible);
      icon.classList.toggle('is-leaving',!visible);
      icon.setAttribute('aria-hidden',String(!visible));
    });
  }
  function status(session,text){
    const node=session.root.querySelector('[data-calm-status]');
    if(node.textContent!==text)node.textContent=text;
  }
  function resetTimers(session){
    Object.assign(session,{quiet:0,loud:0,level:0,time:null});
  }
  function release(session){
    session.token++;
    cancelAnimationFrame(session.frame);
    session.stream?.getTracks().forEach(track=>track.stop());
    session.context?.close().catch(()=>{});
    session.stream=null;
    session.context=null;
    session.analyser=null;
    session.samples=null;
    session.button.disabled=false;
    session.button.textContent='ACTIVAR MICRÓFONO';
    session.root.style.setProperty('--calm-level','0');
    session.root.querySelector('[data-calm-wait]').textContent='';
    resetTimers(session);
  }
  function pause(session,message){
    release(session);
    session.mode='paused';
    paint(session);
    status(session,message);
  }
  function close(){
    if(!current)return;
    release(current);
    current=null;
  }
  function tick(session,time){
    if(current!==session||!session.analyser)return;
    const elapsed=session.time===null?0:Math.min(.25,(time-session.time)/1000);
    session.time=time;
    session.analyser.getFloatTimeDomainData(session.samples);
    let square=0,sum=0;
    for(const sample of session.samples){
      sum+=sample;
      square+=sample*sample;
    }
    const mean=sum/session.samples.length;
    const rms=Math.sqrt(Math.max(0,square/session.samples.length-mean*mean));
    const response=rms>session.level ? .045 : .20;
    session.level+=(rms-session.level)*(1-Math.exp(-elapsed/response));
    const wait=session.root.querySelector('[data-calm-wait]');
    let message;
    if(session.calibration<calibrationSeconds){
      session.calibration+=elapsed;
      session.floor=Math.min(session.floor,Math.max(.00012,rms));
      message='AJUSTANDO EL MICRÓFONO. GUARDEMOS SILENCIO.';
    }else{
      const [minimum,multiplier,margin]=sensitivities[session.sensitivity];
      if(rms<session.floor)session.floor+=(Math.max(.00012,rms)-session.floor)*Math.min(1,elapsed*.4);
      const quietLimit=Math.max(minimum,session.floor*multiplier);
      const loudLimit=Math.max(quietLimit*1.12,session.floor+margin);
      session.root.style.setProperty('--calm-level',Math.min(1,session.level/(loudLimit*1.5)).toFixed(3));
      if(session.level<quietLimit){
        session.loud=Math.max(0,session.loud-elapsed*1.5);
        if(session.count<animals.length){
          session.quiet+=elapsed;
          if(session.quiet>=quietSeconds){
            session.quiet=0;
            session.count++;
            paint(session);
          }
        }
        message=session.count===animals.length?'¡EL JARDÍN ESTÁ LLENO DE VIDA!':'SIGAMOS EN SILENCIO. SE ACERCA UN ANIMAL.';
      }else{
        session.quiet=0;
        const noisy=session.level>=loudLimit;
        session.loud=noisy?session.loud+elapsed:Math.max(0,session.loud-elapsed);
        if(session.loud>=1.3){
          session.loud=0;
          if(session.count){
            session.count--;
            paint(session);
          }
        }
        message=noisy?'HAY RUIDO. VOLVEMOS A BAJAR LA VOZ.':'ESPERAMOS A QUE VUELVA EL SILENCIO.';
      }
    }
    const countdown=session.calibration>=calibrationSeconds&&session.count<animals.length&&session.quiet>0
      ?Math.ceil(quietSeconds-session.quiet)+' s':'';
    if(wait.textContent!==countdown)wait.textContent=countdown;
    status(session,message);
    session.frame=requestAnimationFrame(next=>tick(session,next));
  }
  function micMessage(error){
    if(error.name==='NotAllowedError'||error.name==='SecurityError')return 'Permite el micrófono en el navegador y vuelve a pulsar Activar micrófono.';
    if(error.name==='NotFoundError'||error.name==='NotReadableError')return 'No se puede usar el micrófono. Comprueba que está conectado y disponible.';
    return 'El micrófono no se ha podido activar. Puedes volver a intentarlo.';
  }
  async function start(session){
    const AudioInput=window.AudioContext||window.webkitAudioContext;
    if(!navigator.mediaDevices?.getUserMedia||!AudioInput){
      status(session,'El micrófono necesita una conexión HTTPS y un navegador compatible.');
      return;
    }
    const token=++session.token;
    session.button.disabled=true;
    status(session,'Permite el micrófono para empezar.');
    try{
      session.context=new AudioInput();
      await session.context.resume();
      if(current!==session||session.token!==token)return;
      const stream=await navigator.mediaDevices.getUserMedia({audio:{
        echoCancellation:false,noiseSuppression:false,autoGainControl:false
      },video:false});
      if(current!==session||session.token!==token){
        stream.getTracks().forEach(track=>track.stop());
        return;
      }
      session.stream=stream;
      session.analyser=session.context.createAnalyser();
      session.analyser.fftSize=2048;
      const silence=session.context.createGain();
      silence.gain.value=0;
      session.context.createMediaStreamSource(stream).connect(session.analyser);
      session.analyser.connect(silence).connect(session.context.destination);
      session.samples=new Float32Array(session.analyser.fftSize);
      for(const track of stream.getAudioTracks())track.addEventListener('ended',()=>{
        if(current===session&&session.token===token)pause(session,'Se ha desconectado el micrófono. Puedes volver a activarlo.');
      });
      resetTimers(session);
      session.calibration=0;
      session.floor=.006;
      session.mode='active';
      session.button.disabled=false;
      session.button.textContent='PAUSAR MICRÓFONO';
      paint(session);
      session.frame=requestAnimationFrame(time=>tick(session,time));
    }catch(error){
      if(current===session&&session.token===token)pause(session,micMessage(error));
    }
  }
  function mount(root){
    close();
    const stage=root.querySelector('.calm-pdi'),button=stage.querySelector('[data-calm-mic]');
    const session=current={root:stage,button,icons:[...stage.querySelectorAll('.calm-resident')],mode:'ready',count:0,sensitivity:1,token:0,frame:0};
    paint(session);
    button.addEventListener('click',()=>{
      if(session.mode==='active')pause(session,'Jardín en pausa. Activa el micrófono para continuar.');
      else void start(session);
    });
    stage.querySelector('[data-calm-sensitivity]').addEventListener('change',event=>{
      session.sensitivity=Number(event.target.value);
      resetTimers(session);
    });
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&current&&(current.context||current.button.disabled))pause(current,'Jardín en pausa. Activa el micrófono para continuar.');
  });
  window.addEventListener('pagehide',close);
  window.ROSA_CALM_GARDEN={page,markup,mount,close};
})();
