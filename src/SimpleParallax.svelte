<script>
  import { onMount } from "svelte";

  export let rate = -0.4;
  export let disabled = false;

  let container;
  let y;
  let top;
  let height;
  let translate = "";

  onMount(() => {
    getTop();
  });

  function getTop() {
    top = container.getBoundingClientRect().top + y;
  }

  $: intersecting = y > top - height && y < top + height;
  $: if (!intersecting && !disabled && y <= top - height) translate = `transform: translate3d(0, ${height * rate}px, 0);`;
  $: if (intersecting && !disabled) translate = `transform: translate3d(0, ${-(y - top) * rate}px, 0);`;
  $: if (disabled) translate = `transform: translate3d(0, 0, 0);`;
</script>

<svelte:window bind:scrollY={y} on:resize={getTop} />

<div class="simple-parallax-container" bind:this={container} bind:offsetHeight={height}>
  <div class="simple-parallax-item" style="{translate}">
    <slot />
  </div>
</div>

<style>
  .simple-parallax-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .simple-parallax-item {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
