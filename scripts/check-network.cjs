// Comprobaciones de recuperación de arranque, sin dependencias adicionales.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const index=read('public/index.html'),styles=read('public/styles.css');
assert(!styles.includes('fonts.googleapis.com')&&!styles.includes('fonts.gstatic.com'));
assert(styles.includes('font-display:swap'));
for(const family of ['nunito','dmsans']){assert(fs.readFileSync(path.join(root,'public/fonts/local/'+family+'.woff')).subarray(0,4).equals(Buffer.from('wOFF')));assert(read('public/fonts/local/'+family+'-OFL.txt').includes('OPEN FONT LICENSE'));}
const block=index.split('<!-- ROSA NETWORK START V1')[1].split('<!-- ROSA NETWORK END V1')[0],code=block.match(/<script>([\s\S]*?)<\/script>/)[1];
function startup(){
 const events={},timers=new Map(),link={tagName:'LINK',rel:'stylesheet',href:'https://rosa.example/retained.css',media:'',sheet:null,disabled:false};let id=0;
 const message={textContent:''},box={hidden:true,querySelector:()=>message,setAttribute(){this.hidden=true;}};
 const document={getElementById:()=>box,querySelectorAll:()=>[link],addEventListener:(name,fn)=>events[name]=fn};
 const window={addEventListener:(name,fn)=>events[name]=fn},context=vm.createContext({window,document,location:{href:'https://rosa.example/'},URL,Date,setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:n=>timers.delete(n)});
 vm.runInContext(code,context);return {window,events,timers,link,box,message};
}
{
 const test=startup();test.window.ROSA_STARTUP.appReady();test.window.ROSA_STARTUP.loginReady();assert(test.box.hidden);assert.equal(test.timers.size,0);
}
{
 const test=startup();[...test.timers.values()][0].fn();assert(!test.box.hidden);assert.equal(test.link.media,'not all');test.window.ROSA_STARTUP.appReady();test.window.ROSA_STARTUP.loginReady();assert(!test.box.hidden);test.events.load({target:test.link});assert.equal(test.link.media,'');assert(test.box.hidden);
}
{
 const test=startup();test.events.error({target:{tagName:'SCRIPT',src:'https://rosa.example/data.js?rev=21'}});[...test.timers.values()][0].fn();assert(!test.box.hidden);assert(test.message.textContent.includes('No se han descargado'));assert.equal(test.window.ROSA_STARTUP.report().failed[0],'/data.js');assert(!test.window.ROSA_STARTUP.report().appReady);
}
const source=read('public/aula.js'),helper=source.slice(source.indexOf('  async function requestBook('),source.indexOf('  async function load(){'));
async function deadlineTest(bodyStalls,abortAvailable){
 const timers=new Map();let id=0;
 const context={setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:n=>timers.delete(n),fetch:async()=>bodyStalls?{ok:true,json:()=>new Promise(()=>{})}:await new Promise(()=>{})};if(abortAvailable)context.AbortController=AbortController;
 const c=vm.createContext(context);vm.runInContext(helper,c);const promise=vm.runInContext('requestBook()',c);assert.equal([...timers.values()][0].ms,8000);[...timers.values()][0].fn();await assert.rejects(promise,/aula-timeout/);assert.equal(timers.size,0);
}
(async()=>{await deadlineTest(false,true);await deadlineTest(true,true);await deadlineTest(false,false);assert.deepEqual(JSON.parse(read('public/red-salud.json')).networkPatch,1);console.log('PASS fuentes propias/licencias, arranque, CSS retenido/recuperado, script bloqueado y tiempos máximos de API/cuerpo/compatibilidad.');})().catch(error=>{console.error(error);process.exitCode=1;});
