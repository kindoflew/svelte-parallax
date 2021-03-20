<script>
  import { getContext } from "svelte";
  import { spring } from "svelte/motion";
  import { contextKey } from "./contextKey.js";

  // bind:this
  let layer;

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
    config,
    _disabled: disabled,
    scrollTop,
    containerWidth,
    innerHeight,
    intersecting
  } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  let coord;
  // position layer will be when scrolled into viewport
  let targetPosition;
  // distance between starting position and targetPosition
  let distance;
  // height of layer, determined by innerHeight and span
  let layerHeight;

  // hold reference to original rate here for resizing
  let _rate = rate;

  function initLayer() {
    // horizontal rate is relative to percentage of $innerHeight scrolled
    if (horizontal) {
      rate = _rate * ($containerWidth / $innerHeight);
    }

    targetPosition = Math.floor(offset) * $innerHeight;
    distance = horizontal
      ? (rate > 0 ? $containerWidth : -$containerWidth)
      : offset * $innerHeight + targetPosition * rate;
    layerHeight = span * $innerHeight;

    coord = spring(-($scrollTop * rate) + distance, config);
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

  $: if (layer) $innerHeight, $containerWidth, initLayer();
  $: if (layer && $intersecting) $coord = -($scrollTop * rate) + distance;
  $: translate = translate3dString($coord);
</script>

<div
  class="parallax-item"
  bind:this={layer}
  style="
    width: 100%;
    {style}
    height: {layerHeight}px;
    {translate}
  "
>
  <slot />
</div>

<style>
  .parallax-item {
    position: absolute;
    background-size: auto;
    box-sizing: border-box;
  }
</style>
