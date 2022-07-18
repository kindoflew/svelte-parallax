<script>
  import { getContext, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { contextKey, clamp } from './utils';

  // offset bounds where layer is sticky
  export let offset = { top: 0, bottom: 0 };
  // expose progress store
  export let onProgress = undefined;

  // get context from Parallax
  const { config, addLayer, removeLayer } = getContext(contextKey);

  // if layer should stick
  let isSticky = false;
  // top coordinate of layer
  let coord = 0;
  // layer height
  let height;
  // spring store to hold progress value
  const progress = spring(0, { ...config, precision: 0.001 });

  const layer = {
    setPosition: (scrollTop, sectionHeight, disabled) => {
      if (disabled) {
        isSticky = false;
        coord = sectionHeight * offset.top;
        return;
      }

      const start = sectionHeight * offset.top;
      const end = sectionHeight * (offset.bottom || offset.top + 1);
      isSticky = getSticky(scrollTop, start, end);
      coord = getCoord(scrollTop, start, end, isSticky);
      progress.set(clamp((scrollTop - start) / (end - start), 0, 1));
    },
    setHeight: (sectionHeight) => {
      height = sectionHeight;
    },
  };

  const getSticky = (scrollTop, start, end) => {
    // covers an edge case where offset.top === 0
    // and there are other elements in the DOM before
    // the Parallax container
    const startCondition = start === 0 ? scrollTop > start : scrollTop >= start;
    return startCondition && scrollTop <= end;
  };

  const getCoord = (scrollTop, start, end, isSticky) => {
    if (isSticky) return 0;
    return scrollTop <= start ? start : end;
  };

  onMount(() => {
    // register layer with parent
    addLayer(layer);

    return () => {
      //clean up
      removeLayer(layer);
    };
  });

  $: position = isSticky ? 'fixed' : 'absolute';
  $: translate = `translate3d(0px, ${coord}px, 0px);`;
  $: if (onProgress) onProgress($progress ?? 0);
</script>

<div
  {...$$restProps}
  class="sticky-layer {$$restProps.class ? $$restProps.class : ''}"
  style="
    {$$restProps.style ? $$restProps.style : ''};
    position: {position};
    height: {height}px;
    -ms-transform: {translate}
    -webkit-transform: {translate}
    transform: {translate}
  "
>
  <slot progress={$progress} />
</div>

<style>
  .sticky-layer {
    width: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
</style>
