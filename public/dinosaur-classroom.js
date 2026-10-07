'use strict';
(() => {
  const ROUTE='pdi-dinosaurio-clase',VIDEO='video/dinosaurios/aula-dinosaurio.mp4';
  let active=null,lastRoute='pdi-proyectos';
  const onRoute=()=>location.hash.slice(1).split('?')[0]===ROUTE;
  function installEntries(){
    for(const area of document.querySelectorAll('.world-dinos .world-actions,.dino-banner .resource-actions')){
      if(area.querySelector('[data-dinosaur-open]'))continue;
      const link=document.createElement('a');link.className='button secondary dinosaur-entry';
      link.href='#'+ROUTE;link.dataset.dinosaurOpen='';link.textContent='UN DINOSAURIO EN NUESTRA CLASE';area.appendChild(link);
    }
  }
  function finish(restoreRoute=true){
    const session=active;if(!session)return;active=null;
    session.controller.abort();session.video.pause();session.cancelFrame();
    session.video.removeAttribute('src');session.video.load();
    if(session.ownsFullscreen&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    if(session.dialog.open)session.dialog.close();session.dialog.remove();
    session.opener?.focus?.();
    if(restoreRoute&&onRoute())location.hash=lastRoute;
  }
  function open(){
    if(active)return;
    window.ROSA_AULA?.stopVoice?.();window.speechSynthesis?.cancel();
    const dialog=document.createElement('dialog');dialog.id='dinosaur-classroom';dialog.setAttribute('aria-label','UN DINOSAURIO EN NUESTRA CLASE');
    const footprint='<svg viewBox="0 0 120 150" aria-hidden="true" focusable="false"><path d="M39 68C20 76 5 102 12 123C19 145 101 145 110 123C118 101 97 78 79 68C65 57 53 58 39 68Z"/><path d="M37 67C21 64 10 49 9 20C27 27 45 43 43 58C42 62 40 65 37 67Z"/><path d="M59 61C42 59 41 29 60 1C79 28 80 58 59 61Z"/><path d="M83 67C99 64 110 49 111 20C93 27 75 43 77 58C78 62 80 65 83 67Z"/></svg>';
    dialog.innerHTML=`<button type="button" class="dinosaur-exit">← VOLVER</button>
      <section class="dinosaur-intro" aria-labelledby="dinosaur-intro-title">
      <div class="dinosaur-cloud dinosaur-cloud-one" aria-hidden="true"></div><div class="dinosaur-cloud dinosaur-cloud-two" aria-hidden="true"></div>
      <div class="dinosaur-hills" aria-hidden="true"></div>
      <div class="dinosaur-trail" aria-hidden="true">${Array.from({length:7},(_,i)=>'<span class="dinosaur-track dinosaur-track-'+i+'" style="--step:'+i+'">'+footprint+'</span>').join('')}</div>
      <div class="dinosaur-intro-copy"><h1 id="dinosaur-intro-title"><span>INCREÍBLE</span> HA PASADO UN DINOSAURIO POR NUESTRA CLASE</h1>
      <button type="button" class="dinosaur-start" disabled><span class="dinosaur-button-print">${footprint}</span><span class="dinosaur-start-label">PULSA PARA DESCUBRIRLO</span></button>
      <p class="dinosaur-loading" role="status" hidden></p></div></section>
      <section class="dinosaur-player" hidden><div class="dinosaur-stage"><canvas class="dinosaur-background" width="288" height="512" aria-hidden="true"></canvas><div class="dinosaur-picture"><video playsinline preload="metadata" aria-label="VÍDEO DE NUESTRA CLASE"></video></div></div>
      <button type="button" class="dinosaur-immersive">OCULTAR CONTROLES</button><p class="dinosaur-status" role="status"></p>
      <nav class="dinosaur-controls" aria-label="CONTROLES DEL VÍDEO"><button type="button" class="dinosaur-play">▶ REPRODUCIR</button><button type="button" class="dinosaur-repeat">↻ REPETIR</button><button type="button" class="dinosaur-fullscreen">⛶ PANTALLA COMPLETA</button><input class="dinosaur-progress" type="range" min="0" max="100" step="0.01" value="0" aria-label="ADELANTAR O RETROCEDER EL VÍDEO"></nav></section>`;
    document.body.appendChild(dialog);
    const $=selector=>dialog.querySelector(selector),video=$('video'),controller=new AbortController(),signal=controller.signal;
    const session={dialog,video,controller,opener:document.activeElement,cancelFrame:()=>{}};active=session;
    const intro=$('.dinosaur-intro'),player=$('.dinosaur-player'),start=$('.dinosaur-start'),status=$('.dinosaur-status'),loading=$('.dinosaur-loading');
    const picture=$('.dinosaur-picture'),stage=$('.dinosaur-stage'),background=$('.dinosaur-background'),bg=background.getContext('2d'),progress=$('.dinosaur-progress');
    let raf=0,frame=0,lastPaint=0;
    session.cancelFrame=()=>{cancelAnimationFrame(raf);if(frame&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frame);frame=0;raf=0;};
    function resize(){
      const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;
      const aspect=(video.videoWidth||576)/(video.videoHeight||1024);
      const h=Math.min(rect.height,rect.width/aspect),w=h*aspect;
      picture.style.width=w+'px';picture.style.height=h+'px';
      paint();
    }
    function paint(){
      if(active!==session)return;
      progress.value=String(video.currentTime);
      if(video.readyState>=2){bg.drawImage(video,0,0,background.width,background.height);}
    }
    function tick(now){
      if(active!==session||video.paused||video.ended)return;
      if(now-lastPaint>=30){paint();lastPaint=now;}
      raf=requestAnimationFrame(tick);
    }
    function videoFrame(){
      if(active!==session)return;paint();
      if(!video.paused&&!video.ended)frame=video.requestVideoFrameCallback(videoFrame);
    }
    function schedule(){session.cancelFrame();if(video.requestVideoFrameCallback)frame=video.requestVideoFrameCallback(videoFrame);else raf=requestAnimationFrame(tick);}
    function play(){
      status.textContent='';
      // Call from the button gesture, including on iPad. Preserve original audio.
      video.play().catch(()=>{if(active===session){status.textContent='PULSA REPRODUCIR PARA CONTINUAR';$('.dinosaur-play').textContent='▶ REPRODUCIR';}});
    }
    function begin(){
      intro.hidden=true;player.hidden=false;resize();play();
    }
    $('.dinosaur-exit').addEventListener('click',()=>finish());
    dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
    dialog.addEventListener('close',()=>{if(active===session)finish();});
    start.addEventListener('click',begin);
    $('.dinosaur-play').addEventListener('click',()=>video.paused?play():video.pause());
    $('.dinosaur-repeat').addEventListener('click',()=>{video.currentTime=0;paint();play();});
    progress.addEventListener('input',()=>{video.currentTime=Number(progress.value);paint();});
    $('.dinosaur-immersive').addEventListener('click',()=>{
      const immersive=dialog.classList.toggle('is-immersive');$('.dinosaur-immersive').textContent=immersive?'MOSTRAR CONTROLES':'OCULTAR CONTROLES';resize();
    });
    $('.dinosaur-fullscreen').addEventListener('click',()=>{
      if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});session.ownsFullscreen=false;return;}
      // Browsers disallow requestFullscreen on a dialog. Fullscreen its document instead.
      const element=document.documentElement;
      const request=element.requestFullscreen?.bind(element)||element.webkitRequestFullscreen?.bind(element);
      if(request){Promise.resolve(request()).then(()=>{session.ownsFullscreen=true;}).catch(()=>{status.textContent='PUEDES OCULTAR LOS CONTROLES PARA VERLO MÁS GRANDE';});}
      else{dialog.classList.add('is-immersive');$('.dinosaur-immersive').textContent='MOSTRAR CONTROLES';status.textContent='USA MOSTRAR CONTROLES PARA VOLVER';resize();}
    });
    video.addEventListener('loadedmetadata',()=>{progress.max=String(video.duration);background.width=Math.max(1,Math.round(320*video.videoWidth/video.videoHeight));background.height=320;resize();start.disabled=false;});
    video.addEventListener('loadeddata',paint);
    video.addEventListener('play',()=>{$('.dinosaur-play').textContent='Ⅱ PAUSAR';schedule();});
    video.addEventListener('pause',()=>{$('.dinosaur-play').textContent='▶ REPRODUCIR';session.cancelFrame();paint();});
    video.addEventListener('seeking',paint);video.addEventListener('seeked',()=>{paint();if(!video.paused)schedule();});
    video.addEventListener('ended',()=>{session.cancelFrame();paint();status.textContent='¡VAMOS A VERLO OTRA VEZ!';});
    video.addEventListener('error',()=>{start.disabled=true;loading.hidden=false;loading.textContent=status.textContent='NO SE HA PODIDO ABRIR EL VÍDEO';});
    window.addEventListener('resize',resize,{signal});document.addEventListener('fullscreenchange',()=>{$('.dinosaur-fullscreen').textContent=document.fullscreenElement?'⛶ SALIR DE PANTALLA COMPLETA':'⛶ PANTALLA COMPLETA';resize();},{signal});
    const observer=new ResizeObserver(resize);observer.observe(stage);signal.addEventListener('abort',()=>observer.disconnect(),{once:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();},{signal});
    video.src=VIDEO;
    if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');

  }
  function sync(){
    if(onRoute()){if(!document.documentElement.classList.contains('rosa-login-pending'))open();}else{finish(false);lastRoute=location.hash.slice(1)||'pdi-proyectos';}
    installEntries();
  }
  function install(){
    const content=document.getElementById('contenido');if(!content)return;
    new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    new MutationObserver(installEntries).observe(content,{childList:true,subtree:true});
    window.addEventListener('hashchange',sync);sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
