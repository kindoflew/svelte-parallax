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
  // distance between starting position and target position
  let distance;
  // span * innerHeight
  let layerHeight;

  // hold reference to original rate here for resizing if horizontal
  let _rate = rate;

  $: if ($ready) {
       // set height
       layerHeight = span * $innerHeight;
       // set distance
       distance = setDistance($innerHeight, $containerWidth);
     }
  // initial position
  $: if ($ready && !$intersecting && $scrollTop < 0) $coord = distance;
  // update coordinate as page is scrolled 
  $: if ($ready && $intersecting) $coord = -($scrollTop * rate) + distance;
  // translate layer according to coordinate
  $: translate = translate3dString($coord, $disabled);
	  
  function setDistance(innerHeight, containerWidth) {
    // horizontal rate is proportional to amount of innerHeight scrolled
    if (horizontal) rate = _rate * (containerWidth / innerHeight);
    // how many sections are scrolled before layer is at it's offset position, relative to viewport
    let targetScroll = Math.floor(offset) * innerHeight; 

    return horizontal
      ? (rate > 0 ? containerWidth : -containerWidth) 
      : offset * innerHeight + targetScroll * rate;
  } 

  function translate3dString(coord, disabled) {
    // coordinate for when disabled or horizontal's y-coordinate
    let lockedCoord = offset * $innerHeight;

    if (disabled) {
      return `translate3d(0, ${lockedCoord}px, 0);`
    }
    
    return horizontal
      ? `translate3d(${coord}px, ${lockedCoord}px, 0);`
      : `translate3d(0, ${coord}px, 0);`;
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
