<script lang="ts">
	import { page } from '$app/stores';

	/**
	 * text: The text to show
	 * path: The path to page
	 */
	export let text: string;
	export let path: string;

	const makeChecker = (path: string) => {
		return (pagePath: string) => {
			return pagePath === path;
		};
	};

	const checker = makeChecker(path);

	const makeStyle = (pageUrl: string) => {
		return checker(pageUrl)
			? 'w-auto py-1 px-3 rounded-md hover:bg-gray-300 bg-gray-200'
			: 'w-auto py-1 px-3 rounded-md hover:bg-gray-300';
	};
</script>

<a href={path}>
	<button class={makeStyle($page.url.pathname)}>
		{text}
	</button>
</a>
