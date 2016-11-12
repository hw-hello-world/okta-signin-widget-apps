default: start

start: build
	stack exec haskell-scotty-exe

build:
	stack build

test:
	stack test

lint:
	hlint src app test --report=hlint.html

stylish:
	stylish-haskell -i src/*.hs
	stylish-haskell -i app/*.hs
	stylish-haskell -i test/*.hs
