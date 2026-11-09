const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const publicDir=path.join(__dirname,'../public'),source=fs.readFileSync(path.join(publicDir,'dino-route.js'),'utf8');
const context={window:{}};vm.runInNewContext(source,context);const route=context.window.ROSA_DINO_ROUTE;
const used=new Map(),words=new Set(),drawings=new Set();let photos=0,paintPages=0;
assert.equal(route.count,10);assert.equal((route.hub().match(/data-action="dino-route-open"/g)||[]).length,10);
assert.equal((route.hub().match(/<img/g)||[]).length,10);
for(let round=0;round<10;round++){
 const p={round};
 for(let page=0;page<12;page++){
  assert(route.update(p,'page',page));let html=route.project(p);
  assert(!/undefined|NaN/.test(html));assert(html.includes('PÁGINA '+(page+1)+' DE 12'));
  assert.equal((html.match(/data-action="close-projection"/g)||[]).length,1);
  for(const m of html.matchAll(/(?:src|href)="(assets\/[^"?]+)/g))assert(fs.existsSync(path.join(publicDir,m[1])),m[1]);
  if(page<11)assert(html.includes('data-value="'+(page+1)+'" >SIGUIENTE'));else assert(html.includes('disabled>FIN DEL CUADERNO'));
  if(page===0)assert(html.includes('disabled>← ANTERIOR'));
  if(page>=1&&page<=7){
   const files=new Set([...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map(x=>x[1]));
   for(const file of files){const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(publicDir,file))).digest('hex');assert(!used.has(hash),`Imagen repetida: ${file}; ya estaba en ${used.get(hash)}`);used.set(hash,`${round+1}/${page+1}`);photos++;}
   assert(!html.includes('route-notebook/fossil.jpg'),'La foto señalada no vuelve a usarse como comodín');
  }
  if(page===6){
   drawings.add(html.match(/<h3>(.*?)<\/h3>/)[1]);
   if(html.includes('data-action="dino-route-paint-target"')){
    paintPages++;const n=(html.match(/data-action="dino-route-paint-target"/g)||[]).length;assert.equal(n,round===0?4:round===6?3:1);
    assert(route.update(p,'paint-color',1));assert(!route.update(p,'paint-color',9));assert(!route.update(p,'paint-target',n));
    if(round===0){assert(route.update(p,'paint-target',1));assert.equal(Object.keys(p.routeSession.painted).length,0);}
    assert(route.update(p,'paint-target',0));assert.equal(p.routeSession.painted[0],'#356ea4');
    if(round===6){assert(route.update(p,'paint-target',1));assert.equal(Object.keys(p.routeSession.painted).length,2);assert(route.project(p).includes('¡HAS PINTADO DOS ICTIOSAURIOS!'));assert(route.update(p,'paint-target',2));assert.equal(Object.keys(p.routeSession.painted).length,2);}
    if(round===0){assert(route.update(p,'paint-target',2));assert.equal(Object.keys(p.routeSession.painted).length,2);assert(route.project(p).includes('¡LOS DOS T. REX ESTÁN PINTADOS!'));}
    const before=Object.keys(p.routeSession.painted).length;route.update(p,'paint-undo');assert.equal(Object.keys(p.routeSession.painted).length,before-1);
    route.update(p,'paint-reset');assert.equal(Object.keys(p.routeSession.painted).length,0);
   }else assert(html.includes('data-nb-draw'));
  }
  if(page===7){assert(!html.includes('nb-choice-icon'));assert(!html.includes('HACEMOS UN GESTO'));assert.equal((html.match(/<article>/g)||[]).length,2);assert(html.includes('DESCUBRIMOS PALABRAS NUEVAS'));}
  if(page===8)words.add(html.match(/data-word="([^"]+)"/)[1]);
  if(page===9||page===10){
   assert(html.includes('nb-summary-reader'));assert(html.includes(`resumen-${round+1}-${page-8}.webp`));assert(!html.includes('AMPLIAR RESUMEN'));
   const pdf=`assets/route-notebook-v5/semana-${round+1}.pdf`;assert(html.includes(pdf));assert.equal(fs.readFileSync(path.join(publicDir,pdf)).subarray(0,4).toString(),'%PDF');
   route.update(p,'page',page+1);assert(route.project(p).includes(page===9?`resumen-${round+1}-2.webp`:'GUÍA DE LA SEÑO'));route.update(p,'page',page);
  }
  if(page===11)assert(html.includes('GUÍA DE LA SEÑO'));
  if(page===4||page===5){
   const n=(html.match(/data-action="dino-route-answer"/g)||[]).length;assert(n>=2&&n<=3);assert(!route.update(p,'answer',-1));assert(!route.update(p,'answer',n));let correct=0,retry=0;
   for(let c=0;c<n;c++){assert(route.update(p,'answer',c));const h=route.project(p);correct+=Number(h.includes('class="is-correct"'));retry+=Number(h.includes('class="is-retry"'));}assert.equal(correct,1);assert.equal(retry,n-1);
   route.update(p,'page',8);route.update(p,'page',page);assert.equal(p.routeSession.answers[page],n-1);
  }
  if(round===1&&page>=1&&page<=3)assert(html.includes('data-value="'+['triassic','jurassic','cretaceous'][page-1]+'">EXPLORAR'));
 }
 assert(!route.update(p,'page',-1));assert(!route.update(p,'page',12));assert(!route.update(p,'page',NaN));
 route.update(p,'index');assert(route.project(p).includes('ELIGE UNA PÁGINA'));route.update(p,'page',6);assert(!route.project(p).includes('ELIGE UNA PÁGINA'));
 const reopened={round};assert(route.project(reopened).includes('PÁGINA 7 DE 12'));assert.equal(reopened.routeSession,p.routeSession);
}
assert.equal(words.size,10);assert.equal(drawings.size,10);assert.equal(paintPages,3);
console.log(`PASS: 120 páginas, ${photos} imágenes de actividad sin duplicados, 10 PDF de dos páginas, 20 retos, pintura selectiva/restauración, 10 dibujos y palabras, navegación y etapas.`);
