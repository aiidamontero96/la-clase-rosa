'use strict';
window.ROSA_EPISODE=(()=>{
  const config=window.ROSA_EPISODES;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const regions={head:[37,20,604,615],body:[679,102,560,555],left:[81,763,205,337],right:[402,760,210,341],eyes:[727,669,401,202],blink:[723,880,404,162]};
  const part=(name,cls)=>'<svg class="'+cls+'" viewBox="'+regions[name].join(' ')+'" aria-hidden="true" focusable="false"><image href="'+esc(config.mascot.atlas)+'" width="1254" height="1254"/></svg>';
  function puppet(){return '<div class="rosi-puppet" aria-hidden="true"><div class="rosi-shadow"></div><div class="rosi-body-rig">'+part('body','rosi-body')+part('left','rosi-arm rosi-arm-front')+'<div class="rosi-head">'+part('head','rosi-head-art')+'<div class="rosi-eyes">'+part('eyes','rosi-eyes-open')+part('blink','rosi-eyes-blink')+'</div></div></div></div>';}
  const button=(text,action,cls='',attrs='')=>'<button type="button" class="'+cls+'" data-action="episode-'+action+'" '+attrs+'>'+text+'</button>';
  function page(){const e=config.episodes[0];return '<section class="rosi-intro"><div class="rosi-cover">'+puppet()+'<span class="rosi-cover-label">¡Hola, pequeños paleontólogos!</span></div><div class="rosi-intro-copy"><span class="eyebrow">LAS AVENTURAS DE '+esc(config.mascot.name.toUpperCase())+' · SEMANA '+e.week+'</span><h2>'+esc(e.title)+'</h2><p>Una pista, dos ayudantes y una misión para toda la clase. Acompañad a '+esc(config.mascot.name)+' al valle de los dinosaurios.</p><p class="rosi-helper-line"><span>Hoy nos ayudan</span><strong>'+e.helpers.map(esc).join(' y ')+'</strong></p>'+button('▶ Ver capítulo','open','', 'data-value="'+esc(e.id)+'"')+'<p class="hint">Un minuto de aventura. Después, seis retos de la semana 1.</p></div></section>';}
  let dialog,voice,music,stage,caption,progress,clock,playButton,musicButton,subtitlesButton,fullscreenButton,status,finish;
  let episode,media,raf=0,opened=false,playing=false,complete=false,sceneIndex=-1,epoch=0,returnFocus;
  let subtitles=true,musicOn=true;
  try{subtitles=localStorage.getItem('rosa-episode-subtitles')!=='off';musicOn=localStorage.getItem('rosa-episode-music')!=='off';}catch{}
  const q=s=>dialog.querySelector(s);
  const save=(key,on)=>{try{localStorage.setItem(key,on?'on':'off');}catch{}};
  function make(){
    if(dialog)return;
    dialog=document.createElement('dialog');dialog.id='rosi-dialog';dialog.className='rosi-dialog';dialog.setAttribute('aria-labelledby','rosi-title');
    dialog.innerHTML='<div class="rosi-player"><header class="rosi-player-header"><div><span class="rosi-kicker">LAS AVENTURAS DE '+esc(config.mascot.name.toUpperCase())+'</span><h2 id="rosi-title"></h2></div>'+button('✕ <span>Cerrar</span>','close','rosi-close secondary','aria-label="Cerrar el capítulo"')+'</header><div class="rosi-stage" data-expression="happy" data-gesture="wave"><img class="rosi-landscape" src="'+esc(config.mascot.background)+'" alt="Un valle prehistórico con helechos, un lago y huevos de dinosaurio"><div class="rosi-sunlight"></div><div class="rosi-motes" aria-hidden="true">'+Array.from({length:7},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><div class="rosi-leaves" aria-hidden="true">'+[0,1,2].map(i=>'<img src="assets/symbols/1f33f.png" alt="" style="--i:'+i+'">').join('')+'</div>'+puppet()+'<div class="rosi-props" aria-live="off"></div><div class="rosi-start">'+button('▶ <span>¡Vamos de aventura!</span>','play','rosi-start-button')+'</div><div class="rosi-finish" hidden><span class="rosi-finish-star" aria-hidden="true">✦</span><h3>¡Misión preparada!</h3><p>Seis retos de pistas, observación y memoria.</p>'+button('Empezar misión →','mission')+'</div><div class="rosi-caption" aria-live="off"></div></div><div class="rosi-controls"><div class="rosi-progress"><progress max="1" value="0" aria-label="Progreso del capítulo"></progress><span class="rosi-clock">0:00 / 0:00</span></div><div class="rosi-control-buttons">'+button('▶ Reproducir','play','rosi-play')+button('↻ <span>Reiniciar</span>','restart','secondary')+button('CC <span>Subtítulos</span>','subtitles','secondary','aria-pressed="true"')+button('♫ <span>Música</span>','music','secondary','aria-pressed="true"')+button('⛶ <span>Pantalla completa</span>','fullscreen','secondary')+'</div><p class="rosi-status" role="status"></p></div><details class="rosi-transcript"><summary>Leer el capítulo</summary><div></div></details><audio id="rosi-voice" preload="metadata"></audio><audio id="rosi-music" preload="none" loop src="audio/rosi-valle.mp3"></audio></div>';
    document.body.append(dialog);
    voice=q('#rosi-voice');music=q('#rosi-music');stage=q('.rosi-stage');caption=q('.rosi-caption');progress=q('progress');clock=q('.rosi-clock');playButton=q('.rosi-play');musicButton=q('[data-action="episode-music"]');subtitlesButton=q('[data-action="episode-subtitles"]');fullscreenButton=q('[data-action="episode-fullscreen"]');status=q('.rosi-status');finish=q('.rosi-finish');
    window.ROSA_VOICE.configureAudio(voice);music.volume=.12;
    voice.addEventListener('playing',()=>{if(!opened||voice.paused)return;playing=true;stage.classList.add('is-playing');playButton.textContent='Ⅱ Pausar';status.textContent='';syncMusic();tick();});
    voice.addEventListener('pause',freeze);
    voice.addEventListener('waiting',()=>{freeze();if(opened&&!voice.paused)status.textContent='Preparando la voz…';});
    voice.addEventListener('ended',()=>{if(!opened)return;complete=true;freeze();finish.hidden=false;stage.classList.add('is-complete');caption.hidden=true;playButton.textContent='▶ Volver a ver';updateFrame();status.textContent='Ya podéis empezar la misión.';});
    voice.addEventListener('error',()=>{if(opened)audioError();});
    voice.addEventListener('loadedmetadata',()=>{if(opened)updateFrame();});
    dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
    dialog.addEventListener('close',cleanup);
    document.addEventListener('fullscreenchange',updateFullscreen);
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&opened)pause();});
    window.addEventListener('pagehide',()=>{if(opened)pause();});
    window.addEventListener('hashchange',()=>{if(opened)close();});
    dialog.addEventListener('keydown',event=>{if(event.key===' '&&event.target===dialog){event.preventDefault();playing?pause():play();}});
  }
  function prop(scene){
    const names=episode.helpers.map((name,i)=>'<span class="rosi-helper'+(scene.spotlight===i?' is-helper':'')+'"><span aria-hidden="true">✦</span>'+esc(name)+'</span>').join('');
    if(scene.prop==='helpers')return '<div class="rosi-note"><span class="rosi-note-eyebrow">NUESTROS AYUDANTES</span><h3>¡Equipo de exploración!</h3><div class="rosi-helper-names">'+names+'</div></div>';
    if(scene.prop==='tracks')return '<div class="rosi-note"><span class="rosi-note-eyebrow">LA PRIMERA PISTA</span><div class="rosi-track-row" aria-hidden="true">🐾 &nbsp; 🐾 &nbsp; 🐾</div><h3>¿Quién habrá pasado por aquí?</h3></div>';
    if(['dinosaurs','hidden'].includes(scene.prop))return '<div class="rosi-note"><span class="rosi-note-eyebrow">MIRAMOS CON ATENCIÓN</span><h3>'+(scene.prop==='hidden'?'¿Quién se ha escondido?':'¡Cada uno es diferente!')+'</h3><div class="rosi-dino-clues">'+['triceratops','stegosaurus','trex','ankylosaurus'].map((id,i)=>'<div>'+(scene.prop==='hidden'&&[1,3].includes(i)?'<span class="rosi-question">?</span>':'<img src="assets/dinos-pdi/'+id+'.webp" alt="'+['Triceratops','Estegosaurio','Tiranosaurio','Anquilosaurio'][i]+'">')+'</div>').join('')+'</div>';
    if(scene.prop==='ready')return '<div class="rosi-note"><span class="rosi-note-eyebrow">TODO EL EQUIPO</span><span class="rosi-big-star" aria-hidden="true">✦</span><h3>¡Juntos lo descubriremos!</h3></div>';
    return '<div class="rosi-note rosi-welcome"><span class="rosi-note-eyebrow">SEMANA '+episode.week+'</span><h3>'+esc(episode.title)+'</h3><p>Una aventura con '+esc(config.mascot.name)+'</p></div>';
  }
  function open(id){
    episode=config.episodes.find(e=>e.id===id)||config.episodes[0];media=window.ROSA_EPISODE_MEDIA[episode.id];
    make();if(opened)pause();window.ROSA_AULA.stopVoice();returnFocus=document.activeElement;opened=true;epoch++;complete=false;sceneIndex=-1;
    voice.src=media.audio+'?v='+media.scriptHash.slice(0,12);window.ROSA_VOICE.configureAudio(voice);music.currentTime=0;q('#rosi-title').textContent=episode.title;
    q('.rosi-transcript div').innerHTML=media.cues.map(c=>'<p>'+esc(c.text)+'</p>').join('');q('.rosi-transcript').open=false;
    q('.rosi-start').hidden=false;finish.hidden=true;stage.classList.remove('is-complete');status.textContent='';playButton.textContent='▶ Reproducir';
    syncPreferences();updateFrame();dialog.showModal();dialog.scrollTop=0;
  }
  function freeze(){playing=false;cancelAnimationFrame(raf);raf=0;stage.classList.remove('is-playing');stage.style.setProperty('--mouth','0');music.pause();if(!complete)playButton.textContent='▶ Continuar';}
  function pause(){epoch++;voice.pause();freeze();}
  async function play(){
    if(!opened)return;
    if(voice.error)voice.load();
    if(complete){voice.currentTime=0;music.currentTime=0;complete=false;sceneIndex=-1;finish.hidden=true;stage.classList.remove('is-complete');syncPreferences();updateFrame();}
    q('.rosi-start').hidden=true;status.textContent='Preparando la voz…';const attempt=++epoch;
    try{await voice.play();if(!opened||attempt!==epoch)return;status.textContent='';}catch{if(opened&&attempt===epoch)audioError();}
  }
  function audioError(){voice.pause();freeze();status.textContent='No se ha podido cargar la voz. Comprueba la conexión y pulsa Reintentar.';playButton.textContent='▶ Reintentar';}
  function restart(){pause();voice.currentTime=0;music.currentTime=0;complete=false;sceneIndex=-1;finish.hidden=true;stage.classList.remove('is-complete');syncPreferences();updateFrame();play();}
  function syncMusic(){if(!opened||!playing||!musicOn){music.pause();return;}if(music.error)music.load();const attempt=epoch;music.play().then(()=>{if(!opened||!playing||!musicOn||attempt!==epoch)music.pause();}).catch(()=>{});}
  function syncPreferences(){caption.hidden=!subtitles||complete;subtitlesButton.setAttribute('aria-pressed',String(subtitles));musicButton.setAttribute('aria-pressed',String(musicOn));musicButton.innerHTML=(musicOn?'♫':'♪')+' <span>Música'+(musicOn?'':' apagada')+'</span>';}
  const time=value=>{const seconds=Math.floor(Math.max(0,value)/window.ROSA_VOICE.playbackRate);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');};
  function updateFrame(){
    const now=voice.currentTime||0;let index=media.cues.findIndex(c=>now<c.end);if(index<0)index=media.cues.length-1;
    if(index!==sceneIndex){sceneIndex=index;const cue=media.cues[index];caption.textContent=cue.text;stage.dataset.expression=cue.expression;stage.dataset.gesture=cue.gesture;q('.rosi-props').innerHTML=prop(cue);}
    progress.max=media.duration;progress.value=complete?media.duration:now;clock.textContent=time(now)+' / '+time(media.duration);
    const mouth=playing?(media.envelope[Math.floor(now/media.envelopeStep)]||0)/100:0;stage.style.setProperty('--mouth',String(mouth));
  }
  function tick(){cancelAnimationFrame(raf);updateFrame();if(playing&&opened)raf=requestAnimationFrame(tick);}
  function cleanup(){if(!opened)return;opened=false;epoch++;voice.pause();freeze();voice.removeAttribute('src');voice.load();music.currentTime=0;dialog.classList.remove('rosi-expanded');if(document.fullscreenElement===dialog)document.exitFullscreen().catch(()=>{});updateFullscreen();if(returnFocus?.isConnected)returnFocus.focus();}
  function close(){if(!dialog)return;cleanup();dialog.close();}
  function updateFullscreen(){if(!fullscreenButton)return;const full=document.fullscreenElement===dialog||dialog.classList.contains('rosi-expanded');fullscreenButton.innerHTML='⛶ <span>'+(full?'Salir de pantalla completa':'Pantalla completa')+'</span>';fullscreenButton.setAttribute('aria-pressed',String(full));}
  async function fullscreen(){
    if(document.fullscreenElement===dialog){await document.exitFullscreen().catch(()=>{});}
    else if(dialog.classList.contains('rosi-expanded'))dialog.classList.remove('rosi-expanded');
    else if(dialog.requestFullscreen){try{await dialog.requestFullscreen();}catch{if(opened)dialog.classList.add('rosi-expanded');}}
    else dialog.classList.add('rosi-expanded');
    updateFullscreen();
  }
  function handle(action,value){
    if(!action?.startsWith('episode-'))return false;
    if(action==='episode-open')open(value);
    else if(!opened)return true;
    else if(action==='episode-close')close();
    else if(action==='episode-play')playing?pause():play();
    else if(action==='episode-restart')restart();
    else if(action==='episode-subtitles'){subtitles=!subtitles;save('rosa-episode-subtitles',subtitles);syncPreferences();}
    else if(action==='episode-music'){musicOn=!musicOn;save('rosa-episode-music',musicOn);syncPreferences();syncMusic();}
    else if(action==='episode-fullscreen')fullscreen();
    else if(action==='episode-mission'&&complete){const week=episode.week;close();window.ROSA_MISSIONS.start(week);}
    return true;
  }
  return {page,handle};
})();
