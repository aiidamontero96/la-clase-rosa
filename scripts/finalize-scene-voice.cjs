const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const rows=JSON.parse(fs.readFileSync(path.join(root,'sources/scenes-voice-texts.json'),'utf8'));
const manifestPath=path.join(root,'public/audio/pdi/scenes-manifest.js');
const files={};

// Preserve recordings that were already registered by an earlier successful
// run. A rebuild must never make existing narration disappear.
if(fs.existsSync(manifestPath)){
  try{
    const context={window:{ROSA_VOICE_FILES:{files:{}}}};
    vm.runInNewContext(fs.readFileSync(manifestPath,'utf8'),context,{filename:manifestPath});
    for(const [key,url] of Object.entries(context.window.ROSA_VOICE_FILES.files||{})){
      const disk=path.join(root,'public',url);
      if(fs.existsSync(disk)&&fs.statSync(disk).size>500)files[key]=url;
    }
  }catch(error){
    console.warn('Could not read previous scene manifest; rebuilding valid entries only.');
  }
}

let added=0,missing=0;
for(const row of rows){
  const url='audio/pdi/'+row.file,disk=path.join(root,'public',url);
  if(fs.existsSync(disk)&&fs.statSync(disk).size>500){
    if(files[row.key]!==url)added++;
    files[row.key]=url;
  }else missing++;
}

fs.writeFileSync(
  manifestPath,
  "'use strict';\nObject.assign(window.ROSA_VOICE_FILES.files,"+JSON.stringify(files)+");\n"
);
console.log('PDI narration manifest ready:',Object.keys(files).length,'valid clips;',missing,'pending;',added,'added this pass.');
