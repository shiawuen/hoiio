
test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec \
		--timeout 5000

.PHONY: test