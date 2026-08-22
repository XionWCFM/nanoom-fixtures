const fs = require('fs');
const path = require('path');
const index = Number(process.env.NANOOM_SHARD_INDEX || 0);
const total = Number(process.env.NANOOM_SHARD_TOTAL || 1);
if (total > 1 && !index) throw new Error('shard index was not provided');
fs.writeFileSync(path.join(__dirname, `result-${index || 'full'}-${total}.txt`), `core:${index || 'full'}/${total}\n`);
console.log(`core test ${index || 'full'}/${total}`);
