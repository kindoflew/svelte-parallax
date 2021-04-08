<script>
  import { getContext, onMount } from "svelte";
  import { spring } from "svelte/motion";
  import { contextKey } from "./contextKey.js";

  // rate that the layer scrolls relative to scrollY
  export let rate = 0.5;
  // offset from top of container when layer is in viewport
  export let offset = 0;
  // how many sections the layer spans
  export let span = 1;
  // expose style attribute
  export let style = "";

  // get context from Parallax
  let {
    ready,
    config,
    addLayer
  } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  const coord = spring(undefined, config);
  // self-explanatory
  let layerHeight;

  // translate layer according to coordinate
  $: translate = `translate3d(0, ${$coord}px, 0);`;

  onMount(() => {
    // register layer with parent
    addLayer({ setPosition, setHeight });
  });

  function setPosition(innerHeight, scrollTop, disabled) {
    // amount to scroll before layer is at target position
    let targetScroll = Math.floor(offset) * innerHeight;
    // distance to target position
    let distance = offset * innerHeight + targetScroll * rate;
    // current position of layer
    let current = disabled 
      ? offset * innerHeight 
      : -(scrollTop * rate) + distance;

    coord.set(current, { hard: disabled });
  }

  function setHeight(innerHeight) {
    layerHeight = span * innerHeight;
  }
</script>

{#if ready}
  <div
    class="parallax-layer"
    style="
      {style} 
      height: {layerHeight}px; 
      -ms-transform: {translate} 
      -webkit-transform: {translate} 
      transform: {translate}
    "
  >
    <slot />
  </div>
{/if}

<style>
  .parallax-layer {
    width: 100%;
    position: absolute;
    box-sizing: border-box;
  }
</style>
