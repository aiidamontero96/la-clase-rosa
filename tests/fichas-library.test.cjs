const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('public/fichas-library.js','utf8');
function boot(storage=new Map(),blocked=false){
 const notices=[],events=[],written=[];let count=0;
 const window={toast:s=>notices.push(s),dispatchEvent:e=>events.push(e.type),addEventListener(){},open:()=>({document:{open(){},write:s=>written.push(s),close(){}}})};
 const ctx={window,location:{hash:'#imprimibles'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>{if(blocked)throw Error('quota');storage.set(k,v);}},crypto:{randomUUID:()=>String(++count)},CustomEvent:class{constructor(type){this.type=type;}}};
 vm.runInNewContext(source,ctx);return {api:window.ROSA_FICHAS,notices,events,written,storage,window,ctx};
}
test('both generators persist the exact printable through a new session',()=>{
 const a=boot();
 const series=a.api.save({title:'Series AB',kind:'series',html:'<!doctype html><p>● ▲ ●</p>'});
 const custom=a.api.save({title:'Número 3',kind:'studio',html:'<!doctype html><p>3</p>'});
 const b=boot(a.storage);assert.match(b.api.gallery(),/2 fichas/);assert.match(b.api.gallery(),/Series AB/);assert.match(b.api.gallery(),/Número 3/);
 b.api.handle('saved-sheet-open',series.id);b.api.handle('saved-sheet-open',custom.id);
 assert.deepEqual(b.written,['<!doctype html><p>● ▲ ●</p>','<!doctype html><p>3</p>']);
});
test('repeated print does not duplicate a sheet; a changed version is retained separately',()=>{
 const a=boot();const entry={title:'Series',kind:'series',html:'version-one'};
 a.api.save(entry);a.api.save(entry);a.api.save({...entry,html:'version-two'});
 assert.match(a.api.gallery(),/2 fichas/);assert.equal(a.events.length,2);
});
test('storage failure never reports saved or discards previous worksheets',()=>{
 const a=boot();a.api.save({title:'Anterior',kind:'studio',html:'original'});const before=[...a.storage];
 const b=boot(a.storage,true);assert.equal(b.api.save({title:'Nueva',kind:'studio',html:'new'}),null);assert.deepEqual([...a.storage],before);assert.equal(b.events.length,0);assert.match(b.notices[0],/No se ha podido guardar/);
});
test('invalid stored data is not overwritten and titles are escaped',()=>{
 const a=boot();a.api.save({title:'<img onerror="alert(1)">',kind:'studio',html:'sheet'});assert.match(a.api.gallery(),/&lt;img/);assert.doesNotMatch(a.api.gallery(),/<img onerror/);
 const corrupt=new Map([['rosa-generated-sheets-v1','broken']]);const b=boot(corrupt);assert.equal(b.api.save({title:'Nueva',kind:'studio',html:'new'}),null);assert.equal(corrupt.get('rosa-generated-sheets-v1'),'broken');
});
test('blocked popup retains saved sheet and gives recovery message',()=>{
 const a=boot();const item=a.api.save({title:'Ficha',kind:'studio',html:'sheet'});a.window.open=()=>null;assert.equal(a.api.handle('saved-sheet-open',item.id),true);assert.match(a.notices.at(-1),/Permite abrir/);assert.match(a.api.gallery(),/1 ficha/);
});
test('custom generator saves a real printable; later settings do not change the saved sheet',()=>{
 const a=boot();Object.assign(a.ctx,{URL,location:{href:'https://www.laclaserosa.es/#taller'}});
 Object.assign(a.window,{ROSA_PLAY:{themes:{}},ROSA:{students:['ROSA']},ROSA_SHEET_CONTENT:{playThemes:{},shapeColors:['red','blue'],vocabulary:{},letterSets:{},caseSets:{}}});
 vm.runInNewContext(fs.readFileSync('public/sheet-studio.js','utf8'),a.ctx);
 const gen=a.window.ROSA_SHEETS;gen.ui.mode='numeros';gen.handle('studio-save');assert.match(a.api.gallery(),/Números y cantidades · 3/);
 gen.ui.number=7;gen.handle('studio-print');assert.match(a.written[0],/REPASA EL 7/);
 const rows=JSON.parse(a.storage.get('rosa-generated-sheets-v1'));const savedThree=rows.find(r=>r.title.endsWith('3'));
 a.api.handle('saved-sheet-open',savedThree.id);assert.match(a.written[1],/REPASA EL 3/);assert.doesNotMatch(a.written[1],/REPASA EL 7/);
 gen.ui.mode='nombre';gen.ui.student='__custom__';gen.ui.customText='<Rosa>';gen.handle('studio-save');assert.match(a.api.gallery(),/&lt;Rosa&gt;/);
});
test('series generator saves both A4 pages with selected pattern and retrieves identical HTML',()=>{
 const a=boot();Object.assign(a.ctx,{URL,location:{href:'https://www.laclaserosa.es/#fichas-series'},savedInk:'color',E:s=>String(s),btn:()=>'',shape:()=>''});
 const app=fs.readFileSync('public/app.js','utf8');const segment=app.slice(app.indexOf('const patternState='),app.indexOf("document.addEventListener('toggle'"));
 vm.runInNewContext(segment,a.ctx);vm.runInNewContext("patternState.pattern='ABC';patternState.count=4;savePattern();",a.ctx);
 const rows=JSON.parse(a.storage.get('rosa-generated-sheets-v1'));assert.equal(rows.length,1);assert.match(rows[0].title,/ABC/);assert.match(rows[0].html,/Piezas para nuestras series/);assert.match(rows[0].html,/Serie 4/);assert.doesNotMatch(rows[0].html,/Serie 5/);
 vm.runInNewContext('printPattern()',a.ctx);assert.equal(JSON.parse(a.storage.get('rosa-generated-sheets-v1')).length,1);assert.equal(a.written[0],rows[0].html);
});
