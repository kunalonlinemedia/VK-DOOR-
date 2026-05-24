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

// Save image to local disk storage as standard default file-based backup
function saveImageLocally(id: number, base64Image: string, uploadsDir: string): string {
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let imageBuffer: Buffer;
  let ext = "jpg";

  if (matches && matches.length === 3) {
    const contentType = matches[1];
    ext = contentType.split("/")[1] || "jpg";
    imageBuffer = Buffer.from(matches[2], "base64");
  } else {
    imageBuffer = Buffer.from(base64Image, "base64");
  }

  const fileName = `door-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  try {
    if (fs.existsSync(uploadsDir)) {
      const oldFiles = fs.readdirSync(uploadsDir);
      for (const oldFile of oldFiles) {
        if (oldFile.startsWith(`door-${id}-`)) {
          fs.unlinkSync(path.join(uploadsDir, oldFile));
        }
      }
    }
  } catch (err) {
    console.error("Local file cleanup warning:", err);
  }

  fs.writeFileSync(filePath, imageBuffer);
  return `/uploads/${fileName}`;
}

// Upload base64 image securely to freeimage.host cloud repository
async function uploadToFreeimageHost(id: number, base64Image: string): Promise<string> {
  const apiKey = process.env.FREEIMAGE_HOST_API_KEY || "6d207e02198a847aa98d0a2a901485a5";
  
  let base64Clean = base64Image;
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    base64Clean = matches[2];
  }

  const formData = new URLSearchParams();
  formData.append("key", apiKey.trim());
  formData.append("action", "upload");
  formData.append("source", base64Clean);
  formData.append("format", "json");

  console.log(`Uploading VK ${id} to Freeimage.host API...`);
  const response = await fetch("https://freeimage.host/api/1/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });

  if (!response.ok) {
    throw new Error(`Freeimage.host returned HTTP status ${response.status}`);
  }

  const data = (await response.json()) as any;
  if (data && data.success && data.image && data.image.url) {
    return data.image.url;
  } else {
    throw new Error(data?.error?.message || "Invalid response format from Freeimage.host API");
  }
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

  // API Route: save or update lookbook item
  app.post("/api/lookbook-items", async (req, res) => {
    try {
      const { id, customImage } = req.body;
      if (id === undefined) {
        return res.status(400).json({ error: "Missing lookbook item ID" });
      }

      let processedImage: string | undefined = undefined;

      if (customImage) {
        if (customImage.startsWith("data:image/") || customImage.startsWith("data:application/")) {
          // Attempt to upload to freeimage.host cloud repository
          try {
            processedImage = await uploadToFreeimageHost(id, customImage);
            console.log(`Successfully uploaded VK ${id} to Freeimage.host: ${processedImage}`);
          } catch (error: any) {
            console.error("Freeimage.host upload failed, falling back to local file space:", error.message || error);
            processedImage = saveImageLocally(id, customImage, UPLOADS_DIR);
          }
        } else {
          // Already uploaded/existing image URL
          processedImage = customImage;
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
