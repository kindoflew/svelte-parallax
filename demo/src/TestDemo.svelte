<script>
  import Parallax from "../../src/Parallax.svelte";
  import ParallaxLayer from "../../src/ParallaxLayer.svelte";

  let parallax;
</script>

<button on:click={parallax.scrollTo(2)}>Scroll</button>
<Parallax sections={3} bind:this={parallax}>
  <ParallaxLayer offset={1} rate={1} style="background-color: lightblue;"/>
</Parallax>

<style>
  button {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    z-index: 10;
  }
</style>