'use strict';
// Warm only the next page after visible content has finished loading.
// Keep the ordinary HTTP cache and the original image URLs.
window.ROSA_IMAGE_LOADING=(()=>{
  let generation=0,timer=null,active=null;
  const warmed=new Set();
  const connection=()=>navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  function afterVisible(root,paths){
    const token=++generation;clearTimeout(timer);
    if(!root)return;
    const network=connection();
    if(network?.saveData||/^(slow-)?2g$/.test(network?.effectiveType||''))return;
    const urls=[...new Set(paths.filter(Boolean))].slice(0,2).filter(path=>{
      try{return new URL(path,document.baseURI).origin===location.origin&&!warmed.has(path);}catch{return false;}
    });
    if(!urls.length)return;
    const images=[...root.querySelectorAll('img')];
    const settled=images.map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
      const done=()=>{img.removeEventListener('load',done);img.removeEventListener('error',done);resolve();};
      img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});
    }));
    Promise.all(settled).then(()=>{
      if(token!==generation||!root.isConnected)return;
      timer=setTimeout(async()=>{
        for(const url of urls){
          if(token!==generation||!root.isConnected)return;
          // One speculative download at a time; navigation takes priority.
          if(active)return;
          const img=new Image();active=img;img.decoding='async';img.fetchPriority='low';
          const loaded=await new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=url;});
          active=null;
          if(loaded){warmed.add(url);if(warmed.size>64)warmed.delete(warmed.values().next().value);}
        }
      },400);
    });
  }
  return {afterVisible};
})();
