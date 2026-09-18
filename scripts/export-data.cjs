const fs = require('fs');
const vm = require('vm');
const context = {window:{}};
const source = fs.existsSync('public/data.js') ? 'public/data.js' : 'dist/client/data.js';
vm.runInNewContext(fs.readFileSync(source,'utf8'),context);
process.stdout.write(JSON.stringify(context.window.ROSA));
