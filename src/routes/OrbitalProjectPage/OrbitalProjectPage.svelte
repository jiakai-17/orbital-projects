<script lang="ts">
	import { onMount } from 'svelte';

	const api = '/api';
	const cfWorker = 'https://orbital-img.jx123.workers.dev';

	// types
	export let year: string;

	type project = {
		teamId: number;
		teamName: string;
		teamMembers: string[];
		advisor: string;
		achievement: string;
		year: string;
		posterUrl: string;
		videoUrl: string;
		submissionPosterUrl: string;
		submissionVideoUrl: string;
		posterImg: string;
		thumbnailImg: string;
		svelteKey: string;
		searchText: string;
	};

	type scrapedDataJSON = {
		updated: string;
		data: project[];
	};

	let isLoading = true;
	let projs: project[];
	let lastUpdated: string;

	let searchQuery = '';
	let filteredProjs: project[];

	function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
		let timer: any;
		return (...args: Parameters<T>) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func(...args);
			}, delay);
		};
	}

	async function fetchData() {
		try {
			const response = await fetch(`${api}/get/project_data_${year}.json`);
			const jsonData = (await response.json()) as scrapedDataJSON;
			lastUpdated = jsonData.updated;
			projs = jsonData.data
				// make search text in project
				.map((p: project) => {
					p.searchText = [p.teamName, p.teamMembers.join(' '), p.advisor, p.teamId]
						.join(' ')
						.toLowerCase();
					p.svelteKey = p.year + '_' + p.teamId;
					return p;
				});

			filteredProjs = projs;
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			isLoading = false;
		}
	}

	const handleSearch = debounce((s: string) => {
		if (!projs) {
			// handle if projs is not loaded yet
			return;
		}
		filteredProjs = projs.filter((p: project) => {
			if (!filterByAchievementLevel(p)) {
				return false;
			}
			if (s === '') {
				return true;
			}
			const keywords = s.split(' ');

			return keywords.every((k: string) => p.searchText.includes(k.toLowerCase()));
		});
	}, 250);

	const achievementFilters = ['vostok', 'gemini', 'apollo', 'artemis'];
	let selectedFilters = new Set(achievementFilters);

	const onCheckFilter = (event: any) => {
		if (event.target.checked) {
			selectedFilters.add(event.target.value);
		} else {
			selectedFilters.delete(event.target.value);
		}
		selectedFilters = selectedFilters;
		handleSearch(searchQuery);
	};

	const onSelectAllFilters = (event: any) => {
		if (event.target.checked) {
			selectedFilters = new Set(achievementFilters);
		} else {
			selectedFilters = new Set();
		}
		selectedFilters = selectedFilters;
		handleSearch(searchQuery);
	};

	const filterByAchievementLevel = (p: project) => {
		return selectedFilters.has(p.achievement);
	};

	const getImageLink = (key: string) => {
		if (key === 'null') {
			return '';
		}
		return `${cfWorker}/get/${key}`;
	};

	const makeAchievementBadgeClass = (achievement: string) => {
		if (achievement === 'vostok') {
			return 'w-fit bg-yellow-200 text-red-600 py-0.5 px-2 rounded-md';
		}
		if (achievement === 'gemini') {
			return 'w-fit bg-gray-800 text-yellow-500 py-0.5 px-2 rounded-md';
		}
		if (achievement === 'apollo') {
			return 'w-fit bg-amber-950 text-white py-0.5 px-2 rounded-md';
		}
		if (achievement === 'artemis') {
			return 'w-fit bg-neutral-200 text-red-600 py-0.5 px-2 rounded-md';
		}
		return '';
	};

	const getAchievementsText = (achievement: string) => {
		switch (achievement) {
			case 'vostok':
				return 'Vostok';
			case 'gemini':
				return 'Project Gemini';
			case 'apollo':
				return 'Apollo 11';
			case 'artemis':
				return 'Artemis';
			default:
				return '';
		}
	};
	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	};

	$: handleSearch(searchQuery);
	$: selectedFilters;

	onMount(() => {
		fetchData();
	});
</script>

<svelte:head>
	<title>{year} Projects</title>
	<meta content="Home" name="description" />
</svelte:head>

{#if isLoading}
	<h3 class="my-8 flex w-full justify-center text-base">Loading...</h3>
{:else}
	<section class="mb-20">
		<h1 class="my-12 flex w-full justify-center text-3xl font-bold md:text-4xl">
			{year} Projects ({filteredProjs.length})
		</h1>
		<h3 class="my-8 flex w-full justify-center text-base">
			Last updated: {new Date(lastUpdated).toLocaleString('en-UK')}
		</h3>

		<div class="mx-4 my-6 flex flex-col flex-wrap items-center justify-center">
			<input
				bind:value={searchQuery}
				class="w-[80%] min-w-[20rem] rounded-md border-2 border-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-gray-200 lg:w-[70%]"
				placeholder={'Search for a project...'}
			/>
			<div class="mt-4 flex flex-col justify-between gap-4 md:flex-row md:gap-8">
				<label>
					<input
						type="checkbox"
						checked={selectedFilters.size === achievementFilters.length}
						on:change={onSelectAllFilters}
					/>
					All
				</label>
				<div>
					<label>
						<input
							type="checkbox"
							checked={selectedFilters.has('vostok')}
							on:change={onCheckFilter}
							value="vostok"
						/>
						Vostok
					</label>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={selectedFilters.has('gemini')}
							on:change={onCheckFilter}
							value="gemini"
						/>
						Project Gemini
					</label>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={selectedFilters.has('apollo')}
							on:change={onCheckFilter}
							value="apollo"
						/>
						Apollo 11
					</label>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							checked={selectedFilters.has('artemis')}
							on:change={onCheckFilter}
							value="artemis"
						/>
						Artemis
					</label>
				</div>
			</div>
		</div>

		<div class="mt-16 flex w-full justify-center px-8">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{#each filteredProjs as fp (fp.svelteKey)}
					<div
						class="h-[575px] w-[300px] overflow-hidden rounded-md border-2 border-gray-300 px-2 py-2 shadow-md"
					>
						<div class="text-md h-[3rem] text-center font-bold">
							{`#${fp.teamId}: ${fp.teamName}`}
						</div>
						<div class="my-2 flex justify-center text-xs font-bold capitalize">
							<div class={makeAchievementBadgeClass(fp.achievement)}>
								{getAchievementsText(fp.achievement)}
							</div>
						</div>
						<div class="mx-2 my-2 h-[200px]">
							{#if isValidUrl(getImageLink(fp.posterImg))}
								<a href={getImageLink(fp.posterImg)} target="_blank" rel="noopener noreferrer">
									<img
										loading="lazy"
										src={getImageLink(fp.thumbnailImg)}
										class={`h-[200px] w-full object-contain`}
										alt={`Team ${fp.teamId}'s Poster`}
									/>
								</a>
							{:else}
								<img
									loading="lazy"
									src={''}
									class={`h-[200px] w-full border-2 border-gray-200 object-contain`}
									alt={`No image available for Team ${fp.teamId}'s Poster`}
								/>
							{/if}
						</div>
						<div class="mx-3 mt-4">
							<div class="min-h-[4.5rem]">
								<div class="text-sm font-bold">Team Members:</div>
								<div class="mb-3 text-sm">{fp.teamMembers.join(' & ')}</div>
							</div>
							<div class="text-sm font-bold">Advised by:</div>
							<div class="text-sm">{fp.advisor}</div>
						</div>
						<div class="my-4 flex flex-row justify-center gap-3 text-sm">
							{#if isValidUrl(getImageLink(fp.posterImg))}
								<a href={getImageLink(fp.posterImg)} target="_blank" rel="noopener noreferrer">
									<button class="rounded-md bg-blue-500 px-3 py-1 text-white">View Poster</button>
								</a>
							{:else}
								<button
									class="rounded-md bg-blue-500 px-3 py-1 text-white opacity-50"
									on:click={() => alert(fp.posterImg)}
									>View Poster
								</button>
							{/if}
							{#if isValidUrl(fp.videoUrl)}
								<a href={fp.videoUrl} target="_blank" rel="noopener noreferrer">
									<button class="rounded-md bg-red-500 px-3 py-1 text-white">Watch Video</button>
								</a>
							{:else}
								<button
									class="rounded-md bg-red-500 px-3 py-1 text-white opacity-50"
									on:click={() => alert(fp.videoUrl)}
									>Watch Video
								</button>
							{/if}
						</div>

						<div class="flex flex-row justify-center gap-3 text-sm">
							{#if isValidUrl(fp.submissionPosterUrl)}
								<a href={fp.submissionPosterUrl} target="_blank" rel="noopener noreferrer">
									<button class="rounded-md bg-indigo-600 px-3 py-1 text-white">MS Poster</button>
								</a>
							{:else}
								<button
									class="rounded-md bg-indigo-600 px-3 py-1 text-white opacity-60"
									on:click={() => alert(fp.submissionPosterUrl)}
									>MS Poster
								</button>
							{/if}
							{#if isValidUrl(fp.submissionVideoUrl)}
								<a href={fp.submissionVideoUrl} target="_blank" rel="noopener noreferrer">
									<button class="rounded-md bg-indigo-600 px-3 py-1 text-white">MS Video</button>
								</a>
							{:else}
								<button
									class="rounded-md bg-indigo-600 px-3 py-1 text-white opacity-60"
									on:click={() => alert(fp.submissionVideoUrl)}
									>MS Video
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}
