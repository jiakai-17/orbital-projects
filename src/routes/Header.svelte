<script lang="ts">
	import NavTabs from './NavTabs.svelte';

	let screenSize = 0;
	let isMenuOpen = false;

	let urls = [
		['Home', '/'],
		['2023 Projects', '/orbital23'],
		['2022 Projects', '/orbital22']
	];

	const handleMenuClick = () => {
		isMenuOpen = !isMenuOpen;
	};

	$: isMenuOpen;
	$: screenSize > 768 ? (isMenuOpen = false) : null;
</script>

<svelte:window bind:innerWidth={screenSize} />

<header class="flex h-16 flex-col border-b-[1px] border-b-gray-400">
	<nav class="ml-2 mr-3 flex h-16 items-center justify-between">
		<div class="aspect-square h-12 w-12">
			<a href="/">
				<img alt="Orbital" class="rounded-lg" src={'/orbital_logo.png'} />
			</a>
		</div>
		{#if screenSize < 768}
			<div class="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-12">
				<button class="w-auto rounded-md p-1 hover:bg-gray-300" on:click={handleMenuClick}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="h-8 w-8"
					>
						<path
							fill-rule="evenodd"
							d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		{:else}
			<ul class="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-12">
				{#each urls as [name, url]}
					<li>
						<NavTabs text={name} path={url} />
					</li>
				{/each}
			</ul>
			<div>
				<a
					href="https://github.com/jiakai-17/orbital-projects"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img alt="GitHub Repo" class="aspect-auto h-8 w-auto" src={'/github.svg'} />
				</a>
			</div>
		{/if}
	</nav>
</header>
{#if screenSize < 768 && isMenuOpen}
	<div class="flex w-full flex-col border-2 border-gray-300">
		{#each urls as [name, url]}
			<button class="border-b-2 border-b-gray-200" on:click={handleMenuClick}>
				<NavTabs text={name} path={url} rounded={false} />
			</button>
		{/each}
		<a
			href="https://github.com/jiakai-17/orbital-projects"
			target="_blank"
			rel="noopener noreferrer"
		>
			<button class={'w-full px-3 py-1 hover:bg-gray-300'}> GitHub</button>
		</a>
	</div>
{/if}
