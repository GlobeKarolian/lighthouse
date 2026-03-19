// Fetches SEO guidelines from a public Google Doc.
// The doc must be published to the web (File > Share > Publish to web) as plain text.
// Set SEO_GUIDELINES_DOC_ID in your environment variables to enable this.
//
// To get the doc ID: open the Google Doc, the URL looks like
// https://docs.google.com/document/d/XXXXXXXXX/edit
// The XXXXXXXXX part is the doc ID.

export async function GET() {
  const docId = process.env.SEO_GUIDELINES_DOC_ID;

  if (!docId) {
    return Response.json({ guidelines: null, source: "default" });
  }

  try {
    // Fetch the published-to-web version as plain text
    const url = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min

    if (!res.ok) {
      console.error("Failed to fetch SEO guidelines doc:", res.status);
      return Response.json({ guidelines: null, source: "default", error: "Could not fetch Google Doc. Make sure it is published to the web." });
    }

    const text = await res.text();

    if (!text || text.trim().length < 50) {
      return Response.json({ guidelines: null, source: "default", error: "Google Doc appears empty." });
    }

    return Response.json({ guidelines: text.trim(), source: "google_doc" });
  } catch (error) {
    console.error("SEO guidelines fetch error:", error);
    return Response.json({ guidelines: null, source: "default", error: error.message });
  }
}
