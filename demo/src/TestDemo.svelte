<script>
  import Parallax from "../../src/Parallax.svelte";
  import ParallaxLayer from "../../src/ParallaxLayer.svelte";

  let parallax;
  let parallaxProgress;
  let section;
  let sectionProgress;
  const handleProgress = (progress) => {
    ({ parallaxProgress, section, sectionProgress } = progress);
  };
</script>

<button on:click={parallax.scrollTo(2)}>Scroll</button>
<h1 class='progress-details'>
  {`${parallaxProgress} ${section} ${sectionProgress}`}
</h1>

<Parallax sections={3} bind:this={parallax} onProgress={handleProgress}>
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
  h1 {
    position: fixed;
    z-index: 10;
  }
</style>