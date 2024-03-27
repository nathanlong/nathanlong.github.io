---
title: ffmpeg Basics and Recipes
description:
date: 2024-03-27T12:44:55-0400
tags: [tooling]
---

Recently I wrote about [ffmpeg](https://www.ffmpeg.org/), a Swiss-army knife command-line utility for media. While I find it incredibly handy NOW, it took time to build up a working knowledge of the tool to handle certain tasks with confidence. The downside of having a versatile tool is that it can do an awful lot of things!

So let's break down how it works and I'll share some of my most common recipes for converting media.

## Installing

The easiest way to install (on a Mac) is with [homebrew](https://brew.sh/):

`brew install ffmpeg`

You can also download directly from [their site](https://ffmpeg.org/download.html), but that's a tad more involved. Homebrew drops it into your path, ready to go.

## Basics

An `ffmpeg` command will take:

1. An **input file,**
2. several sets of **options**,
3. and an **output file** to spit everything out into.

A basic command will look something like:

```bash
ffmpeg -i input-file {lots of options here} output-file
```

## Compression

One of the handiest things `ffmpeg` can do is give you fine-grained control over video compression. Not only can you pick the method of compression, you can choose what codec to use.

There are several methods of compression, but two of the main ones you'll see are:

* `-b:v` Sets a fixed **bitrate** of the output, measured in kb (ex. 1200kb) or megabytes (ex. 2M). You'll typically see values between 1200-6000kb. The lower the number, the less 'bits' will be used.
* `-crf` Sets a **Constant Rate Factor** (available for [x264](http://www.videolan.org/developers/x264.html), [x265](http://x265.org/) and [libvpx](https://www.webmproject.org/code/)). This is a smart value between 0 and 51 that attempts to vary the bitrate per frame for better-looking results (less artifacts). For x264, sane values are between 18 (better quality, larger file) and 28 (lower quality, larger file). The default is 23, so you can use this as a starting point.

Bitrates can get quite complicated but give you a lot of control. They're useful in situations for streaming videos or where you need to specify a minimum, maximum, or ensure a constant bitrate. Because I use `ffmpeg` to operate on smaller videos I gravitate towards `-crf` values.

Read more on [how CRF works](https://slhck.info/video/2017/02/24/crf-guide.html).

### Convert to h264 mp4

If you need to share a video, you can't go wrong with an mp4. It's widely supported and everything except ancient devices should be able to play it. Here's a good default compression recipe:

```bash
ffmpeg -i input.mov -c:v libx264 -crf 28 -preset very slow output.mp4
```

Option descriptions:

* `-c:v` selects the compression format to `libx264`
* `-crf 28` sets a decent constant rate factor.
* `-preset` sets a series of options that will provide a certain encoding speed to compression ratio, slower speeds mean more compression.

One benefit of H264 compression is it's FAST and pretty efficient. I can usually get a `.mov` file down to about 10% of its size with this recipe.

Read more about [H264 compression](https://trac.ffmpeg.org/wiki/Encode/H.264).

### Convert to webm

webm is now [fully supported in modern browsers](https://caniuse.com/webm) but is a little more finicky to encode, it's quite easy to set some options and wind up with large webm files. I find webm's to be slightly larger than well-compressed mp4s.

```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm
```

* `-c:v` selects the compression format to `libvpx-vp9` which is the latest webm codec.
* `-b:v` is set to 0 (required) to allow constant quality settings with:
* `-crf 30` which follows the CRF numbers outlined above

They recommend that you use a two-pass method on webm for the best results, but it is QUITE slow, so grab a coffee while you wait:

```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 0 -crf 30 -pass 1 -an -f null /dev/null && \
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 0 -crf 30 -pass 2 -c:a libopus output.webm
```

* `-pass {number}` lets it know that we're doing some multipass business here.
* `-f` forces output, in this case `null` to prevent the first pass from outputting anything
* `&&` is a normal bash/zsh command to run the second command if the first command is successful.

Read more on [VP9 compression here](https://trac.ffmpeg.org/wiki/Encode/VP9).

> **Heads Up!**
>
> When you do a two-pass encoding, the first pass will LOOK like nothing is happening, just be patient, it will eventually start showing progress and spit out your file.
>
> I'll also state that I haven't found much difference between the single pass and the double pass methods, but I also think I'm not operating at the size and length of video files to see the difference. If it's a smaller file, the single pass is probably good enough for your needs.

## Common Recipes

Now we've talked about compression, what are some other things you can do? Here are a few of the tasks I find myself running.

### Scale Video by Height

One of the easiest ways to shrink file size is to reduce the size of the video, especially if you've got a mondo-sized source file. To produce a 1080p video:

```bash
ffmpeg -i input.mp4 -vf scale=-1:1080 output.mp4
```

* `-vf` is an alias for `-filter:v` (video filter)
* `scale=-1:1080`resizes the video to ''whatever'' (the -1) by 1080 pixels high. If the video is 16:9, the width would then be 1920. If you ran `-1:720` the output would be 1280x720 for a 16:9 video.

> **Note:** Common resolutions for 16:9 video are: 1024×576, 1152×648, 1280×720, 1366×768, 1600×900, 1920×1080, 2560×1440 and 3840×2160. You can use these as some numbers to start with.

### Trim Video by Timecode

Sometimes you only need a slice of a video, or you need to just shave off the first few seconds of something. Here's how you trim by timecode:

```bash
ffmpeg -i input.mp4 -ss 00:01:02.500 -t 00:01:03.250 -c copy output.mp4
```

* `-ss` indicates start time in seconds (with decimals for sub-second times)
* `-to` is the end time in `hh:mm:ss` format
* `-c` copies existing formats

```bash
ffmpeg -i input.mp4 -ss 00:00:03 output.mp4
```

* Not providing a `-to` means it runs to the end of the file. This example will trim off the first 3 seconds of the file.

### Remove Audio

```bash
ffmpeg -i example.mp4 -c copy -an example-nosound.mp4
```

* `-an` removes audio
* `-c` copies existing formats

### Boost Volume

Note that this can work on audio files, not just videos.

```bash
ffmpeg -i input.wav -af "volume=1.5" output.wav
```

* `-af` set audio filters
* `volume=1.5` and boost the volume to 150% of the original. This can be proportional or in decibels: `volume=-5dB`

### Create a Poster Image

Embedding an HTML video and don't have a poster image? Rather than trying to awkwardly screengrab something, you can use this to create an image at a specific timestamp.

```bash
ffmpeg -i example.mp4 -ss 00:00:00.000 -vframes 1 'thumb.png'
```

* `-ss` seeks to where we’re pulling a frame (in this case, the start of the video)
* `-vframes` sets the number of frames to output
* `*.png` (in output file extension) converts it to a PNG image


## Advanced Recipes

Here are some of the more complicated recipes I use that string together some of the operations I've already covered.

### Create Ambient Video MP4

Need to load up a looping ambient video, but you're given a 200+MB file?

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset veryslow -vf scale=-1:720 -movflags +faststart -an output.mp4
```

* Uses H264 compression
* Uses a Constant Rate of 28
* Uses the `veryslow` preset for better compression
* Reduces to 1080x720 dimensions
* `-movflags +faststart` moves the metadata to the front of the video allowing immediate streaming (rather than waiting for the whole file to load)
* Removes audio channels since it will be playing muted.

### GIF to MP4

Want a GIF, but not with the filesize overhead?

```bash
ffmpeg -i animated.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" video.mp4
```

* `-movflags +faststart` to move metadata to the front for streaming
* `-pix_fmt yuv420p` use the pixel format of `yuv420p` which is a chroma subsampling scheme.
* `-vf` starts a filter. The formula in the string will upscale the resolution by 2x.

### MP4 to GIF

Going the other way is a bit more involved because we need to take a full-color video and restrict it to 256 colors for a GIF. First, we'll need to generate a color palette from the video:

```bash
ffmpeg -i input.mp4 -y -ss 10 -vf fps=10,scale=320:-1:flags=lanczos,palettegen palette.png
```

* Generates a PNG color palette
* `-ss` seeks to timecode for what frame to sample the palette from

Then, using that palette, we'll convert the video into the best-fit gif.

```bash
ffmpeg -i input.mp4 -i palette.png -filter_complex "fps=10,scale=-1:480:flags=lanczos[x];[x][1:v]paletteuse" output.gif
```

* Notice the two inputs, we grab the video and the palette
* `-filter-complex` Sets up a filter that: sets the fps to 10, scales it to 480 pixels high, and uses the palette we specified earlier.

### Max Compatibility

I hardly use this recipe anymore since MOST devices can handle mp4's just fine. But just in case you need to get something running on an older device:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -b:a 128k -movflags +faststart output.mp4
```

* H.264 video and AAC audio is the best combination for broad support. Ancient browsers that do not have H.264 decoders however will need a VP8/Vorbis video.
* The `-profile:v` baseline and `-level 3.0` options are only needed for old mobile devices that cannot handle CPU-intensive features of H.264.
* Uses a constant rate of 23.
* `-movflags +faststart` moves the metadata to the front of the video allowing immediate streaming

---

If you've come across other recipes, or you see a way how these could be improved, shoot me a note! I'm constantly improving and adding to this list.
