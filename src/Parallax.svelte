<script>
  import { setContext, onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { spring } from "svelte/motion";
  import { quadInOut } from "svelte/easing";
  import { writableSet } from "./utils/writableSet.js";
  import { contextKey } from "./utils/contextKey.js";
  import { scrollTo as svelteScrollTo } from "./scroll-fork/svelteScrollTo.js";
  import "focus-options-polyfill";

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
  /** a function that recieves a progress object: `{ parallaxProgress: float, section: number, sectionProgress: float }` */
  export let onProgress = undefined;
  /** disable parallax effect, layers will be frozen at target position */
  export let disabled = false;
  /** style attribute for container. don't forget your semi-colons! */
  export let style = "";

  /** DEPRECATED: use `threshold.top` */
  export let onEnter = undefined;
  /** DEPRECATED: use `threshold.bottom` */
  export let onExit = undefined;

  // bind:scrollY
  const y = writable(0);
  // top coord of Parallax container
  const top = writable(0);
  // height of a section
  const height = writable(0);

  // this is only here until legacy onEnter/onExit API is removed
  const legacyEnter = onEnter ? 0 : 1;
  const legacyExit = onExit ? 0 : 1;
  const enter = onEnter === undefined ? threshold.top : legacyEnter;
  const exit = onExit === undefined ? threshold.bottom : legacyExit;

  // fake intersection observer
  const scrollTop = derived([y, top, height], ([$y, $top, $height], set) => {
    const dy = $y - $top;
    const min = 0 - $height + $height * enter;
    const max = $height * sections - $height * exit;
    // sorry
    const step = dy < min ? min : dy > max ? max : dy;
    set(step);
  });

  let parallaxProgress = writable(0)
  let section = writable(0)
  let sectionProgress = writable(0)

  const getProgress = (scrollTop, height) => {
    // subtract height because progress doesn't start until top of container is at top of viewport
    const scrollHeight = (height * sections) - height;
    let _parallaxProgress = scrollTop / scrollHeight;
    const containerHeight = height * sections;
    let _section = Math.floor((scrollTop / containerHeight) * sections);
    const sectionScrollTop = scrollTop - (height * _section);
    const _sectionProgress = sectionScrollTop / height;

    // stop updating parallaxProgress to avoid values greater than 1
    // stop updating section because we're adding 1 (sections aren't zero-indexed, but the math is)
    // continue updating sectionProgress in case value is needed beyond the bottom of the container
    const end = scrollTop >= scrollHeight;

    _parallaxProgress = end ? 1 : _parallaxProgress
    _section = end ? sections : _section + 1

    parallaxProgress.set(_parallaxProgress)
    section.set(_section)
    sectionProgress.set(_sectionProgress)

    if (onProgress) {
      onProgress({
        parallaxProgress: _parallaxProgress,
        section: _section,
        sectionProgress: _sectionProgress,
      })
    }
  };

  $: if ($height > 0 && $scrollTop >= 0) getProgress($scrollTop, $height);

  // eventually filled with ParallaxLayer objects
  const layers = writableSet(new Set());
  // update ParallaxLayers from parent
  $: $layers.forEach(layer => {
       layer.setHeight($height);
     });
  $: $layers.forEach(layer => {
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
    parallaxProgress,
    section,
    sectionProgress,
  });

  onMount(() => {
    setDimensions();
  });

  function setDimensions() {
    // set height here for edge case with more than one Parallax on page
    $height = sectionHeight ? sectionHeight : innerHeight;
    container.style.height = `${$height * sections}px`;
    $top = container.getBoundingClientRect().top + window.pageYOffset;
  }

  export function scrollTo(section, { selector = '', duration = 500, easing = quadInOut } = {}) {
    const scrollTarget = $top + ($height * (section - 1));

    const focusTarget = () => {
      document.querySelector(selector).focus({ preventScroll: true });
    }
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
      onDone: selector ? focusTarget : () => {}
    });
  }
</script>

<svelte:window
  bind:scrollY={$y}
  bind:innerHeight
  on:resize={() => setTimeout(setDimensions, 0)}
/>

<div class="parallax-container" bind:this={container} {style}>
  <slot />
</div>

<style>
  .parallax-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    -ms-transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    box-sizing: border-box;
  }
</style>
