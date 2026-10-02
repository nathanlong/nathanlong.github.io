import fs from 'node:fs';
import path from 'node:path';

// The OPML stays in public/ so it can also be downloaded as-is. Resolve it from
// the project root: at build time this file runs from a bundled chunk in dist/,
// so paths relative to import.meta.url point to the wrong place.
const opmlPath = path.join(process.cwd(), 'public/data/feed.opml');

export async function GET() {
  // Strip the OPML's own XML declaration; ours goes first, with the stylesheet
  const opmlContent = fs
    .readFileSync(opmlPath, 'utf-8')
    .replace(/<\?xml[^>]*\?>/g, '')
    .trim();

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/xsl/voices.xsl"?>
    ${opmlContent}
`;

  return new Response(xmlString, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
