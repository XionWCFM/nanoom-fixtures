const fs = require('fs');
const path = require('path');
const core = path.join(__dirname, '..', 'core');
if (!fs.existsSync(core)) throw new Error('core workspace is missing');
fs.writeFileSync(path.join(__dirname, 'result.txt'), 'app:ok\n');
console.log('app test ok');
