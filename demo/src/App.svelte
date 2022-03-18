<script>
  import { Route } from "tinro";
  import BasicDemo from "./BasicDemo.svelte";
  import ThresholdDemo from "./ThresholdDemo.svelte";
  import ReactDemo from "./ReactDemo.svelte";
  import MultiDemo from "./MultiDemo.svelte";
  import TestDemo from "./TestDemo.svelte";
  
  let routes = [
    { text: "Basic", path: "/basic-demo" },
    { text: "Threshold", path: "threshold-demo" },
    { text: "react-spring", path: "/react-demo" },
    { text: "Multi", path: "/multi-demo" }
  ];

</script>

<Route path="/">
<nav>
  <ul>
    {#each routes as {text, path}, i (i)}
    <li>
      <a href={path}>{text}</a>
    </li>
    {/each}
  </ul>
</nav>
</Route>
<Route path="/basic-demo"><BasicDemo /></Route>
<Route path="/threshold-demo"><ThresholdDemo /></Route>
<Route path="/react-demo"><ReactDemo /></Route>
<Route path="/multi-demo"><MultiDemo /></Route>
<Route path="/test-demo"><TestDemo /></Route>

<style>
  :global(body) {
    padding: 0;
    color: #313131;
    font-family: monospace;
  }
  nav {
    font-size: 1.5rem;
    width: 50%;
    margin: 0 auto;
  }
  ul {
    list-style: none;
    display: flex;
    justify-content: space-between;
    margin: 0;
  }
</style>
