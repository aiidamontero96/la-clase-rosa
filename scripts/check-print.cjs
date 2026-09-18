const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('public/print-actions.js','utf8');
const app=fs.readFileSync('public/app.js','utf8');
const index=fs.readFileSync('public/index.html','utf8');
const legacy=fs.readFileSync('public/print.html','utf8');

assert.match(index,/print-actions\.js\?rev=3/);assert.doesNotMatch(index,/print-actions\.css/);
assert.doesNotMatch(app,/printable-download|Descarga iniciada|Preparando la impresión/);
assert.match(app,/btn\('Imprimir','printable-print'/);assert.match(app,/btn\('Compartir','printable-share'/);
assert.doesNotMatch(legacy,/Abrir o descargar PDF|Guardar o compartir PDF|print-pages/);

function makeLink(clicks){return {hidden:false,remove(){},click(){clicks.push({href:this.href,download:this.download});}};}

(async()=>{
  const clicks=[],shared=[];
  const document={body:{append(){}},createElement:tag=>{assert.equal(tag,'a');return makeLink(clicks);}};
  class TestFile extends Blob{constructor(parts,name,options){super(parts,options);this.name=name;}}
  class TestURL extends URL{static createObjectURL(){return `blob:${++objectUrl}`;}static revokeObjectURL(){}}
  let objectUrl=0;
  const navigator={canShare:()=>true,share:async payload=>{shared.push(payload);}};
  let popupHTML='';const popup={document:{open(){popupHTML='';},write(html){popupHTML+=html;},close(){}},focus(){},close(){}};
  const fetch=async url=>url==='materials.json'?{ok:true,json:async()=>({rutinas:{pages:2},'curso-andalucia-28f':{pages:1,coloring:'pdf/curso-andalucia-28f-colorear.pdf'}})}:{ok:true,blob:async()=>new Blob(['pdf'],{type:'application/pdf'})};
  const context={Blob,File:TestFile,document,navigator,fetch,URL:TestURL,location:{href:'https://example.test/index.html#imprimibles'},setTimeout:fn=>{fn();return 1;},window:{open:()=>popup}};
  vm.runInNewContext(source,context);
  const api=context.window.ROSA_PRINT;
  assert.deepEqual(Object.keys(api),['share','print']);
  assert.equal(await api.share({id:'rutinas',title:'Nuestra asamblea',ink:'bn'}),'shared');
  assert.equal(shared.length,1);assert.equal(shared[0].files[0].name,'rutinas-bn.pdf');assert.equal(clicks.length,0);
  navigator.canShare=()=>false;
  assert.equal(await api.share({id:'rutinas',ink:'color'}),'downloaded');
  assert.equal(clicks.at(-1).download,'rutinas.pdf');
  assert.equal(await api.print({id:'curso-andalucia-28f',title:'Bandera',ink:'coloring'}),'printing');
  assert(popupHTML.includes('curso-andalucia-28f-colorear-1.jpg'));assert(popupHTML.includes('window.print()'));assert(popupHTML.includes('Volver a la app'));
  console.log(JSON.stringify({printableActions:['share','print'],fileShare:'passed',downloadFallback:'passed',htmlPrint:'passed'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
