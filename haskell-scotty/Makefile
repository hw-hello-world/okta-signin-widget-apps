default: start

start: build
	stack exec haskell-scotty-exe

build:
	stack build

test:
	stack test

lint:
	hlint src app test

stylish:
