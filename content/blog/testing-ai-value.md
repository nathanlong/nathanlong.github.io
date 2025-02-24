---
title: Testing AI Value
description: I've been an AI skeptic, but it's time to test AI for myself... with a few boundaries.
date: 2025-01-24T17:36:19-0500
tags: [tooling]
---

I was disappointed when [AlphaGo beat Lee Sedol](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol) in 2016, but intrigued when it influenced opening strategies that had been set for decades (or even centuries). I was alarmed in 2022 by how confidently ChatGPT spouted hallucinations with no factual basis but amused that it enabled me to create a haiku about my love of cheese effortlessly.

I've been an AI skeptic, but it's frickin' everywhere. The Pragmatic Engineer newsletter tracked the [decline of StackOverflow with the rise of ChatGPT](https://newsletter.pragmaticengineer.com/p/are-llms-making-stackoverflow-irrelevant). Anthropic is raising capital at a [valuation of $60B](https://techcrunch.com/2025/01/07/anthropic-reportedly-in-talks-to-raise-2b-at-60b-valuation-led-by-lightspeed/). AI even recently popped up as a way to help my kid [learn Spanish](https://blog.duolingo.com/duolingo-max/)... AI is everywhere, seemingly in everyTHING, and it does not look like it's going away soon.

I like Cal Newport's concept of [digital minimalism](https://calnewport.com/on-digital-minimalism/) when dealing with disruptive technology: aggressively clearing away digital clutter and keeping only the tools that bring value to your life. I think of it as digital [KonMari](https://konmari.com/about-the-konmari-method/). (Literally why I slid out of most social media, minimal value there for me, folks.)

So what value does AI bring a web developer? Addy Osmani has a [few opinions](https://newsletter.pragmaticengineer.com/p/how-ai-will-change-software-engineering) on that. Addy defines two effective patterns of AI usage he's seen engineers use:

1. **Bootstrappers** - Use AI to rapidly develop the initial codebase for a working prototype of a rough concept — good enough for initial user feedback.
2. **Iterators** - Daily use for code completion, refactoring, generating tests and documentation, and as a virtual 'pair programmer'.

It's the second pattern that speaks to me.

I'm not OK with AI doing serious writing FOR me, but I am OK with having it help check my grammar and sentence structure: [Clippy](https://www.youtube.com/watch?v=3kcQzCzSDvc) is reborn (but maybe... more useful this time).

I'm not OK with AI coding FOR me, but I am OK with AI helping me fix flaws in my code and find efficiency gains: my coding robot [buddy and me](https://www.youtube.com/watch?v=4j2xEwEHbrE).

Addy notes that for effective use, engineers need to identify when the model is making errors, making it more valuable to senior-level engineers who can validate, strengthen, and handle edge cases. AI becomes an accelerator, a proof-checker, a sounding board.

This feels like enough value to test, but I still have some reservations:

1. Working as a remote employee is isolating enough. Replacing human collaboration with AI collaboration could silently diminish connection in a space where it's already at a premium.
2. Obfuscating the actual workings with 'magic' feels dangerous. If we don't know WHY it works, we will not be able to fix it when it breaks.
3. Fear is a bad reason to adopt something: either to prevent being 'left behind' or to stay relevant in today's job market. Some things are just OK to skip. (Remember how WEB3 was going to change the world?)

## The Test

So we test it. But we set some boundaries:

1. I do the work. The AI must function as an assistant to counteract the temptation to rely on it too heavily.
2. It remains opt-in. No inline recommendations. This interface must only come when called.
3. I must understand everything I commit. If I don't understand it, or can't reach an understanding, the recommendation gets nuked.
4. Data must remain reasonably protected and not be used for training data. This one comes from my peers at Viget and I wholeheartedly agree. This code is my work product and must be legally protected within the bounds of our contracts.

And then we review:

1. Does it improve my work product like catching errors or improving clarity?
2. Does it make me more efficient?
3. Does it introduce errors?
4. How expensive is it?
5. Does the result justify the cost?

## The Implementation

After reviewing several options I've settled on the [CodeCompanion](https://github.com/olimorris/codecompanion.nvim) plugin for NeoVim. In particular, its chat interface will let me send the contents of a buffer to the LLM, and I can control the level of access it has. This fits the pattern I'm looking for.

This will also allow me to test different LLMs. I plan to start with [Claude 3.5 Sonnet](https://www.anthropic.com/claude/sonnet) as it's aimed at the type of work I do and Anthropic honors my #4 boundary of not using my data for training purposes for commercial products.

So, we'll see. If it proves valuable, I'll keep it around. If not, well then...

