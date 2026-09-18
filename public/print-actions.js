'use strict';
(function(){
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function printable(options){
    const id=options?.id,ink=['bn','coloring'].includes(options?.ink)?options.ink:'color';
    if(typeof id!=='string'||!/^[a-z0-9-]+$/.test(id))throw new Error('invalid-printable');
    const stem=id+(ink==='bn'?'-bn':ink==='coloring'?'-colorear':'');
    return {stem,pdf:'pdf/'+stem+'.pdf',title:options?.title||id};
  }
  async function pdfData(item){
    const response=await fetch(item.pdf);
    if(!response.ok)throw new Error('pdf');
    const source=await response.blob();
    const blob=source.type==='application/pdf'?source:new Blob([source],{type:'application/pdf'});
    const filename=item.stem+'.pdf';
    return {blob,filename,file:typeof File==='function'?new File([blob],filename,{type:'application/pdf'}):null};
  }
  function saveFile(blob,filename){
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=filename;link.hidden=true;
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function share(options){
    const item=printable(options),data=await pdfData(item);
    if(data.file&&typeof navigator.share==='function'){
      let supported=typeof navigator.canShare!=='function';
      try{if(typeof navigator.canShare==='function')supported=navigator.canShare({files:[data.file]});}catch{}
      if(supported){
        try{
          await navigator.share({files:[data.file],title:'La Clase Rosa · '+item.title});
          return 'shared';
        }catch(error){if(error?.name==='AbortError')return 'cancelled';}
      }
    }
    saveFile(data.blob,data.filename);
    return 'downloaded';
  }
  async function print(options){
    const item=printable(options),popup=window.open('','_blank');
    if(!popup)throw new Error('popup-blocked');
    popup.document.open();popup.document.write('<!doctype html><html lang="es"><meta charset="utf-8"><title>Preparando…</title><body style="font-family:Arial;padding:24px">Preparando el imprimible…</body></html>');popup.document.close();
    try{
      const response=await fetch('materials.json');if(!response.ok)throw new Error('manifest');
      const manifest=await response.json(),entry=manifest[options.id];if(!entry)throw new Error('missing-printable');
      const pages=Number(entry.pages)||1,base=new URL('.',location.href).href;
      const images=Array.from({length:pages},(_,index)=>'<img src="pages/'+item.stem+'-'+(index+1)+'.jpg" alt="Página '+(index+1)+' de '+pages+'">').join('');
      popup.document.open();popup.document.write('<!doctype html><html lang="es"><head><base href="'+escapeHTML(base)+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHTML(item.title)+' · Imprimir</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#ece8eb;font-family:Arial,sans-serif}.toolbar{position:sticky;top:0;z-index:2;display:flex;gap:10px;justify-content:center;padding:12px;background:white;border-bottom:1px solid #ddd}.toolbar button{min-height:44px;padding:10px 16px;border:1px solid #a6295d;border-radius:10px;background:#a6295d;color:white;font-weight:700}.toolbar .back{background:white;color:#702040}.pages{display:grid;gap:18px;justify-content:center;padding:18px}.pages img{display:block;width:min(210mm,100%);height:auto;background:white;box-shadow:0 4px 18px #0002}@media print{body{background:white}.toolbar{display:none}.pages{display:block;padding:0}.pages img{width:210mm;height:297mm;object-fit:contain;box-shadow:none;break-after:page}.pages img:last-child{break-after:auto}}</style></head><body><div class="toolbar"><button onclick="window.print()">Imprimir ahora</button><button class="back" onclick="window.close()">Volver a la app</button></div><main class="pages">'+images+'</main><script>window.addEventListener("load",()=>setTimeout(()=>window.print(),250));<\/script></body></html>');popup.document.close();popup.focus();return 'printing';
    }catch(error){popup.close();throw error;}
  }
  window.ROSA_PRINT={share,print};
})();
