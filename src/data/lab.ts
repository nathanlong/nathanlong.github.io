// Lab experiments, newest activity first: an update counts as recent, so a
// revived experiment rises back up the list
import { getCollection, type CollectionEntry } from 'astro:content';

export const lastTouched = ({ data }: CollectionEntry<'lab'>) =>
  data.updatedDate ?? data.pubDate;

export async function getExperiments() {
  return (await getCollection('lab')).sort(
    (a, b) => lastTouched(b).valueOf() - lastTouched(a).valueOf(),
  );
}
