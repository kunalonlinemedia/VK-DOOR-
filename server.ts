import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface LookbookItem {
  id: number;
  title: string;
  category: string;
  woodType: string;
  customImage?: string;
}

const PRESET_DESIGNS: LookbookItem[] = [
  { id: 1, title: "Teakwood Royal Arch Entrance", category: "Double Entrance", woodType: "Premium CP Teak Wood" },
  { id: 2, title: "Classic CNC Grooved Panel", category: "Single Main", woodType: "Ivory Hardwood" },
  { id: 3, title: "Double-Leaf Colonial Grand", category: "Double Entrance", woodType: "Himalayan Cedar" },
  { id: 4, title: "Modern Minimalist Horizontal Slate", category: "Interior Luxury", woodType: "African Wenge Veneer" },
  { id: 5, title: "Artisanal Carved Peacock Grandeur", category: "Religious & Royal", woodType: "Desi Sagwan Teak" },
  { id: 6, title: "Veneer Flush Minimal Panel", category: "Bedroom Single", woodType: "Burma Teak Veneer" },
  { id: 7, title: "Heavy Duty Sheesham Chaukhat", category: "Frame Included", woodType: "Indian Rosewood (Sheesham)" },
  { id: 8, title: "Retro Glass-Framed French Entry", category: "Single Patio", woodType: "White Ashwood" },
  { id: 9, title: "Exquisite Designer Brass Pivot", category: "Modern Pivot", woodType: "Golden Walnut Wood" },
  { id: 10, title: "Standard Hardwood Flush Door", category: "Heavy Duty Core", woodType: "Engineered Red Meranti" },
  { id: 11, title: "Contemporary Geometrical Slices", category: "Art Deco", woodType: "American Cherrywood" },
  { id: 12, title: "Crafted Solid Wood Villa Maindoor", category: "Villa Special", woodType: "Select CP Teak" },
  { id: 13, title: "Traditional Indian Temple Entrance", category: "Religious & Royal", woodType: "Sacred Sandalwood & Teak" },
  { id: 14, title: "Industrial Pivot Reinforced Panels", category: "Modern Pivot", woodType: "Smoked Oakwood" },
  { id: 15, title: "Acoustic Noise-Reduction Panel", category: "Interior Luxury", woodType: "Multi-layered Walnut" },
  { id: 16, title: "Diamond Cut Solid Block Panel", category: "Single Main", woodType: "Sudan Mahogany" },
  { id: 17, title: "Classic Architraved Bedroom Suite", category: "Bedroom Single", woodType: "Maple Cherry Wood" },
  { id: 18, title: "Rustic Antique Sliding Barnway", category: "Sliding Panel", woodType: "Reclaimed Pine & Spruce" },
  { id: 19, title: "Art Deco Arch Modernist Passage", category: "Single Main", woodType: "Santos Rosewood" },
  { id: 20, title: "Luxurious Gold-Inlay Teak Panel", category: "Double Entrance", woodType: "Elite Burma Teak" }
];

const DB_FILE = path.join(process.cwd(), "lookbook-db.json");

// Helper to loads items
function loadLookbookItems(): LookbookItem[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const dataStr = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(dataStr) as LookbookItem[];
    }
  } catch (error) {
    console.error("Failed to load lookbook-db.json:", error);
  }
  return [...PRESET_DESIGNS];
}

// Helper to save items
function saveLookbookItems(items: LookbookItem[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write lookbook-db.json:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create uploads directory for 100% free local image hosting
  const UPLOADS_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  // Serve raw uploads from local storage static mount
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Body parser setup to process high-res compressed base64 images securely
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: get lookbook items
  app.get("/api/lookbook-items", (req, res) => {
    try {
      const items = loadLookbookItems();
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: "Could not load lookbook items." });
    }
  });

  // API Route: get Storage & ImgBB config
  app.get("/api/storage-config", (req, res) => {
    try {
      const configFile = path.join(process.cwd(), "storage-config.json");
      if (fs.existsSync(configFile)) {
        const configStr = fs.readFileSync(configFile, "utf-8");
        const config = JSON.parse(configStr);
        return res.json({ configured: !!config.imgbbApiKey, config });
      }
      return res.json({ configured: false, config: { imgbbApiKey: "" } });
    } catch (error) {
      console.error("Failed to read storage config:", error);
      res.json({ configured: false, config: { imgbbApiKey: "" } });
    }
  });

  // API Route: save Storage & ImgBB config
  app.post("/api/storage-config", (req, res) => {
    try {
      const { imgbbApiKey } = req.body;
      const configData = {
        imgbbApiKey: imgbbApiKey ? imgbbApiKey.trim() : ""
      };

      const configFile = path.join(process.cwd(), "storage-config.json");
      fs.writeFileSync(configFile, JSON.stringify(configData, null, 2), "utf-8");

      res.json({ success: true, config: configData });
    } catch (error) {
      console.error("Failed to save storage config:", error);
      res.status(500).json({ error: "Failed to write storage configuration." });
    }
  });

  // API Route: save or update lookbook item
  app.post("/api/lookbook-items", async (req, res) => {
    try {
      const { id, customImage } = req.body;
      if (id === undefined) {
        return res.status(400).json({ error: "Missing lookbook item ID" });
      }

      let processedImage = customImage;

      // Handle raw base64 image decoding and saving
      if (customImage && customImage.startsWith("data:image/")) {
        let uploadedUrl = "";
        
        // 1. Try ImgBB if configured in storage-config.json
        try {
          const configFile = path.join(process.cwd(), "storage-config.json");
          let imgbbApiKey = "";
          if (fs.existsSync(configFile)) {
            const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
            imgbbApiKey = config.imgbbApiKey || "";
          }
          const apiKey = imgbbApiKey || process.env.IMGBB_API_KEY;
          if (apiKey) {
            const base64Clean = customImage.replace(/^data:image\/\w+;base64,/, "");
            const formData = new URLSearchParams();
            formData.append("image", base64Clean);

            const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            });
            if (uploadRes.ok) {
              const uploadData: any = await uploadRes.json();
              if (uploadData && uploadData.success && uploadData.data && uploadData.data.url) {
                uploadedUrl = uploadData.data.url;
                console.log("Saved dynamically via ImgBB Free Cloud:", uploadedUrl);
              }
            } else {
              const errText = await uploadRes.text();
              console.error("ImgBB upload error response, falling back locally:", errText);
            }
          }
        } catch (err) {
          console.error("ImgBB Cloud save warning, using internal server fallback:", err);
        }

        // 2. Fallback to Local Server file writing if ImgBB upload not configured or failed
        if (!uploadedUrl) {
          try {
            const base64Clean = customImage.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Clean, "base64");
            const fileName = `door-${id}-${Date.now()}.jpg`;
            const filePath = path.join(UPLOADS_DIR, fileName);

            // Clean up old local physical files for this exact ID to save disk space
            try {
              if (fs.existsSync(UPLOADS_DIR)) {
                const oldFiles = fs.readdirSync(UPLOADS_DIR);
                for (const oldFile of oldFiles) {
                  if (oldFile.startsWith(`door-${id}-`)) {
                    fs.unlinkSync(path.join(UPLOADS_DIR, oldFile));
                  }
                }
              }
            } catch (cleanupErr) {
              console.error("Cleanup of old door file warning:", cleanupErr);
            }

            fs.writeFileSync(filePath, buffer);
            uploadedUrl = `/uploads/${fileName}`;
            console.log("Saved base64 image locally on server storage:", uploadedUrl);
          } catch (writeErr) {
            console.error("Failed to save image file locally on disk:", writeErr);
            uploadedUrl = customImage; // Absolute raw fallback to stay operational
          }
        }

        processedImage = uploadedUrl;
      } else if (!customImage) {
        // If image is being deleted/removed, delete local physical files for this ID too
        try {
          if (fs.existsSync(UPLOADS_DIR)) {
            const oldFiles = fs.readdirSync(UPLOADS_DIR);
            for (const oldFile of oldFiles) {
              if (oldFile.startsWith(`door-${id}-`)) {
                fs.unlinkSync(path.join(UPLOADS_DIR, oldFile));
              }
            }
          }
        } catch (cleanupErr) {
          console.error("Failed to delete local physical file during removal:", cleanupErr);
        }
      }

      const items = loadLookbookItems();
      let updated: LookbookItem[];
      const exists = items.some(item => item.id === id);

      if (exists) {
        if (!processedImage && id > 20) {
          // Remove dynamic item entirely from the list if the image has been deleted/reset
          updated = items.filter(item => item.id !== id);
        } else {
          // Preset door items: simple update: remove customImage if null, otherwise update
          updated = items.map(item => {
            if (item.id === id) {
              const updatedItem = { ...item };
              if (!processedImage) {
                delete updatedItem.customImage;
              } else {
                updatedItem.customImage = processedImage;
              }
              return updatedItem;
            }
            return item;
          });
        }
      } else {
        if (processedImage) {
          const newItem: LookbookItem = {
            id: id,
            title: `Bespoke Premium Design VK ${100 + id}`,
            category: `Custom Entrance`,
            woodType: `Selected Natural Hardwood`,
            customImage: processedImage
          };
          updated = [...items, newItem];
        } else {
          updated = items;
        }
      }

      saveLookbookItems(updated);
      res.json({ success: true, items: updated });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Could not save lookbook item." });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
