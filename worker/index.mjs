const COOKIE='rosa_aula';
const gameIds=new Set('contar series falta intruso clasificar letras emociones calendario tiempo dino verdadero adivinanza memory vocabulario parejas cantidades comparar juntar siguiente tamanos vocales silabas colores orden posiciones asociaciones puzzle ordenar-piezas cestas cuento sorpresa'.split(' '));
const clamp=(value,min,max,fallback=min)=>Number.isInteger(value)&&value>=min&&value<=max?value:fallback;
const ids=values=>Array.isArray(values)?[...new Set(values.filter(value=>gameIds.has(value)))]:[];
const intList=(values,max=12)=>Array.isArray(values)?values.filter(v=>Number.isInteger(v)&&v>=0&&v<max).slice(0,12):[];
export function cleanBook(raw={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid notebook');
  const book={version:1,favorites:ids(raw.favorites),level:clamp(raw.level,1,3,2),queue:ids(raw.queue).slice(0,4),cursors:{},last:null,adventure:{theme:'none',steps:0}};
  for(const [key,value] of Object.entries(raw.cursors||{}))if(gameIds.has(key))book.cursors[key]=clamp(value,0,100000);
  if(['nido','jardin'].includes(raw.adventure?.theme))book.adventure={theme:raw.adventure.theme,steps:clamp(raw.adventure.steps,0,6)};
  const p=raw.last;
  if(p&&gameIds.has(p.kind)){
    book.last={kind:p.kind,round:clamp(p.round,0,100000),level:clamp(p.level,1,3,2),hidden:!!p.hidden,answered:!!p.answered,pattern:['AB','AAB','ABB','ABC','AABB'].includes(p.pattern)?p.pattern:'AB',memory:intList(p.memory),matched:[...new Set(intList(p.matched))],placed:{},storyId:['lila','semilla','mochila'].includes(p.storyId)?p.storyId:'lila',storyPath:Array.isArray(p.storyPath)?p.storyPath.filter(v=>typeof v==='string'&&/^[a-z0-9-]{1,24}$/.test(v)).slice(0,12):['inicio'],surpriseOpen:!!p.surpriseOpen,surpriseType:['mezcla','adivinanza','movimiento','pregunta','reto'].includes(p.surpriseType)?p.surpriseType:'mezcla'};
    for(const [key,value] of Object.entries(p.placed||{}).slice(0,12))if(/^\d{1,2}$/.test(key)&&/^\d{1,2}$/.test(String(value)))book.last.placed[key]=String(value);
    if(p.session&&ids(p.session.games).length){const games=ids(p.session.games).slice(0,4);book.last.session={games,index:clamp(p.session.index,0,games.length-1)};}
  }
  return book;
}
const response=(data,status=200,cookie)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff',...(cookie?{'Set-Cookie':cookie}:{})}});
async function identity(request){
  const match=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)rosa_aula=([a-f0-9]{64})(?:;|$)/);
  const token=match?.[1]||Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
  const key=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
  return {key,cookie:COOKIE+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000'};
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/api/aula'){
      if(!['GET','PUT'].includes(request.method))return response({error:'Método no permitido.'},405);
      const origin=request.headers.get('Origin');
      if((origin&&origin!==url.origin)||request.headers.get('Sec-Fetch-Site')==='cross-site')return response({error:'Origen no permitido.'},403);
      if(request.method==='PUT'&&(!origin||!request.headers.get('Content-Type')?.startsWith('application/json')))return response({error:'Petición no válida.'},403);
      if(!env.DB)return response({error:'No se puede guardar en este momento.'},503);
      try{
        if(request.method==='PUT'&&!/(?:^|;\s*)rosa_aula=[a-f0-9]{64}(?:;|$)/.test(request.headers.get('Cookie')||''))return response({error:'El navegador no conserva la selección. Permite las cookies de este sitio y reintenta.'},409);
        const {key,cookie}=await identity(request);
        if(request.method==='GET'){
          const row=await env.DB.prepare('SELECT data FROM pdi_notebooks WHERE id = ?').bind(key).first();
          return response({book:cleanBook(row?JSON.parse(row.data):{})},200,cookie);
        }
        if(Number(request.headers.get('Content-Length'))>32768)return response({error:'La selección es demasiado grande.'},413);
        const text=await request.text();if(text.length>32768)return response({error:'La selección es demasiado grande.'},413);
        let book;try{book=cleanBook(JSON.parse(text));}catch{return response({error:'La selección no es válida.'},400);}
        await env.DB.prepare('INSERT INTO pdi_notebooks (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at').bind(key,JSON.stringify(book),Date.now()).run();
        return response({saved:true},200,cookie);
      }catch(error){console.error('Classroom notebook unavailable',error?.message);return response({error:'No se ha podido guardar. Puedes seguir jugando y reintentar.'},503);}
    }
    if(url.pathname.startsWith('/api/'))return response({error:'No encontrado.'},404);
    if(url.pathname==='/libros/Yayoi_Kusama_PDI(1).html'){
      url.pathname='/libros/Yayoi_Kusama_PDI.html';
      return env.ASSETS?env.ASSETS.fetch(new Request(url,request)):new Response('No encontrado.',{status:404});
    }
    if(env.ASSETS)return env.ASSETS.fetch(request);
    return new Response('No se ha podido cargar La Clase Rosa. Vuelve a intentarlo en unos momentos.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
};
