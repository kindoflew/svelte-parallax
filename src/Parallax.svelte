<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { quadInOut } from "svelte/easing";
  import { contextKey } from "./contextKey.js";
  import { scrollTo as svelteScrollTo } from "svelte-scrollto";
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

  // initialize 'props'
  const ready = writable(false);
  const y = writable(0);
  const top = writable(0);
  const scrollTop = derived([y, top], ([$y, $top]) => $y - $top);
  const intersecting = writable(false);
  const innerHeight = writable(0);
  const containerWidth = writable(0);
  const _disabled = writable(false);
  // make disabled reactive so it can be set dynamically by user
  $: $_disabled = disabled;
  // for use in intersecting calculation
  let enterThreshold = onEnter ? 1 : 0;
  let exitThreshold = onExit ? 0 : 1;
  
  // set context of 'props'
  setContext(contextKey, {
    ready,
    scrollTop,
    intersecting,
    innerHeight,
    containerWidth,
    config,
    _disabled,
  });

  onMount(() => {
    $ready = true;
  });

  $: containerHeight = $innerHeight * sections;
  $: if ($ready) getContainerDimensions();
  // if container is in viewport (refactor to intersection observer?)
  $: $intersecting = (
       $y >= ($top - $innerHeight * enterThreshold) && 
       $y <= ($top + containerHeight - $innerHeight * exitThreshold)
     );

  function getContainerDimensions() {
    let containerRect = container.getBoundingClientRect();
    $top = containerRect.top + $y;
    $containerWidth = containerRect.width;
  }

  export function scrollTo(section, { selector = '', duration = 1400, easing = quadInOut } = {}) {
    let target = $top + ($innerHeight * (section - 1));

    const focusTarget = () => {
      document.querySelector(selector).focus({ preventScroll: true });
    }
    // don't animate scroll if disabled
    if (disabled) {
      window.scrollTo({top: target});
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
  on:resize={() => setTimeout(getContainerDimensions, 150)}
/>

<div
  class="parallax-container"
  bind:this={container}
  style="{style} height: {containerHeight}px;"
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
