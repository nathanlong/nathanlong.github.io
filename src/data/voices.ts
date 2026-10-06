// Reads the Web Voices OPML (exported from FreshRSS) for the /voices page.
// The OPML stays in public/ so it can also be downloaded as-is. Resolve it from
// the project root: at build time this runs from a bundled chunk in dist/, so
// paths relative to import.meta.url point to the wrong place.
import fs from 'node:fs';
import path from 'node:path';

export const OPML_HREF = '/data/feed.opml';
const opmlPath = path.join(process.cwd(), 'public', OPML_HREF);

export interface Voice {
  name: string;
  htmlUrl?: string;
  xmlUrl?: string;
  description?: string;
}

export interface VoiceGroup {
  name: string;
  voices: Voice[];
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

const decode = (value: string) =>
  value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code: string) => {
    if (code[0] !== '#') return ENTITIES[code] ?? match;
    return String.fromCodePoint(
      code[1].toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16)
        : Number(code.slice(1)),
    );
  });

const attributes = (source: string) =>
  Object.fromEntries(
    [...source.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, name, double, single]) => [name, decode(double ?? single)],
    ),
  );

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

/**
 * Categories (outlines with children) holding feeds (self-closing outlines),
 * both sorted by name. Feeds outside any category go in "Other".
 */
export function getVoices() {
  const opml = fs.readFileSync(opmlPath, 'utf-8');

  const updated = /<dateCreated>([^<]*)<\/dateCreated>/.exec(opml)?.[1];
  const groups: VoiceGroup[] = [];
  const other: VoiceGroup = { name: 'Other', voices: [] };
  let current: VoiceGroup | undefined;

  // Matched as whole tags with quoted attributes, so a ">" inside an
  // attribute value can't end a tag early
  const tags =
    /<outline((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|<\/outline>/g;
  for (const [tag, attrs = '', selfClosing] of opml.matchAll(tags)) {
    if (tag === '</outline>') {
      current = undefined;
      continue;
    }
    const { text, title, htmlUrl, xmlUrl, description } = attributes(attrs);
    const name = text ?? title ?? '';
    if (!selfClosing) {
      current = { name, voices: [] };
      groups.push(current);
    } else {
      (current ?? other).voices.push({ name, htmlUrl, xmlUrl, description });
    }
  }

  if (other.voices.length) groups.push(other);
  for (const group of groups) group.voices.sort(byName);

  return {
    updated: updated ? new Date(updated) : undefined,
    groups: groups.filter((group) => group.voices.length).sort(byName),
  };
}
