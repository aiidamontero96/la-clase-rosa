'use strict';
window.ROSA_FICHAS=(()=>{
  function openHTML(html){
    const win=window.open('','_blank');
    if(!win){window.toast?.('Permite abrir la ventana para ver e imprimir la ficha.');return false;}
    win.document.open();win.document.write(html);win.document.close();return true;
  }
  const seriesExamples=['AB','AAB','ABB','ABC','AABB'].map(pattern=>['series-'+pattern.toLowerCase(),'Series '+pattern]);
  const customExamples=[
    ['contar-dibujos','Contar y elegir el número'],
    ['sumas-dibujos','Sumar con dibujos'],
    ['colorear-cantidades','Colorear la cantidad indicada'],
    ['numeros','Repasar y trabajar números'],
    ['formas','Reconocer y dibujar formas'],
    ['nombre','Trabajar el nombre'],
    ['lenguaje','Letras, sílabas y palabras'],
    ['pensar','Atención visual'],
    ['trazos','Trazos y caminos'],
    ['dino','Huellas de dinosaurios'],
    ['policubos','Policubos']
  ];
  function exampleGroup(title,examples){
    return '<h3>'+title+'</h3><ul class="fichas-example-links">'+examples.map(([id,label])=>
      '<li><a href="fichas-ejemplo/'+id+'.html"><div class="ficha-example-preview" data-example-preview aria-hidden="true"><span>VISTA PREVIA A4</span></div><strong>'+label+'</strong><small>Abrir e imprimir <span aria-hidden="true">→</span></small></a></li>'
    ).join('')+'</ul>';
  }
  function examples(){
    return '<section class="fichas-examples" aria-labelledby="fichas-examples-title"><div class="fichas-list-heading"><div><span class="eyebrow">LISTAS PARA IMPRIMIR</span><h2 id="fichas-examples-title">Fichas de ejemplo</h2></div><span class="fichas-count">'+(seriesExamples.length+customExamples.length)+' fichas</span></div>'+
      exampleGroup('Series',seriesExamples)+exampleGroup('Actividades',customExamples)+'</section>';
  }
  function page(){return '<div class="fichas-page"><header class="fichas-heading"><span class="eyebrow">EL TALLER DE LA CLASE ROSA</span><h1>Fichas para tu aula</h1><p>Crea una ficha a tu medida o elige un ejemplo listo para imprimir.</p></header><div class="fichas-generators"><a class="fichas-generator fichas-series" href="#fichas-series"><span class="fichas-generator-art" aria-hidden="true">● <b>▲</b> ●</span><div><span class="eyebrow">PATRONES Y SECUENCIAS</span><h2>Generar series</h2><p>Elige el tema, el patrón y cuántas series incluir.</p><strong>Crear series <span aria-hidden="true">→</span></strong></div></a><a class="fichas-generator fichas-custom" href="#taller"><span class="fichas-generator-art" aria-hidden="true">A <b>1</b> ✎</span><div><span class="eyebrow">A TU MEDIDA</span><h2>Crear ficha a medida</h2><p>Contar, sumar, colorear cantidades, nombres y más.</p><strong>Crear una ficha <span aria-hidden="true">→</span></strong></div></a></div>'+examples()+'</div>';}
  async function loadPreview(preview){
    const url=preview.closest('a').href;
    try{
      const response=await fetch(url);
      if(!response.ok)throw new Error('preview');
      const sheet=new DOMParser().parseFromString(await response.text(),'text/html');
      const firstPage=sheet.querySelector('.studio-sheet,.pattern-sheet');
      if(!firstPage)throw new Error('page');
      if(!preview.isConnected)return;

      const frame=document.createElement('iframe');
      frame.title='Primera página de la ficha';
      frame.tabIndex=-1;
      frame.setAttribute('sandbox','');
      const base=new URL(sheet.querySelector('base')?.getAttribute('href')||'.',url);
      const styles=[...sheet.querySelectorAll('link[rel="stylesheet"]')]
        .map(link=>link.outerHTML).join('');
      const isSeries=firstPage.classList.contains('pattern-sheet');
      frame.srcdoc='<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="'+base.href+'">'+styles+
        '<style>html,body{width:794px;height:1123px;overflow:hidden;background:white}body{margin:0!important;padding:0!important}.pattern-sheet{margin:0 auto!important;box-shadow:none!important}.studio-sheet{box-shadow:none!important}</style></head><body class="'+
        (isSeries?'pattern-print-document':'studio-print-document')+'">'+firstPage.outerHTML+'</body></html>';
      preview.replaceChildren(frame);
      const size=new ResizeObserver(([entry])=>{frame.style.transform='scale('+(entry.contentRect.width/794)+')';});
      size.observe(preview);
      previewSizes.push(size);
    }catch{
      preview.textContent='ABRE LA FICHA PARA VERLA';
    }
  }
  let previewObserver;
  const previewSizes=[];
  function mountPreviews(root){
    previewObserver?.disconnect();
    previewSizes.splice(0).forEach(observer=>observer.disconnect());
    const previews=root.querySelectorAll('[data-example-preview]');
    if(!previews.length)return;
    previewObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        previewObserver.unobserve(entry.target);
        void loadPreview(entry.target);
      });
    },{rootMargin:'300px'});
    previews.forEach(preview=>previewObserver.observe(preview));
  }
  return {openHTML,page,mountPreviews};
})();
