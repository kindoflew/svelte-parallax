<script>
  import Parallax from '../../src/Parallax.svelte';
  import ParallaxLayer from '../../src/ParallaxLayer.svelte';

  let disabled = false;
  let parallax;

  let flexCenter = "display: flex; justify-content: center; align-items: center;";
</script>

<button class="disable" on:click={() => disabled = !disabled}>disable</button>

<Parallax sections=3 disabled={disabled} bind:this={parallax}>
  <ParallaxLayer rate=-1.5 span=2 style="background-color: orange;" />
   
  <ParallaxLayer rate=2 offset=1.5 style="background-color: brown;" />

  <ParallaxLayer offset=0.5 horizontal rate=-1 style="background-color: lightblue;"/>

  <ParallaxLayer rate=1 style="background-color: pink; {flexCenter} flex-direction: column;">
    <h1>svelte-parallax!</h1>
    <button class="bottom-btn" on:click={() => parallax.scrollTo(3, '.top-btn')}>Scroll to bottom</button>
    <p>CAUTION: obnoxious parallax stuff ahead. click disable button if you prefer reduced motion.</p>
    
  </ParallaxLayer>
  
  <ParallaxLayer offset=1.5 horizontal rate=1.5 style="background-color: yellow;"/>

  <ParallaxLayer offset=1 rate=1 horizontal style="background-color: green; {flexCenter}">
    <p class="white">wooooosh!</p>
  </ParallaxLayer>

  <ParallaxLayer offset=2 rate=-1.5 horizontal style="background-color: orangered;"/>

  <ParallaxLayer offset=2 rate=2 style="background-color: pink; {flexCenter}">
    <button class="top-btn" on:click={() => parallax.scrollTo(0, '.bottom-btn')}>Scroll to top</button>
  </ParallaxLayer>
</Parallax>

<style>
  :global(body) {
    background-color: #0bdb8c;
    color: #313131;
    font-family: monospace;
    position: static;
  }
  h1 {
    font-size: 4rem;
  }

  p {
    font-size: 1.5rem;
  }

  .white {
    color: #e0e0e0;
    font-size: 3rem;
  }

  button {
    font-size: 2rem;
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
</style>
