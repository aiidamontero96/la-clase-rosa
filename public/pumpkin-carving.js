'use strict';

window.ROSA_PUMPKIN = (() => {
  let session=null;

  function markup(){
    return '<section class="pumpkin-carving" aria-label="Taller digital para tallar una calabaza">'+
      '<div class="pumpkin-night" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'+
      '<header><span>TALLER DE HALLOWEEN</span><h2>TALLA TU CALABAZA</h2></header>'+
      '<div class="pumpkin-stage is-lit" data-pumpkin-stage>'+
        '<span class="pumpkin-aura" aria-hidden="true"></span>'+
        '<img src="assets/pumpkin-carving/pumpkin-real.webp" width="1100" height="1100" alt="Calabaza real sin tallar">'+
        '<canvas data-pumpkin-canvas aria-label="Zona táctil para tallar la calabaza"></canvas>'+
      '</div>'+
      '<p class="pumpkin-cue">DIBUJA UNA FORMA Y UNE EL FINAL CON EL INICIO</p>'+
      '<nav class="pumpkin-tools" aria-label="Herramientas para tallar">'+
        '<button type="button" data-action="pumpkin-undo" class="pumpkin-tool" disabled>DESHACER</button>'+
        '<button type="button" data-action="pumpkin-light" class="pumpkin-tool">APAGAR LUZ</button>'+
        '<button type="button" data-action="pumpkin-reset" class="pumpkin-tool pumpkin-reset">NUEVA CALABAZA</button>'+
      '</nav>'+
      '<span class="sr-only" data-pumpkin-status role="status" aria-live="polite"></span>'+
    '</section>';
  }

  function init(projection){
    const canvas=document.querySelector('[data-pumpkin-canvas]'),stage=document.querySelector('[data-pumpkin-stage]');
    if(!canvas||!stage||typeof canvas.getContext!=='function')return;
    if(canvas.dataset.ready==='1')return;
    canvas.dataset.ready='1';
    const fresh=!session||session.projection!==projection;
    session?.observer?.disconnect?.();
    const state={projection,canvas,stage,ctx:canvas.getContext('2d'),strokes:fresh?[]:session.strokes,lit:fresh?true:session.lit,drawing:false,pointerId:null,current:null,observer:null};
    session=state;stage.classList.toggle('is-lit',state.lit);

    const point=event=>{const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height};};
    const trace=(ctx,shape,close=false)=>{if(!shape.points.length)return;ctx.beginPath();const first=shape.points[0];ctx.moveTo(first.x*canvas.width,first.y*canvas.height);for(const item of shape.points.slice(1))ctx.lineTo(item.x*canvas.width,item.y*canvas.height);if(close)ctx.closePath();};
    const pathLength=shape=>shape.points.slice(1).reduce((total,item,index)=>{const previous=shape.points[index];return total+Math.hypot(item.x-previous.x,item.y-previous.y);},0);
    const segmentHit=(a,b,c,d)=>{const denominator=(b.x-a.x)*(d.y-c.y)-(b.y-a.y)*(d.x-c.x);if(Math.abs(denominator)<.000001)return null;const t=((c.x-a.x)*(d.y-c.y)-(c.y-a.y)*(d.x-c.x))/denominator,u=((c.x-a.x)*(b.y-a.y)-(c.y-a.y)*(b.x-a.x))/denominator;return t>.03&&t<.97&&u>.03&&u<.97?{x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)}:null;};
    const intersectedLoop=shape=>{
      const points=shape.points;if(points.length<9||pathLength(shape)<.12)return null;const end=points.at(-1),previous=points.at(-2);
      for(let index=0;index<points.length-6;index++){const hit=segmentHit(points[index],points[index+1],previous,end);if(hit)return [hit,...points.slice(index+1,-1),end,hit];}
      return null;
    };
    const nearbyLoop=shape=>{
      const points=shape.points;if(points.length<7||pathLength(shape)<.1)return null;const end=points.at(-1);let nearest=-1,distance=.1;
      for(let index=0;index<points.length-6;index++){const current=Math.hypot(end.x-points[index].x,end.y-points[index].y);if(current<distance){distance=current;nearest=index;}}
      return nearest>=0?[points[nearest],...points.slice(nearest+1),points[nearest]]:null;
    };
    const render=()=>{
      const ctx=state.ctx;if(!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);
      const scale=canvas.width/1100;
      for(const shape of state.strokes){
        if(shape.closed){
          ctx.save();trace(ctx,shape,true);const glow=ctx.createRadialGradient(canvas.width*.5,canvas.height*.49,0,canvas.width*.5,canvas.height*.49,canvas.width*.44);glow.addColorStop(0,state.lit?'#fffef0':'#56230f');glow.addColorStop(.5,state.lit?'#ffed78':'#3d170c');glow.addColorStop(1,state.lit?'#ffb51f':'#271007');ctx.fillStyle=glow;ctx.fill();ctx.strokeStyle='#4a1a09';ctx.lineWidth=10*scale;ctx.lineJoin='round';ctx.stroke();ctx.strokeStyle=state.lit?'#e99817':'#1e0c07';ctx.lineWidth=2.5*scale;ctx.stroke();ctx.restore();
        }else{
          ctx.save();trace(ctx,shape);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#54210e';ctx.lineWidth=7*scale;ctx.stroke();ctx.strokeStyle='#d87822';ctx.lineWidth=2.2*scale;ctx.stroke();ctx.restore();
        }
        if(shape===state.current&&!shape.closed&&shape.points.length>3){const first=shape.points[0],ready=Boolean(nearbyLoop(shape));ctx.save();ctx.beginPath();ctx.arc(first.x*canvas.width,first.y*canvas.height,ready?13*scale:9*scale,0,Math.PI*2);ctx.fillStyle=ready?'#fff8b8':'#f09b2f';ctx.shadowColor=ready?'#ffd52f':'transparent';ctx.shadowBlur=ready?24*scale:0;ctx.fill();ctx.restore();}
      }
      ctx.save();ctx.globalCompositeOperation='destination-in';const image=stage.querySelector('img');if(image?.complete)ctx.drawImage(image,0,0,canvas.width,canvas.height);ctx.restore();
      stage.classList.toggle('has-carving',state.strokes.some(shape=>shape.closed));
      const undo=document.querySelector('[data-action="pumpkin-undo"]');if(undo)undo.disabled=!state.strokes.length;
    };
    const resize=()=>{const rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));if(canvas.width===w&&canvas.height===h)return;canvas.width=w;canvas.height=h;render();};
    state.render=render;state.resize=resize;
    const image=stage.querySelector('img');if(image&&!image.complete)image.addEventListener('load',()=>{resize();render();},{once:true});
    resize();
    if(typeof ResizeObserver==='function'){state.observer=new ResizeObserver(resize);state.observer.observe(stage);}
    canvas.addEventListener('pointerdown',event=>{if(event.button!==undefined&&event.button!==0)return;event.preventDefault();canvas.setPointerCapture?.(event.pointerId);state.drawing=true;state.pointerId=event.pointerId;state.current={closed:false,points:[point(event)]};state.strokes.push(state.current);render();});
    canvas.addEventListener('pointermove',event=>{if(!state.drawing||event.pointerId!==state.pointerId||state.current.closed)return;event.preventDefault();const next=point(event),last=state.current.points.at(-1);if(Math.hypot(next.x-last.x,next.y-last.y)<.0012)return;state.current.points.push(next);const loop=intersectedLoop(state.current);if(loop){state.current.points=loop;state.current.closed=true;stage.classList.add('just-carved');window.setTimeout(()=>stage.classList.remove('just-carved'),520);announce('FORMA TALLADA E ILUMINADA');}render();});
    const stop=event=>{if(!state.drawing||event.pointerId!==state.pointerId)return;const shape=state.current;if(!shape.closed){const loop=intersectedLoop(shape)||nearbyLoop(shape);if(loop){shape.points=loop;shape.closed=true;announce('FORMA TALLADA E ILUMINADA');}else announce('CRUZA O UNE LA LÍNEA PARA ABRIR EL HUECO');}state.drawing=false;state.pointerId=null;state.current=null;render();};
    canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
  }

  function announce(text){const status=document.querySelector('[data-pumpkin-status]');if(status)status.textContent=text;}
  function handle(action,value,target){
    if(!action.startsWith('pumpkin-'))return false;
    if(!session)return true;
    if(action==='pumpkin-undo'){
      session.strokes.pop();session.render();announce('ÚLTIMO CORTE DESHECHO');
    }else if(action==='pumpkin-reset'){
      session.strokes.length=0;session.render();announce('CALABAZA NUEVA');
    }else if(action==='pumpkin-light'){
      session.lit=!session.lit;session.stage.classList.toggle('is-lit',session.lit);target.textContent=session.lit?'APAGAR LUZ':'ENCENDER LUZ';session.render();announce(session.lit?'LUZ ENCENDIDA':'LUZ APAGADA');
    }
    return true;
  }

  return Object.freeze({markup,init,handle});
})();
