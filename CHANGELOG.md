# CHANGELOG

## 0.1.11
* bugfix: scroll animation is now cancellable when user scrolls or clicks
* add temporary fork of svelte-scrollto until PR is merged

## 0.1.10
* DEPRECATED: SimpleParallax is deprecated moving forward. I realized you can do the same effect easily with Parallax/ParallaxLayer so I'm adding it to the new Recipes section of the README. I'll keep the component in the package with a notice for awhile.
* add Recipes section to README
* Parallax: refactor intersecting calculations to just use scrollTop store
* ParallaxLayer: refactor out unneeded checks because of Parallax refactor

## 0.1.9
* bugfix: disabled works correctly now
* refactored a few more things in ParallaxLayer

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