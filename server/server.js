import express from "express";
import cors from "cors";

export const createServer = async () => {
  try {
    const server = express();

    server.use(cors());
    server.use(express.json());

    server.get("/api/preview", async (req, res) => {
      try {
        const { url } = req.query;

        if (!url || typeof url !== "string") {
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

    server.get("/test", (req, res) => {
      res.json({ message: "Server working" });
    });

    // IDEA: create a function that find available port
    const port = 3007;

    server.listen(port, () => {});
  } catch (error) {
    console.error("Server failed:", error);
  }
};

createServer();

const getMetaContent = (html, property) => {
  const patterns = [
    new RegExp(
      `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const getTitle = (html) => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
};

const getFavicon = (html, baseUrl) => {
  const patterns = [
    /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']*)["']/i,
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']icon["']/i,
    /<link[^>]*rel=["']shortcut icon["'][^>]*href=["']([^"']*)["']/i,
    /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']shortcut icon["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const href = match[1].trim();
      if (!href) continue;

      try {
        return href.startsWith("http") ? href : new URL(href, baseUrl).href;
      } catch (e) {
        continue;
      }
    }
  }

  try {
    return new URL("/favicon.ico", baseUrl).href;
  } catch (e) {
    return null;
  }
};

function parseMetadata(html, url) {
  return {
    url,
    title: getMetaContent(html, "og:title") || getTitle(html) || null,
    favicon: getFavicon(html, url) || null,
    siteName: getMetaContent(html, "og:site_name") || new URL(url).hostname,
  };
}
