import express from "express";
import cors from "cors";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/preview", async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({ error: "URL required" });
      }

      const response = await fetch(url);

      const html = await response.text();
      const metadata = parseMetadata(html, url);

      res.json(metadata);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch preview",
        message: error.message,
      });
    }
  });

  const server = app.listen(3001, () => {
    console.log("Server running on port 3001");
  });

  return server;
}

function parseMetadata(html, originalUrl) {
  const getMetaContent = (property) => {
    const patterns = [
      new RegExp(
        `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
        "i"
      ),
      new RegExp(
        `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
        "i"
      ),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getTitle = () => {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
  };

  return {
    title: getMetaContent("og:title") || getTitle() || "No title",
    description:
      getMetaContent("og:description") || getMetaContent("description") || "",
    image: getMetaContent("og:image") || "",
    url: getMetaContent("og:url") || originalUrl,
    siteName: getMetaContent("og:site_name") || new URL(originalUrl).hostname,
  };
}
