'use strict';
(async()=>{
  const button=document.querySelector('#custom-print-button');
  const images=[...document.images];
  const loaded=await Promise.all(images.map(img=>img.complete?Promise.resolve(img.naturalWidth>0):new Promise(resolve=>{img.addEventListener('load',()=>resolve(true),{once:true});img.addEventListener('error',()=>resolve(false),{once:true});})));
  if(loaded.every(Boolean)){button.disabled=false;}
  else{const note=document.createElement('p');note.setAttribute('role','alert');note.textContent='Falta un dibujo por cargar. Vuelve a preparar la impresión antes de imprimir.';button.after(note);}
})();
