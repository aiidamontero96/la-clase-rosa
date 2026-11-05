const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('public/fichas-library.js','utf8');

function boot(){
  const written=[],notices=[];
  const window={
    toast:message=>notices.push(message),
    open:()=>({document:{open(){},write:html=>written.push(html),close(){}}})
  };
  const ctx={window};
  Object.defineProperty(ctx,'localStorage',{get(){throw Error('Worksheet flows should not access local storage');}});
  vm.runInNewContext(source,ctx);
  return {ctx,window,api:window.ROSA_FICHAS,written,notices};
}

test('Fichas offers a preview slot for every example without a local collection',()=>{
  const html=boot().api.page();
  const links=[...html.matchAll(/href="fichas-ejemplo\/([^"]+)\.html"/g)].map(match=>match[1]);
  assert.equal(new Set(links).size,16);
  assert.equal((html.match(/data-example-preview/g)||[]).length,16);
  assert.doesNotMatch(html,/Mis fichas|TU COLECCIÓN/);
});

test('series printing opens both A4 pages without saving',()=>{
  const a=boot();
  Object.assign(a.ctx,{URL,location:{href:'https://www.laclaserosa.es/#fichas-series'},savedInk:'color',E:String,btn:()=>'',shape:()=>''});
  const app=fs.readFileSync('public/app.js','utf8');
  const segment=app.slice(app.indexOf('const patternState='),app.indexOf("document.addEventListener('toggle'"));
  vm.runInNewContext(segment,a.ctx);
  vm.runInNewContext("patternState.pattern='ABC';patternState.count=4;printPattern();",a.ctx);
  assert.match(a.written[0],/Patrón ABC/);
  assert.match(a.written[0],/Piezas para nuestras series/);
  assert.match(a.written[0],/Serie 4/);
  assert.doesNotMatch(a.written[0],/Serie 5/);
});

test('blocked print popup gives recovery message',()=>{
  const a=boot();
  a.window.open=()=>null;
  assert.equal(a.api.openHTML('sheet'),false);
  assert.match(a.notices[0],/Permite abrir/);
});
