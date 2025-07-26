import express from "express";
import cors from "cors";

export const createServer = async () => {
  try {
    const server = express();

    // FIX
    console.log("Starting Express server...");

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

        console.log("Metadata parsed:", metadata);
        res.json(metadata);
      } catch (error) {
        console.error("Preview error:", error);
        res.status(500).json({
          error: "Failed to fetch preview",
          message: error.message,
        });
      }
    });

    server.get("/test", (req, res) => {
      // FIX
      console.log("Test endpoint hit");

      res.json({ message: "Server working" });
    });

    // IDEA: create a function that find available port
    const port = 3007;

    server.listen(port, () => {
      // FIX
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    // FIX
    console.error("Server failed:", error);
  }
};

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
