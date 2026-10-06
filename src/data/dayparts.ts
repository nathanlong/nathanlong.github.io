// Times of day that set the site's colors. Each part starts at `start`
// (local hour, 0–23) and runs until the next part starts, wrapping past
// midnight. List them in order of start time.
//
// Colors live in src/styles/dayparts.css, one block per id.
export interface Daypart {
  id: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'midnight';
  /** Shown in the menu's color picker */
  label: string;
  /** Local hour this part begins, 0–23 */
  start: number;
  /** Appearance while this part is on the clock and Appearance is `time` */
  dark: boolean;
}

export const dayparts: Daypart[] = [
  { id: 'dawn', label: 'Dawn', start: 5, dark: true },
  { id: 'morning', label: 'Morning', start: 8, dark: false },
  { id: 'noon', label: 'Noon', start: 11, dark: false },
  { id: 'afternoon', label: 'Afternoon', start: 14, dark: false },
  { id: 'evening', label: 'Evening', start: 18, dark: true },
  { id: 'midnight', label: 'Midnight', start: 22, dark: true },
];

// Setting values the menu and preview params use alongside daypart ids
const RESERVED_IDS = ['time', 'auto', 'system', 'light', 'dark'];

// Fail the build on bad data instead of shipping a broken theme
function validate(parts: Daypart[]) {
  const fail = (message: string) => {
    throw new Error(`src/data/dayparts.ts: ${message}`);
  };
  if (!parts.length) fail('needs at least one daypart');

  const ids = new Set<string>();
  parts.forEach((part, i) => {
    if (ids.has(part.id)) fail(`duplicate id "${part.id}"`);
    if (RESERVED_IDS.includes(part.id)) fail(`id "${part.id}" is reserved`);
    ids.add(part.id);

    if (!Number.isInteger(part.start) || part.start < 0 || part.start > 23)
      fail(`"${part.id}" start must be an integer 0–23`);
    if (i > 0 && part.start <= parts[i - 1].start)
      fail(`"${part.id}" must start after "${parts[i - 1].id}"`);
  });
}

validate(dayparts);

