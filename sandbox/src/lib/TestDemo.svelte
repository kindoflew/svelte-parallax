<!-- ################################################# -->
<!-- ################################################# -->
<!-- #### THIS FILE IS FOR TESTS -- DO NOT CHANGE #### -->
<!-- ################################################# -->
<!-- ################################################# -->
<script>
  import Parallax from '../../../src/Parallax.svelte';
  import ParallaxLayer from '../../../src/ParallaxLayer.svelte';
  import StickyLayer from '../../../src/StickyLayer.svelte';

  let parallax;

  let parallaxProgress;
  const handleProgress = (progress) => {
    parallaxProgress = progress;
  };
  let layerProgress;
  const handleLayerProgress = (progress) => {
    layerProgress = progress;
  };
  let stickyProgress;
  const handleStickyProgress = (progress) => {
    stickyProgress = progress;
  };
</script>

<button on:click={parallax.scrollTo(2)}>Scroll</button>
<h1 >
  <div class='parallax-progress-details'>
    {parallaxProgress}
  </div>
  <div class='layer-progress-details'>
    {layerProgress}
  </div>
  <div class='sticky-progress-details'>
    {stickyProgress}
  </div>
</h1>

<Parallax sections={3} bind:this={parallax} onProgress={handleProgress}>
  <ParallaxLayer
    offset={1}
    rate={1}
    onProgress={handleLayerProgress}
    style="display: flex; justify-content: center; align-items: center;"
    let:progress
  >
  <p class="layer-let-progress" style="background-color: lightblue;">{progress}</p>
  </ParallaxLayer>
  <StickyLayer
    offset={{ top: 0.5, bottom: 1.5 }}
    onProgress={handleStickyProgress}
    style="display: flex; justify-content: center; align-items: center;"
    let:progress
  >
    <p class="sticky-let-progress" style="background-color: yellowgreen;">{progress}</p>
  </StickyLayer>
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

  p {
    font-size: 2rem;
  }
</style>