---
title: How to Run FreshRSS Locally With Docker
description: A short guide on how to run FreshRSS locally for that self-hosted RSS joy.
date: 2026-01-20T17:17:28-0500
tags: [tooling]
---

I love RSS.

I love that it gives me a direct line to what people are publishing. No algorithm, no intermediary, just me and the voices I choose—and there are so many interesting voices out there!

Managing the feeds is the real drag. Since they pulled the plug on Google Reader, there hasn’t been one app that I could really get behind. Fortunately, a group of folks who love RSS even more than I do have created an open-source RSS reader,  [FreshRSS](https://freshrss.org/index.html). Which is great! But how do you run it?

If you’re like me, you don’t need to host it publicly; you just want to run the app locally. Turns out the FreshRSS team has helped make this easy by hosting a [well-maintained public Docker image](https://hub.docker.com/r/freshrss/freshrss) of the application. All you will need is a local container service, like [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Orbstack](https://orbstack.dev/).

## **Installing FreshRSS locally**

Create a folder somewhere you can easily manage and navigate to in the terminal.

Create a new `docker-compose.yml` in that folder with the contents of:

```yaml
volumes:
  data:
  extensions:

services:
  freshrss:
    # Grab latest docker image from hub.docker.com
    image: freshrss/freshrss:latest
    container_name: freshrss
    hostname: freshrss
    restart: unless-stopped
    logging:
      options:
        max-size: 10m
    ports:
      - 8080:80
    # set up location for data persistence
    volumes:
      - data:/var/www/FreshRSS/data
      - extensions:/var/www/FreshRSS/extensions
    environment:
      TZ: America/New_York
      # cron syntax for: update every 30 minutes
      CRON_MIN: '*/30'
```


Let’s break down what’s happening here.

The first three lines define Docker volumes, which are persistent storage that live OUTSIDE the container. This is important as they’ll persist beyond the container starting and stopping (kinda important unless you want to re-index each feed\!)

We then define the `freshrss` service, point it to that fancy Docker Hub image, name it, set some reasonable defaults, attach it to a port, and then point to where the named volumes will be attached.

If you’re in a different timezone than East Coast US, change the `environment.TZ` field to match your location. If you’re not sure of the specific name, [find your timezone here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

## **Starting your local FreshRSS container**

Now navigate to that folder you created and run:

`docker compose up`

The container will spin up and bring you to the installation screen of FreshRSS. Follow the install instructions and PRESTO! Self-hosted RSS! (To stop the process, hit CTRL-C).

The app should be available at `http://localhost:8080/`

You can also run it in ‘detached’ mode with `docker compose up -d`, but you’ll need to remember to stop the container when you’re done. (I like keeping my containers attached in a terminal tab so I can remember what I have running.)

> **NOTE:** If you delete the container, you will also delete the data FreshRSS has been saving for you. Just start/stop, don’t destroy the container unless you also want to wipe your data. FreshRSS has lots of archiving options if you want to set up a backup system.

## **Time to fill it with some voices!**

Now that you have a locally running RSS reader, you need voices to fill it with\! I [publish a list of web industry voices](https://nathan-long.com/voices.xml) that I continually update. You can scan the list and pick what you want, or you can [download and import my OPML file](https://nathan-long.com/voices/feed.opml) to get your feeds started\!

## **A few RSS Tips**

As you add more and more voices, it can become overwhelming to keep track of them. To keep your feed from being stressful, I have found you have to **become OK with the idea that you will not read every post in your feed**. Really! It’s OK! I used to struggle with the feeling that I would “miss” something important, but those pieces tend to have a reverb effect across the blogosphere—if something’s important, it will show up in other places as well!

There are a few strategies I use when organizing my feed:

* If a person writes under a site name (like Harry Roberts at CSS Wizardry), consider labeling the feed by the author’s name so you start to get a feel for who’s writing what.
* Group voices by interest or industry topic (Design, a11y, etc) so that you can get a feel for what topics are emerging in what category.
* FreshRSS has an 'Important Feeds' visibility category you can set for the people you're most interested in hearing from to help cut through the noise.

And then a few tips for reading my feed:

* Scanning is your friend. Start with the titles and only move into the ones that interest you.
* If the unread numbers get really big, pick just one category or voice to start with. Scan the entries, read what’s interesting, and then mark everything else read. Rinse and repeat as time allows.

