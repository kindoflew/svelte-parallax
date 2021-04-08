<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { quadInOut } from "svelte/easing";
  import { contextKey } from "./contextKey.js";
  import { scrollTo as svelteScrollTo } from "./scroll-fork/svelteScrollTo.js";
  import "focus-options-polyfill";

  // bind:this
  let container;

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

  // for use in scrollTop 
  let enter = onEnter ? 1 : 0;
  let exit = onExit ? 0 : 1;

  // initialize stores
  const ready = writable(false);
  const layers = writable([]);
  const y = writable(0);
  const top = writable(0);
  const innerHeight = writable(0);
  // TODO: use intersection observer?
  const scrollTop = derived([y, top], ([$y, $top], set) => {
    const step = $y - $top;
    const min = 0 - $innerHeight * enter;
    const max = $innerHeight * sections - $innerHeight * exit;
    
    if (step < min) {
      set(min);
    } else if (step > max) {
      set(max);
    } else {
      set(step);
    }
  });
  
  // set context for ParallaxLayer
  setContext(contextKey, {
    ready,
    config,
    addLayer: (layer) => {
      layers.update((layers) => [...layers, layer])
    }
  });

  // update each ParallaxLayer's position
  $: $layers.forEach(layer => {
       layer.setPosition($innerHeight, $scrollTop, disabled);
     });

  onMount(() => {
    setDimensions();
    $ready = true;
  });

  function setDimensions() {
    container.style.height = `${$innerHeight * sections}px`;
    $top = container.getBoundingClientRect().top + window.pageYOffset;
    // set each ParallaxLayer's height
    $layers.forEach(layer => {
      layer.setHeight($innerHeight);
    });
  }

  export function scrollTo(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    let target = $top + ($innerHeight * (section - 1));

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
  bind:innerHeight={$innerHeight}
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
