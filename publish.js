var exec = require('child_process').exec;

exec('node_modules/.bin/jsdoc src/gjl.js -c jsdoc/conf.json');