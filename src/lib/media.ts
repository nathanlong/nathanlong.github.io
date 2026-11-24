import type { ImageMetadata } from 'astro';

// Images in media/ (gitignored, backed up by bin/media.sh), looked up by name.
// The glob is lazy and Astro only emits images that get rendered, so unused
// files in media/ never reach the build.
const images = import.meta.glob<ImageMetadata>(
  '/media/*.{jpg,jpeg,png,webp,gif,avif,svg}',
  { import: 'default' },
);

/** An imported image, or a name in media/ written as '@media/name.jpg' */
export type MediaImage = ImageMetadata | string;

export async function resolveImage(image: MediaImage): Promise<ImageMetadata> {
  if (typeof image !== 'string') return image;
  const path = image.replace(/^@media\//, '/media/');
  const load = images[path];
  if (!load) throw new Error(`Image not found in media/: ${image}`);
  return load();
}
