# svelte-parallax

A spring-based parallax component for Svelte. (Well, it's actually two components.)

**NOTE**: This is at 0.1.x and I'm still working on stuff. It's possible that the API could change or something could break. If anything is weird, open an issue and let me know!

<br/>

## Content
* [Install](#install)
* [svelte-parallax](#svelte-parallax)
  * [`<Parallax>`](#parallax)
  * [`scrollTo`](#scrollto)
  * [`<ParallaxLayer>`](#parallaxlayer)
  * [Tips](#tips)
  * [Differences from react-spring/parallax](#differences-from-react-springparallax)
* [Recipes](#recipes)
* ~~[SimpleParallax](#simpleparallax)~~ DEPRECATED
* [Contributing](#contributing)

<br/>

## Install

```bash
npm i -D svelte-parallax
```

<br/>

## svelte-parallax
This package is based on [react-spring/parallax](https://github.com/pmndrs/react-spring/tree/v9/packages/parallax).
The API is very similar and it functions (mostly) the same under the hood (See [differences](#differences-from-react-spring/parallax) between them).

<br/>

[Play with a basic demo here](https://svelte.dev/repl/b9b9935c08964edcabfb03cf0a215b66?version=3.35.0)

<br/>

The `<Parallax>` component is a container whose height will be the height of the viewport * the number of sections you input. `<ParallaxLayer>` components contain anything you want to be affected and are nested inside `<Parallax>`. A simple set-up may look like this:

```html
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';
</script>

<Parallax sections={3}>
  <ParallaxLayer rate={0} span={3} style={"background-color: orange;"} />

  <ParallaxLayer rate={-0.5} offset={1}>
    <img src='horse.jpg' alt='a horse'>
  </ParallaxLayer>

  <ParallaxLayer rate={1} offset={1.5} horizontal>
    <img src='bird.jpg' alt='a bird'>
  </ParallaxLayer>

  <ParallaxLayer rate={2} offset={2} style={"background-color: lightblue;"} />
</Parallax>
```

<br/>

### `<Parallax>`

| Props      | Type    | Default                               |
| ---------- | ------- | ------------------------------------- |
| `sections` | number  | `1`                                   |
| `config`   | object  | `{ stiffness: 0.017, damping: 0.26 }` |
| `onEnter`  | boolean | `false`                               |
| `onExit`   | boolean | `false`                               |
| `disabled` | boolean | `false`                               |
| `style`    | string  | `""`                                  |


#### Details
* `sections`: How many innerHeight-sized sections the container has.

* `config`: Optional [Svelte spring store](https://svelte.dev/docs#spring) configuration, if you want more control over parallax physics.

* `onEnter`: Whether or not to start the effect when the container enters the viewport. `true`: start effect as soon as container is visible, `false`: wait until container top is at the top of the viewport.

* `onExit`: Whether or not to end the effect when the container exits the viewport. `true`: wait until container is completely out of viewport to stop, `false`: end effect as soon as bottom of container clears bottom of viewport.

* `disabled`: Whether or not the effect is disabled (for a11y, etc. see [Prefers-reduced-motion](#prefers-reduced-motion)). When `disabled = true`, layers will stay at their target positions.

* `style`: The `style` attribute of the container is exposed so you can do pretty much whatever you want. Messing with `height`, `position` or `overflow` *might* break stuff, but you do you.

<br/>

### `scrollTo`
Rather than have a click listener on an entire `<ParallaxLayer>` (which I think is bad for a11y because a page sized `<div>` probably shouldn't be a button), `<Parallax>` exports a `scrollTo` function for click-to-scroll so you can use semantic HTML. It takes a little set-up because of this, but I believe the benefits outweight a little boilerplate. 

`scrollTo` uses [svelte-scrollto](https://github.com/langbamit/svelte-scrollto) to animate scrolling, instead of relying on the native browser implementation. Because of this, you can have smooth, custom scrolling regardless of browser support for `scroll-behavior`.


| Parameters          | Type   | Description                     |
| ------------------- | ------ | ------------------------------- |
| `section`           | number | The section to scroll to        |
| `config` (optional) | object | Scroll animation config options |  


<br/>

#### `config` object:
| Key        | Type     | Description                                      | Default     |
| ---------- | -------- | ------------------------------------------------ | ----------- |
| `selector` | string   | CSS selector of element to focus on after scroll | `""`        |
| `duration` | number   | Duration of scroll in milliseconds               | `1400`      |
| `easing`   | function | Easing function (import from 'svelte/easing')    | `quadInOut` |

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

### `<ParallaxLayer>`

| Props           | Type    | Default |
| --------------- | ------- | ------- |
| `rate`          | number  | `0.5`   |
| `offset`        | number  | `0`     |
| `span`          | number  | `1`     |
| `horizontal`    | boolean | `false` |
| `style`         | string  | `""`    |


#### Details
* `rate`: Rate the layer will scroll relative to `scrollY`. Can be positive or negative: positive will translate the layer up (left if horizontal) and negative, down (right if horizontal). `0` will scroll normally.

* `offset`: Offset from the top of the container when the layer is completely in the viewport, starting at 0. Can be a float (`0.5` will place the layer halfway down the first section).

* `span`: How many innerHeight-sized sections the layer will span.

* `horizontal`: Whether or not the layer will scroll horizontally. If true, the layer will start out of the viewport and scroll into view (left for positive rate, right for negative). Rate formula is different for horizontal and is determined by the percentage of `innerHeight` scrolled related to the container's width. A rate of `0` will cause the layer to remain out of view.

* `style`: Style attribute is also exposed for this component.

<br/>

### Tips
* `rate`: The `rate` prop will affect the initial position of `<ParallaxLayer>` because of the way the motion formulas work. A suggested workflow would be intially setting `disabled=true` on `<Parallax>` and placing content where you want it to *end up*. After that, remove `disabled` and then tweak rate and style until the motion is how you'd like it.

* `z-index`: `<ParallaxLayer>`s are organized on the z-axis like normal — later elements are placed on top of earlier elements. If you don't want to mess with z-index (and who does?) make sure to place all content that should always be visible/clickable towards the bottom of `<Parallax>`. Y-axis order is unaffected by this because that is decided by `offset`.

* `will-change`: I decided not to set `will-change: transform` on every `<ParallaxLayer>` because you quickly hit a memory limit (atleast in Firefox) and [it's not recommended anyways](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change). If you have performance issues, this can be added as necessary to the `style` prop.

<br/>

### Differences from react-spring/parallax
* Some of the prop names are changed for no reason other than that I like them more. If you are coming from react, `span = factor`, `sections = pages`, `rate = speed`.

* react-spring/parallax is a scrollable container, svelte-parallax is not (you are scrolling the actual page). This means that svelte-parallax can be anywhere on your page and only have the browser scrollbar visible.

* react-spring/parallax has a `horizontal` prop on the container component, svelte-parallax does not. This is mostly because of the point mentioned above — this is not a scrollable container, so you'd have to scroll the actual browser window horizontally, which is gross to me.

* svelte-parallax has a `horizontal` prop on `<ParallaxLayer>`, react-spring/parallax does not. I don't know if people will actually use it, but I like the idea of stuff popping in from the sides.


All that being said, I'd like to thank anyone and everyone who made react-spring/parallax, without whom this package would not exist.

#### Side-by-side example:
* [original react-spring/parallax demo](https://codesandbox.io/s/nwq4j1j6lm?from-embed)

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

**NOTE**: For SvelteKit/Sapper with SSR you'd have to do that behind an `if (process.browser)` or `if (typeof window !== 'undefined')` check.

<br/>

### Squarespace-style

For simple, no-frills parallax effects, you can set `stiffness` and `damping` to `1` which will cancel out the spring effect, and then set both `onEnter` and `onExit` on `<Parallax>` so the effect will be enabled whenever the container is in the viewport.

```html
<Parallax onEnter onExit config={{stiffness: 1, damping: 1}} sections={1}>
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
<Parallax onEnter onExit config={{stiffness: 1, damping: 1}} sections={3}>
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

[Demo](https://svelte.dev/repl/8afe479073024755a1cc158293310c0e?version=3.35.0)

<br/>

## ~~SimpleParallax~~ DEPRECATED
**NOTICE**: Deprecated in 0.1.10 in favor of focusing on the main two components. Will keep this around for awhile incase anyone has actually downloaded this already. Use the [Squarespace-style recipe](#squarespace-style) instead.


This component is your run of the mill, Squarespace-style parallax effect. No bells or whistles, you can just nest your content inside it:

```html
<script>
  import { SimpleParallax } from 'svelte-parallax';
</script>

<SimpleParallax>
  <img src="horse.jpg" alt="a horse">
</SimpleParallax>
```

**NOTE**: To be explicit: **YOU DO NOT USE `<ParallaxLayer>` IN `<SimpleParallax>`**.

<br/>

[Demo](https://svelte.dev/repl/12bc2038f4d54becaf896d65bc22e691?version=3.35.0)

<br/>


### Props

| Props      | Type    | Default |
| ---------- | ------- | ------- |
| `rate`     | number  | `-0.4`  |
| `disabled` | boolean | `false` |


#### Details
* `rate`: Rate of scroll relative to `scrollY`. Can be positive or negative: positive will translate the layer up and negative, down. `0` will scroll normally.

* `disabled`: Whether or not the effect is disabled. If set to true, your content will not be translated at all.

<br/>

**NOTE**: Mentioned above, but worth repeating: `rate` will affect the initial position of your parallaxing content, so you may have to tweak some styles on your content (i.e., `position: relative` and alter `top` or `bottom`).

**ANOTHER NOTE**: Each `<SimpleParallax>` has it's own `<svelte:window bind:scrollY>` so it's recommended to not have a million of them on one page. It's set up this way to avoid you having to hook up your own listener and passing it as a prop.

<br/>



## Contributing
Contributions are welcome! I'm pretty new to web development myself, so I'm keeping everything in JavaScript for now and I've tried to comment a lot to make jumping in easier. There really isn't a whole lot to the JavaScript parts so that helps too. (I have a weird thing for nested ternary operators so there might be one or two of them. Sorry in advance.)

To work locally:

```bash
git clone git@github.com:kindoflew/svelte-parallax
cd svelte-parallax
npm install
# if you want to use the demo page
cd demo
npm install
npm run dev
```

This will run a dev server on localhost:5000. The source lives in `src` and `demo` is there for live feedback while working.

Things I Probably Need:
* **Tests**: Don't really know a lot about testing UI yet, so if that's your thing, feel free to give it a go. Or you can just mess with the components until they break and open an issue!

* **Optimzations**: Didn't want to optimize in advance (YAGNI and Svelte takes care of a lot of it already), but I did notice that on mobile any `<ParallaxLayer>` that has only a `background-image` (no nested content) and a `rate` other than `0` will flicker until it stops moving. Only tested on an iPhone7 and iPhone8 so far. Also, note that `will-change: transform` has had no effect. Don't know much about rendering optimizations, so I'm open to any suggestions!
