<script>
  import { onMount } from "svelte";

  export let rate = -0.4;
  export let disabled = false;

  let container;
  let y;
  let top;
  let height;
  let translate = "";

  function getTop() {
    top = container.getBoundingClientRect().top + y;
  }

  onMount(() => {
    getTop();
  });

  $: intersecting = y > top - height && y < top + height;
  $: if (intersecting && !disabled) translate = `transform: translate3d(0, ${-(y - top) * rate}px, 0)`;
</script>

<svelte:window bind:scrollY={y} on:resize={getTop} />

<div class="parallax-container" bind:this={container} bind:offsetHeight={height}>
  <div class="parallax-item" style={translate}>
    <slot />
  </div>
</div>

<style>
  .parallax-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .parallax-item {
    height: 100%;
    width: 100%;
  }
</style>
