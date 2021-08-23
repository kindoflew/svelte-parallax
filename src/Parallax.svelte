<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { quadInOut } from "svelte/easing";
  import { writableSet } from "./utils/writableSet.js";
  import { contextKey } from "./utils/contextKey.js";
  import { scrollTo as svelteScrollTo } from "./scroll-fork/svelteScrollTo.js";
  import "focus-options-polyfill";

  // bind:this
  let container;
  // bind:innerHeight
  let innerHeight;
  
  /** the number of viewport height-sized sections the container spans */
  export let sections = 1;
  /** spring config object */
  export let config = { stiffness: 0.017, damping: 0.26 };
  /** threshold of effect start/end when container enters/exits viewport */
  export let threshold = { top: 1, bottom: 1 };
  /** disable parallax effect, layers will be frozen at target position */
  export let disabled = false;
  /** style attribute for container. don't forget your semi-colons! */
  export let style = "";
  /** DEPRECATED: use `threshold.enter` */
  export let onEnter = undefined;
  /** DEPRECATED: use `threshold.exit` */
  export let onExit = undefined;

  // bind:scrollY
  const y = writable(0);
  // top coord of Parallax container
  const top = writable(0);

  // this is only here until legacy onEnter/onExit API is removed
  const legacyEnter = onEnter ? 0 : 1;
  const legacyExit = onExit ? 0 : 1;
  const enter = onEnter === undefined ? threshold.top : legacyEnter;
  const exit = onExit === undefined ? threshold.bottom : legacyExit;

  // fake intersection observer
  const scrollTop = derived([y, top], ([$y, $top], set) => {
    const dy = $y - $top;
    const min = 0 - innerHeight + innerHeight * enter;
    const max = innerHeight * sections - innerHeight * exit;
    // sorry
    const step = dy < min ? min : dy > max ? max : dy;
    set(step);
  });

  // eventually filled with ParallaxLayer objects
  const layers = writableSet(new Set());
  // update ParallaxLayers from parent
  $: $layers.forEach(layer => {
       layer.setHeight(innerHeight);
     });
  $: $layers.forEach(layer => {
       layer.setPosition($scrollTop, innerHeight, disabled);
     });

  setContext(contextKey, {
    config,
    addLayer: (layer) => {
      layers.add(layer);
    },
    removeLayer: (layer) => {
      layers.delete(layer);
    }
  });

  onMount(() => {
    setDimensions();
  });

  function setDimensions() {
    // set height here for edge case with more than one Parallax on page
    container.style.height = `${innerHeight * sections}px`;
    $top = container.getBoundingClientRect().top + window.pageYOffset;
  }

  export function scrollTo(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    const scrollTarget = $top + (innerHeight * (section - 1));

    const focusTarget = () => {
      document.querySelector(selector).focus({ preventScroll: true });
    }
    // don't animate scroll if disabled
    if (disabled) {
      window.scrollTo({ top: scrollTarget });
      selector && focusTarget();
      return;
    }

    svelteScrollTo({
      y: scrollTarget, 
      duration,
      easing,
      onDone: selector ? focusTarget : () => {}
    });
  }
</script>

<svelte:window
  bind:scrollY={$y}
  bind:innerHeight={innerHeight}
  on:resize={() => setTimeout(setDimensions, 0)}
/>

<div
  class="parallax-container"
  bind:this={container}
  style="{style}"
>
  <slot />
</div>

<style>
  .parallax-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    -ms-transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    box-sizing: border-box;
  }
</style>
