const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),rows=JSON.parse(fs.readFileSync(path.join(root,'sources/scenes-voice-texts.json'),'utf8'));
const files={};for(const row of rows){const url='audio/pdi/'+row.file;assert(fs.statSync(path.join(root,'public',url)).size>500,row.key);files[row.key]=url;}
fs.writeFileSync(path.join(root,'public/audio/pdi/scenes-manifest.js'),"'use strict';\nObject.assign(window.ROSA_VOICE_FILES.files,"+JSON.stringify(files)+");\n");
console.log('Illustrated PDI narration ready:',rows.length,'general clips; no student names.');
