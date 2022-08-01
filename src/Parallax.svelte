<script>
  import { setContext, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { writable, derived } from 'svelte/store';
  import { quadInOut } from 'svelte/easing';
  import { writableSet, contextKey, clamp } from './utils';
  import { scrollTo as svelteScrollTo } from './scroll-fork/svelteScrollTo.js';
  import 'focus-options-polyfill';

  // bind:this
  let container;
  // bind:innerHeight
  let innerHeight;

  /** the number of sections the container spans */
  export let sections = 1;
  /** the height of a section, defaults to window.innerHeight */
  export let sectionHeight = undefined;
  /** spring config object */
  export let config = { stiffness: 0.017, damping: 0.26 };
  /** threshold of effect start/end when container enters/exits viewport */
  export let threshold = { top: 1, bottom: 1 };
  /** a function that receives a progress object: `{ progress: float, section: number }` */
  export let onProgress = undefined;
  /** a function that receives "scrollTop" -- the number of pixels scrolled between each threshold */
  export let onScroll = undefined;
  /** disable parallax effect, layers will be frozen at target position */
  export let disabled = false;

  // bind:scrollY
  const y = writable(0);
  // top coord of Parallax container
  const top = writable(0);
  // height of a section
  const height = writable(0);
  // spring store to hold scroll progress
  const progress = spring(undefined, { ...config, precision: 0.001 });

  // fake intersection observer
  const scrollTop = derived([y, top, height], ([$y, $top, $height], set) => {
    const dy = $y - $top;
    const min = 0 - $height + $height * threshold.top;
    const max = $height * sections - $height * threshold.bottom;
    const step = clamp(dy, min, max);
    set(step);
  });

  $: if (onScroll) onScroll($scrollTop);
  $: if (onProgress) setProgress($scrollTop, $height);
  $: if (onProgress) onProgress($progress ?? 0);

  const setProgress = (scrollTop, height) => {
    if (height === 0) {
      progress.set(0);
      return;
    }
    const scrollHeight = height * sections - height;
    progress.set(clamp(scrollTop / scrollHeight, 0, 1));
  };

  // eventually filled with ParallaxLayer objects
  const layers = writableSet(new Set());
  // update ParallaxLayers from parent
  $: $layers.forEach((layer) => {
    layer.setHeight($height);
  });
  $: $layers.forEach((layer) => {
    layer.setPosition($scrollTop, $height, disabled);
  });
  $: if ($height !== 0) (sectionHeight, setDimensions());

  setContext(contextKey, {
    config,
    addLayer: (layer) => {
      layers.add(layer);
    },
    removeLayer: (layer) => {
      layers.delete(layer);
    },
  });

  onMount(() => {
    setDimensions();
  });

  const setDimensions = () => {
    height.set(sectionHeight ? sectionHeight : innerHeight);
    top.set(container.getBoundingClientRect().top + window.pageYOffset);
  }

  export function scrollTo(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    const scrollTarget = $top + $height * (section - 1);

    const focusTarget = () => {
      document.querySelector(selector).focus({ preventScroll: true });
    };
    // don't animate scroll if disabled
    if (disabled) {
      window.scrollTo({ top: scrollTarget });
      selector && focusTarget();
      return;
    }

    svelteScrollTo({
      y: scrollTarget,
      duration,
      easing,
      onDone: selector ? focusTarget : () => {},
    });
  }
</script>

<svelte:window
  bind:scrollY={$y}
  bind:innerHeight
  on:resize={() => setTimeout(setDimensions, 0)}
/>

<div
  {...$$restProps}
  class="parallax-container {$$restProps.class ? $$restProps.class : ''}"
  style="
    height: {$height * sections}px;
    {$$restProps.style ? $$restProps.style : ''};
  "
  bind:this={container}
>
  <slot />
</div>

<style>
  .parallax-container {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
