// Regresiones del diagnóstico: redirección canónica, lentitud y fallos reales.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(new URL('../public/diagnostico-red.html','file://'+__filename),'utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('})();','window.test={inspect,run,sameSite};})();');
function setup(origin='https://laclaserosa.es',reply={}){
 let now=0,id=0;const timers=new Map(),nodes=new Map(),requests=[];
 const node=()=>({textContent:'',disabled:false,children:[],events:{},addEventListener(k,f){this.events[k]=f;},appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
 const context={window:{},location:new URL(origin+'/diagnostico-red.html'),URL,AbortController,TextDecoder,Uint8Array,Date,
  document:{getElementById:get,createElement:node},performance:{now:()=>now},
  setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id),
  fetch:async(url,options)=>{requests.push({url,options});now+=reply.delay||0;
   if(reply.stall)return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Object.assign(new Error(),{name:'AbortError'}))));
   return {ok:reply.ok!==false,status:503,url:reply.url||url,headers:{get:()=>reply.type||'application/javascript'},
    text:async()=>reply.text||(new URL(url).pathname.endsWith('.woff')?'wOFF':new URL(url).pathname.endsWith('/')?'<main id="contenido"></main><script src="app.js?rev=1"></script><link href="styles.css?rev=1" rel="stylesheet">':'const healthy=true;'),json:async()=>({site:'la-clase-rosa',networkPatch:1})};
  }};
 vm.runInNewContext(code,context);return {...context.window.test,timers,nodes,requests,get};
}
(async()=>{
 const slow=setup(undefined,{delay:8500});const result=await slow.inspect('app.js','js');
 assert(result.ok);assert.match(result.detail,/respuesta lenta/);assert.equal(slow.requests[0].url,'https://www.laclaserosa.es/app.js');assert.equal(slow.requests[0].options.credentials,'omit');assert.equal(slow.timers.size,0);
 assert(slow.sameSite(new URL('https://laclaserosa.es/app.js')));assert(!slow.sameSite(new URL('https://unrelated.example/app.js')));assert(!slow.sameSite(new URL('http://www.laclaserosa.es/app.js')));
 const local=setup('http://localhost:5173');assert((await local.inspect('app.js','js')).ok);assert.equal(local.requests[0].url,'http://localhost:5173/app.js');assert(!local.sameSite(new URL('https://www.laclaserosa.es/')));
 assert(!(await setup(undefined,{url:'https://unrelated.example/'}).inspect('app.js','js')).ok);
 assert.match((await setup(undefined,{ok:false}).inspect('app.js','js')).detail,/HTTP 503/);
 assert.match((await setup(undefined,{text:'<html>Blocked</html>',type:'text/html'}).inspect('app.js','js')).detail,/Llegó HTML/);
 const stalled=setup(undefined,{stall:true}),pending=stalled.inspect('app.js','js');const timer=[...stalled.timers.values()][0];assert.equal(timer.ms,20000);timer.fn();assert.match((await pending).detail,/Sin respuesta en 20 s/);assert.equal(stalled.timers.size,0);
 const complete=setup();await complete.run();assert.match(complete.get('status').textContent,/6 de 6 comprobados; 0 con incidencias/);assert.equal(complete.timers.size,0);
 const stopped=setup(undefined,{stall:true}),run=stopped.run();assert([...stopped.timers.values()].some(t=>t.ms===180000));stopped.get('stop').events.click();await run;assert.match(stopped.get('status').textContent,/Prueba detenida/);assert.equal(stopped.requests.length,1);assert.equal(stopped.get('run').disabled,false);assert.equal(stopped.get('download').disabled,false);assert.equal(stopped.timers.size,0);
 console.log('PASS diagnóstico: dominio canónico, respuesta lenta, entorno local, destinos ajenos, HTTP/HTML, timeout y parada.');
})().catch(error=>{console.error(error);process.exitCode=1;});
