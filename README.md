# svelte-parallax

A (small) spring-based parallax component library for Svelte.

**NOTE**: This is at 0.6.x and I'm still working on stuff. Something could break and while I'm not *trying* to remove anything from the API it's still a possibility (I'll post a deprecation notice first instead of outright yanking something). If anything is weird, open an issue and let me know!

**BREAKING CHANGE**: From `v0.6.0` on, the `onProgress` prop in `Parallax` receives a number representing scroll progress, instead of an object with several fields. See [CHANGELOG](https://github.com/kindoflew/svelte-parallax/blob/main/CHANGELOG.md) for details.

<br/>

## Content
* [Install](#install)
* [svelte-parallax](#svelte-parallax)
  * [`<Parallax>`](#parallax)
  * [`<ParallaxLayer>`](#parallaxlayer)
  * [`<StickyLayer>`](#stickylayer)
  * [Using `progress` in `ParallaxLayer` and `StickyLayer`](#using-progress-in-parallaxlayer-and-stickylayer)
  * [`scrollTo`](#scrollto)
  * [Tips](#tips)
  * [Differences from react-spring/parallax](#differences-from-react-springparallax)
* [Recipes](#recipes)
* [Contributing](#contributing)

<br/>

## Install

```bash
npm i -D svelte-parallax
```

<br/>

## svelte-parallax
This package is based on [react-spring/parallax](https://github.com/pmndrs/react-spring/tree/master/packages/parallax).
The API is pretty similar and it functions (mostly) the same under the hood (See [differences](#differences-from-react-spring/parallax) between them).

<br/>

[Play with a basic demo here](https://svelte.dev/repl/917289a96f564f3788dcb6400f44a8bc?version=3.37.0)

<br/>

The `<Parallax>` component is a container whose height will be the number of `sections` you choose multiplied by the `sectionHeight` prop (defaults to `window.innerHeight`, which should be good for most use cases). `<ParallaxLayer>` and `<StickyLayer>` components contain anything you want to be affected and are nested inside `<Parallax>`. A simple set-up may look like this:

```html
<script>
  import { Parallax, ParallaxLayer, StickyLayer } from 'svelte-parallax';
</script>

<Parallax sections={3} config={{stiffness: 0.2, damping: 0.3}}>
  <ParallaxLayer rate={0} span={3} style="background-color: orange;" />

  <ParallaxLayer rate={-0.5} offset={1}>
    <img src='horse.jpg' alt='a horse'>
  </ParallaxLayer>

  <ParallaxLayer rate={1} offset={1.75}>
    <img src='bird.jpg' alt='a bird'>
  </ParallaxLayer>

  <StickyLayer offset={{ top: 0.5, bottom: 2 }}>
    <p>A description of a horse and a bird.</p>
  </StickyLayer>

  <ParallaxLayer rate={2} offset={2} style="background-color: lightblue;" />
</Parallax>
```

<br/>

### `<Parallax>`

| Props            | Type                                                       | Default                               |
| ---------------- | ---------------------------------------------------------- | ------------------------------------- |
| `sections`       | `number`                                                   | `1`                                   |
| `sectionHeight`  | `number`                                                   | `window.innerHeight`                  |
| `config`         | <pre>{<br/> stiffness?: number;<br/> damping?: number;<br/> precision?: number;<br/>}</pre> | `{ stiffness: 0.017, damping: 0.26 }` |
| `threshold`      | `{ top: number, bottom: number }`                          | `{ top: 1, bottom: 1 }`               |
| `onProgress`     | `(number) => void`                                         | `undefined`                           |
| `onScroll`       | `(number) => void`                                         | `undefined`                           |
| `disabled`       | `boolean`                                                  | `false`                               |


#### Details
* `sections`: How many sections the container has.

* `sectionHeight`: The height of an individual section. Defaults to `window.innerHeight`, using Svelte's `bind:innerHeight`.

* `config`: Optional [Svelte spring store](https://svelte.dev/docs#spring) configuration, if you want more control over parallax physics.

* `threshold`: Adds a threshold above/below `Parallax` that is equal to the height of the viewport multiplied by the value, each one should be a number between `0` and `1`. `threshold.top = 1`: the effect will be active whenever the top of the container is at or above the *top* of the viewport, `threshold.top = 0`: effect will be active whenever the top of the container is at or above the *bottom* of the viewport. `threshold.bottom` is similar, but on the other end -- `1`: active when bottom of container is at or below the *bottom* of the viewport, `0`: active when bottom is at or below the *top* of the viewport. Not really sure what happens if either is `< 0` or `> 1` -- I never checked.

* `onProgress`: Takes a function that receives a number between `0` and `1` that represents the scroll progress of the container. Starts at `0` when the top of the `Parallax` container is at the top of the viewport, ends at `1` when the bottom of the `Parallax` container is at the bottom of the viewport. The number is set using a `spring` store, so it will update in-sync with the parallaxing layers.

* `onScroll`: Takes a function that receives `scrollTop` -- the number of pixels scrolled from when the parallax effect starts until it ends. If `threshold` is not set, that means this number starts at `0` when the top of the container is at the top of the viewport and ends at its max value when the bottom of the container is at the bottom of the viewport. If either`threshold` value is set below `1`, this function will be start being called earlier (`threshold.top`) or continue being called later (`threshold.bottom`).

* `disabled`: Whether or not the effect is disabled (for a11y, etc. see [Prefers-reduced-motion](#prefers-reduced-motion)). When `disabled = true`, layers will stay at their target positions.

* `$$restProps`: You can add any other props you need (including `style` or `class`) and they will be passed to the underlying `div` container. If you're adding styles, messing with `height`, `position`, or `overflow` *might* break stuff, but you do you.


<br/>

### `<ParallaxLayer>`

| Props                 | Type                | Default     |
| --------------------- | ------------------- | ------------|
| `rate`                | `number`            | `0.5`       |
| `offset`              | `number`            | `0`         |
| `span`                | `number`            | `1`         |
| `onProgress`          | `(number) => void`  | `undefined` |


#### Details
* `rate`: Rate the layer will scroll relative to `scrollY`. Can be positive or negative: positive will translate the layer up and negative, down. `0` will scroll normally.

* `offset`: Offset from the top of the container when the layer's section completely fills the viewport. Can be a float (`0.5` will place the layer halfway down the first section when the first section takes up the whole viewport).

* `span`: How many innerHeight-sized sections the layer will span.

* `onProgress`: Takes a function that receives a number between `0` and `1` that represents the layer's intersecting progress. Starts at `0` when a layer enters the viewport and ends at `1` when a layer exits the viewport. It is also set using a `spring` store. (See [usage tips below](#using-progress-in-parallaxlayer-and-stickylayer)).

* `$$restProps`: You can add any other props you need (including `style` or `class`) and they will be passed to the underlying `div` container.


<br/>

### `<StickyLayer>`

| Props                 | Type                                | Default     |
| --------------------- | ----------------------------------- | ------------|
| `offset`              | `{ top?: number, bottom?: number }` | `0`         |
| `onProgress`          | `(number) => void`                  | `undefined` |


#### Details
* `offset`: An object that contains the offset bounds for when the layer starts/stops being sticky (it is zero-indexed, like `ParallaxLayer`'s `offset`).

* `onProgress`: Takes a function that receives a number between `0` and `1` that represents the layer's sticky progress. Starts at `0` when a layer becomes sticky and ends at `1` when it stops being sticky. It is also set using a `spring` store. (See [usage tips below](#using-progress-in-parallaxlayer-and-stickylayer)).

* `$$restProps`: You can add any other props you need (including `style` or `class`) and they will be passed to the underlying `div` container.

<br/>


### Using `progress` in `ParallaxLayer` and `StickyLayer`

Both of these components expose `progress` in two different ways. The first way is through their `onProgress` prop. The example below is using `progress` to dynamically change the `background-color` of `Parallax` as the `ParallaxLayer` crosses the viewport:

```HTML
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';

  const [red, green, blue] = [100, 100, 200];
  let backgroundColor = `rgb(${red}, ${green}, ${blue})`;

  const handleProgress = (progress) => {
    const p = 1 + progress;
    backgroundColor = `rgb(${red * p}, ${green * p}, ${blue * p})`;
  };
</script>

<Parallax sections={3} style="background-color: {backgroundColor}">
  <ParallaxLayer
    offset={1}
    onProgress={handleProgress}
  >
    <div>
      I'm changing the background color!
    </div>
  </ParallaxLayer>
  ...
</Parallax>
```

The second way is using `let:progress`. This example is rotating a `div` inside `StickyLayer` while it is sticky:

```HTML
<script>
  import { Parallax, StickyLayer } from 'svelte-parallax';
</script>

<Parallax sections={3}>
  <StickyLayer
    offset={{ top: 1, bottom: 2 }}
    let:progress
  >
    <div style="transform: rotate({progress * 360}deg)">
      I'm spinning!
    </div>
  </StickyLayer>
  ...
</Parallax>
```

Which one you use is up to you, but I think `onProgress` probably makes the most sense when the value will be used in something *outside* of the layer it comes from and `let:progress` is more useful when you want to use the value *inside* the layer it comes from.

**NOTE**: In the `Parallax` container, `progress` is only accessible through the `onProgress` prop. This is mostly because I'm not exactly sure how `svelte` handles shadowing `let` variables (they are all named `progress` to have a unified API), and I'd rather not introduce a feature that could accidentally rely on internal `svelte` behavior that could change. The general usage of `onProgress` in `Parallax` is the same as that of the two layer components.


<br/>


### `scrollTo`
Rather than have a click listener on an entire `<ParallaxLayer>` (which I think is bad for a11y because a page sized `<div>` probably shouldn't be a button), `<Parallax>` exports a `scrollTo` function for click-to-scroll so you can use semantic HTML. It takes a little set-up because of this, but I believe the benefits outweigh a little boilerplate. 

`scrollTo` uses a fork of [svelte-scrollto](https://github.com/langbamit/svelte-scrollto) to animate scrolling, instead of relying on the native browser implementation. Because of this, you can have smooth, custom scrolling regardless of browser support for `scroll-behavior`.


| Parameters          | Type                                                                    | Description                     |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| `section`           | `number`                                                                | The section to scroll to        |
| `config` (optional) | <pre>{<br/> selector?: string;<br/> duration?: number;<br/> easing?: (number) => number;<br/>}</pre> | See below |  


<br/>

#### `config` object:
| Key        | Type                 | Description                                        | Default     |
| ---------- | -------------------- | -------------------------------------------------- | ----------- |
| `selector` | `string`             | CSS selector of element to focus on after scroll   | `""`        |
| `duration` | `number`             | Duration of scroll in milliseconds                 | `500`       |
| `easing`   | `(number) => number` | Easing function (import from `'svelte/easing'`)    | `quadInOut` |

<br/>

Example setup:

```HTML
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';

  // for bind:this. name can be anything
  let parallax;
</script>
                    <!-- bind to component instance -->
<Parallax sections={2} bind:this={parallax}>

  <ParallaxLayer>
                      <!-- function is a method on component instance -->
    <button 
      class='horse-btn' 
      on:click={() => parallax.scrollTo(2, { selector: '.top-btn', duration: 2000 })}
    >
      Scroll to horse
    </button>
  </ParallaxLayer>

  <ParallaxLayer offset={1}>
    <img src='horse.jpg' alt='a horse'>
    <button 
      class="top-btn" 
      on:click={() => parallax.scrollTo(1, { selector: '.horse-btn', duration: 1000 })}
    >
      Scroll to top
    </button>
  </ParallaxLayer>
</Parallax>
```

If you *really* need to use something besides buttons for `scrollTo` make sure to address `tabindex`, focus-style, and `keyup`/`keydown` events (More best practices at [MDN - ARIA: button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)).

<br/>


### Tips
* `rate`: The `rate` prop will affect the initial position of `<ParallaxLayer>` because of the way the motion formulas work. A suggested workflow would be intially setting `disabled=true` on `<Parallax>` and placing content where you want it to *end up*. After that, remove `disabled` and then tweak rate and style until the motion is how you'd like it.

* `z-index`: `<ParallaxLayer>`s are absolutely positioned so they are organized on the z-axis in the order they are written in the HTML. If you don't want to mess with z-index (and who does?) make sure to place all content that should always be visible/clickable towards the bottom of `<Parallax>`. y-axis order is unaffected by this because that is decided by `offset`.

* `scrollY`: svelte-parallax uses Svelte's `bind:scrollY` in its motion functions, so it will not work if placed inside a scrollable element (like a `div` with `overflow: scroll`). I don't have plans to change this right now, but if enough people ask for it, who knows?

* `onScroll`: related to the point above, we use an `onScroll` prop instead of `on:scroll` because the scroll event isn't actually being fired from the container -- it's based on `window.scrollY`. Because of this, I thought that `on:scroll` would be misleading.

* optimization: We aren't adding `will-change: transform` or doing the `transform: translate3d(0,0,0)` hack anymore -- both rules can get in the way of other styles and can lead to performance problems of their own (plus, adding `will-change` to everything [isn't recommended anyways](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)). However, you can add these to any components that you think need it using `style` or `class` props.

<br/>

### Differences from react-spring/parallax
* Some of the prop names are changed for no reason other than that I like them more. If you are coming from react, `span = factor`, `sections = pages`, `rate = speed`.

* react-spring/parallax is a scrollable container, svelte-parallax is not (you are scrolling the actual page). This means that svelte-parallax can be anywhere on the page and also that the only scrollbar will be the browser's.

* react-spring/parallax has a `horizontal` prop on the container component, svelte-parallax does not. This is mostly because of the point mentioned above — this is not a scrollable container, so you'd have to scroll the actual browser window horizontally, which is gross to me.

* react-spring/parallax has a `sticky` prop on `ParallaxLayer` (that I implemented!), svelte-parallax has a `StickyLayer` component.


All that being said, I'd like to thank anyone and everyone who made react-spring/parallax, without whom this package would not exist.

#### Side-by-side example:
* [original react-spring/parallax demo](https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/parallax-vert)

* [svelte-parallax version](https://svelte.dev/repl/1504d411044745a186004855521a89c7?version=3.35.0)

<br/>

## Recipes

### Prefers-reduced-motion

Parallax effects can be jarring for those sensitive to too much visual motion. Browsers expose information about whether or not your user prefers reduced motion. You can use something like this to dynamically disable the effect for those users:

```html
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';

  let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
</script>

<Parallax disabled={prefersReducedMotion}>
  <!-- your stuff here -->
</Parallax>
```

**NOTE**: For SvelteKit/Sapper with SSR you'd have to do that in `onMount` or behind an `if (process.browser)` or `if (typeof window !== 'undefined')` check.

<br/>

### Squarespace-style

For simple, no-frills parallax effects, you can set `stiffness` and `damping` to `1` which will cancel out the spring effect, and then set `threshold` properties to `0` so the effect will be enabled whenever the container is in the viewport.

```html
<Parallax 
  config={{ stiffness: 1, damping: 1 }} 
  threshold={{ top: 0, bottom: 0 }} 
  sections={1}
>
  <ParallaxLayer rate={-0.4}>
    <img 
      src="horse.jpg"
      alt="a horse"
    />
  </ParallaxLayer>
</Parallax>
```


You could even have multiple parallaxing layers with static divs in between like this:

```html
<Parallax 
  config={{ stiffness: 1, damping: 1 }} 
  threshold={{ top: 0, bottom: 0 }} 
  sections={3}
>
  <ParallaxLayer rate={-0.4}>
    <img 
      src="horse.jpg"
      alt="a horse"
    />
  </ParallaxLayer>
  <ParallaxLayer rate={-0.4} offset={2}>
    <img 
      src="bird.jpg"
      alt="a bird"
    />
  </ParallaxLayer>
       <!-- Rate is 0, offset is between the two parallaxing layers above -->
  <ParallaxLayer rate={0} offset={1} style={"background-color:lightblue;"} />
</Parallax>
```

### Get current section

If you want to get the current section that is being scrolled, you can do something like this (starts when the section is at the top of the viewport; changes when the next section reaches the top of the viewport -- you can adjust the math to suit your specific needs):

```html
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';

  // bind:innerHeight
  let innerHeight;
  // `section` prop passed to `Parallax`
  const sections = 3;

  let section;
  const handleScroll = (scrollTop) => {
    // add 1 so section isn't zero-indexed
    section = Math.floor(scrollTop / innerHeight) + 1;
  };
</script>

<svelte:window bind:innerHeight />

<div style="position: fixed;">
  Currently in section {section}!
</div>

<Parallax sections={sections} onScroll={handleScroll}>
  <!-- your stuff here -->
</Parallax>
```

<br/>

## Contributing
Contributions are welcome! I'm keeping everything in JavaScript for now and I've tried to comment a lot to make jumping in easier. There really isn't a whole lot to the JavaScript parts so that helps too.

To work locally:

```bash
git clone git@github.com:kindoflew/svelte-parallax
cd svelte-parallax
npm install
# if you want to use the demo app
cd demo
npm install
npm run dev # can also be run from root folder once installed
```

This will run a dev server on localhost:5000. The source lives in `src` and `demo` is there for live feedback while working.

Things I Probably Need:

* **Optimzations**: Didn't want to optimize in advance (YAGNI and Svelte takes care of a lot of it already), but I did notice that on mobile any `<ParallaxLayer>` that has only a `background-image` (no nested content) and a `rate` other than `0` will flicker until it stops moving. Only tested on an iPhone7 and iPhone8 so far. Also, note that `will-change: transform` has had no effect. Don't know much about rendering optimizations, so I'm open to any suggestions!
