<?xml version="1.0" encoding="utf-8"?>
<!--
This is a custom XSL stylesheet based off of these examples:

- https://darekkay.com/blog/rss-styling/
- https://daverupert.com/atom.xml
-->

<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>RSS Feed - <xsl:value-of select="/atom:feed/atom:title"/></title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/css/index.css"/>
        <style type="text/css">
          img { max-width: 100%; }
          body { --gap: 5vw; margin: 0; line-height: 1.7; }
          h1,h2,h3 { margin-block-start: 0; margin-block-end: 0; }
          .pb-5 { padding-bottom: calc(var(--gap) / 2); }
          .meta { color: #676767; }
          .container { display: grid; gap: var(--gap); max-width: 60rem; width: 95%; margin: auto; }
          .intro { background-color: #2ac3de; margin-block-end: var(--gap); padding-block: calc(var(--gap) / 2); }
          .intro .container { gap: 1rem; grid-template-columns: 4fr 2fr; align-items: top; }
          @media (min-width: 40rem) {
            .intro .container { grid-template-columns: 4fr 1fr; align-items: center; }
          }
          .recent { padding-block-end: var(--gap); }
        </style>
      </head>
      <body>
        <nav class="intro text-content">
          <div class="container">
            <div>
              <p class="mb-1">This is my RSS feed. You can <strong>Subscribe</strong> by copy-pasting the URL into your RSS feed reader. (Or use the <a href="/feed/feed.json">JSON version</a>) </p>
              <small class="mb-1 block">
                Visit <a href="https://aboutfeeds.com">About Feeds</a> to get started with newsreaders and subscribing. It’s free.
              </small>
            </div>
            <img src="https://user-images.githubusercontent.com/623568/248300444-9c102e35-b15c-41aa-b455-2e0893593391.gif" alt="Kirby inhaling everything into the black hole of his stomach" style="transform:scaleX(-1);"/>
          </div>
        </nav>
        <main class="container text-content">
          <header>
            <h1 class="flex items-center gap-1/4">
              <svg class="" width="1em" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="logo-path" fill-rule="evenodd" clip-rule="evenodd" d="M26.6213 1.87259C25.4497 0.701019 23.5502 0.701018 22.3787 1.87259L1.87258 22.3787C0.701003 23.5503 0.701003 25.4498 1.87258 26.6213L22.3787 47.1274C23.5502 48.299 25.4497 48.299 26.6213 47.1274L47.1274 26.6213C48.299 25.4498 48.299 23.5503 47.1274 22.3787L26.6213 1.87259ZM30.1666 31.472C30.8226 31.824 31.5826 32 32.4466 32H36.6466V29.288H32.6626C32.1826 29.288 31.7986 29.152 31.5106 28.88C31.2386 28.592 31.1026 28.208 31.1026 27.728V14.48H23.8786V17.192H28.1026V27.728C28.1026 28.576 28.2866 29.328 28.6546 29.984C29.0226 30.624 29.5266 31.12 30.1666 31.472ZM12.848 18.8V32H15.848V23.744C15.848 22.912 16.056 22.272 16.472 21.824C16.904 21.376 17.488 21.152 18.224 21.152C18.976 21.152 19.56 21.368 19.976 21.8C20.392 22.232 20.6 22.848 20.6 23.648V32H23.6V23.336C23.6 21.88 23.208 20.72 22.424 19.856C21.656 18.992 20.624 18.56 19.328 18.56C18.224 18.56 17.352 18.864 16.712 19.472C16.228 19.9436 15.9317 20.5596 15.8231 21.32H15.776V18.8H12.848Z" fill="#9ECE6A"/>
              </svg>
              <span>nathan-long.com</span>
            </h1>
            <p class="py-1">
              <xsl:value-of select="/atom:feed/atom:subtitle"/>
            </p>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/atom:feed/atom:link[2]/@href"/>
              </xsl:attribute>
              Visit Website &#x2192;
            </a>
          </header>

          <section class="recent">
            <h2>Recent blog posts</h2>
            <xsl:for-each select="/atom:feed/atom:entry">
              <div class="pb-5">
                <div class="text-4 font-bold">
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="atom:link/@href"/>
                    </xsl:attribute>
                    <xsl:value-of select="atom:title"/>
                  </a>
                </div>

                <div class="color-gray text-small">
                  Published on
                  <xsl:value-of select="substring(atom:updated, 0, 11)" />
                </div>
              </div>
            </xsl:for-each>
          </section>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
