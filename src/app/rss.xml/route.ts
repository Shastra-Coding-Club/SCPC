import { NextResponse } from 'next/server'

export async function GET() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SCPC - Shastra Competitive Programming Competition</title>
    <link>https://tcet-shastra.online</link>
    <description>Updates and news from SCPC - Shastra Competitive Programming Competition at TCET Mumbai</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://tcet-shastra.online/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://res.cloudinary.com/divj3y2cp/image/upload/f_auto,q_auto/v1/scpc-team/scpc</url>
      <title>SCPC Logo</title>
      <link>https://tcet-shastra.online</link>
    </image>

    <item>
      <title>SCPC 2026 Registration Open</title>
      <link>https://tcet-shastra.online</link>
      <description>Join SCPC 2026, a 12-hour competitive programming hackathon at TCET Mumbai. ₹60,000 prize pool, 500+ coders nationwide. Register now!</description>
      <pubDate>${new Date('2026-01-23').toUTCString()}</pubDate>
      <guid isPermaLink="true">https://tcet-shastra.online/#registration</guid>
      <category>Competitive Programming</category>
      <category>Hackathon</category>
    </item>

    <item>
      <title>SCPC 2026 Event Details Announced</title>
      <link>https://tcet-shastra.online/#about</link>
      <description>SCPC 2026 will be held on March 13, 2026 at TCET Campus, Mumbai. The event features online qualifier, offline hackathon, and ICPC-style finale.</description>
      <pubDate>${new Date('2026-01-20').toUTCString()}</pubDate>
      <guid isPermaLink="true">https://tcet-shastra.online/#about</guid>
      <category>Event</category>
    </item>
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
