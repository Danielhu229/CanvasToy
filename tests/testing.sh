#! /bin/sh
echo 'testing: build..'
tsc
cat ../lib/gl-matrix/gl-matrix.js > canvas-toy-test.js
cat canvas-toy-test-tmp.js >> canvas-toy-test.js
rm canvas-toy-test-tmp.js
echo 'testing: run..'
karma start karma.conf.js --browsers Chrome --single-run