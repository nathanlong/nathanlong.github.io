// Net Noodlings, the weekly newsletter on Buttondown. Issues come from its RSS
// feed at build time, so the homepage and /newsletter list the latest ones.
import Parser from 'rss-parser';

export const NEWSLETTER = {
  name: 'Net Noodlings with Nathan',
  archive: 'https://buttondown.com/nathanlong/archive/',
  rss: 'https://buttondown.com/nathanlong/rss',
  subscribe: 'https://buttondown.com/api/emails/embed-subscribe/nathanlong',
  referral: 'https://buttondown.com/refer/nathanlong',
};

export interface Issue {
  href: string;
  title: string;
  date: Date;
}

async function fetchIssues(): Promise<Issue[]> {
  try {
    const feed = await new Parser().parseURL(NEWSLETTER.rss);
    // Feed fields are all optional, so skip anything incomplete and parse dates
    return feed.items.flatMap(({ link, title, isoDate, pubDate }) => {
      const date = isoDate ?? pubDate;
      return link && title && date
        ? [{ href: link, title, date: new Date(date) }]
        : [];
    });
  } catch (error) {
    // A Buttondown outage shouldn't fail the whole build; the lists just
    // come out empty and pages fall back to the archive link.
    console.warn(`[newsletter] Couldn't load ${NEWSLETTER.rss}:`, error);
    return [];
  }
}

// One request per build, however many pages ask
let issues: Promise<Issue[]> | undefined;

/** The newest issues first, as many as the feed carries (currently 30). */
export function getIssues() {
  issues ??= fetchIssues();
  return issues;
}
