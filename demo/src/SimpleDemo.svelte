<script>
  import SimpleParallax from '../../src/SimpleParallax.svelte';

	let disabled = false;
</script>

<header>
	<h2>Title</h2>
	<nav>
		<ul>
			<li>Home</li>
			<li>About</li>
			<li>Contact</li>
		</ul>
	</nav>
</header>

<div class="hero">
	<SimpleParallax disabled={disabled}>
		<img 
		  src="https://images.unsplash.com/photo-1610989001873-03968eed0f08?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=815&q=80"
			alt="Svelte code on a screen"
		/>
	</SimpleParallax>
</div>

<section></section>

 <div class="hero">
	<SimpleParallax disabled={disabled}>
		<img
		  src="https://images.unsplash.com/photo-1610989001873-03968eed0f08?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=815&q=80"
			alt="Svelte code on a screen"
		/>
	</SimpleParallax>
</div>

<section></section>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: lightblue;
		height: 4rem;
		padding: 0 1rem;
		margin: 0;
	}
	
	h2 {
		flex: 1;
		padding: 0;
		margin: 0;
	}
	
	nav {
		flex: 1;
	}
	
	ul {
		list-style: none;
		display: flex;
		justify-content: space-between;
		padding: 0;
		margin: 0;
	}
	
	section {
		background-color: lightblue;
		height: 25rem;
	}
	
	.hero {
		height: 35rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	img {
		width: 170%;
		height: 170%;
		position: relative;
	}
</style>