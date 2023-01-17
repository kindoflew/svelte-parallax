<script>
  import Parallax from '../../../src/Parallax.svelte';
  import ParallaxLayer from '../../../src/ParallaxLayer.svelte';

  let parallax;
  let parallax2;
  let disabled = false;
  let fancy = 'fancy'.split('');

  const url = (name, wrap = false) => `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;
</script>

<button class="disable" on:click={() => (disabled = !disabled)}>disable</button>

<Parallax sections={3} bind:this={parallax} {disabled}>
  {#each fancy as char, index (index)}
    <ParallaxLayer
      rate={(index + 1) / (fancy.length - 1)}
      offset={1}
      style="margin-left: {38 +
        index * 5}%; display: flex; justify-content: flex-start; align-items: center;"
    >
      <p class="fancy">
        {char}
      </p>
    </ParallaxLayer>
  {/each}

  <ParallaxLayer offset={1} rate={-2.5} style="display: flex; justify-content: flex-end;">
    <div style="background-color: lightblue; opacity: 0.5; width: 50%; height: 100%;" />
  </ParallaxLayer>

  <ParallaxLayer offset={1} rate={2.5} style="display: flex; justify-content: flex-start;">
    <div style="background-color: yellow; opacity: 0.5; width: 50%; height: 100%;" />
  </ParallaxLayer>

  <ParallaxLayer
    rate="1"
    style="background-color: pink; display: flex; justify-content: center; align-items: center; flex-direction: column;"
  >
    <h1>svelte-parallax!</h1>
    <button
      class="bottom-btn"
      on:click={() => parallax.scrollTo(3, { selector: '.top-btn', duration: 4000 })}
    >
      Click me!
    </button>
  </ParallaxLayer>

  <ParallaxLayer
    offset="2"
    rate="2"
    style="background-color: pink; display: flex; justify-content: center; align-items: center;"
  >
    <button
      class="top-btn"
      on:click={() => parallax.scrollTo(1, { selector: '.bottom-btn', duration: 1000 })}
    >
      Scroll to top
    </button>
  </ParallaxLayer>
</Parallax>

<Parallax sections="3" style="background-color: #253237;" {disabled} bind:this={parallax2}>
  <ParallaxLayer offset="1" rate="1" style="background-color: #805E73;" />
  <ParallaxLayer offset="2" rate="1" style="background-color: #87BCDE;" />

  <ParallaxLayer
    offset="0"
    rate="0"
    span="3"
    style="background-image: {url('stars', true)}; background-size: cover;"
  />

  <ParallaxLayer offset="1.3" rate="-0.3">
    <img src={url('satellite4')} alt="" style="width: 15%; margin-left: 70%;" />
  </ParallaxLayer>

  <ParallaxLayer offset="1" rate="0.8" style="opacity: 0.1;">
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 55%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 10%; margin-left: 15%;" />
  </ParallaxLayer>

  <ParallaxLayer offset="1.75" rate="0.5" style="opacity: 0.1;">
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 70%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 40%;" />
  </ParallaxLayer>

  <ParallaxLayer offset="1" rate="0.2" style="opacity: 0.2;">
    <img src={url('cloud')} alt="" style="display: block; width: 10%; margin-left: 10%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 75%;" />
  </ParallaxLayer>

  <ParallaxLayer offset="1.6" rate="-0.1" style="opacity: 0.4;">
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 60%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 25%; margin-left: 30%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 10%; margin-left: 80%;" />
  </ParallaxLayer>

  <ParallaxLayer offset="2.6" rate="0.4" style="opacity: 0.6;">
    <img src={url('cloud')} alt="" style="display: block; width: 20%; margin-left: 5%;" />
    <img src={url('cloud')} alt="" style="display: block; width: 15%; margin-left: 75%;" />
  </ParallaxLayer>

  <ParallaxLayer
    offset="2.5"
    rate="-0.4"
    style="display: flex; align-items: center; justify-content: center;"
  >
    <img src={url('earth')} alt="" style="width: 60%;" />
  </ParallaxLayer>

  <ParallaxLayer
    offset="2"
    rate="-0.3"
    style="display: flex; align-items: center; justify-content: center;"
  >
    <img src={url('clients')} alt="" style="height: 80%; width: 80%;" />
  </ParallaxLayer>

  <ParallaxLayer
    offset="0"
    rate="0.1"
    style="display: flex; align-items: center; justify-content: center;"
  >
    <img
      src={url('server')}
      alt=""
      class="server"
      style="width: 20%;"
      on:click={() => parallax2.scrollTo(2, { selector: '.bash' })}
      on:keyup={(e) => e.key === 'Enter' && parallax2.scrollTo(2, { selector: '.bash' })}
      tabindex="0"
      role="button"
    />
  </ParallaxLayer>

  <ParallaxLayer
    offset="1"
    rate="0.1"
    style="display: flex; align-items: center; justify-content: center;"
  >
    <img
      src={url('bash')}
      alt=""
      class="bash"
      style="width: 40%;"
      on:click={() => parallax2.scrollTo(3, { selector: '.clients-main' })}
      on:keyup={(e) => e.key === 'Enter' && parallax2.scrollTo(3, { selector: '.clients-main' })}
      tabindex="0"
      role="button"
    />
  </ParallaxLayer>

  <ParallaxLayer
    offset="2"
    rate="-0"
    style="display: flex; align-items: center; justify-content: center;"
  >
    <img
      src={url('clients-main')}
      alt=""
      class="clients-main"
      style="width: 40%;"
      on:click={() => parallax2.scrollTo(1, { selector: '.server' })}
      on:keyup={(e) => e.key === 'Enter' && parallax2.scrollTo(1, { selector: '.server' })}
      tabindex="0"
      role="button"
    />
  </ParallaxLayer>
</Parallax>

<style>
  h1 {
    font-size: 4rem;
  }

  p {
    font-size: 1.5rem;
  }

  .fancy {
    font-size: 2.5rem;
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
