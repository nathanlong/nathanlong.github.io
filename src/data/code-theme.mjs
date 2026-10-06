// Syntax highlighting theme for code blocks. Shiki writes each token's color
// as var(--shiki-token-…) instead of a fixed value, and each daypart in
// src/styles/dayparts.css sets those variables, so code follows the site's
// colors and appearance. Shared by astro.config.mjs and /dev/themes.
import { createCssVariablesTheme } from 'shiki';

export const codeTheme = createCssVariablesTheme({
  name: 'dayparts',
  variablePrefix: '--shiki-',
});
