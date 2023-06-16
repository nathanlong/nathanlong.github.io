---
title: Setting up LSPs for Modern JavaScript Tooling in Neovim
description: Installing LSPs, snippets, and Intellisense-style autocompletion
date: 2023-02-23
tags: neovim
---

It's no secret that I love Vim. I've been using it since I started in the industry, but rather than talking about WHY I love it so much (that feels like a separate post) let's talk about adding some key modern features of a code editor for writing JavaScript.

> **Note:** These features are going to require us to run with [Neovim](https://neovim.io/), a relatively recent retooling of [Vim](https://www.vim.org/), the modal editor that's been in active development since the 90's! <small>(Such sleek, much wow, very powerful... 🐕)</small>

We're going to nab:

- **Intellisense-style code-completion** and hinting for:
    - JavaScript, HTML, CSS, ESLint, and JSON
- **Powerful language actions** and methods for displaying info and jumping around in your code.
- **Linters** that will ~~tell you how wrong you are~~ help you write better code.
- **Auto code-formatting** with Prettier.

What you'll need:

- **[Neovim](https://neovim.io/)** (for LSP support).
- A little bit of **Lua** code (don't worry, if I can parse it you can too).
- Some familiarity with installing utilities via the **command line**.

## LSP's, you magical beasties...

A lot of the features we're interested in come from the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) or LSP developed by Microsoft. They act as language-specific 'brains' that an editor (like Visual Studio Code) can communicate with for all sorts of handy language features.

This is the tech behind **Intellisense** completion, and it's also supported in Neovim. We're going to be nabbing these brains for ourselves with the help of NPM.

There are 4 LSP's that we're interested in today:

- [TypeScript](https://www.npmjs.com/package/typescript) - Why TypeScript? Well, it has inside of it many language features that work for vanilla JavaScript, not JUST TypeScript.
- [typescript-language-server](https://www.npmjs.com/package/typescript-language-server) - works with TypeScript to provide those language features for JavaScript
- [vscode-langservers-extracted](https://www.npmjs.com/package/vscode-langservers-extracted) - This is a combo bundle. The fine folks at Microsoft wrote LSPs for HTML, CSS, JSON, and added ESLint support while they were at it.
- [@tailwindcss/language-server](https://www.npmjs.com/package/@tailwindcss/language-server) - (optional) We use [Tailwind](https://tailwindcss.com/) quite a bit at [Viget](https://www.viget.com/), and this gives us powerful autocompletion which is a MUST with Tailwind, but if this isn't your cup of tea you can leave this one off.

We're going to install everything globally with this command:

```bash
npm install -g typescript-language-server typescript vscode-langservers-extracted @tailwindcss/language-server
```

(I'm using `npm` to install modules in this example, but you can use whatever package manager you prefer. The point is you just need these globally installed so you can access them from Neovim. These LSP's are just a small sampling of what's available, see the docs at [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) for ways to install and configure more LSPs)

Now that we have these magical language 🧠's available globally we need to connect them to Neovim.

## Connecting Neovim

We'll be installing Neovim plugins to help attach everything. The plugin manager I'm using here is [Packer](https://github.com/wbthomason/packer.nvim), but these will work with any other plugin manager as well.

We're also going to be writing the setup and configurations of these plugins in Lua because most of them are written in Lua themselves. However, there's no need to swap out your `init.vim` (vimscript-based config equivalent of `.vimrc` for Neovim) for `init.lua` just yet. Neovim gives you the option to write Lua blocks inside of Vimscript like:

```lua
lua << EOF
  -- all your lua config here
end
```

So if you're rocking Vimscript, make sure to wrap the following setup in the Lua markers.

### Install the plugins

```lua
require('packer').startup({function(use)
  -- ...other plugins before and after...
  --
  -- LSP integration and autocomplete
  use 'neovim/nvim-lspconfig'
  use 'hrsh7th/nvim-cmp'
  use 'hrsh7th/cmp-nvim-lsp'
  use 'hrsh7th/cmp-nvim-lsp-signature-help'
  use 'hrsh7th/cmp-buffer'
  use 'hrsh7th/cmp-path'
  -- Prettier
  use {
    'prettier/vim-prettier',
    run = 'yarn install --frozen-lockfile --production',
    ft = {'javascript', 'typescript', 'css', 'scss', 'json', 'graphql', 'markdown', 'vue', 'yaml', 'html'}
  }
end})
```

|Plugin |Description |
|:---|:---|
|[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) |Officially supported LSP quickstart configs |
|[nvim-cmp](https://github.com/hrsh7th/nvim-cmp) |The completion engine we'll be using for everything |
|[cmp-nvim-lsp](https://github.com/hrsh7th/cmp-nvim-lsp) |This is a 'source' plugin for our complete engine, `nvim-cmp`. This allows it to use the LSPs (required) |
|[cmp-nvim-lsp-signature-help](https://github.com/hrsh7th/cmp-nvim-lsp-signature-help) |A helper source that will auto-hint at function arguments for us (optional) |
|[cmp-buffer](https://github.com/hrsh7th/cmp-buffer) |While we're at it, another source plugin that allows autocompletion from the buffer itself (optional) |
|[cmp-path](https://github.com/hrsh7th/cmp-path) |Another source plugin to help complete file system paths (optional) |
|[Prettier](https://github.com/prettier/vim-prettier) |Officially maintained auto-formatting utility for a variety of languages, what we're doing here is actually only activating it for certain filetypes |

**One note about Prettier:** You may have noticed we did not install Prettier globally. TYPICALLY you'll be running Prettier from a local project installation, and this setup will hook into a project that has Prettier installed. But if you want to use Prettier outside of a project config, you can also install a version globally that you can use without modifying project dependencies. We'll come back to Prettier a little later on.

### Activate the plugins

If you haven't worked with Lua plugins before they differ from traditional Vim plugins in the fact that they're not active by default, you have to call them (and optionally pass configuration options) before they'll attach themselves to your session. This allows for you to selectively load plugins per filetype or any other fancy options you might need.

Inside of your `init.vim` or `init.lua` add the following:

#### LSP Config

```lua
-- LSP Mappings + Settings -----------------------------------------------------
-- modified from: https://github.com/neovim/nvim-lspconfig#suggested-configuration
local opts = { noremap=true, silent=true }
-- Basic diagnostic mappings, these will navigate to or display diagnostics
vim.keymap.set('n', '<space>d', vim.diagnostic.open_float, opts)
vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, opts)
vim.keymap.set('n', ']d', vim.diagnostic.goto_next, opts)
vim.keymap.set('n', '<space>q', vim.diagnostic.setloclist, opts)

-- Use an on_attach function to only map the following keys
-- after the language server attaches to the current buffer
local on_attach = function(client, bufnr)
  -- Enable completion triggered by <c-x><c-o>
  vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')

  -- Mappings to magical LSP functions!
  local bufopts = { noremap=true, silent=true, buffer=bufnr }
  vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
  vim.keymap.set('n', 'gk', vim.lsp.buf.hover, bufopts)
  vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
  vim.keymap.set('n', 'gK', vim.lsp.buf.signature_help, bufopts)
  vim.keymap.set('n', '<space>D', vim.lsp.buf.type_definition, bufopts)
  vim.keymap.set('n', '<space>rn', vim.lsp.buf.rename, bufopts)
  vim.keymap.set('n', '<space>ca', vim.lsp.buf.code_action, bufopts)
  vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
  vim.keymap.set('n', '<space>f', function() vim.lsp.buf.format { async = true } end, bufopts)
end

-- The nvim-cmp almost supports LSP's capabilities so You should advertise it to LSP servers..
local capabilities = require('cmp_nvim_lsp').default_capabilities()

-- Capabilities required for the visualstudio lsps (css, html, etc)
capabilities.textDocument.completion.completionItem.snippetSupport = true

-- Activate LSPs
-- All LSPs in this list need to be manually installed via NPM/PNPM/whatevs
local lspconfig = require('lspconfig')
local servers = { 'tailwindcss', 'tsserver', 'jsonls', 'eslint' }
for _, lsp in pairs(servers) do
  lspconfig[lsp].setup {
    on_attach = on_attach,
    capabilites = capabilities,
  }
end

-- This is an interesting one, for some reason these two LSPs (CSS/HTML) need to
-- be activated separately outside of the above loop. If someone can tell me why,
-- send me a note...
lspconfig.cssls.setup {
  on_attach = on_attach,
  capabilities = capabilities
}

lspconfig.html.setup {
  on_attach = on_attach,
  capabilities = capabilities
}
```

Awesome, that's the LSP setup. We now have LSP's activated and attached -- but they're not going to autocompleting yet. We need to set up `nvim-cmp`. But to do that we also need to specify a snippet engine.

#### Snippet Setup

Now, you don't NEED `LuaSnip` specifically for `nvim-cmp`, but you do need A snippet engine (`nvim-cmp` requires one 🤷). I've chosen `LuaSnip` for it's ease of use and power, which I may cover in a future article. For now let's set it up:

```lua
-- Luasnip ---------------------------------------------------------------------
-- Load as needed by filetype by the luasnippets folder in the config dir
local luasnip = require("luasnip")
require("luasnip.loaders.from_lua").lazy_load()
-- set keybinds for both INSERT and VISUAL.
vim.api.nvim_set_keymap("i", "<C-n>", "<Plug>luasnip-next-choice", {})
vim.api.nvim_set_keymap("s", "<C-n>", "<Plug>luasnip-next-choice", {})
vim.api.nvim_set_keymap("i", "<C-p>", "<Plug>luasnip-prev-choice", {})
vim.api.nvim_set_keymap("s", "<C-p>", "<Plug>luasnip-prev-choice", {})
-- Set this check up for nvim-cmp tab mapping
local has_words_before = function()
  local line, col = unpack(vim.api.nvim_win_get_cursor(0))
  return col ~= 0 and vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]:sub(col, col):match("%s") == nil
end
```

#### Autocomplete Setup

Almost done! Now we just need to activate `nvim-cmp` and feed it both our LSP and other sources, and create some keymappings:

```lua
-- CMP - Autocompletion --------------------------------------------------------
local cmp = require 'cmp'
cmp.setup {
  snippet = {
    expand = function(args)
       require('luasnip').lsp_expand(args.body) -- For `luasnip` users.
    end,
  },
  mapping = {
    ['<C-p>'] = cmp.mapping.select_prev_item(),
    ['<C-n>'] = cmp.mapping.select_next_item(),
    ['<C-d>'] = cmp.mapping.scroll_docs(-4),
    ['<C-f>'] = cmp.mapping.scroll_docs(4),
    ['<C-Space>'] = cmp.mapping.complete(),
    ['<C-e>'] = cmp.mapping.close(),
    ['<CR>'] = cmp.mapping.confirm {
      behavior = cmp.ConfirmBehavior.Replace,
      select = true,
    },
    ["<Tab>"] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_next_item()
      elseif luasnip.expand_or_jumpable() then
        luasnip.expand_or_jump()
      elseif has_words_before() then
        cmp.complete()
      else
        fallback()
      end
    end, { "i", "s" }),

    ["<S-Tab>"] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_prev_item()
      elseif luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, { "i", "s" }),
  },
  sources = {
    { name = 'nvim_lsp' },
    { name = 'nvim_lsp_signature_help' },
    { name = 'luasnip' },
    { name = 'buffer' },
    { name = 'path' }
  },
}
```

Aaaaay, now we have LSP-assisted autocomplete working! 😎 We've set up some smart mappings specifically around `<Tab>` and `<S-Tab>` to allow `nvim-cmp` to quickly cycle through options, and we've fed all of our sources into the completion engine.

### Prettier Setup

And lastly, lets activate and make some keybindings for Prettier:

```lua
-- Prettier
keymap("n", "<leader>re", "<Plug>(Prettier)", opts)
keymap("v", "<leader>re", ":PrettierFragment<cr>", opts)
```

If it's more helpful to see everything all together, you can take a peek at [my personal Neovim config](https://github.com/nathanlong/dotfiles/blob/main/nvim/init.lua), just know that it may deviate slightly from these instructions as I'm always tinkering.

## That's great, but what can I DO with these things?

Each one of these things we just installed and connected will allow to some truly magical actions.

### Language-Powered Extensible autocompletion (nvim-cmp + LSP)

If you've seen someone use VSCode, you have seen this in action. Language keywords are automatically provided for you as you type, and more than that: it KNOWS your code base. If you've correctly formatted your code, the autocomplete popups will be able to tell you what types of arguments the function requires, grab methods and functions from imported code, and just overall better autocomplete.

But YOU get to pick what goes in there. If you need something like Elixir and Erlang support, there are [LSP's for that](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#elixirls). This system will allow you to grab whatever completion brains you want and plug them into your new system.

### Super Language Powers

There are a lot of powerful features hidden in the LSPs that are not obvious at first. We bound a lot of these commands to key mappings in our config files, here are a few of them explained:

- **Buffer Hover** = Display a tooltip for what your cursor is on. Helpful for things like seeing the expanded Tailwind CSS definitions or a bit of info about a piece of code. Very handy.
- **Buffer Implementation** = Open a quickfix window of everywhere in the current file what your cursor is over has been implemented (not the same as referenced, there's a different command for that 😆).
- **Buffer Definition** = Jumps to the definition of what your cursor is currently over. You can jump back to a variable or function definition.
- **Buffer Type Definition** = Jumps to the definition of the type you're on.
- **Buffer Rename** = Rename what's under your cursor everywhere. Incredibly handy!
- **Signature Help** = Displays function signatures with the current parameter emphasized. Can't remember what arguments a function takes? Activate signature help and it'll tell you!
- **Code Action** = This one is interesting. It's context sensitive command that will give you a list of things that can be done for a diagnostic error and can actually fix an issue for you or provide recommendations!
- **Buffer Reference** = Create a quickfix window for all references for what your cursor is on.
- **Buffer Format** = This one can also be pretty magical. This command can do some basic clean up and formatting for you. Think of it as Prettier-Lite™️

### Linting In Context

We didn't address it directly, but part of the `vscode-langservers-extracted` package included `eslint`. Through the LSP integration, diagnostics will output directly alongside your JavaScript so you can see ~~when you've made a terrible mistake~~ when your code could be improved. This setup also gives you an easy way to navigate through diagnostic errors (We bound them to `[d` and `]d` in the config files) and even have some quick LSP-assisted resolution through Code Actions.

### Auto-formatting (Prettier)

Alright, this is more subjective than the other benefits, but stick with me here for a 🔥 **hot take** 🔥.

While [Prettier](https://prettier.io/) isn't perfect, it does have a valuable function: it completely removes arbitrary and subjective formatting differences when working on a team.

Tabs/Spaces? (Foh-get a-bout eet) Spaces around argument options? (Naht to woo-ray, hun). Entire PR's littered with whitespace adjustments? (Ne-vah agaihns). Write the code how you want to while you're hacking away, then, when you're done, have the formatter clean it up and snap it into alignment with team standards (collected in the `.pretterrc`). It's like a robot butler for your code, and while it may not put everything back where YOU would put it you can also know that it's doing the same thing for everyone else. And that's a lot harder to get stuck on.

## Conclusion

The support of LSP's is one of the main reasons I hopped onboard the Neovim train. After seeing how nice the JavaScript experience is in Visual Studio Code and the power of what LSP's allow you to do with your code I was sold. When you're styling a user interface in TailwindCSS or working in a Next.js app, having the lightning fast autocomplete along with quick hopping, output previews, and contextual linting... It turns Neovim into a rocket ship for writing modern JavaScript!
