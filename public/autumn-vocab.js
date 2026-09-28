'use strict';
// One cover plus five landscape sheets with six local images each.
(() => {
  const pages=[
    [['ABRIGO','abrigo'],['CHUBASQUERO','chubasquero'],['JERSEY','jersey'],['BUFANDA','bufanda'],['GORRO','gorro'],['BOTAS','botas']],
    [['CALCETINES','calcetines'],['PANTALÓN LARGO','pantalon-largo'],['CHAQUETA','chaqueta'],['PARAGUAS','paraguas'],['BOTAS DE AGUA','botas-de-agua'],['CAMISETA DE MANGA LARGA','camiseta-de-manga-larga']],
    [['ZAPATOS','zapatos'],['MANZANA','manzana'],['PERA','pera'],['UVAS','uvas'],['GRANADA','granada'],['HIGOS','higos']],
    [['CAQUI','caqui'],['MEMBRILLO','membrillo'],['CASTAÑAS','castanas'],['NUECES','nueces'],['AVELLANAS','avellanas'],['MANDARINA','mandarina']],
    [['CALABAZA','calabaza'],['HOJAS CAÍDAS','hojas-caidas'],['LLUVIA','lluvia'],['CHARCO','charco'],['SETA','seta'],['ARDILLA','ardilla']]
  ];
  const titles=['','NOS VESTIMOS EN OTOÑO','MÁS ROPA DE OTOÑO','FRUTAS DE OTOÑO','FRUTAS Y FRUTOS DE OTOÑO','DESCUBRIMOS EL OTOÑO'];
  const route='pdi-otono-vocabulario';
  const onRoute=()=>location.hash.slice(1).split('?')[0]===route;
  const href=n=>'#'+route+(n?'?page='+n:'');
  const initialPage=()=>{
    const n=Number(new URLSearchParams(location.hash.split('?')[1]||'').get('page')||0);
    return Number.isInteger(n)?Math.max(0,Math.min(5,n)):0;
  };
  let page=initialPage(),revealed=new Set();
  function root() {
    let node=document.getElementById('autumn-route');
    if (!node) {
      node=document.createElement('section');
      node.id='autumn-route';
      node.setAttribute('aria-label','CONOCEMOS EL OTOÑO');
      document.body.appendChild(node);
    }
    return node;
  }
  function go(next) {
    if (!onRoute() || next<0 || next>5 || next===page) return;
    page=next;revealed=new Set();
    history.replaceState(null,'',href(next));
    render();
  }
  function render() {
    if (!onRoute()) return;
    const node=root();
    const cards=page?pages[page-1].map(([label,file],index)=>
      '<button type="button" class="autumn-card" data-autumn-card="'+index+'" aria-label="DESCUBRIR PALABRA">'+
      '<img src="assets/autumn-vocab/'+file+'.webp" width="440" height="560" alt="IMAGEN DE OTOÑO">'+
      '<span class="autumn-caption">PULSA PARA DESCUBRIR</span></button>').join(''):'';
    node.innerHTML='<nav class="autumn-toolbar" aria-label="CONTROLES DE LA PDI">'+
      '<span>'+(page?'PÁGINA '+(page+1)+' DE 6':'')+'</span><a href="#pdi-proyectos" aria-label="SALIR DEL RECORRIDO">× SALIR</a></nav>'+
      '<main class="autumn-stage">'+(page?'<h1>'+titles[page]+'</h1><div class="autumn-grid">'+cards+'</div>':
      '<div class="autumn-cover"><img src="assets/autumn-vocab/hoja-portada.webp" alt="HOJA NARANJA DE OTOÑO" width="443" height="443"><h1>CONOCEMOS EL OTOÑO</h1></div>')+'</main>'+
      '<nav class="autumn-pagination" aria-label="PÁGINAS DE OTOÑO">'+
      (page?'<button type="button" data-autumn-page="'+(page-1)+'">← ANTERIOR</button>':'<span></span>')+
      '<span>'+(page?'PÁGINA '+(page+1)+' / 6':'')+'</span>'+
      (page<5?'<button type="button" data-autumn-page="'+(page+1)+'">SIGUIENTE →</button>':'<a href="#pdi-proyectos">TERMINAR</a>')+'</nav>';
    node.querySelectorAll('[data-autumn-page]').forEach(button=>{
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();go(Number(button.dataset.autumnPage));});
    });
    node.querySelectorAll('[data-autumn-card]').forEach(card=>{
      const index=Number(card.dataset.autumnCard);
      const reveal=()=>{
        revealed.add(index);
        const label=pages[page-1][index][0];
        card.querySelector('.autumn-caption').textContent=label;
        card.querySelector('img').alt=label;
        card.setAttribute('aria-label',label);
        card.classList.add('is-revealed');
      };
      card.addEventListener('click',event=>{event.stopPropagation();reveal();});
      if(revealed.has(index))reveal();
    });
  }
  function sync() {
    if (!onRoute()) {document.getElementById('autumn-route')?.remove();return;}
    const fromUrl=initialPage();
    if(fromUrl!==page){page=fromUrl;revealed=new Set();}
    render();
  }
  function install() {
    window.addEventListener('hashchange',()=>setTimeout(sync,0));
    document.addEventListener('keydown',event=>{
      if(!onRoute())return;
      if(event.key==='ArrowRight'){event.preventDefault();go(page+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();go(page-1);}
      if(event.key==='Escape')location.hash='pdi-proyectos';
    });
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
  window.ROSA_AUTUMN={pages,go,render};
})();
