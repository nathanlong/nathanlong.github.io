---
title: Custom Class Regex for Tailwind IntelliSense in Neovim
description: For when your templating language expects something that looks nothing like HTML.
date: 2023-11-29
tags: neovim
---

Sometimes while using Tailwind, you need to place classes into things that aren't structured like HTML elements. Take a look at this Twig snippet from a Craft site:

{% raw %}
```twig
{{ entry.primaryDescription ? tag('div', {
  class: 'text-body-lg text-rich',
  html: entry.primaryDescription,
}) }}
```
{% endraw %}

This checks for the existence of a field and wraps it in a `<div>` tag... But that little bit there as `class:`... If you're running Tailwind in Neovim like me, it doesn't recognize that as a trigger for autocomplete because it wants that sweet, sweet HTML `class=` attribute.

And without IntelliSense/autocomplete you're missing a critical piece of the Tailwind authoring experience. You NEED autocomplete when working with Tailwind.

The fine folks working on Tailwind realized this problem and have exposed some settings to allow custom triggers for whatever wacky format your templating language wants. In fact, they've exposed two methods for us:

1. The [class attribute](https://github.com/tailwindlabs/tailwindcss-intellisense#tailwindcssclassattributes) setting.
2. The experimental [class regex setting](https://www.paolotiu.com/blog/get-tailwind-intellisense-anywhere)

We're looking at the second one. Most guides will tell you to plop some JSON in your VSCode settings and it's not immediately clear where the equivalent of this is for Neovim. But hey, you're here now, so I'll show you. You stuff it into your LSP initialization settings for Tailwind, like this:

```lua
local lspconfig = require('lspconfig')
local capabilities = require('cmp_nvim_lsp').default_capabilities()
local on_attach = --this is a custom function that sets several options

-- The initialization of TailwindCSS LSP
lspconfig.tailwindcss.setup {
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    tailwindCSS = {
      experimental = {
        classRegex = {
          "(?:class: ?)(?:'|\"|`)([^\"'`]*)(?:'|\"|`)", -- Twig, looks for string preceded by 'class:'
        }
      }
    }
  }
}
```

This setup assumes a few things:

1. You're using [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) to connect to your LSPs.
2. You're using [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) for autocomplete.

You can check out my [earlier post](/blog/modern-javascript-tooling-in-neovim/) on setting up LSP's or look at my [init.lua](https://github.com/nathanlong/dotfiles/blob/main/nvim/init.lua) to see how I've set it up.

The regex itself is looking for anything inside a string (either `""` or `''`) preceded by `class:` and 0 to 1 spaces. Tailwind will now helpfully suggest classes once you kick open that string. If you need something different than what's listed here you can check out [this repository of sample regexes you can use](https://github.com/paolotiu/tailwind-intellisense-regex-list) for different patterns.

Happy autocompleting!

