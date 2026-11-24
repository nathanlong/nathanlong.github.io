## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Media

Images and video for content live in `media/` (gitignored, flat, named `<slug>--<name>.<ext>`) and are backed up one way to Google Drive by `bin/media.sh` during deploy. Reference them through the `@media/` alias:

- Posts that use components are `.mdx`. Content components live in `src/components/content/`:
  - `<Slide image="@media/talk--slide-01.jpg" caption="...">notes</Slide>`: `image` takes an `@media/` name or an imported image (`src/lib/media.ts` resolves names; unused files are never emitted)
  - `<InlineVideo src={clip} />`: takes an imported file (`import clip from '@media/x.mp4'`), because a name lookup would ship every video
- In `.astro` files, import and use `<Image>`.
- Plain Markdown: `![alt](@media/name.jpg)` (Markdown syntax, not `<img>`, so Astro optimizes it).
- Frontmatter / JSON collections: `"@media/name.jpg"` with the `image()` schema helper.
- Hats: `media/hat--<id>.png` is picked up automatically; date ranges go in `src/data/hats.ts`.

Small images the site design depends on (avatar, grain, newsletter art) stay in git under `src/assets/images/`.
