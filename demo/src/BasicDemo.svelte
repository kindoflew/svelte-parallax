<script>
  import Parallax from "../../src/Parallax.svelte";
  import ParallaxLayer from "../../src/ParallaxLayer.svelte";

  let parallax;
  let disabled = false;
  let show = true;
  let fancy = "fancy".split("");
  const handleProgress = (progress) => {
    // console.log(progress.parallaxProgress, progress.section, progress.sectionProgress);
  };
  const handleLayerProgress = (progress) => {
    // console.log(progress);
  };
  // disabled = !disabled show = !show
</script>

<button class="disable" on:click={() => (disabled = !disabled)}>disable</button>

<!-- <div style="height:20rem; width: 30rem;"></div> -->

<Parallax 
  sections={3} 
  style="background-color: #0bdb8c;" 
  bind:this={parallax} {disabled} 
  onProgress={handleProgress}
>
  {#each fancy as char, index (index)}
    <ParallaxLayer
      rate={(index + 1) / (fancy.length - 1)}
      offset={1}
      style="
        padding-left: {38 + index * 5}%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      "
    >
      <p class="fancy">
        {char}
      </p>
    </ParallaxLayer>
  {/each}

  <ParallaxLayer
    offset={1}
    rate={-2.5}
    style="display: flex; justify-content: flex-end;"
  >
    <div
      style="background-color: lightblue; opacity: 0.5; width: 50%; height: 100%;"
    />
  </ParallaxLayer>

  <ParallaxLayer
    offset={1}
    rate={2.5}
    style="display: flex; justify-content: flex-start;"
    onProgress={handleLayerProgress}
  >
    <div
      style="background-color: yellow; opacity: 0.5; width: 50%; height: 100%;"
    />
  </ParallaxLayer>
{#if show}
  <ParallaxLayer
    rate="1"
    style="background-color: pink; display: flex; justify-content: center; align-items: center; flex-direction: column;"
  >
    <h1>svelte-parallax!</h1>
    <button
      class="bottom-btn"
      on:click={() =>
        parallax.scrollTo(3, { selector: ".top-btn", duration: 4000 })}
    >
      Click me!
    </button>
  </ParallaxLayer>
{/if}
  <ParallaxLayer
    offset="2"
    rate="2"
    style="background-color: pink; display: flex; justify-content: center; align-items: center;"
  >
    <button
      class="top-btn"
      on:click={() =>
        parallax.scrollTo(1, { selector: ".bottom-btn", duration: 1000 })}
    >
      Scroll to top
    </button>
  </ParallaxLayer>
</Parallax>

<style>
  h1 {
    font-size: 2rem;
  }

  button {
    font-size: 1rem;
    cursor: pointer;
  }

  button:focus {
    outline: 4px dashed #ff5c77;
  }

  .disable {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 10;
  }

  .fancy {
    font-size: 2.5rem;
  }
</style>
