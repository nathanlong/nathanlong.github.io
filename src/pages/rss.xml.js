import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';

// Feed readers render posts outside the site, so relative links and images
// (including Astro's /_astro/ assets) are resolved against the post's URL.
const absolutize = (html, base) =>
  html.replace(
    /(\s(?:href|src)=")([^"#][^"]*)"/g,
    (_, attr, url) => `${attr}${new URL(url, base)}"`,
  );

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      const link = new URL(`/blog/${post.id}/`, context.site);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        categories: post.data.tags,
        link: link.href,
        content: post.rendered?.html && absolutize(post.rendered.html, link),
      };
    }),
  });
}
