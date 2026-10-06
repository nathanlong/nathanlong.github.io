// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { codeTheme } from './src/data/code-theme.mjs';

/**
 * Wraps each highlighted code block in a container with an expand toggle.
 * The button ships hidden and is revealed by the script in BlogPost.astro.
 * @type {import('shiki').ShikiTransformer}
 */
const codeBlockToggle = {
  name: 'code-block-toggle',
  root(root) {
    const button = {
      type: 'element',
      tagName: 'button',
      properties: { type: 'button', class: 'code-toggle', hidden: true },
      children: [{ type: 'text', value: 'Expand' }],
    };
    root.children = [
      {
        type: 'element',
        tagName: 'div',
        properties: { class: 'code-block' },
        children: [button, ...root.children],
      },
    ];
  },
};

/**
 * Pages that only exist in `astro dev`, kept outside src/pages so they're
 * never part of a build.
 * @type {import('astro').AstroIntegration}
 */
const devPages = {
  name: 'dev-pages',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev')
        injectRoute({
          pattern: '/dev/themes',
          entrypoint: './src/dev/themes.astro',
        });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://nathan-long.com',
	integrations: [mdx(), sitemap(), devPages],
  markdown: {
    shikiConfig: {
      // Token colors are CSS variables set per daypart in dayparts.css
      theme: codeTheme,
      transformers: [codeBlockToggle],
    }
  }
});
