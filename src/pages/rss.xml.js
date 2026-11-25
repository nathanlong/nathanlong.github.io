import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as mdxRenderer } from '@astrojs/mdx/container-renderer';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/consts';

// Feed readers render posts outside the site, so relative links and images
// (including Astro's /_astro/ assets) are resolved against the post's URL.
const absolutize = (html, base) =>
  html.replace(
    /(\s(?:href|src)=")([^"#][^"]*)"/g,
    (_, attr, url) => `${attr}${new URL(url, base)}"`,
  );

// Feed readers drop scripts and site CSS, so remove what only works on the
// site: scripts, JS-driven buttons (code-block Expand, video play/pause),
// and Astro's scoped-style attributes.
const forFeed = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, '')
    .replace(/\sdata-astro-cid-\w+(="[^"]*")?/g, '');

// Markdown posts come with their HTML; MDX posts are components, so render
// them here.
async function renderPost(post, container) {
  if (post.rendered?.html) return post.rendered.html;
  const { Content } = await render(post);
  return container.renderToString(Content);
}

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const container = await AstroContainer.create({
    renderers: await loadRenderers([mdxRenderer()]),
  });
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: await Promise.all(
      posts.map(async (post) => {
        const link = new URL(`/blog/${post.id}/`, context.site);
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.pubDate,
          categories: post.data.tags,
          link: link.href,
          content: absolutize(forFeed(await renderPost(post, container)), link),
        };
      }),
    ),
  });
}
