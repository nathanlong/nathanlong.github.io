---
title: My Personal tmux Mystery
description:
date: 2024-08-22T11:23:23-0400
tags: [tooling]
---

Roll in enough Vim circles and you'll hear people sing the praises of `tmux`, the [terminal multiplexer](https://github.com/tmux/tmux/wiki). And to be honest... I've never really quite gotten it. 

I tried it and didn't get why it was great. Recently, Adam Stacoviak from the [Changelog](https://changelog.com/) mirrored my thoughts in this short clip:

<div class="feature">
<iframe style="aspect-ratio: 560/315; width: 100%; height: auto;" width="560" height="315" src="https://www.youtube.com/embed/nAc_kxlGXFY?si=RCzaLBzFXO6GYA4m" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The selling points that Nick and Jared make for `tmux` actually made me realize why it's never quite fit for me. Their two main points:

1. `tmux` sessions are a great way to manage projects and window arrangements.
2. `tmux` allows persistent processes over an SSH connection.

It made me realize that my normal workflow differs from what they describe. Which made me start to wonder, "Am I the outlier here?"

So here's a quick overview of how my workflow differs.

1. I don't use complex window arrangements and have other ways to manage projects.
3. (The big one) Most of my development is local-only.

## Projects and Window Arrangement

To open up a project I:

1. Open up WezTerm
2. Type the shortcut saved from my [bashmarks script](https://github.com/huyng/bashmarks)
3. Open `nvim`
4. Use the amazing [Telescope plugin](https://github.com/nvim-telescope/telescope.nvim) to pull up any files I need.
4. Start coding.

Once I'm in the project I typically work with a single full-screen window. I use lots of window splits to compare files, put them side by side, keep one open as a reference, or whatever ... but that's all internal to NeoVim. I manage my git history through the [Fugitive plugin](https://github.com/tpope/vim-fugitive). If I need to run a quick command I have a [floating terminal](https://github.com/voldikss/vim-floaterm) bound to a function key that I can quickly bring up and dismiss without leaving NeoVim. Once I'm IN NeoVim, I don't need to leave it.

Adam jokingly (seriously?) says halfway through the video, "What's wrong with multiple tabs?" And ... 😳 ... that's EXACTLY what I do when I need to run a separate process in the background, I kick open a new tab on WezTerm and then leave it running. Need to fire off a container that's not detached? Open a new tab. Need to run my local [node-based wiki](https://tiddlywiki.com/) in the background? Open a new tab and fire off the process.

The tabs act as my expander and window management. Because I start fresh each time with a simple arrangement, I don't need to save the session and the project. I just need to get there in the command line and open NeoVim.

I realize many people don't work in this one-window-at-a-time-in-fullscreen mode like I do. If there was a lot of setup or tear down between projects I could see sessions being useful, I just don't think it will help me much. 

## Local Only Development

This is the main reason of that makes `tmux` not a real boost for me — I simply don't often work through an SSH connection.

Most of my development work happens on a local checkout of a project, running on local containers. Occasionally I'll need to SSH into something and run a few commands, but typically they're relatively minor and quick — I've never had a command disconnect on me.

IF I did more work on remote boxes I could see this being a critical part, but it's simply not a large part of my workflow.

So I'm not crazy, I'm just not who `tmux` is for.
