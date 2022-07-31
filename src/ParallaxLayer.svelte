<script>
  import { getContext, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { contextKey, clamp } from './utils';

  /** rate that the layer scrolls relative to `scrollY` */
  export let rate = 0.5;
  /** offset from top of container when layer is in viewport */
  export let offset = 0;
  /** how many sections the layer spans */
  export let span = 1;
  /** a function that receives a number between 0 and 1, representing the progress of the layer */
  export let onProgress = undefined;

  // get context from Parallax
  const { config, addLayer, removeLayer } = getContext(contextKey);

  // spring store to hold changing scroll coordinate
  const coord = spring(undefined, config);
  // and one to hold intersecting progress
  const progress = spring(undefined, { ...config, precision: 0.001 });
  // layer height
  let height;

  const layer = {
    setPosition: (scrollTop, sectionHeight, disabled) => {
      if (disabled) {
        coord.set(offset * sectionHeight, { hard: true });
        return;
      }
      // amount to scroll before layer is at target position
      const targetScroll = Math.floor(offset) * sectionHeight;
      // distance to target position
      const distance = offset * sectionHeight + targetScroll * rate;
      coord.set(-(scrollTop * rate) + distance);
      progress.set(getProgress(scrollTop, rate, distance, sectionHeight));
    },
    setHeight: (sectionHeight) => {
      height = span * sectionHeight;
    },
  };

  const getProgress = (scrollTop, rate, distance, sectionHeight) => {
    const apparentRate = rate + 1;
    const halfWay = distance / apparentRate;
    const direction = rate >= 0 ? 1 : -1;
    const scrollDistance = (sectionHeight / apparentRate) * direction;
    const start = halfWay - scrollDistance;
    const end = halfWay + scrollDistance * span;
    const progress = (scrollTop - start) / (end - start);
    return clamp(progress, 0, 1);
  };

  onMount(() => {
    // register layer with parent
    addLayer(layer);

    return () => {
      // clean up
      removeLayer(layer);
    };
  });

  // translate layer according to coordinate
  $: translate = `translate3d(0px, ${$coord}px, 0px);`;
  $: if (onProgress) onProgress($progress ?? 0);
</script>

<div
  {...$$restProps}
  class="parallax-layer {$$restProps.class ? $$restProps.class : ''}"
  style="
    {$$restProps.style ? $$restProps.style : ''};
    height: {height}px;
    -ms-transform: {translate};
    -webkit-transform: {translate};
    transform: {translate};
  "
>
  <slot progress={$progress} />
</div>

<style>
  .parallax-layer {
    width: 100%;
    position: absolute;
    box-sizing: border-box;
  }
</style>
