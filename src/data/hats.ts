import type { ImageMetadata } from 'astro';

// Hats that drop onto the avatar on hover. Each one is media/hat--<id>.png
// (media/ is outside git, see bin/media.sh), drawn on the avatar's canvas
// (avatar-base.png, 1400×1900) in place over the head, so they line up
// without any per-hat positioning.
//
// Adding a hat: drop the file in media/. It's in the year-round pool unless
// it gets a date range in `seasons` below.
//
// Each page load in the browser picks one:
// - If any hats with a `from`/`to` range cover today, one of those at random.
// - Otherwise, one of the hats without a range at random.
// The pick is kept for the rest of the browser session.
export interface Hat {
  /** Unique, from the file name; used in the avatar's data-hat attribute */
  id: string;
  image: ImageMetadata;
  /** First day it can appear, as 'MM-DD' (inclusive) */
  from?: string;
  /** Last day it can appear, as 'MM-DD' (inclusive). May wrap past New Year. */
  to?: string;
}

type Season = Required<Pick<Hat, 'from' | 'to'>>;

/** Date ranges for seasonal hats, keyed by id */
const seasons: Record<string, Season> = {
  trucker: { from: '09-22', to: '12-01' },
  pumpkin: { from: '10-01', to: '10-31' },
  'tiny-bike-helmet': { from: '03-01', to: '12-01' },
};

const files = import.meta.glob<ImageMetadata>('/media/hat--*.png', {
  eager: true,
  import: 'default',
});

export const hats: Hat[] = Object.entries(files)
  .map(([path, image]) => {
    const id = path.match(/hat--(.+)\.png$/)![1];
    return { id, image, ...seasons[id] };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

// Catch typos: a season for a hat with no file would silently never appear
for (const id of Object.keys(seasons)) {
  if (!hats.some((hat) => hat.id === id)) {
    throw new Error(
      `hats.ts: season set for "${id}" but media/hat--${id}.png is missing`,
    );
  }
}
