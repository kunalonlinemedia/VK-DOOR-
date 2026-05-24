import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ override: true });

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

interface LookbookItem {
  id: number;
  title: string;
  category: string;
  woodType: string;
  customImage?: string;
}

export const PRESET_DESIGNS: LookbookItem[] = [
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

// In-memory fallback if file system is read-only
let memoryItems: LookbookItem[] | null = null;

function getItems(): LookbookItem[] {
  let savedItems: LookbookItem[] = [];
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      savedItems = JSON.parse(data);
    }
  } catch (e) {
    if (memoryItems) savedItems = memoryItems;
  }
  
  if (savedItems.length === 0 && memoryItems) {
    savedItems = memoryItems;
  }

  const merged = JSON.parse(JSON.stringify(PRESET_DESIGNS));
  savedItems.forEach(savedItem => {
    const index = merged.findIndex((i: LookbookItem) => i.id === savedItem.id);
    if (index !== -1) {
      merged[index].customImage = savedItem.customImage;
    } else {
      merged.push(savedItem);
    }
  });
  return merged;
}

function saveItems(items: LookbookItem[]) {
  // Only save items that have customImages or IDs > 20
  const toSave = items.filter(i => i.customImage || i.id > 20);
  memoryItems = toSave;
  
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), "utf-8");
  } catch (e) {
    console.error("Read-only filesystem detected, relying on memory cache.");
  }
}

app.get("/api/lookbook-items", (req, res) => {
  res.json(getItems());
});

app.post("/api/lookbook-items", (req, res) => {
  try {
    const { id, customImage } = req.body;
    if (id === undefined) {
      return res.status(400).json({ error: "Missing lookbook item ID" });
    }

    const items = getItems();
    const index = items.findIndex((i: LookbookItem) => i.id === id);

    if (index !== -1) {
      if (customImage) {
        items[index].customImage = customImage;
      } else {
        delete items[index].customImage;
      }
    } else if (customImage) {
      items.push({
        id,
        title: `Bespoke Premium Design VK ${100 + id}`,
        category: `Custom Entrance`,
        woodType: `Selected Natural Hardwood`,
        customImage: customImage
      });
    }

    saveItems(items);
    res.json({ success: true, items });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Could not save lookbook item: " + (e.message || "") });
  }
});

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
