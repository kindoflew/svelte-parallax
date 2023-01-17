<script>
  import Parallax from '../../../src/Parallax.svelte';
  import ParallaxLayer from '../../../src/ParallaxLayer.svelte';
  import StickyLayer from '../../../src/StickyLayer.svelte';

  const handleStickyProgress = (progress) => {
    // console.log(progress);
  };
</script>

<Parallax sections={4} style={'background-color: lightblue;'}>
  <ParallaxLayer
    offset={0}
    rate={1}
    style={'display: flex; justify-content: center; align-items: center;'}
  >
    <h1>Scroll Down!</h1>
  </ParallaxLayer>
  <ParallaxLayer offset={1.95} rate={1}>
    <div style="width: 20rem; margin-left: auto; margin-right: 3rem;">
      {#each { length: 5 } as _, index (index)}
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, veniam doloribus!
          Quasi a earum inventore eaque doloremque voluptatem mollitia, numquam, laboriosam dicta
          repellat accusantium cumque unde, dolore ex accusamus eos.
        </p>
      {/each}
    </div>
  </ParallaxLayer>
  <StickyLayer
    offset={{ top: 1, bottom: 1.8 }}
    onProgress={handleStickyProgress}
    style={'display: flex; justify-content: flex-start; align-items: center;'}
    let:progress
  >
    <div
      class="sticky-content"
      style="background-color: rebeccapurple; margin-left: 5rem; transform: rotate({progress *
        360}deg)"
    />
  </StickyLayer>
  <ParallaxLayer offset={3} style={'display: flex; justify-content: center; align-items: center;'}>
    <h1>The End!</h1>
  </ParallaxLayer>
</Parallax>

<style>
  h1 {
    margin: 0;
    text-align: center;
    padding-top: 5rem;
  }
  .sticky-content {
    background-color: rebeccapurple;
    height: 10rem;
    width: 10rem;
  }
</style>
