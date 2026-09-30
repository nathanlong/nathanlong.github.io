// .prettierrc.mjs

/** @type {import("prettier").Config} */
export default {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'css',
  printWidth: 80,
  proseWrap: 'preserve',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  // prettier-plugin-tailwindcss must stay last so it can wrap the other parsers.
  plugins: ['prettier-plugin-astro',],
  tailwindStylesheet: './src/styles/app.css',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
