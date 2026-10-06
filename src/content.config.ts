import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()),
      heroImage: z.optional(image()),
    }),
});

const lab = defineCollection({
  loader: file('./src/content/lab/experiments.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.url(),
    source: z.url(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    status: z.string().optional(),
    image: z.url(),
    imageAlt: z.string(),
    feature: z.boolean(),
  }),
});

export const collections = { blog, lab };
