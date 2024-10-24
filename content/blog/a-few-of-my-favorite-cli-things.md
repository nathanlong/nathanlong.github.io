---
title: These Are a Few of My Favorite CLI Things...
description: I take a look at a few of the CLI utilities I've picked up along the way.
date: 2024-03-21T09:16:32-0400
tags: [tooling]
---

I've recently been perusing the setups at [uses.tech](https://uses.tech/). It's interesting to see where people have landed on hardware and software options, but I started thinking about some of the miscellaneous CLI utilities I've tried and picked up along the way. My work LIVES inside the terminal (as a Vim user) and here are some of the small things I've found to make it easier on myself (in no particular order):

## tig

**Site:** [https://jonas.github.io/tig/](https://jonas.github.io/tig/)

Git can be weird sometimes. While I don't use `tig` to perform any git operations, I find the explorer view helpful to see what's going on in there. Have you rebased correctly? What did your teammates just commit, and what files did it affect? I run this constantly on active projects to keep a mental picture of what's going on.

(So what DO I do most of my git actions with? I use Tim Pope's excellent [Fugitive](https://github.com/tpope/vim-fugitive) Vim plugin, but that's more Vim-based, so it doesn't qualify for this article...)

<div class="feature rounded-1 overflow-hidden lh-0">
  <video class="w-full h-auto" autoplay muted loop playsinline>
      <source src="https://github.com/nathanlong/nathanlong.github.io/assets/623568/44491262-1f61-402d-b394-31c16aa65bcd" type="video/mp4" />
  </video>
</div>

## exa

**Site:** [https://the.exa.website/](https://the.exa.website/)

`exa` is a more colorful way to list files and directories. It may seem simple, but when you're navigating around, having color-coded items, as well as other pertinent information right at hand, is a nice quality-of-life improvement. This has completely replaced `ls -laF` for me. I've aliased the two modes I use the most to:

```bash
alias ll='exa --long --header --git --all' # long form, everything
alias lt='exa --tree --level=2 --long --all' # tree view
```

<div class="feature rounded-1 overflow-hidden lh-0">
  <video class="w-full h-auto" autoplay muted loop playsinline>
    <source src="https://github.com/nathanlong/nathanlong.github.io/assets/623568/4faafda2-4c14-49ad-a48f-7f21bbf289dd" type="video/mp4" />
  </video>
</div>

## bashmarks

**Github:** [https://github.com/huyng/bashmarks](https://github.com/huyng/bashmarks)

I found this bash script about 12 years ago and I've used it every day since then. It's a very simple bookmarking system for navigating directories with tab completion and very short commands. `s` saves the current directory with the name you give it, and `g` + `name` takes you right back to that path.

I've tried fuzzy completion and other fancier bookmarking options, but this one is so simple and does just what I need that I've wound up back at bashmarks several times. I'll save the fancy fuzzy searching for INSIDE projects, I'd rather just teleport to where I need to go. I highly recommend this script if you need a simple navigation option.

## ffmpeg

**Site:** [https://ffmpeg.org/](https://ffmpeg.org/)

This is an absolute monster of a video and audio tool. Need to compress a looping ambient hero video? Run it through `ffmpeg`. Need to strip the audio from something? Run it through `ffmpeg`. Need to quickly trim down a video? You guessed it, `ffmpeg`. I have shaved innumerable megabytes of video data with this tool while processing assets for client projects.

The only beef I have with it is that writing out the arguments for proper compression is like trying to write an arcane spell. You need special knowledge of `ffmpeg`'s vast options and some knowledge of video codecs to make your way. Yet despite that, it remains an indispensable tool for front-end development.

The video screencaps in this article were captured with a normal Quicktime screen recording, but I have a special quickfire mov-to-mp4 command that uses the absolute basic mp4 defaults and still manages to make them 5-10% of the original `.mov` size:


```bash
# Quicktime mov files are so big!
function movtomp4() {
	for i in *.mov; do
		ffmpeg -i "$i" "${i}.mp4";
	done
}
```

At some point, I'll have to write up my cheatsheet for `ffmpeg`...

## degit

**Github:** [https://github.com/Rich-Harris/degit](https://github.com/Rich-Harris/degit)

I learned about `degit` from the Vite docs, and it's become my go-to way for initializing a prototype kit. When I have an idea I want to try, I turn to `degit` and let it grab all the configuration files for me. Need Tailwind? Grab a starter kit for that. Testing out something in React? There's a starter kit you can pull for that too.

In fact, I made a few [starter kits of my own](/blog/vite-rapid-prototype-starter-kits/).

## just

**Github:** [https://github.com/casey/just](https://github.com/casey/just)

Do you have a project that needs lots of arbitrary commands? Things you have to continually look up and paste back into your console? `just` helps provide a unified layer on top of whatever system you're using. Unlike a Rakefile or Makefile, it's not bound to any specific language, you can just feed it whatever commands you'd like and it'll run them for you.

It even pairs nicely with the previous utility, `degit` to help form a rapid-start prototyping area with [project templates](/blog/vite-rapid-prototype-starter-kits/)

## asdf

**Site:** [https://asdf-vm.com/](https://asdf-vm.com/)

It can be tough to make sure that your environments are in sync across projects, versions, and even programming languages. For a while, I was using language-specific version managers (`nvm`, `rvm`, with all the shims that come with it) but Viget introduced me to `asdf` as an all-in-one way to manage all these different languages in a way that didn't have me pulling my hair out.

## btop

**Github:** [https://github.com/aristocratos/btop](https://github.com/aristocratos/btop)

Think Activity Monitor, but way cooler looking and accessible without clicking a bunch of things. `btop` is a pleasing way to see just what is making your computer slow down to a crawl (shakes fist at Docker).

<div class="feature rounded-1 overflow-hidden lh-0">
<video class="w-full h-auto" autoplay muted loop playsinline>
      <source src="https://github.com/nathanlong/nathanlong.github.io/assets/623568/15fc78f3-a1d3-4e30-acca-a070f4fea860" type="video/mp4" />
</video>
</div>
