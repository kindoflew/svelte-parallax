<script>
  import Parallax from "../../src/Parallax.svelte";
  import ParallaxLayer from "../../src/ParallaxLayer.svelte";
</script>

<div style="height:20rem; width: 30rem;"/>

<Parallax sections={2} threshold={{ top: 0, bottom: 0 }} style={'background-color: green;'}>
  <ParallaxLayer span={2} style={'background-color: pink;'}>

  </ParallaxLayer>
</Parallax>

<div style="height:20rem; width: 30rem;" />

<style>
  /* your styles go here */
</style>