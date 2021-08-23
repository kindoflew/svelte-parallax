<script>
  import { getContext, onMount } from "svelte";
  import { spring } from "svelte/motion";
  import { contextKey } from "./utils/contextKey.js";

  /** rate that the layer scrolls relative to `scrollY` */
  export let rate = 0.5;
  /** offset from top of container when layer is in viewport */
  export let offset = 0;
  /** how many sections the layer spans */
  export let span = 1;
  /** style attribute for layer. don't forget your semi-colons! */
  export let style = "";

  // get context from Parallax
  let {
    config,
    addLayer,
    removeLayer
  } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  const coord = spring(undefined, config);
  // layer height
  let height;

  const layer = { 
    setPosition: (scrollTop, innerHeight, disabled) => {
      // amount to scroll before layer is at target position
      const targetScroll = Math.floor(offset) * innerHeight;
      // distance to target position
      const distance = offset * innerHeight + targetScroll * rate;
      const current = disabled 
        ? offset * innerHeight 
        : -(scrollTop * rate) + distance;

      coord.set(current, { hard: disabled });
    },
    setHeight: (innerHeight) => {
      height = span * innerHeight;
    }
  };

  onMount(() => {
    // register layer with parent
    addLayer(layer);

    return () => {
      // clean up
      removeLayer(layer);
    }
  });

  // translate layer according to coordinate
  $: translate = `translate3d(0, ${$coord}px, 0);`;
</script>

<div
  class="parallax-layer"
  style="
      {style}
      height: {height}px;
      -ms-transform: {translate}
      -webkit-transform: {translate}
      transform: {translate}
    "
>
  <slot />
</div>

<style>
  .parallax-layer {
    width: 100%;
    position: absolute;
    box-sizing: border-box;
  }
</style>
