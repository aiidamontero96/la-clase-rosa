'use strict';
window.ROSA_FICHAS=(()=>{
  const KEY='rosa-generated-sheets-v1';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(){
    const raw=localStorage.getItem(KEY);
    if(!raw)return [];
    const rows=JSON.parse(raw);
    if(!Array.isArray(rows)||rows.some(r=>!r||typeof r.id!=='string'||typeof r.html!=='string'||typeof r.title!=='string'))throw new Error('invalid-library');
    return rows;
  }
  function save({title,kind,html}){
    try{
      const rows=read(),existing=rows.find(r=>r.html===html);
      if(existing){window.toast?.('Esta ficha ya está en Mis fichas.');return existing;}
      const item={id:crypto.randomUUID(),title,kind,html,createdAt:new Date().toISOString()};
      localStorage.setItem(KEY,JSON.stringify([item,...rows]));
      window.toast?.('Ficha guardada en Mis fichas.');
      window.dispatchEvent(new CustomEvent('rosa-fichas-saved'));
      return item;
    }catch{window.toast?.('No se ha podido guardar la ficha. El almacenamiento del navegador está lleno o no está disponible. Tus fichas anteriores se conservan.');return null;}
  }
  function openHTML(html){
    const win=window.open('','_blank');
    if(!win){window.toast?.('Permite abrir la ventana para ver e imprimir la ficha.');return false;}
    win.document.open();win.document.write(html);win.document.close();return true;
  }
  function gallery(){
    let rows;try{rows=read();}catch{return '<p class="note" role="alert">No se puede leer la lista de fichas guardadas en este navegador.</p>';}
    return '<section class="fichas-saved" aria-labelledby="fichas-saved-title"><div class="fichas-list-heading"><div><span class="eyebrow">TU COLECCIÓN</span><h2 id="fichas-saved-title">Mis fichas</h2></div><span class="fichas-count">'+rows.length+' '+(rows.length===1?'ficha':'fichas')+'</span></div>'+(rows.length?'<div class="fichas-grid">'+rows.map(r=>'<article class="ficha-card"><div class="ficha-paper" aria-hidden="true"><span>'+(r.kind==='series'?'● ▲ ●':'A 1')+'</span><i></i><i></i><i></i></div><div class="ficha-card-content"><span class="eyebrow">'+(r.kind==='series'?'SERIES':'A MEDIDA')+'</span><h3>'+esc(r.title)+'</h3><p>Creada el '+esc(new Date(r.createdAt).toLocaleDateString('es-ES'))+'</p><button type="button" class="button secondary" data-action="saved-sheet-open" data-value="'+esc(r.id)+'">Abrir e imprimir</button></div></article>').join('')+'</div>':'<div class="fichas-empty"><span aria-hidden="true">✎</span><h3>Tu próxima ficha empieza aquí</h3><p>Elige un generador y pulsa «Generar y guardar». La ficha aparecerá en esta lista.</p></div>')+'<p class="fichas-storage-note">Guardadas en este navegador. No se sincronizan entre dispositivos y se borran si eliminas los datos del sitio.</p></section>';
  }
  function page(){return '<div class="fichas-page"><header class="fichas-heading"><span class="eyebrow">EL TALLER DE LA CLASE ROSA</span><h1>Fichas para tu aula</h1><p>Crea lo que necesitas y vuelve a utilizarlo cuando quieras.</p></header><div class="fichas-generators"><a class="fichas-generator fichas-series" href="#fichas-series"><span class="fichas-generator-art" aria-hidden="true">● <b>▲</b> ●</span><div><span class="eyebrow">PATRONES Y SECUENCIAS</span><h2>Generar series</h2><p>Elige el tema, el patrón y cuántas series incluir.</p><strong>Crear series <span aria-hidden="true">→</span></strong></div></a><a class="fichas-generator fichas-custom" href="#taller"><span class="fichas-generator-art" aria-hidden="true">A <b>1</b> ✎</span><div><span class="eyebrow">A TU MEDIDA</span><h2>Crear ficha a medida</h2><p>Nombres, números, letras, trazos y más propuestas.</p><strong>Crear una ficha <span aria-hidden="true">→</span></strong></div></a></div>'+gallery()+'</div>';}
  function handle(action,id){if(action!=='saved-sheet-open')return false;try{const item=read().find(r=>r.id===id);if(item)openHTML(item.html);else window.toast?.('Esta ficha ya no está disponible.');}catch{window.toast?.('No se ha podido abrir la ficha.');}return true;}
  window.addEventListener('storage',event=>{if(event.key===KEY&&location.hash==='#imprimibles')window.render?.();});
  return {save,openHTML,gallery,page,handle};
})();
