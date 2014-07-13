
build: clean
	mkdir dist
	browserify -u **/backbone.js -u **/lodash.js -u **/underscore.js -s router -o dist/router.js router.js

dist: build
	ccjs dist/router.js --LANGUAGE_IN=ECMASCRIPT5 > dist/router.min.js

clean:
	rm -rf dist

.PHONY: clean build
