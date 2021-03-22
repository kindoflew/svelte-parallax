<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { contextKey } from "./contextKey.js";
  import "focus-options-polyfill";

  // bind:this
  let container;

  // how many viewport heights the container spans
  export let sections = 1;
  // default spring config
  export let config = { stiffness: 0.017, damping: 0.26 };
  // whether or not effect starts as soon as container enters viewport
  export let onEnter = false;
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
  let threshold = onEnter ? 1 : 0;
  
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
  $: if ($ready) setContainerDimensions();
  // if container is in viewport (refactor to intersection observer?)
  $: $intersecting = $y >= $top - $innerHeight * threshold && $y < $top + containerHeight;

  function setContainerDimensions() {
    let containerRect = container.getBoundingClientRect();
    $top = containerRect.top + $y;
    $containerWidth = containerRect.width;
  }

  export function scrollTo(section, selector) {
    let target = $top + ($innerHeight * (section - 1));
    window.scrollTo({
      top: target,
      behavior: disabled ? "auto" : "smooth"
    });
    if (selector) { 
      document.querySelector(selector).focus({ preventScroll: true })
    }
  }
</script>

<svelte:window
  bind:scrollY={$y}
  bind:innerHeight={$innerHeight}
  on:resize={() => setTimeout(setContainerDimensions, 150)}
/>

<div
  class="parallax-container"
  bind:this={container}
  style="
    width: 100%;
    {style}
    height: {containerHeight}px;
  "
>
  <slot />
</div>

<style>
  .parallax-container {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    box-sizing: border-box;
  }
</style>
