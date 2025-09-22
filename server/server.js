import express from "express";
import cors from "cors";
import { unfurl } from "unfurl.js";

export const createServer = async () => {
  try {
    const server = express();

    server.use(cors());
    server.use(express.json());

    server.get("/api/preview", async (req, res) => {
      try {
        const { url } = req.query;

        const metadata = await unfurl(url);

        res.json(metadata);
      } catch (error) {
        console.error("Preview error:", error);
        res.status(500).json({
          error: "Failed to fetch preview",
          message: error.message,
        });
      }
    });

    server.post("/api/previews", async (req, res) => {
      try {
        const { urls } = req.body;

        const results = await Promise.all(
          urls.map(async (url) => {
            try {
              const metadata = await unfurl(url);

              return { url, metadata, success: true };
            } catch (error) {
              return { url, error: error.message, success: false };
            }
          })
        );

        res.json(results);
      } catch (error) {
        res.status(500).json({ error: "Failed to process URLs" });
      }
    });

    server.get("/test", (req, res) => {
      res.json({ message: "Server working" });
    });

    // Find available port function
    const findAvailablePort = async (startPort = 3007) => {
      const net = await import("net");

      return new Promise((resolve) => {
        const server = net.createServer();

        server.listen(startPort, () => {
          const port = server.address().port;
          server.close(() => resolve(port));
        });

        server.on("error", () => {
          resolve(findAvailablePort(startPort + 1));
        });
      });
    };

    const port = await findAvailablePort(3007);

    server.listen(port, () => {
      console.log(`☦️ Server running on http://localhost:${port}`);
    });

    return { server, port };
  } catch (error) {
    console.error("Server failed:", error);
    throw error;
  }
};
