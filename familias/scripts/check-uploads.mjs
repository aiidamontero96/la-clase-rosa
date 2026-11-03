import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const moduleSource=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8');
const html=JSON.parse(moduleSource.split('\n',1)[0].slice('const HTML='.length,-1));
const script=html.split('<script>')[1].split('</script>')[0].replace(/boot\(\);\s*$/,'');
const elements=new Map();let dimensions,closed=0;
function node(){return {innerHTML:'',textContent:'',value:'',disabled:false,dataset:{},style:{},classList:{add(){}},setAttribute(){},append(){},addEventListener(){},querySelectorAll(){return[];},close(){},showModal(){},getContext(){return {drawImage(){}};},toBlob(cb,type){dimensions={width:this.width,height:this.height};cb(new Blob([new Uint8Array(1000)],{type}));}};}
const document={querySelector(key){if(!elements.has(key))elements.set(key,node());return elements.get(key);},createElement(){return node();},addEventListener(){}};
let active=0,peak=0;
class UploadXHR{
 constructor(){this.upload={};}
 open(method,url){this.url=url;}
 setRequestHeader(){}
 send(file){active++;peak=Math.max(peak,active);this.upload.onprogress({lengthComputable:true,loaded:file.size,total:file.size});setTimeout(()=>{active--;this.status=file.name==='failed.mp4'?503:201;this.responseText=JSON.stringify(this.status===201?{id:file.name,name:file.name,mime:file.type,size:file.size}:{error:'Temporary failure'});this.onload();},file.name==='first.mp4'?20:1);}
}
const window={addEventListener(){},createImageBitmap:async()=>({width:4000,height:3000,close(){closed++;}})};
const c=vm.createContext({document,window,navigator:{},location:{pathname:'/',origin:'https://test.invalid'},Blob,File,URL,XMLHttpRequest:UploadXHR,createImageBitmap:window.createImageBitmap,setTimeout,clearTimeout,setInterval,clearInterval,console});vm.runInContext(script,c);
c.original=new File([new Uint8Array(800000)],'photo.jpg',{type:'image/jpeg'});
const compressed=await vm.runInContext('optimizePhoto(original)',c);assert(compressed.size<c.original.size);assert.deepEqual(dimensions,{width:2048,height:1536});assert.equal(closed,1);
c.small=new File([new Uint8Array(1000)],'small.jpg',{type:'image/jpeg'});assert.equal(await vm.runInContext('optimizePhoto(small)',c),c.small);
c.video=new File([new Uint8Array(1000)],'clip.mp4',{type:'video/mp4'});assert.equal(await vm.runInContext('optimizePhoto(video)',c),c.video,'videos are not reencoded');
c.list=['first.mp4','second.mp4','failed.mp4','fourth.mp4'].map(name=>new File([new Uint8Array(1000)],name,{type:'video/mp4'}));
await vm.runInContext('uploadMany(list)',c);assert.equal(peak,2,'at most two transfers run concurrently');
assert.equal(vm.runInContext('files.map(f=>f.name).join(",")',c),'first.mp4,second.mp4,fourth.mp4','selection order survives out-of-order completion and failures');assert.match(elements.get('#editor-error').textContent,/Temporary failure/);assert.equal(vm.runInContext('busy',c),false);
vm.runInContext('renderLogin()',c);assert(!elements.get('#app').innerHTML.includes('Soy la maestra'));assert(!elements.get('#app').innerHTML.includes('href="/panel"'));
vm.runInContext("user={role:'family',name:'Family'};posts=[];render()",c);assert(!elements.get('#app').innerHTML.includes('Mi contraseña'));assert(!elements.get('#app').innerHTML.includes('Cuentas de familias'));
vm.runInContext('newUser()',c);assert(!elements.get('#modal').innerHTML.includes('minlength="12"'));assert.match(elements.get('#modal').innerHTML,/name="password"/);
console.log('Upload/UI checks passed: smaller photos, 2048px limit, original videos, two parallel transfers, progress/errors, stable attachment order, teacher-only credentials and clean family login.');
