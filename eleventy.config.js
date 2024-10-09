import { DateTime } from 'luxon'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'
import eleventyNavigationPlugin from '@11ty/eleventy-navigation'
import { EleventyHtmlBasePlugin } from '@11ty/eleventy'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  // Copy folders and special files
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPassthroughCopy({ favicons: '/' })
  eleventyConfig.addPassthroughCopy('CNAME')
  eleventyConfig.addPassthroughCopy('site.webmanifest')

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpeg}')

  // Add plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)
  eleventyConfig.addPlugin(eleventyNavigationPlugin)
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      class: function ({ language }) {
        return 'feature language-' + language
      },
    },
  })

  // Filters
  eleventyConfig.addFilter('readableDate', (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toFormat(
      format || 'LLLL dd, yyyy',
    )
  })

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  })

  eleventyConfig.addFilter('dateToRfc3339', (dateObj) => {
    let s = dateObj.toISOString()

    // remove milliseconds
    let split = s.split('.')
    split.pop()

    return split.join('') + 'Z'
  })

  eleventyConfig.addFilter(
    'getNewestCollectionItemDate',
    (collection, emptyFallbackDate) => {
      if (!collection || !collection.length) {
        return emptyFallbackDate || new Date()
      }

      return new Date(
        Math.max(
          ...collection.map((item) => {
            return item.date
          }),
        ),
      )
    },
  )

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return []
    }
    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  // Return the smallest number argument
  eleventyConfig.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers)
  })

  // Return all the tags used in a collection
  eleventyConfig.addFilter('getAllTags', (collection) => {
    let tagSet = new Set()
    for (let item of collection) {
      ;(item.data.tags || []).forEach((tag) => tagSet.add(tag))
    }
    return Array.from(tagSet)
  })

  eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1,
    )
  })

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ['md', 'njk', 'html', 'liquid'],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: 'njk',

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: 'njk',

  // These are all optional:
  dir: {
    input: 'content', // default: "."
    includes: '../_includes', // default: "_includes"
    data: '../_data', // default: "_data"
    output: '_site',
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.
  pathPrefix: '/',
}
