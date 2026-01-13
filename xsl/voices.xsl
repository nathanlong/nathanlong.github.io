<?xml version="1.0" encoding="utf-8"?>

<!--
This is an XSL stylesheet that takes the OPML export from Feedly and converts it to a sorted list of websites.

The goal is to:
- Expose interesting voices on the web and encourage discovery
- Keep it easy to maintain (ingest OPML with minimal modification)
-->

<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/opml">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>Voices - Nathan Long</title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/css/styles.css"/>
        <style type="text/css">
        </style>
      </head>
      <body>
        <!-- this is to preserve color settings from elsewhere on my site, remove if you're pulling this for your own -->
        <script>
          // Prevent FART (look it up) by blocking render for a tiny bit...
          // First check for local settings, then check media queries, then apply fallback
          function getColor() {
            const colorPref = window.localStorage.getItem('color-mode');
            if (typeof colorPref === 'string') {
              return colorPref;
            }
            const mql = window.matchMedia('(prefers-color-scheme: dark)');
            if (typeof mql.matches === 'boolean') {
              return mql.matches ? 'dark' : 'light';
            }
            return 'light';
          }

          function getMotion() {
            const motionPref = window.localStorage.getItem('motion-mode');
            if (typeof motionPref === 'string') {
              return motionPref;
            }
            const mql = window.matchMedia('(prefers-reduced-motion: no-preference)');
            if (typeof mql.matches === 'boolean') {
              return mql.matches ? 'no-preference' : 'reduced'
            }
            return 'no-preference';
          }

          function getParty() {
            const partyPref = window.localStorage.getItem('party-mode')
            if (typeof partyPref === 'string') {
              return partyPref;
            }
            return 'no-party';
          }

          const colorMode = getColor();
          const motionMode = getMotion();
          const partyMode = getParty();
          const root = document.documentElement;
          root.classList.add(colorMode, partyMode, motionMode);
          root.style.setProperty('--play-state', motionMode === "reduced" ? "paused" : "running")
          root.style.setProperty('--transition-toggle', motionMode === "reduced" ? "0" : "1")
        </script>
        <main class="content text-content flow mb-4">
          <a class="absolute top-1/2 left-1 text-small" href="/">← Return to Site</a>

          <section class="mt-content text-center">
            <h1 class="mb-1/4">Web Voices</h1>
            <p>A Collection of Websites and Feeds from the Web Industry</p>
            <p class="text-small">Download the <a href="/voices/feed.opml">OPML file</a> to import into your feed reader of choice.</p>
            <p class="text-small color-reduced">Updated on <xsl:value-of select="substring(head/dateCreated, 6, 11)"/></p>
          </section>
          <xsl:for-each select="body/outline">
            <xsl:sort select="@text" order="ascending" />
            <fieldset class="feature border-1 border-divider leading-md">
              <legend class="p-1/2 font-bold font-thin heading-200"><xsl:value-of select="@text"/></legend>
              <ul class="p-1 pl-2 two-columns-md">
                <xsl:for-each select="outline">
                  <xsl:sort select="@text" order="ascending" />
                  <li class="mb-1/2 flex-col break-inside-avoid">
                    <strong>
                      <xsl:value-of select="@text"/>
                    </strong>
                    <div>
                    <xsl:choose>
                      <xsl:when test="@htmlUrl">
                        <a href="{@htmlUrl}">Website</a>
                      </xsl:when>
                    </xsl:choose>
                    <xsl:choose>
                      <xsl:when test="@htmlUrl and @xmlUrl">
                        <span> - </span>
                      </xsl:when>
                    </xsl:choose>
                    <xsl:choose>
                      <xsl:when test="@xmlUrl">
                        <a href="{@xmlUrl}">Feed</a>
                      </xsl:when>
                    </xsl:choose>
                    </div>
                  </li>
                </xsl:for-each>
              </ul>
            </fieldset>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
