'use strict';
window.ROSA_FICHAS=(()=>{
  function openHTML(html){
    const win=window.open('','_blank');
    if(!win){window.toast?.('Permite abrir la ventana para ver e imprimir la ficha.');return false;}
    win.document.open();win.document.write(html);win.document.close();return true;
  }
  const seriesExamples=[
    ['AB','Animales','continuar',4],['AAB','Formas','copiar',4],['ABB','Juguetes','continuar',4],
    ['ABC','Dinosaurios','falta',6],['AABB','Espacio','falta',6]
  ].map(([pattern,theme,task,count])=>['series-'+pattern.toLowerCase(),'Series '+pattern,{pattern,theme,task,count,ink:'color'}]);
  const customExamples=[
    ['contar-dibujos','Contar y elegir el número',{pictureTheme:'Material escolar',pictureLimit:5,seed:25},'Cambiar dibujos'],
    ['sumas-dibujos','Sumar con dibujos',{pictureTheme:'Frutas',pictureLimit:5,pictureCount:3,seed:1},'Cambiar dibujos'],
    ['colorear-cantidades','Colorear la cantidad indicada',{pictureTheme:'Animales',pictureLimit:5,pictureCount:2,seed:5},'Cambiar dibujos'],
    ['numeros','Repasar y trabajar números',{number:5}],
    ['formas','Reconocer y dibujar formas',{}],
    ['nombre','Trabajar el nombre',{student:'__custom__',customText:'LUNA'},'Cambiar nombre'],
    ['lenguaje','Letras, sílabas y palabras',{}],
    ['pensar','Atención visual',{}],
    ['trazos','Trazos y caminos',{}],
    ['dino','Huellas de dinosaurios',{}],
    ['policubos','Policubos',{}]
  ];
  function exampleSettings(id,route){
    const example=(route==='fichas-series'?seriesExamples:customExamples).find(entry=>entry[0]===id);
    return example?(route==='fichas-series'?{...example[2]}:{mode:id,...example[2]}):null;
  }
  function exampleGroup(title,examples,route){
    return '<h3>'+title+'</h3><ul class="fichas-example-links">'+examples.map(([id,label,,editLabel='Personalizar'])=>{
      const printUrl='fichas-ejemplo/'+id+'.html';
      const editUrl='#'+route+'?ejemplo='+id;
      return `<li class="ficha-example-card">
        <div class="ficha-example-preview" data-example-preview="${printUrl}" aria-hidden="true"><span>VISTA PREVIA A4</span></div>
        <h4>${label}</h4>
        <div class="ficha-example-actions">
          <a class="ficha-print" href="${printUrl}" aria-label="Abrir e imprimir: ${label}">Abrir e imprimir</a>
          <a class="ficha-edit" href="${editUrl}" aria-label="${editLabel}: ${label}">${editLabel}</a>
        </div>
      </li>`;
    }).join('')+'</ul>';
  }
  function examples(){
    return '<section class="fichas-examples" aria-labelledby="fichas-examples-title"><div class="fichas-list-heading"><div><span class="eyebrow">LISTAS PARA IMPRIMIR</span><h2 id="fichas-examples-title">Fichas de ejemplo</h2></div><span class="fichas-count">'+(seriesExamples.length+customExamples.length)+' fichas</span></div>'+
      exampleGroup('Series',seriesExamples,'fichas-series')+exampleGroup('Actividades',customExamples,'taller')+'</section>';
  }
  function page(){return '<div class="fichas-page"><header class="fichas-heading"><span class="eyebrow">EL TALLER DE LA CLASE ROSA</span><h1>Fichas para tu aula</h1><p>Crea una ficha a tu medida o elige un ejemplo listo para imprimir.</p></header><div class="fichas-generators"><a class="fichas-generator fichas-series" href="#fichas-series"><span class="fichas-generator-art" aria-hidden="true">● <b>▲</b> ●</span><div><span class="eyebrow">PATRONES Y SECUENCIAS</span><h2>Generar series</h2><p>Elige el tema, el patrón y cuántas series incluir.</p><strong>Crear series <span aria-hidden="true">→</span></strong></div></a><a class="fichas-generator fichas-custom" href="#taller"><span class="fichas-generator-art" aria-hidden="true">A <b>1</b> ✎</span><div><span class="eyebrow">A TU MEDIDA</span><h2>Crear ficha a medida</h2><p>Contar, sumar, colorear cantidades, nombres y más.</p><strong>Crear una ficha <span aria-hidden="true">→</span></strong></div></a></div>'+examples()+'</div>';}
  async function loadPreview(preview){
    const url=new URL(preview.dataset.examplePreview,document.baseURI);
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
      frame.srcdoc='<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="'+base.href+'">'+styles+
        '<style>html,body{margin:0!important;padding:0!important;width:210mm!important;height:297mm!important;overflow:hidden;background:#fff!important}'+
        'body.ficha-preview-document>section{box-sizing:border-box!important;--u:1mm!important;width:210mm!important;height:297mm!important;min-height:0!important;margin:0!important;box-shadow:none!important;overflow:hidden!important}</style></head>'+
        '<body class="ficha-preview-document">'+firstPage.outerHTML+'</body></html>';
      function fit(width,height){
        const scale=Math.min(width/794,height/1123);
        frame.style.transform=`translate(${(width-794*scale)/2}px,${(height-1123*scale)/2}px) scale(${scale})`;
      }
      fit(preview.clientWidth,preview.clientHeight);
      preview.replaceChildren(frame);
      const size=new ResizeObserver(([{contentRect}])=>fit(contentRect.width,contentRect.height));
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
  return {openHTML,page,mountPreviews,exampleSettings};
})();

