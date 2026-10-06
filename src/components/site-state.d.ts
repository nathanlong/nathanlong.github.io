// The API SiteState.astro's head script puts on window for ThemeControls.

type DaypartId = import('@/data/dayparts').Daypart['id'];

interface SiteState {
  /** Saved settings, with the defaults ('time' / 'auto') filled in */
  readonly prefs: {
    scheme: 'time' | 'system' | 'light' | 'dark';
    hue: 'auto' | DaypartId;
  };
  /** The daypart the clock (or a ?daypart= preview) says right now */
  clockPart(): DaypartId;
  /** True while preview URL params are overriding the saved settings */
  readonly previewing: boolean;
  /** Drop the preview params and show the saved settings */
  stopPreview(): void;
  /** Merge and save a change; a default value removes that override */
  set(change: { scheme?: string; hue?: string }): void;
}

interface Window {
  /** Missing if the head script didn't run */
  siteState?: SiteState;
}
