<script lang="ts">
	import NavTabs from './NavTabs.svelte';

	let urls = [
		['Home', '/'],
		['2023 Projects', '/orbital23'],
		['2022 Projects', '/orbital22']
	];
</script>

<header class="flex h-16 w-full border-b-[1px] border-b-gray-400">
	<nav class="flex min-h-fit w-full justify-between">
		<div class="aspect-square p-3 md:p-1">
			<a href="/">
				<img alt="Orbital" class="rounded-lg" src={'/orbital_logo.png'} />
			</a>
		</div>
		<ul class="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-12">
			{#each urls as [name, url]}
				<li>
					<NavTabs text={name} path={url} />
				</li>
			{/each}
		</ul>
		<div />
	</nav>
</header>
