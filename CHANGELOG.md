# CHANGELOG

## 0.1.8
* refactor: ParallaxLayer initialization
* add vendor prefixes for transform rules
* rename SimpleParallax class names to avoid clashing with Parallax/ParallaxLayer
* bugfix: SimpleParallax initial and disabled positions are now correct

## 0.1.7
* typo in README

## 0.1.6
* move focus-options-polyfill to devDependency
* refactor scrollTo to use svelte-scrollto
* BREAKING CHANGE: change the second parameter of scrollTo function from string to options object
* update README to reflect breaking change

## 0.1.5
* refactoring: change initialization of ParallaxLayer to depend on container being mounted
* feature: add onExit prop to Parallax

## 0.1.4
* bugfix: fix onEnter
* bugfix: correct initial position of ParallaxLayers

## 0.1.3
* bugfix: add correct Y-coordinate for ParallaxLayer when effect is disabled
* bugfix: add setTimeout to window resize listener

## 0.1.2
* add focus-options-polyfill for Safari ({ preventScroll: false })
* add CHANGELOG

## 0.1.1
* add basic demo to README
* remove unused utils

## 0.1.0
* initial commit