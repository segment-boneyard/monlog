
build: node_modules

node_modules: package.json
	@npm install

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter dot \
		--bail

.PHONY: test build