import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export async function GET(context) {
  // 1. Convert import.meta.url to a normal absolute file path string
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // 2. Safely resolve the relative path to your OPML file
  // Adjust the path climbs ('../') depending on where your feed.opml lives relative to pages/
  const opmlPath = path.resolve(__dirname, '../../public/data/feed.opml');

  // 3. Read using a clean absolute path string
  let opmlContent = fs.readFileSync(opmlPath, 'utf-8');

  // Strip the XML declarations
  opmlContent = opmlContent.replace(/<\?xml[^>]*\?>/g, '').trim();

  // 3. String-interpolate the clean XML into your parent feed body
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
