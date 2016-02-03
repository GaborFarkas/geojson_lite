var exec = require('child_process').exec;

exec('java -jar node_modules/google-closure-compiler/compiler.jar --js src/gjl.js --js_output_file build/gjl.js --compilation_level ADVANCED_OPTIMIZATIONS');