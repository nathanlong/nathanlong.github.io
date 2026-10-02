// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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

// https://astro.build/config
export default defineConfig({
  site: 'https://nathan-long.com',
	integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      transformers: [codeBlockToggle],
    }
  }
});
