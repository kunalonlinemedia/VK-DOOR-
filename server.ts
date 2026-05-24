import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ override: true });

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

async function deleteFromGitHub(id: number) {
  const token = process.env.GITHUB_UPLOAD_TOKEN;
  if (!token) return;
  const owner = "Kunalonlinemedia";
  const repo = "VK-DOOR-";
  
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/contents/uploads`;
  try {
    const res = await fetch(listUrl, {
      headers: { "Authorization": `Bearer ${token}`, "User-Agent": "VK-DOOR-Applet", "Accept": "application/vnd.github.v3+json" },
      cache: "no-store"
    });
    if (res.ok) {
      const files = await res.json();
      if (Array.isArray(files)) {
        for (const file of files) {
          if (file.name.startsWith(`door-${id}-`)) {
            console.log(`Deleting old image ${file.name} for VK ${id}...`);
            await fetch(file.url, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "VK-DOOR-Applet",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                 message: `Delete old image for VK ${id}`,
                 sha: file.sha
              })
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to delete from GitHub:", err);
  }
}

async function uploadToGitHub(id: number, base64Image: string): Promise<string> {
  const token = process.env.GITHUB_UPLOAD_TOKEN;
  if (!token) {
    throw new Error("GITHUB_UPLOAD_TOKEN is missing in environment variables.");
  }

  // Delete previous copies to avoid clutter
  await deleteFromGitHub(id);

  const owner = "Kunalonlinemedia";
  const repo = "VK-DOOR-";
  
  let base64Clean = base64Image;
  let ext = "jpg";
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (matches && matches.length === 3) {
    const contentType = matches[1];
    ext = contentType.split("/")[1] || "jpg";
    base64Clean = matches[2];
  }

  const fileName = `door-${id}-${Date.now()}.${ext}`;
  const filePath = `uploads/${fileName}`; 

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  
  console.log(`Uploading new image to ${filePath}...`);
  
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "VK-DOOR-Applet"
    },
    body: JSON.stringify({
      message: `Upload custom image for VK Door design ${id}`,
      content: base64Clean
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json() as any;
  if (data && data.content && data.content.download_url) {
    return data.content.download_url;
  } else {
    throw new Error("Invalid response format from GitHub API");
  }
}

async function fetchLookbookItemsFromGitHub(): Promise<LookbookItem[]> {
  const items = JSON.parse(JSON.stringify(PRESET_DESIGNS)); // deep copy
  const token = process.env.GITHUB_UPLOAD_TOKEN;
  
  if (!token) {
    console.log("No token found, returning default items");
    return items;
  }

  const owner = "Kunalonlinemedia";
  const repo = "VK-DOOR-";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/uploads`;

  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VK-DOOR-Applet"
      },
      cache: "no-store",
      next: { revalidate: 0 }
    } as RequestInit);

    if (res.ok) {
      const files = await res.json();
      if (Array.isArray(files)) {
        files.forEach(file => {
          if (file.name.startsWith("door-")) {
            const parts = file.name.split("-");
            if (parts.length >= 2) {
              const id = parseInt(parts[1], 10);
              if (!isNaN(id)) {
                if (id <= 20) {
                  const preset = items.find((i: LookbookItem) => i.id === id);
                  if (preset) {
                    preset.customImage = file.download_url;
                  }
                } else {
                  const existingIndex = items.findIndex((i: LookbookItem) => i.id === id);
                  if (existingIndex !== -1) {
                    items[existingIndex].customImage = file.download_url;
                  } else {
                    items.push({
                      id,
                      title: `Bespoke Premium Design VK ${100 + id}`,
                      category: `Custom Entrance`,
                      woodType: `Selected Natural Hardwood`,
                      customImage: file.download_url
                    });
                  }
                }
              }
            }
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch uploads list from GitHub:", error);
  }
  
  return items;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.get("/api/lookbook-items", async (req, res) => {
  try {
    const items = await fetchLookbookItemsFromGitHub();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Could not load lookbook items." });
  }
});

app.post("/api/lookbook-items", async (req, res) => {
  try {
    const { id, customImage } = req.body;
    if (id === undefined) {
      return res.status(400).json({ error: "Missing lookbook item ID" });
    }

    if (customImage && (customImage.startsWith("data:image/") || customImage.startsWith("data:application/"))) {
      await uploadToGitHub(id, customImage);
    } else if (!customImage) {
      // User deleted image
      await deleteFromGitHub(id);
    }

    // Give GitHub API a moment to propagate
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fetch refreshed list and return to frontend
    const items = await fetchLookbookItemsFromGitHub();
    res.json({ success: true, items });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: "Could not save lookbook item: " + (e.message || "") });
  }
});

// Check if NOT running on Vercel to start traditional port listener
if (process.env.VERCEL !== "1") {
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid esbuild resolving vite in production
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
}

export default app;
