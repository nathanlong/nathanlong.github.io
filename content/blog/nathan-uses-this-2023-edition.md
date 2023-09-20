---
title: "Nathan Uses This: 2023 Edition"
description:
date: 2023-09-20
tags: tooling
---

[1]: https://francescoimprota.com/2023/06/13/my-tech-stack/
[2]: https://chriscoyier.net/2023/09/14/tool-picks/
[3]: https://css-irl.info/cool-tools/
[4]: https://christianheilmann.com/2023/09/14/the-10-tools-i-install-on-every-new-mac-i-get/


There's been a [lot][1] [of][2] [folks][3] [talking][4] recently about the tools that they use so I thought this would be a good time pull a Marie Kondo on everything that's rolling around in this machine to see if it still holds up to inspection. While several of these things won't spark joy, they should at least spark VALUE.

## [Paper Planner](https://www.amazon.com/Blue-Sky-2023-2024-Enterprise-144720/dp/B0BS4869YR/): Task/Life Management

Alright, stay with me. My first tool choice has nothing to do with computers, but everything to do with planning. I've tried so many different planning tools (Todoist, Wunderlist, Trello, Workflowy, Things, Habitica, Remember the Milk, and even building my own system) and none of them have worked for me.

There's too much input sprawl: emails, Slack, GitHub issues, JIRA issues, the one client that still insists on using BitBucket... And that's just work. We also have school events, play dates, practices, trips — things that exist outside of the computer that ALSO need to be tracked.

Maybe I'll expand on this in the future, but my principle has become to manage the task at the source, but keep my goals, high-level items, and events in the planner.

## [TiddlyWiki](https://tiddlywiki.com/): Notes, Writing, Journal, Build Logs

Things that need to stick around longer than a week go in my personal wiki powered by TiddlyWiki. Everything gets stored as flat files for backup, version control, and storage and I run the node module in the background to stitch it all together in an interactive interface for me. It's part [zettelkessen](https://zettelkasten.de/posts/overview/#the-introduction-to-the-zettelkasten-method), part journal, part work dashboard. Because it's web-based, it's also easy to extend and style just how I  want it. It's become my second brain, I'm not sure I could function without it anymore...

## [WezTerm](https://wezfurlong.org/wezterm/): Terminal

Earlier this year I switched from iTerm2 to WezTerm, which says a lot because I spend ALLLLL day in the terminal. It's fast, can be scripted with Lua (which is continuing the pattern of Lua-fication in my life), has an external config file I can take with me, and has a host of nice-to-haves like: baked-in support for my favorite code theme ([TokyoNight Storm](https://github.com/folke/tokyonight.nvim)) and my favorite code font ([JetBrains Mono](https://www.jetbrains.com/lp/mono/)) without the need of font-patching for those sweet, sweet icons.

## [NeoVim](https://neovim.io/): Code Editor

I switched from Vim to NeoVim a few years ago and haven't looked back. I was leery of Lua at first, but NeoVim introduced some killer features that made the learning curve worthwhile. LSP support topped the charts for me, and there are some fantastic plugins like [Telescope](https://github.com/nvim-telescope/telescope.nvim), [Treesitter](https://github.com/nvim-treesitter/nvim-treesitter), and others.

One of the main things that bother me in Neovim right now is that some languages (I'm looking at YOU, [Twig](https://twig.symfony.com/)) have terrible indent support. The rise of Prettier has helped in certain cases, but embedded languages continue to be a problem.

## [OBS](https://obsproject.com/): Visual filters for remote meetings

Remember SnapCamera? Well, it's not around anymore. The funny filters helped inject some humor into the suddenly 100% remote meetings during the pandemic. Now I run OBS and can use overlays, gifs—basically whatever I want as a video source for meetings. Is this overkill? Yes. Is it fun? Also yes.

## [Figma](https://www.figma.com/) and the [Affinity Suite](https://affinity.serif.com/en-us/): Design

When I first joined Viget in 2022 it was the first time I'd been without Adobe products since I was 15. It was equal parts shocking and liberating. Figma is one of the best interface design tools I've used. I fear for its future having been gobbled up by Adobe, but I'll continue to use it until there's a better option.

Having started my career as a designer, I was used to being able to manipulate photos, documents, and layouts to do whatever I wanted. I have no desire to maintain a personal Adobe subscription so I turned to Affinity and their extremely reasonably priced suite of design tools. I've been happy with them and regularly reach for Designer for SVG work (Figma can be painful with complicated SVGs...)

## [Buttondown](https://buttondown.email/): Email newsletters

There's a lot of choice when it comes to writing emails and maintaining a mailing list. I've used Mailchimp frequently for clients but I wasn't keen on maintaining a personal subscription. I found Buttondown through [Cassidy Williams](https://cassidoo.co/)'s newsletter and really liked the interface and features. It was the Goldilocks fit for what I wanted in maintaining an email newsletter.

## [Feedly](https://feedly.com): RSS reader

This is one I feel okay about but might change in the future. Feedly is the best of the free readers and does what I need it to right now which is following the 341 sites I've loaded in there. I have no real complaints about it other than it just doesn't feel like it's MINE. Some features I DO like are the bits of social proof that are scattered across the interface, such as loose counts of just how many people are following a source and what's trending in different categories.

## [Just](https://github.com/casey/just): Universal command runner

I was introduced to this utility about a year ago and it quickly replaced the gnarled file of zsh aliases I kept on my local machine. I use it to simplify long project commands (without having to constantly look them up) and doing some basic command automation.

But its most important feature is its ability to serve as a universal interface between different projects. I can create the same recipes to start up local dev from a Rails project that I can to a React, Elixir, SSG-flavor-of-the-day, or whatever. So rather than trying to remember how to start up the server, I can hit my custom `just run` command, and BOOM—we're up and running.

---

Welp, that's a few of my most used tools. It'll be interesting to check back in a year or so and see how these choices have played out.
