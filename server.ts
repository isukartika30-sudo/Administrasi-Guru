import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // API Gemini Proxy Route
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, userApiKey, responseSchema, jsonOutput } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Priority: Custom API key passed from request header/body -> Server env variable
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "API Key Gemini belum dikonfigurasi. Sediakan GEMINI_API_KEY di lingkungan server atau masukkan API Key di menu Pengaturan.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const config: any = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (jsonOutput) {
        config.responseMimeType = "application/json";
      }
      if (responseSchema) {
        config.responseSchema = responseSchema;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      return res.json({
        text: response.text || "",
        success: true,
      });
    } catch (error: any) {
      console.error("Error generating AI content:", error);
      return res.status(500).json({
        error: error?.message || "Terjadi kesalahan saat memproses permintaan AI.",
        success: false,
      });
    }
  });

  // Vite Middleware for Development vs Static for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Administrasi Guru running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
