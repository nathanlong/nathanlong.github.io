import type { ImageMetadata } from 'astro';
import trucker from '@/assets/images/hat-trucker.png';

// Hats that drop onto the avatar on hover. Images should share the avatar's
// canvas (avatar-base.png, 1400×1900), drawn in place over the head, so they
// line up without any per-hat positioning.
//
// Each page load in the browser picks one:
// - If any hats with a `from`/`to` range cover today, one of those at random.
// - Otherwise, one of the hats without a range at random.
// The pick is kept for the rest of the browser session.
export interface Hat {
  /** Unique, used in the avatar's data-hat attribute */
  id: string;
  image: ImageMetadata;
  /** First day it can appear, as 'MM-DD' (inclusive) */
  from?: string;
  /** Last day it can appear, as 'MM-DD' (inclusive). May wrap past New Year. */
  to?: string;
}

export const hats: Hat[] = [
  { id: 'trucker', image: trucker, from: '09-22', to: '11-30' },
];
