const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),source=path.join(root,'public');
// Preserve the established public files and URLs; stage a standard Worker build.
fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(path.join(dist,'client'),{recursive:true});
fs.mkdirSync(path.join(dist,'server'),{recursive:true});
fs.cpSync(source,path.join(dist,'client'),{recursive:true});
fs.copyFileSync(path.join(root,'worker/index.mjs'),path.join(dist,'server/index.js'));
fs.writeFileSync(path.join(dist,'server/wrangler.json'),JSON.stringify({
  name:'la-clase-rosa',main:'index.js',compatibility_date:'2026-09-09',
  assets:{directory:'../client',binding:'ASSETS',run_worker_first:['/api/*']}
},null,2));
console.log('Site assets and classroom storage endpoint prepared.');
