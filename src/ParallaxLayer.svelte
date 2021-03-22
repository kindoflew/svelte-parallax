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
  // whether the layer should scroll horizontally
  export let horizontal = false;
  // expose style attribute
  export let style = "";

  // get 'props' from Parallax
  let { 
    ready,
    scrollTop,
    intersecting,
    innerHeight,
    containerWidth,
    config,
    _disabled: disabled,
  } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  const coord = spring(undefined, config);
  // distance between starting position and targetPosition
  let distance;
  // height of layer, determined by innerHeight and span
  let layerHeight;

  // hold reference to original rate here for resizing
  let _rate = rate;

  // set distance and height
  $: if ($ready) setLayer($innerHeight, $containerWidth);
  // initial position
  $: if ($ready && !$intersecting && $scrollTop < 0) $coord = distance;
  // update coordinate as page is scrolled 
  $: if ($ready && $intersecting) $coord = -($scrollTop * rate) + distance;
  // translate layer according to coordinate
  $: translate = translate3dString($coord);
	  
  function setLayer(innerHeight, containerWidth) {
    if (horizontal) {
      rate = _rate * (containerWidth / innerHeight);
    }
 
    let targetScroll = Math.floor(offset) * innerHeight; 
    distance = horizontal
      ? (rate > 0 ? containerWidth : -containerWidth) 
      : offset * innerHeight + targetScroll * rate;  
    layerHeight = span * innerHeight;
  } 

  function translate3dString(coord) {
    // coordinate for when disabled or horizontal's y-coordinate
    let lockedCoord = offset * $innerHeight;
    // translating coordinate
    let _coord = $disabled 
      ? (horizontal ? 0 : lockedCoord) 
      : coord;

    return horizontal
      ? `transform: translate3d(${_coord}px, ${lockedCoord}px, 0);`
      : `transform: translate3d(0, ${_coord}px, 0);`;
  }
</script>

{#if ready}
<div
  class="parallax-item"
  style="
    width: 100%;
    {style}
    height: {layerHeight}px;
    {translate}
  "
>
  <slot />
</div>
{/if}
<style>
  .parallax-item {
    position: absolute;
    background-size: auto;
    box-sizing: border-box;
  }
</style>
