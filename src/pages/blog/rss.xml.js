import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import global_settings from "../../data/global_settings.json"

export async function GET() {
	const posts = await getCollection('blog');
	console.log(posts);
	return rss({
		title: global_settings.title,
		description: global_settings.description,
		site: global_settings.base_url+'/blog/',
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}`,
		})),
	});
}
