<script>
  import BasicDemo from "./BasicDemo.svelte";
  import ReactDemo from "./ReactDemo.svelte";
  import MultiDemo from "./MultiDemo.svelte";
  import TestDemo from "./TestDemo.svelte";
  import { Route } from "tinro";

</script>
<Route path="/">
<nav>
  <ul>
    <li>
      <a href="/basic-demo">Basic</a>
    </li>
    <li>
      <a href="/react-demo">react-spring</a>
    </li>
    <li>
      <a href="/multi-demo">Multi</a>
    </li>
  </ul>
</nav>
</Route>
<Route path="/basic-demo"><BasicDemo /></Route>
<Route path="/react-demo"><ReactDemo /></Route>
<Route path="/multi-demo"><MultiDemo /></Route>
<Route path="/test-demo"><TestDemo /></Route>

<style>
  :global(body) {
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
