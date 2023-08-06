import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler<{
 *   key: string;
 * }>} */
export async function GET({ params }: any) {
	const data = await fetch(`https://orbital-img.jx123.workers.dev/get/${params.key}`)
		.then((res) => res.json())
		.catch((err) => console.log(err));
	return json(data);
}
