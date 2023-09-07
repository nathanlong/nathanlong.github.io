---
title: Vite Rapid Prototyping Starter Kits
description: Creating quick one-line commands to get a local sandbox up and running.
date: 2023-06-16
tags: tooling
---

One of the things I love about [Vite](https://vitejs.dev/) is how FAST it is to spin up. When I had the idea for my  [Sandclock](https://nathan-long.com/sandclock/) toy app (which I'll write about once I get a little further with it) I used the Vite React starter to quickly spin up a basic project. No configuration, no hunting for packages, just drop and go.

This got me thinking about prototypes.

## Prototypes

Sometimes when building a user interface a concept comes up that's a bit tricky to nail down. Our design tools are great at communicating static design but once you add motion or more complex functionality it can become harder to get collaborate.

This is where I feel prototypes become valuable—getting buy-in on a difficult to explain concept. Splitting the concept from the codebase gives some freedom to get messy and iterate without causing a PR nesting tangle or a bunch of churn commits.

I LOVE code playgrounds like [CodePen](https://codepen.io/). They excel at sharing ideas, illustrating concepts, and exposing techniques — but as a rapid prototyping tool there's some friction between the playground and your final code. Especially if you're looking to port your code afterwards into a specific stack.

Vite helps here in quickly spinning up a local dev environment with little to no config. You get your normal code editor and can plug in any stack you need. If you use one of their starter kits, it's just a one line script to get a full local playground up and running. Vite has the bases covered pretty well in terms of JS frameworks (Vue, React, Svelte, and more) — BUT there are a few patterns we use at Viget that aren't as widely covered like [Tailwind](https://tailwindcss.com/) + [Stimulus](https://stimulus.hotwired.dev/) and Vanilla JS with [Viget Modules](https://www.viget.com/articles/how-does-viget-javascript/).

### Degit-ize your Starter Kit

In the Vite docs, they surface [degit](https://github.com/Rich-Harris/degit) (by Rich Harris) as a way to expand beyond the official Vite starters. It's a command-line utility that nabs clean copies of git repos but leaves all the history behind. We're looking forward, not backwards! It's a nice little utility that opens up the field for one-line installs for UNOFFICIAL starter kits... like these next two.

## Tailwind and Stimulus

At [Viget](https://www.viget.com/), we're big fans of [Tailwind](https://tailwindcss.com/) and [Stimulus](https://stimulus.hotwired.dev/).

### Tailwind

Maybe one day I'll write an apologetics-style post about the reasons Tailwind is great, but for now I'll keep it short. Tailwind is massively composable, completely sidesteps any need for naming methodologies, and flattens out the selector specificity so it'll scale long-term on a project without gathering cruft. It's also portable in that you can write Tailwind in React, Vue, Svelte, but also Craft, Wordpress, custom Ruby apps, or any other system you'd like to use. That means as a team it's a common language that can we can spread on top of any stack we'll need to use.

Tailwind is also well suited for prototypes. You can lift the HTML markup and classes and just port it into whatever you're working on — and it ought to just work. Even if you have custom classes and patterns, those are portable enough between projects, and if you need to RELY on project-specific setup you can just grab the project's `tailwind.config.js` into your prototype from the beginning!

### Stimulus

Sometimes you don't need that much JavaScript. Rather than attempting to render the interface, Stimulus allows you to 'sprinkle' your interface with interactivity that loads only when needed. Like Tailwind, it augments HTML markup as the source of truth and when the two are paired together you can really jam on something without much file switching!

### A new Tailwind/Stimulus starter

Given these team staples, I set about writing a Vite starter only to find my coworker, [Jeremy Frank](https://github.com/jeremyfrank), had already created one!

Check it out [on Github here](https://github.com/jeremyfrank/vite-tailwind-stimulus-starter).

And with degit, you can one-line it with:

```sh
degit jeremyfrank/vite-tailwind-stimulus-starter my-new-project
```

## Vanilla All the Things

OK, so this isn't really a tech stack as it is buy-in into the platform itself. CSS and JS have come a long way in the last several years.

### CSS

In CSS we have variables, grid, powerful selectors like `has()` (ALMOST here) and `not()`, and amazing features like `clamp()` that remove many of the original reasons we used a pre-processor like SASS. And just look at these [new things for CSS in 2023](https://developer.chrome.com/blog/whats-new-css-ui-2023/) like this `popover` [demo from Una Kravets](https://developer.chrome.com/blog/introducing-popover-api/). How can you not be excited about all this?!

### JavaScript

A few years ago the Viget team developed a pattern called [Viget Modules](https://www.viget.com/articles/how-does-viget-javascript/) that tap into [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) to load only the modules needed on a page. Don't need it? Don't load it!

Originally, Webpack worked it's magic to chunk and bundle everything, but now with native ESM support in browsers we can ship these independent modules WITHOUT a bundler. Which means this approach could work without a build system at all!

While we've largely replaced Viget Modules with Stimulus controllers in production sites, I have found that when learning new API's or techniques it is easier to clear away all the magic to better understand what's actually going on in the browser.

This also ensures that whatever you're writing isn't going to be subject to a third-party's opinions of how things ought to be. It's just you and the browser.

You can check out my [vanilla starter kit here](https://github.com/nathanlong/vite-vanilla).

And with degit, you can one-line it with:

```sh
degit nathanlong/vite-vanilla my-new-project
```

## Extra Credit: Prototype Junk Drawer

We've now got several options on how we want to roll our quick prototype kits, but what if we took it one step further?

We could transform all these one-line starter commands with `degit` into aliases, OR... [we could use `just`](https://just.systems/man/en/) to pull together a prototype directory where we can make those one lines EVEN SHORTER.

Check out this `justfile`:

{% raw %}
```sh
# react prototype from the official vite docs
react target:
  @echo 'Creating React prototype in {{target}}…'
  npm create vite@latest {{target}} -- --template react
  cd {{target}} && npm install
  @echo 'Start dev with: npm run dev'

# stimulus prototype (custom starter)
stimulus target:
  @echo 'Creating Stimulus prototype in {{target}}…'
  degit jeremyfrank/vite-tailwind-stimulus-starter {{target}}
  cd {{target}} && npm install
  @echo 'Start dev with: npm run dev'

# vanilla prototype (custom starter)
vanilla target:
  @echo 'Creating Vanilla prototype in {{target}}…'
  degit nathanlong/vite-vanilla {{target}}
  cd {{target}} && npm install
  @echo 'Start dev with: npm run dev'
```
{% endraw %}


Now instead of even having to remember the repo paths you can plop into your ~~junk drawer~~ prototyping directory and start a prototype with something like:

```sh
just stimulus my-awesome-prototype
```

Happy prototyping!
