<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let scrollToTopHidden = true;
	let scrollToTopMinPx = 100;
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	const scrollContainer = () => {
		return document.documentElement || document.body;
	};

	function handleOnScroll() {
		if (!scrollContainer()) {
			return;
		}

		scrollToTopHidden = scrollContainer().scrollTop <= scrollToTopMinPx;
	}
</script>

<svelte:window on:scroll={handleOnScroll} />

<div>
	<Header />

	<main>
		<slot />
	</main>

	{#if !scrollToTopHidden}
		<button
			class={'w-102 fixed bottom-3 right-3 aspect-square h-10 rounded-full bg-gray-200 font-bold'}
			on:click={scrollToTop}
		>
			TOP
		</button>
	{/if}
</div>
