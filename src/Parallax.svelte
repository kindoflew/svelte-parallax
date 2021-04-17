<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { quadInOut } from "svelte/easing";
  import { contextKey } from "./contextKey.js";
  import { scrollTo as svelteScrollTo } from "./scroll-fork/svelteScrollTo.js";
  import "focus-options-polyfill";

  // bind:this
  let container;
  // bind:innerHeight
  let innerHeight;
  
  // how many viewport heights the container spans
  export let sections = 1;
  // default spring config
  export let config = { stiffness: 0.017, damping: 0.26 };
  // whether or not effect starts when container enters viewport
  export let onEnter = false;
  // whether or not effect ends when container exits viewport
  export let onExit = false;
  // disable parallax effect, layers will be frozen at targetPosition
  export let disabled = false;
  // expose style attribute
  export let style = "";

  // fake intersection observer
  const y = writable(0);
  const top = writable(0);

  const enter = onEnter ? 1 : 0;
  const exit = onExit ? 0 : 1;
  
  const scrollTop = derived([y, top], ([$y, $top], set) => {
    const dy = $y - $top;
    const min = 0 - innerHeight * enter;
    const max = innerHeight * sections - innerHeight * exit;
    // sorry
    const step = dy < min ? min : (dy > max ? max : dy);

    set(step);
  });

  // eventual array of child objects
  const layers = writable([]);
  
  // set context for ParallaxLayers
  setContext(contextKey, {
    config,
    addLayer: (layer) => {
      layers.update(layers => [...layers, layer]);
    }
  });

  // update each ParallaxLayer's position
  $: $layers.forEach(layer => {
       layer.setPosition($scrollTop, innerHeight, disabled);
     });

  onMount(() => {
    setDimensions();
  });

  function setDimensions() {
    container.style.height = `${innerHeight * sections}px`;
    $top = container.getBoundingClientRect().top + window.pageYOffset;
    // set each ParallaxLayer's height
    $layers.forEach(layer => {
      layer.setHeight(innerHeight);
    });
  }

  export function scrollTo(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    const target = $top + (innerHeight * (section - 1));

    const focusTarget = () => {
      document.querySelector(selector).focus({ preventScroll: true });
    }
    // don't animate scroll if disabled
    if (disabled) {
      window.scrollTo({ top: target });
      selector && focusTarget();
      return;
    }

    svelteScrollTo({
      y: target, 
      duration,
      easing,
      onDone: selector ? focusTarget : () => {}
    });
  }
</script>

<svelte:window
  bind:scrollY={$y}
  bind:innerHeight={innerHeight}
  on:resize={() => setTimeout(setDimensions, 150)}
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
