'use strict';
window.ROSA_WORKSHEET_PICTURES=(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const themes={Animales:['duck','rabbit','fish','butterfly'],Frutas:['apple','pear','strawberry','banana'],'Material escolar':['pencil','book','backpack','ruler']};
 const labels={duck:'Pato',rabbit:'Conejo',fish:'Pez',butterfly:'Mariposa',apple:'Manzana',pear:'Pera',strawberry:'Fresa',banana:'Plátano',pencil:'Lápiz',book:'Libro',backpack:'Mochila',ruler:'Regla'};
 function icon(id,ink){
  const f=color=>ink==='color'?color:ink==='bn'?'#eeeeee':'#ffffff';
  const eye=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.7" fill="#222" stroke="none"/>`;
  const art={
   duck:`<path d="M20 48 Q12 49 9 43 Q7 67 31 73 Q62 81 73 60 Q80 45 65 35 Q66 14 49 12 Q33 10 32 29 Q31 39 39 44 Q29 41 20 48Z" fill="${f('#ffe17b')}"/><path d="M37 53 Q52 47 57 57 Q56 68 42 64" fill="none"/><path d="M65 29 L82 35 L65 40Z" fill="${f('#efaa56')}"/>${eye(55,26)}<path d="M31 74 L25 81 M48 75 L48 82" fill="none"/>`,
   rabbit:`<path d="M36 35 Q19 5 29 5 Q40 4 44 32 M48 32 Q50 1 60 6 Q69 12 55 38" fill="${f('#eadcce')}"/><ellipse cx="44" cy="61" rx="24" ry="20" fill="${f('#eadcce')}"/><circle cx="27" cy="68" r="9" fill="${f('#fff2df')}"/><ellipse cx="49" cy="42" rx="21" ry="19" fill="${f('#eadcce')}"/>${eye(42,39)}${eye(57,39)}<path d="M46 47 L52 47 L49 50Z M49 50 Q42 56 39 50 M49 50 Q55 56 59 50" fill="none"/><path d="M37 61 Q36 73 43 76 M55 62 L59 76" fill="none"/>`,
   fish:`<path d="M62 45 L82 25 L82 65Z" fill="${f('#74bad6')}"/><path d="M34 29 L43 14 L54 28 M35 59 L45 75 L57 61" fill="${f('#efbf68')}"/><ellipse cx="39" cy="45" rx="29" ry="21" fill="${f('#92d3e5')}"/><path d="M30 27 Q42 45 30 64 M45 34 Q60 43 45 54 M11 48 Q18 53 21 48" fill="none"/>${eye(23,39)}`,
   butterfly:`<path d="M43 43 Q17 6 8 24 Q3 46 29 49 Q8 49 15 70 Q28 85 43 52Z" fill="${f('#edb5c5')}"/><path d="M47 43 Q73 6 82 24 Q87 46 61 49 Q82 49 75 70 Q62 85 47 52Z" fill="${f('#c6b5df')}"/><ellipse cx="45" cy="47" rx="5" ry="23" fill="${f('#e7bd70')}"/><path d="M43 26 Q32 14 34 10 M47 26 Q58 14 56 10" fill="none"/><circle cx="23" cy="34" r="7" fill="${f('#fff4d8')}"/><circle cx="67" cy="34" r="7" fill="${f('#fff4d8')}"/>`,
   apple:`<path d="M45 27 C19 8 6 34 16 58 C24 82 38 77 45 73 C55 80 73 77 79 54 C90 23 62 12 45 27Z" fill="${f('#ef8983')}"/><path d="M45 27 Q41 15 48 8" fill="none"/><path d="M48 18 Q54 2 72 9 Q68 25 48 18Z" fill="${f('#8fc18b')}"/><path d="M26 32 Q18 41 23 50" fill="none"/>`,
   pear:`<path d="M44 22 Q29 19 29 37 Q27 46 17 56 Q4 77 44 81 Q81 79 72 59 Q58 43 58 34 Q58 20 44 22Z" fill="${f('#c8d98c')}"/><path d="M44 23 Q42 12 48 6" fill="none"/><path d="M48 15 Q60 1 71 12 Q66 23 48 15Z" fill="${f('#83b97b')}"/><path d="M25 60 Q20 67 27 72" fill="none"/>`,
   strawberry:`<path d="M15 32 Q8 58 44 82 Q79 59 76 34 Q68 14 45 27 Q24 14 15 32Z" fill="${f('#ef8b96')}"/><path d="M45 27 L24 16 L31 30 L17 33 L38 36 L45 44 L50 33 L73 31 L59 25 L65 15 L49 24 L46 10Z" fill="${f('#8fb77e')}"/><path d="M25 46 l2 3 M40 48 l2 3 M57 44 l2 3 M31 58 l2 3 M47 61 l2 3 M60 55 l2 3 M44 72 l1 1" fill="none"/>`,
   banana:`<path d="M18 19 Q22 66 68 60 L75 68 Q45 88 20 64 Q1 44 10 21Z" fill="${f('#ffe28a')}"/><path d="M18 19 L17 11 L10 11 L10 21 M68 60 L75 56 L80 62 L75 68 M19 32 Q23 61 60 67" fill="none"/>`,
   pencil:`<path d="M22 67 L63 12 L78 24 L38 78 L15 84Z" fill="${f('#ffd978')}"/><path d="M63 12 L68 6 Q71 3 75 6 L84 13 Q88 16 84 21 L78 29Z" fill="${f('#ed9baf')}"/><path d="M60 18 L75 30 M22 67 L38 78 M26 69 L66 22 M32 74 L72 27 M15 84 L21 73 L27 81Z" fill="none"/>`,
   book:`<path d="M18 14 L70 9 Q76 8 77 15 L77 69 Q76 76 69 77 L22 83 Q14 83 14 75 L14 22 Q14 16 18 14Z" fill="${f('#9fc99b')}"/><path d="M23 68 Q12 68 15 77 Q17 82 23 78 L73 72 L73 65Z" fill="#fff"/><path d="M23 15 L23 68 L72 62" fill="none"/><path d="M33 29 L62 25 M33 39 L60 35" fill="none"/>`,
   backpack:`<path d="M33 21 L33 14 Q45 3 57 14 L57 21" fill="none"/><path d="M20 38 Q20 20 44 20 Q70 20 70 39 L74 77 Q46 86 16 77Z" fill="${f('#e9a0a2')}"/><path d="M27 47 L62 47 L65 70 Q45 76 25 70Z" fill="${f('#f4c77e')}"/><path d="M27 53 L62 53 M57 53 L57 61 M28 36 Q45 27 63 37 M19 43 L11 48 L9 70 L17 70 M70 43 L79 48 L81 70 L73 70" fill="none"/>`,
   ruler:`<rect x="10" y="29" width="72" height="30" rx="4" fill="${f('#f4cf8d')}"/><path d="M20 30 V45 M30 30 V40 M40 30 V45 M50 30 V40 M60 30 V45 M70 30 V40" fill="none"/><circle cx="19" cy="51" r="2" fill="none"/>`
  };
  return `<svg class="math-picture" viewBox="0 0 90 90" role="img" aria-label="${esc(labels[id])}" xmlns="http://www.w3.org/2000/svg"><g stroke="#292929" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${art[id]||art.duck}</g></svg>`;
 }
 function build(settings){
  const kind=['choose','add','color'].includes(settings.kind)?settings.kind:'choose';
  const limit=[3,5,10].includes(Number(settings.limit))?Number(settings.limit):5;
  const count=kind==='choose'?4:kind==='add'?([3,4].includes(Number(settings.count))?Number(settings.count):3):([2,3].includes(Number(settings.count))?Number(settings.count):2);
  const seed=Math.abs(Math.trunc(Number(settings.seed)||0));
  const items=themes[settings.theme]||themes.Animales;
  return Array.from({length:count},(_,i)=>{
   const quantity=1+(seed+i*(limit===3?1:3)+1)%limit;
   const choices=[quantity,quantity%limit+1,(quantity+1)%limit+1];
   const rotate=(seed+i)%3;const ordered=choices.slice(rotate).concat(choices.slice(0,rotate));
   const total=2+(seed+i*3)%(limit-1),left=1+(seed+i)%(total-1);
   return {id:items[(seed+i)%items.length],quantity,choices:ordered,left,right:total-left,total,available:Math.min(12,quantity+2+(i%2))};
  });
 }
 function markup(settings){
  const kind=settings.kind,rows=build(settings),ink=kind==='color'?'coloring':settings.ink;
  const pictures=(id,n)=>Array.from({length:n},()=>icon(id,ink)).join('');
  const instruction=kind==='add'?'RESUELVE LAS SUMAS CON DIBUJOS':kind==='color'?'COLOREA TANTOS DIBUJOS COMO INDICA EL NÚMERO':'CUENTA Y RODEA EL NÚMERO CORRECTO';
  const cards=rows.map((r,i)=>kind==='add'?`<section class="picture-exercise picture-sum" aria-label="Suma ${i+1}"><div class="picture-set" style="--items:${r.left}">${pictures(r.id,r.left)}</div><b class="math-sign">+</b><div class="picture-set" style="--items:${r.right}">${pictures(r.id,r.right)}</div><b class="math-sign">=</b><span class="picture-answer" aria-label="Escribe el resultado"></span></section>`:kind==='color'?`<section class="picture-exercise picture-color-row"><strong class="picture-target">${r.quantity}</strong><div class="picture-set" style="--items:${r.available}">${pictures(r.id,r.available)}</div></section>`:`<section class="picture-exercise picture-choice"><div class="picture-set" style="--items:${r.quantity}">${pictures(r.id,r.quantity)}</div><div class="picture-options">${r.choices.map(n=>`<span>${n}</span>`).join('')}</div></section>`).join('');
  return `<main class="picture-math picture-kind-${kind}"><h2>${instruction}</h2><div class="picture-exercises" style="--exercise-count:${rows.length}">${cards}</div></main>`;
 }
 return {themes:Object.keys(themes),build,markup,icon};
})();
