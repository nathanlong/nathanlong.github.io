---
title: Responsive Ambient Videos with AV1 and HEVC/H.265 Compression
description: Encode and compress videos like it's 2026
date: 2026-01-13T10:04:09-0500
tags: [tooling]
---

Ambient videos, or "short looping videos as a background element," are both common and tricky to get right. They can add a lot of visual texture to a design, but are often large, chunky elements that can slow down your performance.

But this is 2026! We have some new tools to help with video compression! We're going to utilize some of the techniques [Evil Martians demonstrated with AV1 encoding](https://evilmartians.com/chronicles/better-web-video-with-av1-codec) and combine them with responsive video techniques that [Scott Jehl explains well](https://scottjehl.com/posts/using-responsive-video/) over on his blog.

There are a few assumptions I'm making: you will be processing the video manually, and you have `ffmpeg` installed (I recommend [Homebrew](https://brew.sh/) on a Mac).

At the end of this, we'll have:

- A vertically formatted AV1 (for mobile)
- A vertically formatted HEVC/H.265 (mobile fallback)
- 720p AV1 (for tablet/small desktop)
- 720p HEVC/H.265 (tablet/small desktop fallback)
- 1080p AV1 (large desktop)
- 1080p HEVC/H.265 (large desktop fallback)
- A poster image generated from the first frame of the video

We'll tie it all together in an HTML `<video>` element and implement some accessibility features.


## Disclaimer

But first... a disclaimer:

**No amount of compression is going to make a 180+ second video performant as an ambient video! Optimization starts at the communication level.**

If an ambient video is being considered, consider the following guidelines:

- 20 seconds or less.
- Avoid wide-panning, rotating, or otherwise big movement shots (helps prevent folks from getting motion-sick or just being jarring in general).
- Avoid flashes if possible (3 or fewer per second per [WCAG SC 2.3.1](https://www.digitala11y.com/understanding-sc-2-3-1-three-flashes-or-below-threshold/)).
- Start with the highest resolution output feasible (as it makes it easier to slice and dice).

Once we have a reasonable starting point, we can work on smooshing these down to a nice size.


## AV1

AV1 is our champion video compression codec that does [some smart things](https://people.xiph.org/~xiphmont/demo/av1/demo1.shtml) to reduce filesize. But as with all nice, new things, it's [not fully supported yet](https://caniuse.com/av1).

To make an AV1 from our reasonable starting point, we can run the following:

```bash
ffmpeg -i INPUT.mov -map_metadata -1 -an -c:v libsvtav1 -qp 40 -tile-columns 2 -tile-rows 2 -pix_fmt yuv420p -movflags +faststart -vf scale=-1:1080 output.av1.1080.mp4
```

Here's a breakdown of what's happening:

- `-i INPUT.mov` sets the source video file for input. FFmpeg will take video and audio streams from this file, convert them, and pack them into a new container.

- `-map_metadata -1` will remove video metadata (like the name of a tool that was used initially to create a video). Sometimes metadata is useful, but for web development, this is rarely the case.

- `-an` removes all audio. It will be muted to allow looping anyway.

- `-c:v libsvtav1` selects the AV1 video codec.

- `-qp 40` sets your size/quality balance for AV1. Lower numbers mean better quality and bigger size.

- `-tile-columns 2 -tile-rows 2` is for speed enhancements at the cost of a small loss in compression efficiency.

- `-pix_fmt yuv420p` sets a pixel format that helps reduce filesize by using full resolution for brightness and a smaller resolution for color. Read up on [chroma subsampling](https://en.wikipedia.org/wiki/Chroma_subsampling) to learn more. Pretty wild!

- `-movflags +faststart` moves the important information to the beginning of the file. It allows the browser to start playing while the video is still downloading.

- `-vf scale=-1:1080` Scales down the image to whatever by 1080 pixels. If you want a different size, put in the desired height instead of 1080.

- `output.av1.1080.mp4` sets the name for the output file. Why an MP4? Aren't we making AV1's?! We are! But MP4 is a CONTAINER format, and it's the most widely supported one. Just like in life, it's what's on the inside that matters.

You will likely need to adjust the `-qp` settings and your output resolutions to get the right mix.

## HEVC/H.265

We still need a fallback, but we don't have to go all the way back to H.264. Safari supports the [HEVC/H.265 codec](https://caniuse.com/hevc), which is like H.264 but ... sleeker. 30-50% smaller than H.264 (with AV1 being 30% smaller than HEVC).

This one is going to take much longer, so grab some coffee and run:

```bash
ffmpeg -i INPUT.mov -map_metadata -1 -an -c:v libx265 -crf 28 -preset veryslow -pix_fmt yuv420p -movflags +faststart -tag:v hvc1 -vf scale=-1:1080 video.hevc.mp4
```

Many of the same flags appear as before, but there are a few new ones:

- `-c:v libx265` selects the HEVC/H.265 codec
- `-preset veryslow` forces HEVC/H.265 codec to generate a smaller video file even if it will be much longer.
- `-crf 28` stands for 'Constant Rate Factor' and sets your size/quality balance. Lower numbers mean better quality and bigger size. The CRF scale goes from 0 to 51.

Again, you may need to adjust your `-crf` rate to get the right amount of compression and quality. The output resolution should match the AV1 file.

## Small Desktop / Tablet Versions

To generate smaller videos, reuse the same commands from before, but change your scaling command. Something like:

`-vf scale=-1:720`

This will output videos that are 720 pixels tall.

If your video is a weird size, you may get errors if the numbers don't divide cleanly when scaling down. If that happens, choose a new size or run the math on your own to find what numbers are going to work.

## Mobile Versions

Most likely, your starting video will be in a wide 16:9 format, but that's a good amount of pixels you'll never see on a mobile screen! We're going to make a vertical crop of the video to minimize our wasted pixels.

```bash
ffmpeg -i INPUT.mov -vf "crop=ih*9/16:ih" -c:a copy output.vertical.mp4
```

- `-vf "crop=ih*9/16:ih"` Calculates the new width based on the input height (ih) to maintain a 9:16 aspect ratio. Since x and y coordinates are not specified, ffmpeg defaults to cropping from the center of the frame (which is what we want). If you want a different ratio, enter your own numbers instead of `9/16`, where the first number is the width and the second is the height.
- `-c:a copy` Not strictly necessary, it just copies any audio settings without modifying them.

Now that we have a vertical file, we can make AV1 and HEVC/H.265 videos like the previous steps. Since we have less overall data, you can likely get away with something like `-vf scale=-1:1620` to give those high-density pixel displays a nice video while still being small.

## Making a poster image

We also need a static poster image that will display if the video is loading over slow connections:

```bash
ffmpeg -i INPUT.mov -ss 00:00:00.000 -vframes 1 thumb.png
```

* `-ss 00:00:00.000` seeks to a specific timestamp in the video. Here's it at the very beginning.
* `-vframes 1` tells ffmpeg output one frame.
* `thumb.png` saves that frame as a PNG.

You'll want to size and compress that image into a reasonable format (WEBP or AVIF). Smaller is better here.


## Rendering the video

Now that we have all the pieces, we can load them into a `video` element:

```html
<video autoplay playsinline muted loop
  poster="/assets/video/output.poster.avif">
  <source
    src="/assets/video/output.vert.av1.1280.mp4"
    media="(max-width: 769px)" type="video/mp4;
    codecs=av01.0.05M.08,opus"
  />
  <source
    src="/assets/video/output.vert.hevc.1280.mp4"
    media="(max-width: 769px)"
    type="video/mp4; codecs=hvc1"
  />
  <source
    src="/assets/video/output.av1.720.mp4"
    media="(max-width:1441px)"
    type="video/mp4; codecs=av01.0.05M.08,opus"
  />
  <source
    src="/assets/video/output.hevc.720.mp4"
    media="(max-width:1441px)"
    type="video/mp4; codecs=hvc1"
  />
  <source
    src="/assets/video/output.av1.1080.mp4"
    type="video/mp4; codecs=av01.0.05M.08,opus"
  />
  <source
    src="/assets/video/output.hevc.1080.mp4"
    type="video/mp4; codecs=hvc1"
  />
</video>
```

Ensure these attributes are on your `<video>` element:

* `autoplay` starts the video as soon as there is enough data to do so.
* `playsinline` tells the browser that the video is to be played in the element's playback area. Required for ambient videos in Safari.
* `muted` Insures no audio is output. Required by all browsers to autoplay.
* `loop` Restarts the video when it reaches the end.
* `poster` points to the image to load while the video is loading or if no data can be provided.

And in addition to `src` on our `<source>` elements, we set:

* `media` which allows media queries, just like the `<picture>` element. No match-y no load-y.
* `type="codecs=av01.0.05M.08,opus"` tells the browser this is an AV1 video
* `type="video/mp4; codecs=hvc1"` tells the browser this is an HEVC/H.265 video.

Note that I used `max-width` queries, but you could just as easily build them with `min-width` queries; just be aware that the browser will use the first item that matches.

## A11Y Considerations

We have an ambient video, but there's still some accessibility we need to ensure. There are two features we need to enable.

The [WCAC SC 2.2.2 "Pause, Stop, Hide"](https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-pause.html) criteria states that something longer than 5 seconds (which we likely qualify for) needs some sort of control to stop the motion. The simplest implementation is a play/pause toggle button.

How you enable it will vary on how you're handling interactivity on your project, but a very simple Vanilla JavaScript implementation could look like:


```javascript
// the awesome button you made to toggle the video
const videoToggleButton = document.querySelector("your-button-selector-here");

// the video itself
const video = document.querySelector("your-video-selector-here")

// toggle the play state of the video
const handleVideoToggle = () => {
  video?.paused ? video?.play() : video?.pause();
  // also whatever you're doing to toggle the play/pause icons
}

// listen for clicks
videoToggleButton?.addEventListener("click", handleVideoToggle);
```

This is over-simplified, but you get the idea. Change the selector to whatever you're using to identify your elements.

Also, unless your video is extremely subtle, we need to prevent it from autoplaying if users have [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) set. You COULD hide it with a CSS media query, but 'reduced motion' does not mean 'no motion'. I prefer that users have the option to still engage with it as they want.

```javascript
// Check if the prefers-reduced-motion media query matches 'reduce'
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// grab the video if you haven't already
const video = document.querySelector("your-selector-here")

if (prefersReducedMotion && video) {
  this.video?.pause();
  this.video?.removeAttribute("autoplay");
  // also whatever you're doing to toggle the play/pause icons
}
```

And there we have it: a responsive, accessible, highly compressed ambient video!
