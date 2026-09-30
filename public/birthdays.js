'use strict';
(() => {
  const KEY = 'rosa-birthdays-v1';
  const MONTHS = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const SKINS = ['#f7cfb0','#dfa478','#ad704e','#704831'];
  const HAIRS = ['#342119','#8d4828','#d9a34a','#292c3b'];
  const CLOTHES = ['#ec6290','#58a5d2','#7cba86','#f3ac52','#a789d3','#e85952','#f5d764','#fafafa'];
  const BOTTOMS = ['#466b9c','#a58bc7','#e988a8','#e8b758','#7baf81','#679ba9','#dd6861','#595266'];
  const SHOES = ['#685382','#4987bb','#eb7995','#d75b56','#e9bd55','#6aa985','#95684f','#37394e'];
  const STICKERS = ['crown','party-hat','blue-balloon','red-balloon','bunting','present','cake','cupcake','star','heart','bow','flower','confetti','candle','doll','toy-car','teddy','rocket','train','ball','book','butterfly'];
  const STICKER_LABELS = ['CORONA','GORRO','GLOBO AZUL','GLOBO ROJO','GUIRNALDA','REGALO','TARTA','MAGDALENA','ESTRELLA','CORAZÓN','LAZO','FLOR','CONFETI','VELA','MUÑECA','COCHE','OSITO','COHETE','TREN','PELOTA','CUENTO','MARIPOSA'];
  const PROBLEMS = [
    { first: 'LUCAS', firstCount: 3, firstType: 'blue-balloon', firstLabel: 'AZULES', second: 'VALERIA', secondCount: 2, secondType: 'red-balloon', secondLabel: 'ROJOS', extraType: 'yellow-balloon', extraLabel: 'AMARILLOS' },
    { first: 'ALMA', firstCount: 4, firstType: 'green-balloon', firstLabel: 'VERDES', second: 'SERGIO', secondCount: 1, secondType: 'orange-balloon', secondLabel: 'NARANJA', extraType: 'purple-balloon', extraLabel: 'MORADOS' },
    { first: 'EMMA', firstCount: 2, firstType: 'yellow-balloon', firstLabel: 'AMARILLOS', second: 'MARTÍN', secondCount: 3, secondType: 'purple-balloon', secondLabel: 'MORADOS', extraType: 'blue-balloon', extraLabel: 'AZULES' }
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const freshAvatar = () => ({ skin: 0, hair: 0, hairStyle: 'short', eyes: '#4c352e', clothes: 0, bottoms: 0, shoes: 0, outfit: 'shirt', glasses: false });
  const freshScene = () => ({ avatar: freshAvatar(), avatarPosition: { x: .5, y: .52 }, stickers: [], strokes: [], wishes: [], candles: [], lit: false });
  const storage = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      return value && typeof value === 'object' && !Array.isArray(value)
        ? { birthdays: value.birthdays || {}, drafts: value.drafts || {}, memories: value.memories || {}, extra: value.extra || [] }
        : { birthdays: {}, drafts: {}, memories: {}, extra: [] };
    } catch { return { birthdays: {}, drafts: {}, memories: {}, extra: [] }; }
  })();
  const ui = { screen: 'home', mode: 'celebrate', name: '', month: new Date().getMonth(), year: new Date().getFullYear(), challengeStep: 'balloons', problemIndex: 0, placedBalloons: [], mistake: false, answer: null, candlesAdded: 0, scene: freshScene(), sticker: '', selectedSticker: '', turn: 0, bookIndex: 0, drawing: false, stroke: null, drag: null, confetti: false, message: '' };
  const roster = () => [...new Set([...(window.ROSA?.students || []), ...storage.extra])];
  // La seño facilitará los demás cumpleaños. Los datos anteriores del navegador se conservan, pero no se muestran.
  const birthday = name => name.toLocaleLowerCase('es') === 'marcelo' ? { day: 30, month: 9, age: 4 } : { day: '', month: '', age: 4 };
  const id = () => String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);
  const schoolYear = () => { const now = new Date(), first = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1; return `${first}/${String((first + 1) % 100).padStart(2, '0')}`; };
  const sceneKey = name => `${schoolYear()}:${name}`;
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(storage)); return true; } catch { ui.message = 'No se ha podido guardar en este navegador. Descarga el recuerdo antes de salir.'; return false; } };
  const persist = () => { if (ui.name) storage.drafts[sceneKey(ui.name)] = JSON.parse(JSON.stringify(ui.scene)); store(); };
  const routeActive = () => location.hash.slice(1).split('?')[0] === 'pdi-cumpleanos';
  const root = () => document.querySelector('#pdi-birthdays');
  const button = (label, action, className = '') => `<button type="button" class="${className}" data-bd-action="${action}">${label}</button>`;
  const age = () => Math.min(10, Math.max(1, Number(birthday(ui.name).age) || 4));
  const collageHasContent = scene => (scene.stickers || []).length > 0 || (scene.strokes || []).some(stroke => stroke?.length);
  const today = () => { const now = new Date(); return { day: now.getDate(), month: now.getMonth() + 1 }; };
  const isToday = name => { const b = birthday(name), d = today(); return Number(b.day) === d.day && Number(b.month) === d.month; };

  function stickerArt(type) {
    const shapes = {
      crown: '<path d="M13 70 8 27 30 44 50 15 70 44 92 27 87 70Z" fill="#f8c95a"/><path d="M13 70 H87 V82 Q50 91 13 82Z" fill="#ef9c51"/><circle cx="50" cy="56" r="7" fill="#f17883"/><circle cx="27" cy="58" r="5" fill="#83b8b4"/><circle cx="73" cy="58" r="5" fill="#83b8b4"/>',
      'party-hat': '<path d="M18 82 49 13 83 82Z" fill="#ac8bd6"/><path d="M31 54 69 54 M24 71 76 71" stroke="#f5cb58" stroke-width="7"/><circle cx="49" cy="13" r="10" fill="#ed7f91"/><path d="M12 84 Q50 93 89 84" fill="none" stroke="#9057a9" stroke-width="7"/>',
      'blue-balloon': '<path d="M50 72 Q17 47 30 22 Q38 5 54 11 Q78 12 78 38 Q76 61 50 72Z" fill="#78bfe0"/><path d="M50 73 44 82 H56Z" fill="#78bfe0"/><path d="M50 82 Q66 93 51 98" fill="none" stroke="#657790" stroke-width="3"/><path d="M39 21 Q30 36 36 45" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
      'red-balloon': '<path d="M50 72 Q17 47 30 22 Q38 5 54 11 Q78 12 78 38 Q76 61 50 72Z" fill="#ec7d82"/><path d="M50 73 44 82 H56Z" fill="#ec7d82"/><path d="M50 82 Q66 93 51 98" fill="none" stroke="#657790" stroke-width="3"/><path d="M39 21 Q30 36 36 45" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
      bunting: '<path d="M6 25 Q50 55 94 25" fill="none" stroke="#7f8ca2" stroke-width="3"/><path d="M10 29 27 37 19 69Z" fill="#ee8598"/><path d="M31 39 49 43 40 76Z" fill="#f4cb64"/><path d="M53 43 71 37 62 76Z" fill="#8ecab2"/><path d="M76 34 92 27 84 66Z" fill="#a58fd1"/>',
      present: '<rect x="18" y="35" width="64" height="52" rx="7" fill="#9cb7df"/><rect x="12" y="27" width="76" height="15" rx="5" fill="#749bcc"/><path d="M45 28 H56 V87 H45Z" fill="#f7d270"/><path d="M50 27 Q13 26 30 10 Q44 4 50 27 M50 27 Q88 24 72 10 Q56 3 50 27" fill="none" stroke="#ed9bae" stroke-width="8" stroke-linecap="round"/>',
      cake: '<path d="M13 45 H87 V85 Q50 94 13 85Z" fill="#f2a2bd"/><path d="M13 46 Q22 62 32 46 Q42 62 51 46 Q62 62 71 46 Q80 62 87 46 V39 H13Z" fill="#fff0d9"/><path d="M24 40 V29 M50 40 V29 M76 40 V29" stroke="#8dc4af" stroke-width="6"/><path d="M24 25 Q18 18 25 13 Q31 20 24 25 M50 25 Q44 18 51 13 Q57 20 50 25 M76 25 Q70 18 77 13 Q83 20 76 25" fill="#f5b849"/><ellipse cx="50" cy="88" rx="45" ry="5" fill="#d6a6ba"/>',
      cupcake: '<path d="M24 50 H76 L69 86 H31Z" fill="#96c3be"/><path d="M23 51 Q13 43 25 36 Q19 26 32 24 Q36 11 50 19 Q65 12 69 26 Q85 28 76 40 Q88 51 75 52Z" fill="#f5b5c8"/><circle cx="50" cy="21" r="6" fill="#e86679"/><path d="M40 60 V79 M53 60 V80 M65 60 V78" stroke="#eaf4ef" stroke-width="3"/>',
      star: '<path d="M50 9 61 37 91 39 67 59 75 89 50 73 25 89 33 59 9 39 39 37Z" fill="#f5cd63"/><circle cx="42" cy="50" r="2" fill="#77556f"/><circle cx="58" cy="50" r="2" fill="#77556f"/><path d="M44 59 Q50 64 56 59" fill="none" stroke="#77556f" stroke-width="2"/>',
      heart: '<path d="M50 85 Q8 55 12 30 Q16 7 38 17 Q46 22 50 31 Q59 10 79 18 Q101 33 83 58Z" fill="#ef8a9b"/><path d="M29 26 Q18 37 26 47" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
      bow: '<path d="M45 43 Q12 11 12 48 Q10 77 45 54 M55 43 Q88 11 88 48 Q90 77 55 54" fill="#eaa0c7"/><path d="M44 54 32 83 50 71 69 84 56 54" fill="#be74a8"/><circle cx="50" cy="49" r="10" fill="#f5ca6c"/>',
      flower: '<circle cx="50" cy="27" r="15" fill="#f3a5ad"/><circle cx="72" cy="42" r="15" fill="#f3a5ad"/><circle cx="64" cy="69" r="15" fill="#f3a5ad"/><circle cx="36" cy="69" r="15" fill="#f3a5ad"/><circle cx="28" cy="42" r="15" fill="#f3a5ad"/><circle cx="50" cy="49" r="16" fill="#f7d66b"/>',
      confetti: '<path d="M15 80 42 42 63 63 25 89Z" fill="#ad8acb"/><path d="M22 73 40 54 M34 82 51 65" stroke="#f9d36a" stroke-width="6"/><path d="M65 21 79 12 M75 43 94 40 M57 25 55 8 M85 62 96 71" stroke="#ed8593" stroke-width="5" stroke-linecap="round"/><circle cx="72" cy="74" r="4" fill="#8bc5b1"/><circle cx="85" cy="26" r="4" fill="#f3c35b"/>',
      candle: '<rect x="35" y="29" width="30" height="61" rx="6" fill="#88b9d0"/><path d="M36 50 65 37 M36 69 65 56 M37 88 65 75" stroke="#f9e0a6" stroke-width="6"/><path d="M50 25 Q38 13 50 4 Q63 17 50 25" fill="#eeab4b"/>',
      doll: '<path d="M27 45 Q15 31 25 19 Q38 11 44 20 M73 45 Q85 31 75 19 Q62 11 56 20" fill="#68475c"/><circle cx="50" cy="33" r="20" fill="#e6ad87"/><path d="M29 31 Q26 12 49 12 Q74 11 72 31 Q57 23 50 17 Q39 30 29 31" fill="#68475c"/><circle cx="42" cy="35" r="2"/><circle cx="58" cy="35" r="2"/><path d="M40 55 H60 L77 83 H23Z" fill="#ac8ccd"/><path d="M36 82 V96 M64 82 V96" stroke="#e6ad87" stroke-width="8"/>',
      'toy-car': '<path d="M12 50 H23 L33 32 H68 L80 50 H87 Q93 50 93 57 V72 H8 V57 Q8 50 12 50Z" fill="#eb786f"/><path d="M37 37 H64 L72 50 H28Z" fill="#bce1e8"/><circle cx="27" cy="73" r="11" fill="#55556e"/><circle cx="73" cy="73" r="11" fill="#55556e"/><circle cx="27" cy="73" r="4" fill="#fff"/><circle cx="73" cy="73" r="4" fill="#fff"/>',
      teddy: '<circle cx="26" cy="23" r="13" fill="#b58b67"/><circle cx="74" cy="23" r="13" fill="#b58b67"/><circle cx="50" cy="39" r="28" fill="#c9a27d"/><ellipse cx="50" cy="72" rx="30" ry="24" fill="#c9a27d"/><ellipse cx="50" cy="44" rx="12" ry="10" fill="#efd4b2"/><circle cx="42" cy="34" r="3" fill="#4c3f47"/><circle cx="58" cy="34" r="3" fill="#4c3f47"/><circle cx="50" cy="43" r="4" fill="#4c3f47"/><ellipse cx="50" cy="75" rx="13" ry="14" fill="#efd4b2"/>',
      rocket: '<path d="M50 9 Q75 28 65 72 H35 Q25 28 50 9Z" fill="#8bb4d7"/><circle cx="50" cy="43" r="11" fill="#ffdf9e"/><path d="M35 59 21 81 36 77 M65 59 79 81 64 77" fill="#e98b9a"/><path d="M39 73 Q50 100 61 73Z" fill="#ffbb63"/>',
      train: '<rect x="25" y="25" width="58" height="54" rx="9" fill="#89b9af"/><rect x="34" y="34" width="40" height="22" rx="4" fill="#f8e7b5"/><path d="M14 77 H92" stroke="#755569" stroke-width="6"/><circle cx="38" cy="78" r="8" fill="#5f5576"/><circle cx="70" cy="78" r="8" fill="#5f5576"/><path d="M42 67 H67" stroke="#fff" stroke-width="5"/>',
      ball: '<circle cx="50" cy="50" r="39" fill="#f2d87b"/><path d="M20 25 Q50 37 80 25 M12 57 Q50 77 88 57 M49 12 Q29 50 49 88 M50 12 Q75 50 50 88" fill="none" stroke="#ed9ea5" stroke-width="6"/>',
      book: '<path d="M10 22 Q32 12 50 26 Q69 12 90 22 V82 Q66 72 50 86 Q30 72 10 82Z" fill="#a493d0"/><path d="M50 26 V86 M21 37 Q35 33 43 40 M57 40 Q68 33 79 37 M20 55 Q35 51 43 58 M57 58 Q68 51 79 55" fill="none" stroke="#fff3d8" stroke-width="4"/>',
      butterfly: '<path d="M49 48 Q16 6 10 39 Q9 55 42 57 Q16 75 26 88 Q40 96 50 60 Q60 96 74 88 Q84 75 58 57 Q91 55 90 39 Q84 6 51 48Z" fill="#a9a1de"/><path d="M50 42 V76 M50 46 Q34 18 28 20 M50 46 Q66 18 72 20" stroke="#614f80" stroke-width="4" fill="none"/><circle cx="29" cy="45" r="6" fill="#f5d37a"/><circle cx="71" cy="45" r="6" fill="#f5d37a"/>'
    };
    const balloonColors = { 'green-balloon':'#84c79b', 'orange-balloon':'#f3ae66', 'yellow-balloon':'#f5d36d', 'purple-balloon':'#ad9ad7' };
    if (balloonColors[type]) shapes[type] = shapes['blue-balloon'].replaceAll('#78bfe0',balloonColors[type]);
    if (!shapes[type]) return `<span class="bd-legacy-sticker">${esc(type)}</span>`;
    return `<svg class="bd-sticker-art" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g stroke="#704d66" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${shapes[type]}</g></svg>`;
  }

  function avatarSvg(avatar = ui.scene.avatar) {
    const a = { ...freshAvatar(), ...avatar }, skin = SKINS[a.skin] || SKINS[0], hair = HAIRS[a.hair] || HAIRS[0], cloth = CLOTHES[a.clothes] || CLOTHES[0], bottomColor = BOTTOMS[a.bottoms] || BOTTOMS[0], shoeColor = SHOES[a.shoes] || SHOES[0];
    const long = ['long','wavy','tails','braid'].includes(a.hairStyle);
    const back = long ? `<path d="M51 91 Q48 18 110 20 Q175 17 170 95 L175 161 Q154 182 138 149 L80 149 Q58 180 44 157Z" fill="${hair}"/>` : '';
    const fringe = a.hairStyle === 'fringe' ? `<path d="M53 76 Q52 28 110 26 Q162 25 167 75 Q143 86 129 57 Q109 86 89 62 Q78 84 53 76Z" fill="${hair}"/>` : `<path d="M53 79 Q50 25 110 26 Q166 22 168 76 Q144 70 132 47 Q108 72 53 79Z" fill="${hair}"/>`;
    const curls = ['curly','afro'].includes(a.hairStyle) ? [55,70,88,108,128,146,163].map((x,i) => `<circle cx="${x}" cy="${[67,47,35,32,34,47,67][i]}" r="${a.hairStyle === 'afro' ? 22 : 15}" fill="${hair}"/>`).join('') : '';
    const waves = a.hairStyle === 'wavy' ? `<path d="M51 90 Q41 111 54 127 Q38 142 48 158 M169 90 Q181 111 167 127 Q183 142 174 158" stroke="${hair}" stroke-width="18" stroke-linecap="round" fill="none"/>` : '';
    const tails = a.hairStyle === 'tails' ? `<path d="M54 61 Q24 43 26 87 Q24 126 40 140 Q54 118 51 80 M166 61 Q195 41 193 87 Q196 126 179 140 Q166 118 169 80" fill="${hair}"/><circle cx="47" cy="72" r="7" fill="#f6a6bf"/><circle cx="173" cy="72" r="7" fill="#f6a6bf"/>` : '';
    const braid = a.hairStyle === 'braid' ? `<path d="M158 72 Q188 103 171 129 L178 151" fill="none" stroke="${hair}" stroke-width="17" stroke-linecap="round"/><circle cx="177" cy="155" r="9" fill="${hair}"/>` : '';
    const bun = a.hairStyle === 'bun' ? `<circle cx="110" cy="29" r="25" fill="${hair}"/>` : '';
    const legs = `<path d="M89 205 V240 M130 205 V240" fill="none" stroke="${skin}" stroke-width="20" stroke-linecap="round"/><path d="M79 236 Q90 232 99 239 V249 H71 Q70 240 79 236 M120 239 Q132 232 143 237 Q151 240 149 249 H120Z" fill="${shoeColor}"/>`;
    const arms = `<path d="M70 166 Q54 190 46 214 M150 166 Q166 190 174 214" fill="none" stroke="${skin}" stroke-width="17" stroke-linecap="round"/><circle cx="45" cy="217" r="10" fill="${skin}"/><circle cx="175" cy="217" r="10" fill="${skin}"/>`;
    const top = `<path d="M72 157 Q110 145 148 157 L151 202 Q110 207 69 202Z" fill="${cloth}"/><path d="M71 155 L59 180 L52 174 L62 155Z M149 155 L161 180 L168 174 L158 155Z" fill="${cloth}"/><path d="M88 153 Q110 163 132 153" fill="none" stroke="#ffffff99" stroke-width="3"/>`;
    const bottom = a.outfit === 'dress' ? `<path d="M71 190 Q110 199 149 190 L169 230 Q110 241 51 230Z" fill="${bottomColor}"/><path d="M72 195 Q110 204 148 195 M83 211 L79 228 M110 213 V233 M137 211 L141 228" fill="none" stroke="#ffffff88" stroke-width="3"/>` : a.outfit === 'overalls' ? `<path d="M75 176 H145 V225 H114 V211 H106 V225 H75Z" fill="${bottomColor}"/><path d="M80 156 L80 188 M140 156 L140 188" stroke="${bottomColor}" stroke-width="12"/><circle cx="80" cy="188" r="3" fill="#fff"/><circle cx="140" cy="188" r="3" fill="#fff"/>` : a.outfit === 'skirt' ? `<path d="M70 201 Q110 206 150 201 L164 229 Q110 239 56 229Z" fill="${bottomColor}"/><path d="M84 210 L79 228 M110 211 V232 M136 210 L141 228" stroke="#ffffff88" stroke-width="3"/>` : a.outfit === 'shorts' ? `<path d="M69 203 H151 V226 H114 V211 H106 V226 H69Z" fill="${bottomColor}"/>` : `<path d="M69 203 H151 V237 H115 V213 H105 V237 H69Z" fill="${bottomColor}"/>`;
    return `<svg class="bd-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260" role="img" aria-label="Avatar infantil"><ellipse cx="110" cy="251" rx="76" ry="6" fill="#ead8e0"/>${back}${waves}${tails}${braid}${bun}${legs}${arms}<path d="M82 138 H138 V172 H82Z" fill="${skin}"/>${top}${bottom}<circle cx="110" cy="92" r="59" fill="${skin}"/><circle cx="51" cy="103" r="10" fill="${skin}"/><circle cx="169" cy="103" r="10" fill="${skin}"/>${fringe}${curls}<circle cx="87" cy="96" r="5" fill="${esc(a.eyes)}"/><circle cx="133" cy="96" r="5" fill="${esc(a.eyes)}"/><path d="M95 121 Q110 133 125 121" fill="none" stroke="#a85f60" stroke-width="3" stroke-linecap="round"/>${a.glasses ? '<g fill="none" stroke="#45405b" stroke-width="4"><circle cx="87" cy="95" r="18"/><circle cx="133" cy="95" r="18"/><path d="M105 91 H115 M49 91 H69 M151 91 H171"/></g>' : ''}</svg>`;
  }

  function nav() {
    const steps = [['avatar','1 · MI AVATAR'],['collage','2 · COLLAGE'],['challenge','3 · RETO'],['cake','4 · TARTA'],['final','5 · RECUERDO']];
    return `<nav class="bd-steps" aria-label="Pasos del cumpleaños">${steps.map(([screen,label]) => `<button type="button" data-bd-action="go-${screen}" class="${ui.screen === screen ? 'active' : ''}" ${!ui.name ? 'disabled' : ''}>${label}</button>`).join('')}</nav>`;
  }
  function home() {
    const entries = roster().map(name => { const b = birthday(name); return { name, month: Number(b.month) || 13, day: Number(b.day) || 32 }; }).sort((a,b) => a.month - b.month || a.day - b.day || a.name.localeCompare(b.name, 'es'));
    const celebrating = entries.filter(({name}) => isToday(name));
    const month = ui.month + 1, days = new Date(ui.year,month,0).getDate(), offset = (new Date(ui.year,ui.month,1).getDay()+6)%7;
    const cells = Array.from({length:offset},()=>'<div class="bd-calendar-blank" aria-hidden="true"></div>');
    for (let day=1;day<=days;day++) {
      const kids = entries.filter(item => item.month === month && item.day === day);
      const current = today();
      cells.push(`<div class="bd-calendar-day ${kids.length ? 'has-birthday' : ''} ${day === current.day && month === current.month && ui.year === new Date().getFullYear() ? 'is-today' : ''}"><span class="bd-day-number">${day}</span>${kids.map(({name}) => `<button type="button" data-bd-child="${esc(name)}" aria-label="Celebrar cumpleaños de ${esc(name)} el ${day} de ${MONTHS[ui.month].toLowerCase()}"><span class="bd-calendar-cake">🎂</span><strong>¡${esc(name.toUpperCase())}!</strong><small>${birthday(name).age} AÑOS</small></button>`).join('')}</div>`);
    }
    const undated = entries.filter(item => item.month === 13);
    return `${celebrating.length ? `<div class="bd-birthday-hero"><span class="bd-hero-confetti" aria-hidden="true">✦ 🎉 ✦</span><div><small>HOY ES UN DÍA ESPECIAL</small><h2>¡FELIZ CUMPLEAÑOS, ${esc(celebrating[0].name.toUpperCase())}!</h2><strong>🎂 ${birthday(celebrating[0].name).age} AÑOS 🎈</strong></div><button type="button" data-bd-child="${esc(celebrating[0].name)}">¡VAMOS A CELEBRARLO! →</button></div>` : ''}<div class="bd-calendar"><div class="bd-calendar-head">${button('‹','month-prev','secondary')}<h2>🎈 ${MONTHS[ui.month]} ${ui.year} 🎈</h2>${button('›','month-next','secondary')}</div><p>TOCA EL NOMBRE DEL CUMPLEAÑERO PARA EMPEZAR</p><div class="bd-calendar-grid">${['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map(day=>`<strong class="bd-weekday">${day}</strong>`).join('')}${cells.join('')}</div></div><div class="bd-home-actions">${button('🎨 TALLER DE CUMPLE','workshop','secondary')}${button('📖 LIBRO DE CUMPLEAÑOS','book','secondary')}</div>${undated.length ? `<details class="bd-undated"><summary>OTROS NIÑOS DE LA CLASE</summary><div class="bd-roster">${undated.map(({name})=>`<button type="button" class="bd-child" data-bd-child="${esc(name)}"><span class="bd-child-icon">🎂</span><strong>${esc(name.toUpperCase())}</strong></button>`).join('')}</div></details>` : ''}`;
  }
  function avatar() {
    const a = ui.scene.avatar;
    const chips = (key, values, labels) => `<div class="bd-control"><strong>${labels[0]}</strong><div>${values.map((value,i) => `<button type="button" data-bd-avatar="${key}" data-bd-value="${esc(value)}" aria-pressed="${String(a[key]) === String(value)}" class="${String(a[key]) === String(value) ? 'active' : ''}">${labels[i+1]}</button>`).join('')}</div></div>`;
    return `<div class="bd-avatar-layout"><div class="bd-avatar-controls">${chips('skin',[0,1,2,3],['PIEL','1','2','3','4'])}${chips('hairStyle',['short','fringe','long','wavy','curly','afro','tails','braid','bun'],['PELO','CORTO','FLEQUILLO','LARGO','ONDULADO','RIZADO','AFRO','COLETAS','TRENZA','MOÑO'])}${chips('hair',[0,1,2,3],['COLOR DE PELO','MORENO','CASTAÑO','RUBIO','NEGRO'])}${chips('eyes',['#4c352e','#4381a9','#4b8a60'],['OJOS','MARRÓN','AZUL','VERDE'])}${chips('clothes',[0,1,2,3,4,5,6,7],['COLOR DE ROPA','ROSA','AZUL','VERDE','NARANJA','LILA','ROJO','AMARILLO','BLANCO'])}${chips('bottoms',[0,1,2,3,4,5,6,7],['COLOR DE ABAJO','AZUL','LILA','ROSA','AMARILLO','VERDE','TURQUESA','ROJO','OSCURO'])}${chips('shoes',[0,1,2,3,4,5,6,7],['COLOR DE ZAPATOS','MORADO','AZUL','ROSA','ROJO','AMARILLO','VERDE','MARRÓN','NEGRO'])}${chips('outfit',['shirt','shorts','skirt','dress','overalls'],['ROPA','PANTALÓN','PANTALÓN CORTO','FALDA','VESTIDO','PETO'])}${chips('glasses',[false,true],['GAFAS','SIN GAFAS','CON GAFAS'])}</div><div class="bd-avatar-focus">${avatarSvg()}<strong>ASÍ SOY YO</strong></div></div><div class="bd-next">${button('QUE VENGAN MIS AMIGOS →','go-collage')}</div>`;
  }
  function workshop() {
    return `<div class="bd-workshop"><h2>¿QUÉ PREPARAMOS HOY PARA ${esc(ui.name.toUpperCase())}?</h2><p>ELIGE UNA ACTIVIDAD. PUEDES VOLVER A ELLA CUANDO QUIERAS.</p><div>${button('👧 CREAR AVATAR','go-avatar')}${button('🎨 COLLAGE COLECTIVO','go-collage','secondary')}${button('🎈 GLOBOS Y VELAS','go-challenge','secondary')}${button('🎂 ENCENDER LA TARTA','go-cake','secondary')}</div></div>`;
  }
  function stage(isCollage = false) {
    const stickers = ui.scene.stickers;
    const pos = ui.scene.avatarPosition || {x:.5,y:.52};
    return `<div class="bd-stage ${isCollage ? 'bd-stage-collage' : ''} ${ui.drawing ? 'is-drawing' : ''}" data-bd-stage="collage"><div class="bd-stage-decor bd-stage-decor-left">✦</div><div class="bd-stage-decor bd-stage-decor-right">✦</div><div class="bd-stage-person" data-bd-person style="left:${pos.x*100}%;top:${pos.y*100}%" aria-label="Arrastrar avatar">${avatarSvg()}</div>${ui.screen === 'final' ? `<div class="bd-final-cake" aria-label="Tarta de ${age()} años">🎂 <strong>${age()}</strong></div>` : ''}${stickers.map(item => `<button type="button" class="bd-sticker ${ui.selectedSticker === item.id ? 'selected' : ''}" data-bd-sticker="${esc(item.id)}" style="left:${item.x*100}%;top:${item.y*100}%;width:${item.size}px;height:${item.size}px;transform:translate(-50%,-50%) rotate(${item.rotate}deg)" aria-label="Mover ${esc(STICKER_LABELS[STICKERS.indexOf(item.emoji)] || item.emoji)}">${stickerArt(item.emoji)}</button>`).join('')}${isCollage ? '<canvas class="bd-ink" data-bd-ink aria-label="Dibujo del collage"></canvas>' : ''}</div>`;
  }
  function palette() {
    return `<div class="bd-palette" aria-label="Pegatinas ilustradas">${STICKERS.map((type,i) => `<button type="button" data-bd-pick="${esc(type)}" class="${ui.sticker === type && !ui.drawing ? 'active' : ''}" aria-label="Elegir ${STICKER_LABELS[i]}">${stickerArt(type)}<small>${STICKER_LABELS[i]}</small></button>`).join('')}</div><div class="bd-sticker-tools">${button('MOVER AVATAR','move-avatar','secondary')}${button('AGRANDAR +','grow','secondary')}${button('REDUCIR −','shrink','secondary')}${button('GIRAR ↻','rotate','secondary')}${button('BORRAR','delete-sticker','secondary')}${button(ui.drawing ? '✏️ DIBUJAR ACTIVADO' : '✏️ DIBUJAR','draw','secondary')}</div><p class="bd-hint">Elige una ilustración y toca el collage para ponerla sobre el avatar o alrededor. Pulsa MOVER AVATAR para arrastrarlo.</p>`;
  }
  const classmates = () => roster().filter(name => name !== ui.name);
  function collage() {
    const names = classmates(), friend = names[ui.turn];
    return `<h2 class="bd-art-title">NUESTRO REGALO PARA ${esc(ui.name.toUpperCase())}</h2><div class="bd-turn">${friend ? `AHORA LE TOCA A <strong>${esc(friend.toUpperCase())}</strong> 💝` : '¡TODOS HAN PARTICIPADO!'} ${friend ? button('HECHO · SIGUIENTE AMIGO →','next-friend','secondary') : button('EMPEZAR OTRA VEZ','reset-turns','secondary')}</div><div class="bd-workspace">${palette()}${stage(true)}</div><div class="bd-next">${button('← MI AVATAR','go-avatar','secondary')}${button('EL RETO DE LOS GLOBOS →','go-challenge')}</div>`;
  }
  function challenge() {
    const name = esc(ui.name.toUpperCase());
    if (ui.challengeStep === 'candles') {
      const target = Math.max(4,age()), complete = 3+ui.candlesAdded >= target;
      return `<div class="bd-challenge bd-challenge-candles"><div class="bd-challenge-ribbon">RETO 2 DE 2 · LAS VELAS DE LA TARTA</div><h2>¿CUÁNTAS VELAS FALTAN?</h2><p>HOY ES EL CUMPLEAÑOS DE ${name} Y CUMPLE <strong>${target} AÑOS</strong>. EN LA TARTA YA HAY <strong>3 VELAS</strong>. ¿CUÁNTAS MÁS PONEMOS?</p><div class="bd-mini-cake"><div class="bd-mini-candles">${Array.from({length:3},()=>'<span class="bd-mini-candle">✦</span>').join('')}${Array.from({length:ui.candlesAdded},()=>'<span class="bd-mini-candle bd-new-candle">✦</span>').join('')}${complete ? '' : `<button type="button" class="bd-empty-candle" data-bd-action="add-candle" aria-label="Colocar una vela más">+<small>PON UNA VELA</small></button>`}</div><div class="bd-mini-frosting"></div><div class="bd-mini-body">${complete ? `${target} VELAS · ¡LO CONSEGUIMOS!` : `${3+ui.candlesAdded} VELAS · FALTAN ${target-3-ui.candlesAdded}`}</div><div class="bd-mini-plate"></div></div>${complete ? `<p class="bd-correct">¡MUY BIEN! ${target-3 === 1 ? 'FALTABA 1 VELA' : `FALTABAN ${target-3} VELAS`}.</p>` : '<p>TOCA EL HUECO PARA COLOCAR LAS VELAS QUE FALTAN.</p>'}<div class="bd-challenge-buttons">${button('← LOS GLOBOS','show-balloons','secondary')}${button('REPETIR','reset-candles','secondary')}</div></div><div class="bd-next">${button('← COLLAGE','go-collage','secondary')}${button('LA TARTA GRANDE →','go-cake')}</div>`;
    }
    const problem = PROBLEMS[ui.problemIndex];
    const ordered = [...Array(problem.firstCount).fill(problem.firstType), ...Array(problem.secondCount).fill(problem.secondType), problem.extraType, problem.extraType];
    const all = [ordered[0],ordered[5],ordered[4],ordered[1],ordered[6],ordered[2],ordered[3]];
    const placed = ui.placedBalloons;
    const balloon = (type,i,atDoor) => `<span class="bd-challenge-balloon ${atDoor ? 'at-door' : ''}" style="--order:${i}">${stickerArt(type)}</span>`;
    const selected = `${problem.firstCount} + ${problem.secondCount} = 5`;
    return `<div class="bd-challenge bd-challenge-balloons"><div class="bd-challenge-ribbon">RETO 1 DE 2 · EL DILEMA DE LOS GLOBOS · ${ui.problemIndex+1} DE ${PROBLEMS.length}</div><h2>¡DECORAMOS LA PUERTA!</h2><p>PARA EL CUMPLE DE ${name}, ${problem.first} HA INFLADO <strong>${problem.firstCount} GLOBOS ${problem.firstLabel}</strong> Y ${problem.second} <strong>${problem.secondCount} GLOBOS ${problem.secondLabel}</strong>. HAY TAMBIÉN <strong>2 ${problem.extraLabel}</strong> DE OTRA FIESTA. ¿CUÁLES PONEMOS EN NUESTRA PUERTA?</p><div class="bd-balloon-game"><div class="bd-balloon-tray"><strong>ELIGE SOLO LOS 5 GLOBOS DE ESTE CUMPLE</strong><div>${all.map((type,i)=>placed.includes(i) ? '<span class="bd-balloon-empty" aria-hidden="true"></span>' : `<button type="button" data-bd-balloon="${i}" aria-label="Elegir globo ${type}">${balloon(type,i,false)}</button>`).join('')}</div><small>${problem.first}: ${problem.firstCount} ${problem.firstLabel} · ${problem.second}: ${problem.secondCount} ${problem.secondLabel}</small></div><div class="bd-class-door"><div class="bd-door-top">NUESTRA CLASE</div><div class="bd-door-balloons">${placed.map(i=>balloon(all[i],i,true)).join('')}</div><div class="bd-door-window">🎂</div><strong>${placed.length} DE 5 GLOBOS</strong></div></div><p class="bd-game-hint" role="status">${ui.mistake ? `ESE GLOBO ES DE OTRA FIESTA. BUSCA LOS ${problem.firstLabel} Y LOS ${problem.secondLabel}.` : placed.length === 5 ? `¡BIEN! ${selected} GLOBOS PARA NUESTRO CUMPLE.` : 'TOCA LOS GLOBOS QUE HAN INFLADO LOS DOS AMIGOS.'}</p>${placed.length === 5 ? `<div class="bd-answer"><strong>¿CUÁNTOS GLOBOS HEMOS JUNTADO?</strong><div>${[4,5,6].map(n=>`<button type="button" data-bd-answer="${n}" class="${ui.answer === n ? 'picked' : ''}" aria-label="Responder ${n}">${n}</button>`).join('')}</div><p aria-live="polite">${ui.answer === 5 ? '🎉 ¡SÍ! SON 5 GLOBOS' : ui.answer ? 'VAMOS A CONTARLOS OTRA VEZ' : 'CUÉNTALOS Y ELIGE UN NÚMERO'}</p></div>` : ''}<div class="bd-challenge-buttons">${button('REPETIR','reset-balloons','secondary')}${button('OTRO PROBLEMA','next-problem','secondary')}${ui.answer === 5 ? button('SIGUIENTE · LAS VELAS →','show-candles') : ''}</div></div><div class="bd-next">${button('← COLLAGE','go-collage','secondary')}${button('IR A LAS VELAS →','show-candles','secondary')}</div>`;
  }
  function cakeArt() {
    const count = age(), active = ui.scene.candles;
    return `<div class="bd-cake-art"><div class="bd-candles">${Array.from({ length: count }, (_,i) => `<button type="button" data-bd-candle="${i}" aria-label="Vela ${i+1}" aria-pressed="${!!active[i]}"><span class="bd-flame ${active[i] ? 'lit' : ''}">🔥</span><span class="bd-candle-stick"></span></button>`).join('')}</div><div class="bd-cake-top"></div><div class="bd-cake-body">🎂 ${esc(ui.name.toUpperCase())} 🎂</div><div class="bd-cake-plate"></div></div>`;
  }
  function cake() {
    const count = ui.scene.candles.filter(Boolean).length;
    return `<div class="bd-cake-page"><h2>¡CONTAMOS LAS VELAS!</h2><p>${esc(ui.name.toUpperCase())} CUMPLE ${age()} AÑOS</p>${cakeArt()}<strong>${count} DE ${age()} VELAS ENCENDIDAS</strong><div>${button('🔥 ENCENDER VELAS','light')}${button('💨 SOPLAR','blow','secondary')}</div>${ui.confetti ? '<div class="bd-confetti" aria-label="Celebración">🎉 ✨ 🎊 ⭐ 🎉</div>' : ''}</div><div class="bd-next">${button('← RETO','go-challenge','secondary')}${button('VER NUESTRO RECUERDO →','go-final')}</div>`;
  }
  function final() {
    const name = esc(ui.name.toUpperCase());
    const content = collageHasContent(ui.scene)
      ? `<h2>TUS COMPAÑEROS DEL COLE TE DESEAN ¡FELIZ CUMPLEAÑOS!</h2><p>${name}</p>${stage(true)}<div class="bd-final-foot"><strong>${age()} AÑOS</strong></div>`
      : `<div class="bd-empty-greeting"><span>TUS COMPAÑEROS DEL COLE</span><span>TE DESEAN</span><strong>¡FELIZ CUMPLEAÑOS!</strong><h2>${name}</h2></div>`;
    return `<div class="bd-final">${content}<div class="bd-final-actions">${button('📸 GUARDAR PNG','download')}${button('🖨️ IMPRIMIR A4','print','secondary')}${button('📖 GUARDAR EN EL LIBRO','save-memory','secondary')}</div></div>`;
  }
  function book() {
    const names = roster().filter(name => storage.memories[sceneKey(name)]);
    const current = names[Math.min(ui.bookIndex, names.length - 1)], scene = storage.memories[sceneKey(current)];
    const preview = scene ? `<div class="bd-book-page"><div><span>🎉 NUESTRO LIBRO DE CUMPLEAÑOS 🎉</span><h3>${esc(current.toUpperCase())}</h3></div>${avatarSvg(scene.avatar)}<div class="bd-book-stickers">${scene.stickers.slice(0,8).map(item => `<span>${stickerArt(item.emoji)}</span>`).join('')}</div>${button('ABRIR RECUERDO','open-book-memory')}</div>` : '';
    return `<div class="bd-book"><h2>NUESTRO LIBRO DE CUMPLEAÑOS ${schoolYear()}</h2><p>Recuerdos guardados en este navegador.</p>${names.length ? `<div class="bd-book-navigation">${button('← ANTERIOR','book-prev','secondary')}<strong>${ui.bookIndex + 1} DE ${names.length}</strong>${button('SIGUIENTE →','book-next','secondary')}</div>${preview}<div class="bd-roster">${names.map(name => `<button class="bd-child" type="button" data-bd-memory="${esc(name)}"><span class="bd-child-icon">📖</span><strong>${esc(name.toUpperCase())}</strong></button>`).join('')}</div>` : '<p class="bd-empty">AÚN NO HAY RECUERDOS. ¡EMPEZAMOS CON EL PRIMER CUMPLEAÑOS!</p>'}</div>`;
  }
  function page(navHtml = '') {
    const title = ui.name ? `EL DÍA ESPECIAL DE ${esc(ui.name.toUpperCase())}` : 'MI DÍA ESPECIAL';
    const screens = { home, workshop, avatar, collage, challenge, cake, final, book };
    return `<div id="pdi-birthdays" class="bd-page"><header class="page-head bd-header"><div><span class="eyebrow">🎂 PIZARRA DIGITAL · CUMPLEAÑOS</span><h1>${title}</h1><p>UNA CELEBRACIÓN CREADA ENTRE TODA LA CLASE</p></div></header>${navHtml}<section class="panel bd-shell"><div class="bd-top">${ui.screen === 'home' ? '' : button('← CUMPLEAÑOS','home','secondary')}${ui.name ? button('🎨 TALLER DE CUMPLE','workshop','secondary') : ''}</div>${ui.name && !['home','book'].includes(ui.screen) ? nav() : ''}<div class="bd-content">${(screens[ui.screen] || home)()}</div><p class="bd-notice" role="status">${esc(ui.message)}</p></section></div>`;
  }
  function render() {
    if (!routeActive()) return;
    const existing = root(), navHtml = existing?.querySelector('.pdi-section-nav')?.outerHTML || window.ROSA_AULA?.pdiNav('cumpleanos') || '';
    document.querySelector('#contenido').innerHTML = page(navHtml);
    requestAnimationFrame(paintStrokes);
  }
  function choose(name, fromBook = false) {
    if (!roster().includes(name)) return;
    ui.name = name;
    const saved = fromBook ? storage.memories[sceneKey(name)] : (storage.drafts[sceneKey(name)] || storage.memories[sceneKey(name)]);
    ui.scene = saved ? JSON.parse(JSON.stringify(saved)) : freshScene();
    ui.scene = { ...freshScene(), ...ui.scene, avatar: { ...freshAvatar(), ...ui.scene.avatar } };
    ui.screen = ui.mode === 'workshop' ? 'workshop' : 'avatar'; ui.turn = 0; ui.challengeStep = 'balloons'; ui.problemIndex = 0; ui.mistake = false; ui.placedBalloons = []; ui.answer = null; ui.candlesAdded = 0; ui.sticker = ''; ui.selectedSticker = ''; ui.message = '';
    render();
  }
  function stagePoint(stage, event) {
    const rect = stage.getBoundingClientRect();
    return { x: Math.max(.025, Math.min(.975, (event.clientX - rect.left) / rect.width)), y: Math.max(.06, Math.min(.94, (event.clientY - rect.top) / rect.height)) };
  }
  function paintStrokes() {
    const canvas = root()?.querySelector('[data-bd-ink]');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 6;
    for (const stroke of ui.scene.strokes) {
      if (!stroke?.length) continue;
      ctx.beginPath(); ctx.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
      for (const p of stroke.slice(1)) ctx.lineTo(p.x * rect.width, p.y * rect.height);
      if (stroke.length === 1) ctx.lineTo(stroke[0].x * rect.width + .1, stroke[0].y * rect.height + .1);
      ctx.strokeStyle = '#c83269'; ctx.stroke();
    }
  }
  function addSticker(stage, event) {
    if (!ui.sticker || ui.drawing || !stage || !STICKERS.includes(ui.sticker)) return;
    const p = stagePoint(stage, event);
    const item = { id: id(), emoji: ui.sticker, x: p.x, y: p.y, size: ui.sticker === 'crown' ? 110 : 76, rotate: 0, area: stage.dataset.bdStage };
    ui.scene.stickers.push(item); ui.selectedSticker = item.id; persist(); render();
  }
  function selected() { return ui.scene.stickers.find(item => item.id === ui.selectedSticker); }
  function action(name) {
    ui.message = '';
    if (name === 'home') { ui.screen = 'home'; ui.name = ''; }
    else if (name === 'month-prev' || name === 'month-next') { const date = new Date(ui.year,ui.month + (name === 'month-next' ? 1 : -1),1); ui.year = date.getFullYear(); ui.month = date.getMonth(); }
    else if (name === 'celebrate' || name === 'workshop') { ui.mode = name; if (ui.name) ui.screen = name === 'workshop' ? 'workshop' : 'avatar'; else ui.screen = 'home'; }
    else if (name === 'book') { ui.screen = 'book'; ui.bookIndex = 0; }
    else if (name === 'book-prev' || name === 'book-next') { const total = roster().filter(child => storage.memories[sceneKey(child)]).length; if (total) ui.bookIndex = (ui.bookIndex + (name === 'book-next' ? 1 : total - 1)) % total; }
    else if (name === 'open-book-memory') { const names = roster().filter(child => storage.memories[sceneKey(child)]); const chosen = names[ui.bookIndex]; if (chosen) { choose(chosen, true); ui.screen = 'final'; } }
    else if (name.startsWith('go-')) { if (!ui.name) return; ui.screen = name.slice(3); ui.selectedSticker = ''; ui.drawing = false; ui.sticker = ''; }
    else if (name === 'next-friend') ui.turn = Math.min(classmates().length, ui.turn + 1);
    else if (name === 'reset-turns') ui.turn = 0;
    else if (name === 'grow' && selected()) { selected().size = Math.min(192, selected().size + 16); persist(); }
    else if (name === 'shrink' && selected()) { selected().size = Math.max(32, selected().size - 16); persist(); }
    else if (name === 'show-balloons') ui.challengeStep = 'balloons';
    else if (name === 'show-candles') ui.challengeStep = 'candles';
    else if (name === 'reset-balloons' || name === 'next-problem') { if (name === 'next-problem') ui.problemIndex = (ui.problemIndex + 1) % PROBLEMS.length; ui.placedBalloons = []; ui.answer = null; ui.mistake = false; }
    else if (name === 'reset-candles') ui.candlesAdded = 0;
    else if (name === 'add-candle') ui.candlesAdded = Math.min(Math.max(4,age())-3,ui.candlesAdded+1);
    else if (name === 'move-avatar') { ui.sticker = ''; ui.drawing = false; ui.selectedSticker = ''; }
    else if (name === 'rotate' && selected()) { selected().rotate = (selected().rotate + 30) % 360; persist(); }
    else if (name === 'delete-sticker' && selected()) { ui.scene.stickers = ui.scene.stickers.filter(item => item.id !== ui.selectedSticker); ui.selectedSticker = ''; persist(); }
    else if (name === 'draw') { ui.drawing = !ui.drawing; ui.sticker = ''; }
    else if (name === 'light') { ui.scene.candles = Array(age()).fill(true); ui.scene.lit = true; persist(); }
    else if (name === 'blow') { ui.scene.candles = Array(age()).fill(false); ui.scene.lit = false; ui.confetti = true; persist(); setTimeout(() => { ui.confetti = false; if (routeActive() && ui.screen === 'cake') render(); }, 1800); }
    else if (name === 'save-memory') { persist(); storage.memories[sceneKey(ui.name)] = JSON.parse(JSON.stringify(ui.scene)); store(); ui.message = `EL RECUERDO DE ${ui.name.toUpperCase()} ESTÁ EN EL LIBRO DE ESTE NAVEGADOR`; }
    render();
  }
  function finalSvg() {
    const name = esc(ui.name.toUpperCase()), scene = ui.scene;
    if (!collageHasContent(scene)) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="0 0 1200 1000"><rect width="1200" height="1000" fill="white"/><g text-anchor="middle" font-family="Arial,sans-serif" fill="#963c5b"><text x="600" y="320" font-size="54" font-weight="800">TUS COMPAÑEROS DEL COLE</text><text x="600" y="410" font-size="54" font-weight="800">TE DESEAN</text><text x="600" y="560" font-size="72" font-weight="900">¡FELIZ CUMPLEAÑOS!</text><text x="600" y="690" font-size="94" font-weight="900">${name}</text></g></svg>`;
    }
    const texts = scene.stickers.map(s => { const x = Math.round(s.x*1200), y = Math.round(230+s.y*550), size = Math.round(s.size*1.4), art = stickerArt(s.emoji); return art.startsWith('<svg') ? `<svg x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" viewBox="0 0 100 100" overflow="visible"><g transform="rotate(${s.rotate} 50 50)">${art.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g></svg>` : `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${esc(s.emoji)}</text>`; }).join('');
    const strokes = scene.strokes.map(points => `<polyline points="${points.map(p => `${Math.round(p.x*1200)},${Math.round(230+p.y*550)}`).join(' ')}" fill="none" stroke="#c83269" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    const cake = `<g transform="translate(820 545)"><ellipse cx="135" cy="210" rx="145" ry="22" fill="#d9a9c0"/><rect x="18" y="85" width="234" height="115" rx="25" fill="#ef9bb9"/><path d="M18 108 Q45 143 74 108 Q104 143 133 108 Q164 143 192 108 Q222 143 252 108 V85 H18Z" fill="#fff0ed"/><text x="135" y="175" text-anchor="middle" font-size="62" font-family="Arial,sans-serif" fill="#8a3657">${age()}</text>${Array.from({length:Math.min(age(),10)},(_,i) => `<rect x="${36+i*22}" y="48" width="10" height="39" rx="3" fill="#fbd36c"/><circle cx="${41+i*22}" cy="38" r="5" fill="#ff994e"/>`).join('')}</g>`;
    const pos = scene.avatarPosition || {x:.5,y:.52};
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1000" viewBox="0 0 1200 1000"><rect width="1200" height="1000" fill="#fff7ed"/><rect x="38" y="32" width="1124" height="925" rx="34" fill="white" stroke="#eeced9" stroke-width="8"/><text x="600" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="900" fill="#953752">TUS COMPAÑEROS DEL COLE TE DESEAN</text><text x="600" y="177" text-anchor="middle" font-family="Arial,sans-serif" font-size="55" font-weight="900" fill="#76304b">¡FELIZ CUMPLEAÑOS, ${name}!</text><defs><clipPath id="bd-art-clip"><rect x="40" y="228" width="1120" height="570"/></clipPath></defs><g clip-path="url(#bd-art-clip)"><g transform="translate(${Math.round(1200*pos.x-198)} ${Math.round(230+550*pos.y-234)}) scale(1.8)">${avatarSvg(scene.avatar).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g>${cake}${strokes}${texts}</g><text x="600" y="865" text-anchor="middle" font-size="44" font-family="Arial,sans-serif" fill="#75354b">${age()} AÑOS</text></svg>`;
  }
  function png() {
    return new Promise((resolve,reject) => {
      const image = new Image();
      image.onload = () => { try { const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1000; canvas.getContext('2d').drawImage(image, 0, 0); resolve(canvas.toDataURL('image/png')); } catch (error) { reject(error); } };
      image.onerror = reject;
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(finalSvg());
    });
  }
  async function exportMemory(print = false) {
    const windowForPrint = print ? window.open('', '_blank') : null;
    try {
      persist();
      const url = await png();
      if (print && windowForPrint) {
        windowForPrint.document.write(`<html lang="es"><head><title>Cumpleaños de ${esc(ui.name)}</title><style>@page{size:A4 landscape;margin:10mm}body{margin:0;display:grid;place-items:center}img{max-width:100%;max-height:185mm}</style></head><body><img src="${url}" alt="Recuerdo de cumpleaños" onload="window.print()"></body></html>`);
        windowForPrint.document.close();
      } else {
        const link = document.createElement('a');
        link.href = url; link.download = `cumpleanos-${ui.name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}.png`;
        document.body.appendChild(link); link.click(); link.remove();
        ui.message = print ? 'SE HA DESCARGADO EL PNG PARA IMPRIMIRLO' : 'RECUERDO DESCARGADO'; render();
      }
    } catch {
      windowForPrint?.close(); ui.message = 'NO SE HA PODIDO CREAR EL PNG. PUEDES IMPRIMIR DESDE EL NAVEGADOR.'; render();
    }
  }

  document.addEventListener('click', event => {
    if (!routeActive() || !root()) return;
    const child = event.target.closest('[data-bd-child], [data-bd-memory]');
    if (child) { choose(child.dataset.bdChild || child.dataset.bdMemory, !!child.dataset.bdMemory); if (child.dataset.bdMemory) { ui.screen = 'final'; render(); } return; }
    const actionButton = event.target.closest('[data-bd-action]');
    if (actionButton) { const a = actionButton.dataset.bdAction; if (a === 'download' || a === 'print') exportMemory(a === 'print'); else action(a); return; }
    const balloonButton = event.target.closest('[data-bd-balloon]');
    if (balloonButton) { const index = Number(balloonButton.dataset.bdBalloon), problem = PROBLEMS[ui.problemIndex], ordered = [...Array(problem.firstCount).fill(problem.firstType), ...Array(problem.secondCount).fill(problem.secondType), problem.extraType, problem.extraType], all = [ordered[0],ordered[5],ordered[4],ordered[1],ordered[6],ordered[2],ordered[3]]; if (index >= 0 && index < 7 && !ui.placedBalloons.includes(index)) { ui.mistake = all[index] === problem.extraType; if (!ui.mistake && ui.placedBalloons.length < 5) ui.placedBalloons.push(index); ui.answer = null; render(); } return; }
    const answerButton = event.target.closest('[data-bd-answer]');
    if (answerButton) { ui.answer = Number(answerButton.dataset.bdAnswer); render(); return; }
    const avatarButton = event.target.closest('[data-bd-avatar]');
    if (avatarButton && ui.name) {
      const key = avatarButton.dataset.bdAvatar, raw = avatarButton.dataset.bdValue;
      ui.scene.avatar[key] = ['skin','hair','clothes','bottoms','shoes'].includes(key) ? Number(raw) : key === 'glasses' ? raw === 'true' : raw;
      persist(); render(); return;
    }
    const picked = event.target.closest('[data-bd-pick]');
    if (picked) { ui.sticker = picked.dataset.bdPick; ui.drawing = false; ui.selectedSticker = ''; render(); return; }
    const sticker = event.target.closest('[data-bd-sticker]');
    if (sticker) { ui.selectedSticker = sticker.dataset.bdSticker; root()?.querySelectorAll('[data-bd-sticker]').forEach(el => el.classList.toggle('selected', el === sticker)); return; }
    const candle = event.target.closest('[data-bd-candle]');
    if (candle) { const i = Number(candle.dataset.bdCandle); ui.scene.candles[i] = !ui.scene.candles[i]; persist(); render(); return; }
    const stage = event.target.closest('[data-bd-stage]');
    if (stage && !event.target.closest('[data-bd-ink]') && (!event.target.closest('[data-bd-person]') || ui.sticker)) addSticker(stage,event);
  });
  document.addEventListener('pointerdown', event => {
    if (!routeActive()) return;
    const sticker = event.target.closest('[data-bd-sticker]');
    if (sticker) { ui.selectedSticker = sticker.dataset.bdSticker; ui.drag = { id: ui.selectedSticker, pointer: event.pointerId, stage: sticker.closest('[data-bd-stage]'), moved: false }; sticker.setPointerCapture?.(event.pointerId); event.preventDefault(); return; }
    const person = event.target.closest('[data-bd-person]');
    if (person && ui.screen === 'collage' && !ui.drawing && !ui.sticker) { ui.drag = { person: true, pointer: event.pointerId, stage: person.closest('[data-bd-stage]'), moved: false }; person.setPointerCapture?.(event.pointerId); event.preventDefault(); return; }
    const canvas = event.target.closest('[data-bd-ink]');
    if (canvas && ui.drawing) { const p = stagePoint(canvas,event); ui.stroke = [p]; ui.scene.strokes.push(ui.stroke); canvas.setPointerCapture?.(event.pointerId); ui.inkPointer = event.pointerId; event.preventDefault(); paintStrokes(); }
  });
  document.addEventListener('pointermove', event => {
    if (!routeActive()) return;
    if (ui.drag?.pointer === event.pointerId) {
      const p = stagePoint(ui.drag.stage,event); ui.drag.moved = true;
      if (ui.drag.person) {
        const x = Math.max(.22,Math.min(.78,p.x)), y = Math.max(.28,Math.min(.72,p.y));
        ui.scene.avatarPosition = {x,y};
        const node = root()?.querySelector('[data-bd-person]'); if (node) { node.style.left = `${x*100}%`; node.style.top = `${y*100}%`; }
      } else {
        const item = selected(); if (!item) return;
        item.x = p.x; item.y = p.y;
        root()?.querySelectorAll('[data-bd-sticker]')?.forEach(node => { if (node.dataset.bdSticker === item.id) { node.style.left = `${p.x*100}%`; node.style.top = `${p.y*100}%`; } });
      }
      event.preventDefault(); return;
    }
    if (ui.inkPointer === event.pointerId && ui.stroke) { ui.stroke.push(stagePoint(event.target,event)); paintStrokes(); event.preventDefault(); }
  });
  const finishPointer = event => {
    if (ui.drag?.pointer === event.pointerId) { if (ui.drag.moved) persist(); ui.drag = null; }
    if (ui.inkPointer === event.pointerId) { ui.stroke = null; ui.inkPointer = null; persist(); }
  };
  document.addEventListener('pointerup', finishPointer);
  document.addEventListener('pointercancel', finishPointer);
  window.addEventListener('resize', () => { if (routeActive() && ui.screen === 'collage') paintStrokes(); });
  window.ROSA_BIRTHDAYS = { page };
})();
