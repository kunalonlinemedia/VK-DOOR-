import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

export const PRESET_DESIGNS = [
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

const GITHUB_TOKEN = process.env.GITHUB_UPLOAD_TOKEN;
const REPO_OWNER = "Kunalonlinemedia";
const REPO_NAME = "VK-DOOR-";
const FILE_PATH = "lookbook-db.json";

async function getDbFromGithub() {
  if (!GITHUB_TOKEN) return [];
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "VK-DOOR-App",
        "Accept": "application/vnd.github.v3+json"
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(content);
    }
  } catch(e) {
    console.error("Github read error:", e);
  }
  return [];
}

async function saveDbToGithub(items: any[]) {
  if (!GITHUB_TOKEN) return;
  
  let sha = "";
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "VK-DOOR-App",
        "Accept": "application/vnd.github.v3+json"
      },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch(e) {}
  
  const content = Buffer.from(JSON.stringify(items, null, 2)).toString("base64");
  
  await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "VK-DOOR-App",
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: "Update lookbook-db.json linking database",
      content,
      sha: sha || undefined
    })
  });
}

// fallback for local development if GitHub token isn't present
const DB_FILE = path.join(process.cwd(), "lookbook-db.json");

function getItemsLocal() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

function saveItemsLocal(items: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {}
}

app.get("/api/lookbook-items", async (req, res) => {
  try {
    let savedItems = [];
    if (GITHUB_TOKEN) {
      savedItems = await getDbFromGithub();
    } else {
      savedItems = getItemsLocal();
    }
    
    const merged = JSON.parse(JSON.stringify(PRESET_DESIGNS));
    savedItems.forEach((savedItem: any) => {
      const index = merged.findIndex((i: any) => i.id === savedItem.id);
      if (index !== -1) {
        merged[index].customImage = savedItem.customImage;
      } else {
        merged.push(savedItem);
      }
    });
    res.json(merged);
  } catch (e) {
    res.status(500).json({ error: "Failed to load database" });
  }
});

app.post("/api/lookbook-items", async (req, res) => {
  try {
    const { id, customImage } = req.body;
    if (id === undefined) {
      return res.status(400).json({ error: "Missing item ID" });
    }

    let savedItems = [];
    if (GITHUB_TOKEN) {
      savedItems = await getDbFromGithub();
    } else {
      savedItems = getItemsLocal();
    }

    const index = savedItems.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      if (customImage) {
        savedItems[index].customImage = customImage;
      } else {
         // remove if customImage is null
         savedItems.splice(index, 1);
      }
    } else if (customImage) {
      savedItems.push({
        id,
        title: `Bespoke Premium Design VK ${100 + id}`,
        category: `Custom Entrance`,
        woodType: `Selected Natural Hardwood`,
        customImage: customImage
      });
    }

    if (GITHUB_TOKEN) {
      await saveDbToGithub(savedItems);
    } else {
      saveItemsLocal(savedItems);
    }
    
    // Re-merge with presets to send back
    const merged = JSON.parse(JSON.stringify(PRESET_DESIGNS));
    savedItems.forEach((savedItem: any) => {
      const mIndex = merged.findIndex((i: any) => i.id === savedItem.id);
      if (mIndex !== -1) {
        merged[mIndex].customImage = savedItem.customImage;
      } else {
        merged.push(savedItem);
      }
    });

    res.json({ success: true, items: merged, usingGithub: !!GITHUB_TOKEN });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Failed to update item" });
  }
});

export default app;
