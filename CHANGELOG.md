# CHANGELOG

## main (unreleased)
* [FEATURE]: add `onProgress` prop to `ParallaxLayer`

## 0.5.2
* [BUGFIX]: correct type for `selector` in `scrollTo` function
## 0.5.1
* [FEATURE]: add type declarations ([#27](https://github.com/kindoflew/svelte-parallax/pull/27))
## 0.5.0
* [FEATURE]: use `$$restProps` instead of having a `style` prop. Functionality shouldn't change for the user, but this allows other arbitrary props to be passed to the components as well. ([#20](https://github.com/kindoflew/svelte-parallax/pull/20))
* [CHORE]: removed opinionated styles from `Parallax`. ([#21](https://github.com/kindoflew/svelte-parallax/pull/21))
* [BUGFIX]: style fixes ($$restProps `style` was clobbering `Parallax` height). ([#22](https://github.com/kindoflew/svelte-parallax/pull/22))
* [BUGFIX]: Revert `position: relative` change. We need to it make sure `ParallaxLayer`s obey `overflow: hidden`. ([#23](https://github.com/kindoflew/svelte-parallax/pull/22))
## 0.4.0
* [FEATURE]: added `sectionHeight` prop to `Parallax`. The value still defaults to `window.innerHeight` (using Svelte's `bind:innerHeight`), but this should resolve [#17](https://github.com/kindoflew/svelte-parallax/issues/17).
* [FEATURE]: added `onProgress` prop to `Parallax`. Takes a function that recieves a progress object: `{ parallaxProgress: float, section: number, sectionProgress: float }`. The two `<component>Progress` values are floats between `0` and `1`. Resolves [#16](https://github.com/kindoflew/svelte-parallax/issues/16).

## 0.3.1
* [BUGFIX]: removed `postinstall` script as it was borking actual component installation

## 0.3.0
* [DEPRECATED]: `onEnter` and `onExit` are being replaced with `threshold` prop. This is mostly because the common convention seems to be that `on<VERB>` props usually take a function and standards are important. Also, `threshold` will take numbers instead of booleans so the user has more control over when effects are active. To switch from old to new, `onEnter=true` is now `threshold={{ top: 0 }}` and `onExit=true` is `threshold={{ bottom: 0 }}`.
* add JSDoc comments to props because they are fancy.

## 0.2.7
* [BUGFIX]: move focus-options-polyfill from devDependencies to dependencies

## 0.2.6
* refactor a few small things for better organization

## 0.2.5
* Parallax: refactor scrollTop to be more DRY
* Parallax: refactor layers array to a set
* ParallaxLayers: now delete themselves from layers set on unmount. This also means ParallaxLayers can now be dynamically added and removed
* Parallax: moved layer.setHeight calls from setDimensions to their own reactive statement (so layer reactivity isn't dependent on resizing)
* Parallax: reduced setTimeout of resize callback to 0

## 0.2.4
* refactor: get rid of $ready flag and change innerHeight from a store to a regular prop and reorganize

## 0.2.3
* [BUGFIX]: add missing $ to ready flag in ParallaxLayer

## 0.2.2
* very small refactors, no functionality changed

## 0.2.1
REFACTOR:
  * make Parallax and ParallaxLayer a little less tightly coupled
  * ParallaxLayer registers itself with Parallax in onMount
  * Parallax now calls all position and height update functions for each ParallaxLayer

## 0.2.0
* [BREAKING CHANGE]: remove horizontal prop from ParallaxLayer. I don't think it works well without additional parameters passed from the user and I want to keep the API minimal (atleast at first). Plus, I'd rather have fewer features at release than have something that doesn't work right and have to remove/change it after.
* [BREAKING CHANGE]: remove SimpleParallax from the package. If someone really wants that particular component you can always copy it from a previous version.

## 0.1.13
* [BUGFIX]: change 'keyup' to 'keydown' in abortEvents listener list in scrollTo. 'keyup' was interfering with the click listener to start the animation if it was started by pressing the enter key. 

## 0.1.12
* reduce default duration of scrollTo

## 0.1.11
* [BUGFIX]: scroll animation is now cancellable when user scrolls or clicks
* add temporary fork of svelte-scrollto until PR is merged

## 0.1.10
* [DEPRECATED]: SimpleParallax is deprecated moving forward. I realized you can do the same effect easily with Parallax/ParallaxLayer so I'm adding it to the new Recipes section of the README. I'll keep the component in the package with a notice for awhile.
* add Recipes section to README
* Parallax: refactor intersecting calculations to just use scrollTop store
* ParallaxLayer: refactor out unneeded checks because of Parallax refactor

## 0.1.9
* [BUGFIX]: disabled works correctly now
* refactored a few more things in ParallaxLayer

## 0.1.8
* refactor: ParallaxLayer initialization
* add vendor prefixes for transform rules
* rename SimpleParallax class names to avoid clashing with Parallax/ParallaxLayer
* [BUGFIX]: SimpleParallax initial and disabled positions are now correct

## 0.1.7
* typo in README

## 0.1.6
* move focus-options-polyfill to devDependency
* refactor scrollTo to use svelte-scrollto
* [BREAKING CHANGE]: change the second parameter of scrollTo function from string to options object
* update README to reflect breaking change

## 0.1.5
* refactoring: change initialization of ParallaxLayer to depend on container being mounted
* feature: add onExit prop to Parallax

## 0.1.4
* [BUGFIX]: fix onEnter
* [BUGFIX]: correct initial position of ParallaxLayers

## 0.1.3
* [BUGFIX]: add correct Y-coordinate for ParallaxLayer when effect is disabled
* [BUGFIX]: add setTimeout to window resize listener

## 0.1.2
* add focus-options-polyfill for Safari ({ preventScroll: false })
* add CHANGELOG

## 0.1.1
* add basic demo to README
* remove unused utils

## 0.1.0
* initial commit