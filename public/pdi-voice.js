'use strict';
window.ROSA_VOICE=(()=>{
  const playbackRate=1.12;
  function configureAudio(audio){audio.defaultPlaybackRate=audio.playbackRate=playbackRate;audio.preservesPitch=true;if('webkitPreservesPitch' in audio)audio.webkitPreservesPitch=true;return audio;}
  const normalize=text=>String(text||'').replace(/Tyrannosaurus rex|T\.\s*rex/gi,'Tiranosaurio rex').replace(/\s*\/\s*/g,', ').replace(/\s+/g,' ').trim();
  const key=text=>normalize(text).toLocaleLowerCase('es-ES').replace(/[.!?]+$/g,'').trim();
  const sentences=text=>normalize(text).replace(/([.!?])\s+/g,'$1\n').split('\n').filter(Boolean);
  const calendarPattern=/^(lunes|martes|miércoles|jueves|viernes|sábado|domingo),? (\d{1,2}) de ([a-záéíóú]+) de (\d{1,6})$/i;
  function numberParts(n,files){
    if(files[key(String(n))])return [String(n)];
    if(n<100)return [String(n)];
    if(n<1000){const rest=n%100;return [n<200&&rest?'ciento':String(Math.floor(n/100)*100),...(rest?numberParts(rest,files):[])];}
    if(n<1000000){const rest=n%1000;return [...(n<2000?[]:numberParts(Math.floor(n/1000),files)),'mil',...(rest?numberParts(rest,files):[])];}
    return [...String(n)];
  }
  function parts(text,files={}){
    const clean=normalize(text),date=clean.match(calendarPattern);
    if(date)return [date[1],...numberParts(Number(date[2]),files),'de',date[3],'de',...numberParts(Number(date[4]),files)];
    return sentences(clean);
  }
  function resolve(text){
    const files=window.ROSA_VOICE_FILES?.files||{};
    if(files[key(text)])return [{text:normalize(text),url:files[key(text)]}];
    const segments=parts(text,files),clips=[];for(let i=0;i<segments.length;){let end=segments.length;while(end>i+1&&!files[key(segments.slice(i,end).join(' '))])end--;const part=segments.slice(i,end).join(' ');clips.push({text:part,url:files[key(part)]});i=end;}return clips;
  }
  return {normalize,key,sentences,parts,resolve,playbackRate,configureAudio};
})();
