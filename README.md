# svelte-parallax

a (very) small component collection for parallax scrolling effects with Svelte.

**NOTE**: This is at 0.1.0 and I'm still working on stuff. I don't think the API will change, but if something is broken, open an issue and let me know!

This package has two parts: 
* a pair of components, `<Parallax>` and `<ParallaxLayer>` 
* a standalone `<SimpleParallax>` component

## Content
* [Install](#install)
* [Parallax and ParallaxLayer](#parallax-and-parallaxlayer)
  * [`<Parallax>`](#parallax)
  * [`scrollTo`](#scrollto)
  * [`<ParallaxLayer>`](#parallaxlayer)
  * [Tips](#tips)
  * [Differences from react-spring/parallax](#differences-from-react-springparallax)
* [SimpleParallax](#simpleparallax)
* [Prefers-reduced-motion](#prefers-reduced-motion)
* [Contributing](#contributing)

## Install

```bash
npm i -D svelte-parallax
```

**IF YOU WANT SIMPLE, NO-FRILLS, SQUARESPACE-STYLE PARALLAX SKIP TO [SimpleParallax](#simpleparallax).**

## Parallax and ParallaxLayer
These components are *heavily* influenced by [react-spring/parallax](https://github.com/pmndrs/react-spring/tree/v9/packages/parallax).
The API is very similar and functions (mostly) the same under the hood (See [differences](#differences-from-react-spring/parallax) between them).

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


### `<Parallax>`

| Props      | Type    | Default                               |
| ---------- | ------- | ------------------------------------- |
| `sections` | number  | `1`                                   |
| `config`   | object  | `{ stiffness: 0.017, damping: 0.26 }` |
| `onEnter`  | boolean | `false`                               |
| `disabled` | boolean | `false`                               |
| `style`    | string  | `""`                                  |


#### Description
* `sections`: How many innerHeight-sized sections the container has.

* `config`: Optional [Svelte spring store](https://svelte.dev/docs#spring) configuration, if you want more control over parallax physics.

* `onEnter`: Whether or not to the start effect as soon as container enters viewport. `true`: start effect as soon as container is visible, `false`: wait until container top is at the top of the viewport.

* `disabled`: Reactive disabled value so you can conditionally disable the effects (for a11y, etc. see [Prefers-reduced-motion](#prefers-reduced-motion)). When `disabled = true`, layers will stay at their target positions.

* `style`: The `style` attribute of the container is exposed so you can do pretty much whatever you want. Messing with `height`, `position` or `overflow` *might* break stuff, but you do you.

### `scrollTo`
Rather than have a click listener on an entire `<ParallaxLayer>` (which I think is bad for a11y because a page sized `div` probably shouldn't be a button or anchor link), `<Parallax>` exports a `scrollTo` function for click-to-scroll so you can use semantic HTML. It takes a little set-up because of this, but I believe the benefits outweight a little boilerplate.


| Parameters      | Type              | Description                                      |
| --------------- | ----------------- | ------------------------------------------------ |
| `section`       | number            | The section to scroll to                         |
| `selector`      | string (optional) | CSS selector of element to focus on after scroll |

```HTML
<script>
  import { Parallax, ParallaxLayer } from 'svelte-parallax';

  // for bind:this. name can be anything
  let parallax;
</script>
                    <!-- bind to component instance -->
<Parallax sections={3} bind:this={parallax}>

  <ParallaxLayer offset={0}>
                                   <!-- function is a method on component instance -->
    <button class='horse-btn' on:click={() => parallax.scrollTo(2, '.top-btn')}>
      Scroll to horse
    </button>
  </ParallaxLayer>

  <ParallaxLayer offset={1}>
    <img src='horse.jpg' alt='a horse'>
    <button class="top-btn" on:click={() => parallax.scrollTo(1, '.horse-btn')}>
      Scroll to top
    </button>
  </ParallaxLayer>
</Parallax>
```

If you *really* need to use something besides buttons or links for `scrollTo` make sure to address `tabindex`, focus-style, and `keyup`/`keydown` events (More best practices at [MDN - ARIA: button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role)).


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

* `offset`: Offset from the top of the container when the layer is completely in the viewport. Can be a float (`0.5` will place the layer halfway down the first section). Should be `<= sections - 1`.

* `span`: How many sections the layer will span. Probably shouldn't be `<= 0` or `> sections`.

* `horizontal`: Whether or not the layer will scroll horizontally. If true, the layer will start out of the viewport and scroll into view (left for positive rate, right for negative). Rate formula is different for horizontal and is determined by the percentage of `scrollY` related to the container's width. A rate of `0` will cause the layer to remain out of view.

* `style`: Style attribute is also exposed for this component.


### Tips
* `rate`: The `rate` prop will affect the initial position of `<ParallaxLayer>` because of the way the motion formulas work. A suggested workflow would be intially setting `disabled=true` on `<Parallax>` and placing content where you want it to *end up*. After that, remove `disabled` and then tweak rate and style until the motion is how you'd like it.

* `z-index`: `<ParallaxLayer>`s are organized on the z-axis like normal — later elements are placed on top of earlier elements. If you don't want to mess with z-index (and who does?) make sure to place all content that should always be visible/clickable towards the bottom of `<Parallax>`. Y-axis order is unaffected by this because that is decided by `offset`.

* `will-change`: I decided not to set `will-change: transform` on every `<ParallaxLayer>` because you quickly hit a memory limit (atleast in Firefox) and [it's not recommended anyways](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change). If you have performance issues, this can be added as necessary to the `style` prop.

* `style`: Optionally, if you hate inline styles, `<Parallax>` and `<ParallaxLayer>` have classes exposed (`.parallax-container` and `.parallax-layer` respectively) so you could target them with something like `:global(.parallax-container)` if that's more your style.


### Differences from react-spring/parallax
* Some of the prop names are changed for no reason other than that I like them more. If you are coming from react, `span = factor`, `sections = pages`, `rate = speed`.

* react-spring/parallax is a scrollable container, svelte-parallax is not, so you are scrolling the actual page. This means that svelte-parallax can be anywhere on your page and only have the browser scrollbar visible.

* react-spring/parallax has a `horizontal` prop on the container component, svelte-parallax does not. This is mostly because of the point mentioned above — this is not a scrollable container, so you'd have to scroll the actual browser window horizontally, which is gross to me. (I am considering making another container component that would use `position: sticky` and scroll horizontally based on `scrollY`, but I'm still not sure about it.)

* svelte-parallax has a `horizontal` prop on `<ParallaxLayer>`, react-spring/parallax does not. I don't know if people will actually use it, but I like the idea of stuff popping in from the sides.


All that being said, I'd like to thank anyone and everyone who made react-spring/parallax, without whom this package would not exist.

### Side-by-side example
[original react-spring/parallax demo](https://codesandbox.io/s/nwq4j1j6lm?from-embed)

[svelte-parallax version](https://svelte.dev/repl/1504d411044745a186004855521a89c7?version=3.35.0)


## SimpleParallax

This component is your run of the mill, Squarespace-style parallax effect. No bells or whistles, you can just nest your content inside it:

```html
<script>
  import { SimpleParallax } from 'svelte-parallax';
</script>

<SimpleParallax>
  <img src="horse.jpg" alt="a horse">
</SimpleParallax>
```

[Demo](https://svelte.dev/repl/12bc2038f4d54becaf896d65bc22e691?version=3.35.0)


**NOTE**: To be explicit: **YOU DO NOT USE `<ParallaxLayer>` IN `<SimpleParallax>`**. I mean, I think it'd still work, but that's not how it's designed.

### Props

| Props      | Type    | Default |
| ---------- | ------- | ------- |
| `rate`     | number  | `-0.4`  |
| `disabled` | boolean | `false` |


#### Details
* `rate`: Rate of scroll relative to `scrollY`. Can be positive or negative: positive will translate the layer up and negative, down. `0` will scroll normally.

* `disabled`: Whether or not the effect is disabled. If set to true, your content will stay in the position it would be when when `scrollY` is equal to the top of the container.


**NOTE**: Mentioned above, but worth repeating: `rate` will affect the initial position of your parallaxing content, so you may have to tweak some styles (i.e., `position: relative` and alter `top` or `bottom`).

**ANOTHER NOTE**: Each `<SimpleParallax>` has it's own `<svelte:window bind:scrollY>` so it's recommended to not have a million of them on one page. It's set up this way to avoid you having to hook up your own listener and passing it as a prop.


## Prefers-reduced-motion

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

## Contributing
Contributions are welcome! I'm pretty new to web development myself, so I'm keeping everything in JavaScript for now and I've tried to comment a lot to make jumping in easier. There really isn't a whole lot to the JavaScript parts so that helps too.

To work locally:

```bash
git clone git@github.com:kindoflew/svelte-parallax
cd svelte-parallax
npm install
npm run dev
```

This will run a dev server on localhost:5000. The source lives in `src` and `demo` is there for live feedback while working.

Things I Probably Need:
* **Tests**: Don't really know a lot about testing UI yet, so if that's your thing, feel free to give it a go. Or you can just mess with the components until they break and open an issue!

* **Optimzation**: Didn't want to optimize in advance (YAGNI and Svelte takes care of a lot of it already), but I did notice that on mobile any `<ParallaxLayer>` that has only a `background-image` (no nested content) and a `rate` other than `0` will flicker until it stops moving. Only tested on an iPhone7 and iPhone8 so far. Also, note that `will-change: transform` has had no effect. Don't know much about rendering optimizations, so I'm open to any suggestions!

* **Refactoring**: I'm sure the code is probably ugly! I have a weird thing for nested ternary operators so there might be one or two of them. Sorry in advance.
