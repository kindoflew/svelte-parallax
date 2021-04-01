<script>
  import { getContext } from "svelte";
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

  // get context stores from Parallax
  let { 
    ready,
    innerHeight,
    scrollTop,
    config,
    _disabled: disabled,
  } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  const coord = spring(undefined, config);
  // distance between starting position and target position
  let distance;
  // self-explanatory
  let layerHeight;

  $: if ($ready) {
       // set height
       layerHeight = span * $innerHeight;
       // set distance
       distance = setDistance($innerHeight);
     }
  // update coordinate as page is scrolled 
  $: if ($ready) $coord = -($scrollTop * rate) + distance;
  // translate layer according to coordinate
  $: translate = $disabled 
      ? `translate3d(0, ${offset * $innerHeight}px, 0);`
      : `translate3d(0, ${$coord}px, 0);`;
	  
  function setDistance(innerHeight) {
    // how many sections are scrolled before layer is at it's target position
    let targetScroll = Math.floor(offset) * innerHeight; 

    return offset * innerHeight + targetScroll * rate;
  } 
</script>

{#if ready}
  <div
    class="parallax-layer"
    style="{style} height: {layerHeight}px; -ms-transform: {translate} -webkit-transform: {translate} transform: {translate}"
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
