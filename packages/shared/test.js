const assert = require('node:assert');
const shared = require('./index');
assert.equal(shared.name, 'shared-v2');
console.log('shared test ok');
