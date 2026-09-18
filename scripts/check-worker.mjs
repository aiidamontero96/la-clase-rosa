import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker,{cleanBook} from '../worker/index.mjs';
const db=new DatabaseSync(':memory:');
for(const file of fs.readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
const env={
  DB:{
    prepare(sql){
      const statement=db.prepare(sql);
      return {bind(...args){return {first:async()=>statement.get(...args),run:async()=>statement.run(...args)};}};
    }
  },
  ASSETS:{fetch:async request=>new Response('asset:'+new URL(request.url).pathname)}
};
const origin='https://rosa.example';
const get=(cookie='')=>worker.fetch(new Request(origin+'/api/aula',{headers:cookie?{Cookie:cookie}:{}}),env);
const first=await get();assert.equal(first.status,200);assert.match(first.headers.get('Cache-Control'),/no-store/);const cookie=first.headers.get('Set-Cookie').split(';')[0];assert.match(first.headers.get('Set-Cookie'),/HttpOnly; Secure; SameSite=Lax/);
const book=(await first.json()).book;book.favorites=['puzzle','vocales'];book.queue=['contar','memory','cuento'];book.level=3;book.adventure={theme:'jardin',steps:4};book.last={kind:'puzzle',round:12,level:3,placed:{0:'0',1:'1'},session:{games:book.queue,index:0}};
const put=(body,headers={})=>worker.fetch(new Request(origin+'/api/aula',{method:'PUT',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json',...headers},body:JSON.stringify(body)}),env);
assert.equal((await put(book)).status,200);const restored=(await (await get(cookie)).json()).book;
assert.deepEqual(restored.favorites,book.favorites);assert.equal(restored.last.placed['1'],'1');assert.equal(restored.adventure.steps,4);assert.equal(restored.level,3);
assert.equal((await (await get()).json()).book.last,null,'Separate visitors must not see each other’s state');
assert.equal((await put(book,{Origin:'https://other.example'})).status,403);
assert.equal((await put(book,{'Content-Type':'text/plain'})).status,403);
assert.equal((await put(book,{Cookie:''})).status,409,'Blocked cookies must not silently lose progress');
assert.equal((await put({payload:'x'.repeat(40000)})).status,413);
assert.equal((await worker.fetch(new Request(origin+'/api/aula'),{})).status,503);
assert.equal(await (await worker.fetch(new Request(origin+'/pdf/memory-dino.pdf'),env)).text(),'asset:/pdf/memory-dino.pdf');
assert.equal((await worker.fetch(new Request(origin+'/api/unknown'),env)).status,404);
const cleaned=cleanBook({favorites:['contar','contar','unknown'],level:99,queue:['puzzle','cestas','contar','vocales','memory'],cursors:{contar:-9},last:{kind:'unknown'}});assert.deepEqual(cleaned.favorites,['contar']);assert.equal(cleaned.level,2);assert.equal(cleaned.queue.length,4);assert.equal(cleaned.last,null);
assert.equal(db.prepare('SELECT COUNT(*) AS total FROM pdi_notebooks').get().total,1);
db.close();console.log(JSON.stringify({notebook:'persisted and isolated',migration:'passed',invalidRequests:'rejected',assets:'preserved'}));
