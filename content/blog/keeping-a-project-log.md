---
title: Keeping a Project Log
description:
date: 2024-03-04
tags: [thoughts, process]
---

> Captain's Log, Stardate 41503.7. We have entered the Neutral Zone where a Talarian freighter has been severely damaged in a battle. I have sent an away team to investigate.
>
> — Captain Jean Luc Picard (S1E20: Heart of Glory) 

I grew up watching Star Trek (specifically reruns of The Next Generation) and listening to Captain Jean Luc Picard (the BEST captain, `fight me`...) record the events of their explorations and adventures.

I used to wonder: who would listen to these logs? Were they for the captain's benefit? Was some poor schmoe's job at Starfleet to listen to long expositions on events? The internet tells me that the ship's logs were (are?) used to document speed, location, who was onboard, significant events, or anything else regarding the ship's operation. If something goes wrong, the log can help piece together the events leading up to the event.

But captains aren't the only folks to keep logs.

Scientists keep highly detailed logs in their [lab notebooks](https://en.wikipedia.org/wiki/Lab_notebook), documenting their hypotheses and experiment results so they can be repeated and breakthroughs can be proven (and protected in the case of intellectual property). Researchers in descriptive sciences keep [field notes](https://en.wikipedia.org/wiki/Fieldnotes) to record observations and evidence to help create an understanding of a phenomenon.

As developers, should we keep logs? **Short answer: Yes.** (And it's not a new idea...) We should keep 'project logs'.

Great. Fantastic. I'm sure you'll all get right on that and do fine. But if you're like me, perhaps a little more structure into WHAT EXACTLY to log would be helpful.

## What should a web developer's log look like?

We're not scientists, nor are we space explorers, but as developers, we navigate through series of problems and solutions in projects. We plot a course at the beginning of a project and then observe how that approach fails or succeeds.

If you're like me, this is all very timely information. Ask me again in 3 months and I will struggle to recall all but the key details of what happened.

A web developer project log should:

* Be private, not publicly accessible.
* Be organized by project.
* Record goals and possible solutions upfront.
* Record any supporting links and materials (designs, workspaces, external notes, etc.)
* Contain a chronological log of quick updates on:
    * Decisions made, and the reasons for them.
    * Events, either internal or external that affect the build process.
    * Stray thoughts about future optimizations.
* Record final results and contrast them against the original goals and solutions.

I'll expand on each of these.

### Keep it Private

Some developers, especially game developers, keep a public devlog. They can range from things like [patch notes](https://itch.io/devlogs), to something [with more behind-the-scenes thinking](https://www.gridsagegames.com/blog/), to [lavishly produced videos](https://www.youtube.com/watch?v=OU3B3D-52us).

But game developers face different problems than we do as web developers. They have a game to sell in a saturated market. If they're a small team or indie dev, they may not have folks devoted to evangelizing their game to their audiences. A public devlog increases accountability and gets existing users excited about upcoming updates. It can expose balance notes that might change the [game meta](https://en.wikipedia.org/wiki/Metagame). It can serve as a marketing tool. Because of these uses, a game devlog exists more for the USERS than for the DEVELOPER.

As web developers, we often sell our services by contract — we don't need the same type of audience-building efforts. In fact, we might even breach contract if we share technical details publicly. So if you keep a log, it will be for YOUR benefit.

### Organized by Project

I want to make a distinction between a log and a journal. A journal is incredibly useful for stream-of-consciousness observations organized by day. However, using this approach for a project spreads information across a series of time-bound entries. If you're working on multiple projects simultaneously it can be difficult to gather that information back up in a usable way. You can tag it, sort it, segment it, or whatever, but when you go looking for you'll also be perusing entries that will cover a variety of topics in addition to the one you're looking for.

For maximum benefit, we'll be using these logs both during and after the build. For that reason, we'll make it easier for our future selves to organize these logs by project.

### Record Goals and Approach

This is one of the most important parts of a developer project log; it's the equivalent of our hypotheses. At the beginning of any project, the problem is explored and an approach is planned to solve it. But projects are not static, goals can change, and wrinkles are introduced by hidden requirements or obstacles that weren't known at the outset. It's much harder to see how far things have drifted if you don't record them first.

A project manager may record parts of this in shared documentation, but this also includes YOUR goals for the project -- things only you can know. This project log exists for your improvement so it's up to you to record these things yourself. PMs will move on, and you may not be paired again on the next project, so this is for you to develop a consistent practice in your approach.

### Record supporting links and materials

If you put something out of sight, you won't use it. Part of increasing the use of this project log is to make it a handy dashboard. Stuff it full of the things you constantly have to look up: design files, meeting notes, links to specific tickets. Whatever you need. If you've recorded it, it's all right there.

### Chronologically record process

Every so often, at a cadence that makes sense to you, record progress on the build. What's happening? Did the client request something different? Was a problem found in the approach? Document decisions and events. Anything that influences the build should find its way in here. Give it a dated entry so you can piece together what happened when.

### Contrast results and goals

We built up our initial approach, we logged the changes and the path we wound up taking, and now, in the end, we can look back and see the difference between our start and end.

We can use this to figure out what worked and what didn't. Was there a particular event that helped or hindered the work? Did your collaboration with a teammate cause a new solution to present itself?

By logging and recognizing these things, we can work to reinforce the good and avoid repeating the bad. If your team runs retrospectives, your log will give you the ammunition to propose changes, highlight difficulties, or give genuine praise to your teammates.

It can also give you a moment to be proud of what you've accomplished. Did you come up with a new technique? Did the project unlock a mental model of something? Use these things to fill out your [Brag Sheet](https://jvns.ca/blog/brag-documents/).

## Format

This is the least important part of the log, and the easiest one to get trapped in. The tool must facilitate the work, not dominate your time. Several tools fit the bill:

* [TiddlyWiki](https://tiddlywiki.com/)
* [Obsidian](https://obsidian.md/)
* [Notion](https://www.notion.so/)
* ... heck, even just some scripts and plaintext.

It just needs to be easy to call up and edit. I personally use TiddlyWiki as part of a larger personal wiki. I love being able to easily extend and format it with HTML/CSS/JS and all the data is stored in plaintext files (either as `.tid` with WikiText syntax or as `.md` with Markdown syntax).

But pick something that works for you.

## Warp Factor Two... Engage!

There. A little structure, a little advice, and now we have a tool to help meaningfully progress our technical chops one project at a time.
