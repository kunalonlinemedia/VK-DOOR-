import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ override: true });

import apiApp from "./api/index";

const app = express();
const PORT = 3000;

app.use(apiApp);

// Mounting Vite in Dev, serving static in Prod
if (process.env.NODE_ENV !== "production") {
  import("vite").then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteServer.middlewares);
    startServer();
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  startServer();
}

function startServer() {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
