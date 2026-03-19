// Fetches recent Google News articles for a given topic using Google News RSS.
// No API key required. Uses the public Google News RSS feed.

export async function POST(request) {
  try {
    const { keywords } = await request.json();

    if (!keywords || keywords.length === 0) {
      return Response.json({ articles: [], error: "No keywords provided." });
    }

    const query = encodeURIComponent(keywords.join(" "));
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Lighthouse/1.0)",
      },
    });

    if (!res.ok) {
      return Response.json({ articles: [], error: `Google News returned ${res.status}` });
    }

    const xml = await res.text();

    // Parse RSS XML (simple regex-based parser for RSS items)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const itemXml = match[1];

      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const pubDate = extractTag(itemXml, "pubDate");
      const source = extractTag(itemXml, "source");

      if (title && link) {
        items.push({
          title: decodeHtmlEntities(title),
          link,
          source: source ? decodeHtmlEntities(source) : null,
          pubDate: pubDate || null,
          timeAgo: pubDate ? getTimeAgo(new Date(pubDate)) : null,
        });
      }
    }

    return Response.json({ articles: items });
  } catch (error) {
    console.error("Trending fetch error:", error);
    return Response.json({ articles: [], error: error.message });
  }
}

function extractTag(xml, tag) {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = xml.match(regex);
  return m ? m[1].trim() : null;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
