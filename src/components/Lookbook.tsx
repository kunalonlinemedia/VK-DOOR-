import { useState, useEffect, FormEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LookbookItem {
  id: number;
  title: string;
  category: string;
  woodType: string;
  customImage?: string; // Base64 data URL
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

export default function Lookbook() {
  const [items, setItems] = useState<LookbookItem[]>(() => {
    let baseItems = [...PRESET_DESIGNS];
    try {
      // Clear legacy storage versions to completely wipe out any previous images from all user devices
      localStorage.removeItem('vk_door_lookbook_items_v3');
      localStorage.removeItem('vk_door_lookbook_photos_v2');
      localStorage.removeItem('vk_door_lookbook_items_v4');
      localStorage.removeItem('vk_door_lookbook_photos_v4');

      const savedItemsStr = localStorage.getItem('vk_door_lookbook_items_v5');
      if (savedItemsStr) {
        return JSON.parse(savedItemsStr) as LookbookItem[];
      }
      
      const savedPhotosStr = localStorage.getItem('vk_door_lookbook_photos_v5');
      if (savedPhotosStr) {
        const savedPhotos = JSON.parse(savedPhotosStr) as Record<number, string>;
        baseItems = baseItems.map(item => {
          if (savedPhotos[item.id]) {
            return { ...item, customImage: savedPhotos[item.id] };
          }
          return item;
        });
      }
    } catch (e) {
      console.error("Could not parse dynamic lookbook items, loading presets", e);
    }
    return baseItems;
  });

  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // PIN Verification system states
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Lock body scroll when full-screen modal or PIN verification modal is open
  useEffect(() => {
    if (selectedItem || showPinModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem, showPinModal]);

  // File upload and image editing states
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load fresh items from server database on mount
  useEffect(() => {
    fetch("/api/lookbook-items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load backend items");
        return res.json();
      })
      .then((data: LookbookItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          try {
            localStorage.setItem('vk_door_lookbook_items_v4', JSON.stringify(data));
          } catch (storageError) {
            console.error("Failed to cache server items:", storageError);
          }
        }
      })
      .catch((err) => {
        console.warn("Using offline storage cache for lookbook:", err);
      });
  }, []);

  const [uploadFeedback, setUploadFeedback] = useState<string>("");

  const handleVerifyPin = () => {
    if (pinInput === "2005") {
      setIsAdminMode(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError("");
      setUploadFeedback("🔓 Access granted: Admin system started!");
      setTimeout(() => setUploadFeedback(""), 3000);
    } else if (pinInput.length === 0) {
      setPinError("Please enter the security PIN.");
    } else {
      setPinError("Invalid security PIN. Please try again.");
    }
  };



  // HTML5 high-end canvas image utility to compress files on client-side before sending
  const compressAndPreview = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Invalid file: Please choose a valid photograph (JPG, PNG, WEBP).");
      return;
    }

    setUploadFeedback("Optimizing photograph resolution...");
    const reader = new FileReader();
    reader.onload = (event) => {
      const originalBase64 = event.target?.result as string;

      const img = new Image();
      img.src = originalBase64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Premium Lookbook sharpness dimension (max 1200px)
        const maxDim = 1200;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
          setPreviewUrl(compressedBase64);
          setUploadFeedback("✨ Picture optimized successfully!");
        } else {
          setPreviewUrl(originalBase64);
        }
        setTimeout(() => setUploadFeedback(""), 2000);
      };
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop events
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      compressAndPreview(file);
    }
  };

  // Save custom link helper syncing with fullstack server API
  const saveCustomPhoto = async (id: number, imgDataUrl: string | null) => {
    setIsUploading(true);
    setUploadFeedback(imgDataUrl ? "Publishing image link..." : "Removing design...");
    
    // 1. Maintain photos record in local caching sync for generic backward-compatibility
    try {
      const savedPhotosStr = localStorage.getItem('vk_door_lookbook_photos_v4') || "{}";
      const savedPhotos = JSON.parse(savedPhotosStr) as Record<number, string>;
      if (imgDataUrl) {
        savedPhotos[id] = imgDataUrl;
      } else {
        delete savedPhotos[id];
      }
      localStorage.setItem('vk_door_lookbook_photos_v4', JSON.stringify(savedPhotos));
    } catch (e) {
      console.error("Failed to clean up lookup photo cache", e);
    }

    // 2. Transmit changes to server-side directory database and Cloudflare R2
    try {
      const response = await fetch("/api/lookbook-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, customImage: imgDataUrl }),
      });
      if (!response.ok) {
        throw new Error("Cloud sync request failed");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
        try {
          localStorage.setItem('vk_door_lookbook_items_v4', JSON.stringify(data.items));
        } catch (e) {
          console.error(e);
        }
        setUploadFeedback(imgDataUrl ? "🚀 Picture saved and published live!" : "🗑️ Design reset successfully!");
      }
    } catch (e) {
      console.error("Local sync server connection failure:", e);
      setUploadFeedback("⚠️ Server error. Could not upload image.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadFeedback(""), 4000);
    }
  };

  const openUploadModal = (id: number) => {
    const item = items.find(i => i.id === id);
    setEditingItemId(id);
    setPreviewUrl(item?.customImage || "");
    setShowUploadModal(true);
  };

  const handleSaveUploadedImage = (e: FormEvent) => {
    e.preventDefault();
    if (editingItemId === null || !previewUrl) return;
    saveCustomPhoto(editingItemId, previewUrl);
    setShowUploadModal(false);
    setEditingItemId(null);
    setPreviewUrl("");
  };

  const handleResetImage = (id: number) => {
    if (window.confirm("Are you sure you want to reset this design card back to the default architectural preview?")) {
      saveCustomPhoto(id, null);
      setUploadFeedback("Restored back to default.");
      setTimeout(() => setUploadFeedback(""), 2000);
    }
  };

  // Helper code to render stunning default design fallback SVGs
  const renderFallbackSVG = (item: LookbookItem) => {
    let woodBgColor = "#8B5A2B"; // Warm medium brown default
    let lineAccent = "#5C3A21";
    let paneColor1 = "#A0522D";
    let paneColor2 = "#CD853F";

    switch ((item.id % 5)) {
      case 0: // Mahogany style
        woodBgColor = "#662d1b";
        lineAccent = "#3d1308";
        paneColor1 = "#7c3821";
        paneColor2 = "#944429";
        break;
      case 1: //CP Royal Teak style
        woodBgColor = "#a36e3b";
        lineAccent = "#633c16";
        paneColor1 = "#c4884d";
        paneColor2 = "#d99d5f";
        break;
      case 2: // Walnut / Smoked Oak
        woodBgColor = "#44342d";
        lineAccent = "#211612";
        paneColor1 = "#5e4b42";
        paneColor2 = "#786156";
        break;
      case 3: // Rosewood
        woodBgColor = "#772b2c";
        lineAccent = "#4a1215";
        paneColor1 = "#8c3b3c";
        paneColor2 = "#a84e50";
        break;
      case 4: // Pine / Cedar
        woodBgColor = "#c29567";
        lineAccent = "#8c6035";
        paneColor1 = "#d9ad7e";
        paneColor2 = "#ebbfa0";
        break;
    }

    return (
      <svg className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" viewBox="0 0 400 550" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic Abstract Wood Grain Background Mock */}
        <rect width="400" height="550" fill={woodBgColor} />
        
        {/* Vertical Grain Lines */}
        <path d="M40 0 C 60 120, 30 300, 50 550" stroke={lineAccent} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
        <path d="M120 0 C 100 180, 140 380, 110 550" stroke={lineAccent} strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        <path d="M220 0 C 240 100, 200 290, 230 550" stroke={lineAccent} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        <path d="M300 0 C 280 200, 310 400, 290 550" stroke={lineAccent} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        <path d="M370 0 C 390 150, 350 350, 380 550" stroke={lineAccent} strokeWidth="1" strokeLinecap="round" opacity="0.35" />

        {/* Chaukhat Frame Outlining */}
        <rect x="25" y="25" width="350" height="500" rx="2" stroke={lineAccent} strokeWidth="14" fill="none" opacity="0.9" />
        <rect x="36" y="36" width="328" height="478" rx="1" stroke="#222" strokeWidth="1" fill="none" opacity="0.2" />

        {/* Main Door Panels layout */}
        {item.id % 2 === 0 ? (
          // Traditional Elegant 6-Panel Design
          <>
            {/* Top Row Panels */}
            <rect x="52" y="52" width="130" height="120" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="58" y="58" width="118" height="108" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />

            <rect x="218" y="52" width="130" height="120" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="224" y="58" width="118" height="108" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />

            {/* Middle Row Panels */}
            <rect x="52" y="196" width="130" height="150" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="58" y="202" width="118" height="138" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />

            <rect x="218" y="196" width="130" height="150" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="224" y="202" width="118" height="138" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />

            {/* Bottom Row Panels */}
            <rect x="52" y="370" width="130" height="135" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="58" y="376" width="118" height="123" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />

            <rect x="218" y="370" width="130" height="135" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            <rect x="224" y="376" width="118" height="123" fill={paneColor2} stroke="#fff" strokeWidth="0.8" opacity="0.15" />
          </>
        ) : (
          // Contemporary Grooved Modern Slate Minimalist design
          <>
            <rect x="52" y="52" width="296" height="446" fill={paneColor1} stroke={lineAccent} strokeWidth="4" />
            
            {/* Elegant Minimalist Horizontal CNC Carvings */}
            <line x1="60" y1="120" x2="340" y2="120" stroke={lineAccent} strokeWidth="3" opacity="0.8" />
            <line x1="60" y1="180" x2="340" y2="180" stroke={lineAccent} strokeWidth="3" opacity="0.8" />
            <line x1="60" y1="240" x2="340" y2="240" stroke={lineAccent} strokeWidth="3" opacity="0.8" />
            <line x1="60" y1="300" x2="340" y2="300" stroke={lineAccent} strokeWidth="3" opacity="0.8" />
            <line x1="60" y1="360" x2="340" y2="360" stroke={lineAccent} strokeWidth="3" opacity="0.8" />
            <line x1="60" y1="420" x2="340" y2="420" stroke={lineAccent} strokeWidth="3" opacity="0.8" />

            {/* Inner artistic diamond CNC accent of our brand */}
            <polygon points="200,105 215,120 200,135 185,120" fill="none" stroke={lineAccent} strokeWidth="1.5" />
            <polygon points="200,285 215,300 200,315 185,300" fill="none" stroke={lineAccent} strokeWidth="1.5" />
          </>
        )}

        {/* Premium Brass Handle/Pull */}
        <rect x="320" y="255" width="8" height="45" rx="2" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="1" />
        <circle cx="324" cy="277.5" r="3" fill="#1C1A17" />
        
        {/* Subtle Watermark/Logo Label in Gold */}
        <text x="200" y="520" fill="#EAE0D5" fontSize="12" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="bold" letterSpacing="4" textAnchor="middle" opacity="0.45">VK DOOR DESIGN</text>
      </svg>
    );
  };

  // Build the clean WhatsApp Inquire text using only the VK standard key
  const generateWhatsAppLink = (item: LookbookItem) => {
    const codeName = `VK ${100 + item.id}`;
    const textMsg = `Hello VK DOOR, I am looking at your premium designs. I am highly interested in design code: ${codeName}. Please contact me back with the sizing options, wood customization, and price quotation. Thank you.`;
    return `https://wa.me/919050050120?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <div className="space-y-12 pb-16">

      {/* HEADER SECTION - WRITING EXCLUSIVELY ABOUT LUXURIOUS WOODEN DOORS */}
      <div className="relative text-center max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-6">
        <div className="inline-flex items-center space-x-2 bg-brand-light border border-brand-border/40 rounded-full px-4.5 py-1 z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-wood/80" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-brand-dark font-extrabold">The Prestige Selection</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-stone-900 leading-tight">
          Pristine Solid Wood <br />
          <span className="italic font-normal text-brand-wood">Doors & Bespoke Craftsmanship</span>.
        </h1>

        <p className="font-bricolage text-stone-950 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          Crafted from India&apos;s finest selected Teakwood, seasoned Sheesham, and premium hard timber. Each masterpiece is engineered with complete termite-resistant defense, perfect anti-bending alignment, and hand-mutilated finishing. <span className="whitespace-nowrap">VK DOOR</span> delivers absolute safety, high-grade acoustic dampening, and elegant vintage styles straight to luxury Indian residences.
        </p>

        {/* Studio Admin Controls floating switch but visually subtle */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
                setUploadFeedback("Administrative edit mode deactivated.");
                setTimeout(() => setUploadFeedback(""), 2000);
              } else {
                setPinInput("");
                setPinError("");
                setShowPinModal(true);
              }
            }}
            className={`px-4 py-2 rounded-full border text-[10px] font-extrabold tracking-wider transition-all uppercase flex items-center space-x-2 cursor-pointer ${
              isAdminMode 
                ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md shadow-amber-500/15' 
                : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className={`fa-solid ${isAdminMode ? 'fa-pen-nib' : 'fa-sliders'}`} />
            <span>{isAdminMode ? "Disable Edit Mode" : "Manage Images (Admin Required)"}</span>
          </button>
        </div>
      </div>

      {/* ADMIN STATUS FEEDBACK AND TIPS BANNER */}
      <AnimatePresence>
        {(uploadFeedback || isAdminMode) && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-sans flex flex-col sm:flex-row items-center justify-between gap-3 ${
              uploadFeedback ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-current animate-pulse shrink-0" />
              <p className="font-normal leading-relaxed text-center sm:text-left">
                {uploadFeedback 
                  ? uploadFeedback 
                  : "💡 ADMIN ACTIVE: Click 'Upload Image' on any card to compress, upload, and save a physical photograph directly to the server!"}
              </p>
            </div>
            {isAdminMode && (
              <span className="text-[10px] bg-stone-900 text-stone-100 font-mono py-1 px-2.5 rounded-md self-end sm:self-auto font-bold select-none">
                Interactive Studio mode
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 20 CARD DESIGN GRID (RESPONSIVE: Strictly 2 columns on mobile, fluid scalable grid) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-brand-border/40">
          <span className="text-[10px] sm:text-xs font-bricolage tracking-wider uppercase text-stone-500 font-extrabold truncate whitespace-nowrap">
            Premium Wooden Door Catalog
          </span>
          <span className="text-[10px] sm:text-xs font-bricolage tracking-widest text-emerald-700 font-extrabold flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-full uppercase shrink-0">
            <i className="fa-brands fa-whatsapp text-emerald-500 text-sm" />
            <span>Connected</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <motion.div
              layoutId={`card-container-${item.id}`}
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
              className="bg-white rounded-3xl border border-brand-border/50 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all h-full"
            >
              {/* IMAGE ELEMENT (NO NUMBER BUBBLE GIVEN AS REQUESTED) - PRESERVING NATURAL HIGH-QUALITY ASPECT RATIO */}
              <div 
                className="w-full overflow-hidden bg-transparent select-none relative cursor-pointer group"
                style={{ aspectRatio: item.customImage ? 'auto' : '2/3' }}
                onClick={() => {
                  if (!isAdminMode) {
                    setSelectedItem(item);
                  }
                }}
              >
                {item.customImage ? (
                  <img
                     src={item.customImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block select-none pointer-events-none transition-transform duration-500 group-hover:scale-103 bg-transparent"
                    loading="lazy"
                  />
                ) : (
                  renderFallbackSVG(item)
                )}

                {/* Luxury Hover Overlay (when NOT in edit mode) */}
                {!isAdminMode && (
                  <div className="absolute inset-0 bg-stone-950/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 select-none">
                    <span className="bg-white/95 text-brand-dark rounded-full px-4 py-1.5 text-[11px] font-bricolage font-extrabold tracking-wide shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-1">
                      <i className="fa-solid fa-expand text-[9px] text-brand-gold animate-pulse" />
                      <span>Tap to View</span>
                    </span>
                  </div>
                )}
                
                {/* Admin Quick Action Button Overlay when Edit Mode is active */}
                {isAdminMode && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 space-y-3 transition-opacity animate-fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openUploadModal(item.id);
                      }}
                      className="w-full max-w-[130px] py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 text-[10px] font-bold uppercase rounded-lg tracking-wider text-center cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <i className="fa-solid fa-camera" />
                      <span>Upload Image</span>
                    </button>

                    {item.customImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResetImage(item.id);
                        }}
                        className="w-full max-w-[130px] py-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[9px] font-bold uppercase rounded-lg tracking-wider text-center cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <i className="fa-solid fa-trash-can" />
                        <span>Delete Photo</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* CARD DETAILS WRAP (SHOWING ONLY VK 101 ETC AND COMPACT REDESIGNED WHATSAPP BUTTON BASED ON REQUEST) */}
              <div className="p-3.5 text-center space-y-2.5 bg-white">
                <h3 className="font-bricolage text-sm sm:text-base font-extrabold text-brand-dark tracking-wide">
                  VK {100 + item.id}
                </h3>

                <div className="flex justify-center flex-wrap gap-2">
                  <a
                    href={generateWhatsAppLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-sm active:scale-95 cursor-pointer"
                  >
                    <i className="fa-brands fa-whatsapp text-xs" />
                    <span>Inquire</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* DYNAMIC SEQUENTIAL PLACEHOLDER CARD: Instantiates Next ID seamlessly in Admin Mode */}
          {isAdminMode && (() => {
            const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 21;
            return (
              <motion.div
                layoutId={`card-container-placeholder-${nextId}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stone-50/50 rounded-3xl border-2 border-dashed border-stone-300 overflow-hidden flex flex-col justify-between h-full hover:border-amber-500 hover:bg-stone-50 transition-all duration-300 min-h-[320px]"
              >
                <div 
                  className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer"
                  onClick={() => openUploadModal(nextId)}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-3">
                    <i className="fa-solid fa-plus text-lg" />
                  </div>
                  
                  <h3 className="font-bricolage text-sm sm:text-base font-extrabold text-stone-600 tracking-wide">
                    VK {100 + nextId} Placeholder
                  </h3>
                  
                  <p className="text-[10px] text-stone-400 mt-1.5 max-w-[150px] leading-normal font-normal">
                    Click to upload a physical photograph of the brand new door design
                  </p>
                </div>

                <div className="p-3.5 text-center bg-stone-100/40 border-t border-stone-200/50 flex justify-center">
                  <button
                    onClick={() => openUploadModal(nextId)}
                    className="inline-flex items-center space-x-1 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-camera" />
                    <span>Upload Design</span>
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* SECURE ADMIN PIN VERIFICATION MODAL */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-stone-200 rounded-[2rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <i className="fa-solid fa-shield-halved text-lg" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-bricolage text-xl font-black text-stone-900 uppercase">Admin Required</h3>
                <p className="text-xs text-stone-500 font-bricolage leading-normal font-normal px-2">
                  Enter the 4-digit verification code to access the administrative image upload system.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPinInput(val);
                    setPinError("");
                  }}
                  placeholder="••••"
                  className="w-32 mx-auto text-center tracking-[0.8em] font-serif text-3xl font-bold py-2 border-b-2 border-stone-300 focus:border-amber-500 outline-none text-stone-900 bg-transparent placeholder-stone-300 transition-colors"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyPin();
                    }
                  }}
                />
                {pinError && (
                  <p className="text-[11px] text-red-600 font-bold font-bricolage">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinInput("");
                    setPinError("");
                  }}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPin}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow-md shadow-amber-500/10"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* DIRECT IMAGE FILE UPLOADER MODAL WITH LIVE COMPRESSION */}
      <AnimatePresence>
        {showUploadModal && editingItemId !== null && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4" onClick={() => { if(!isUploading) { setShowUploadModal(false); setEditingItemId(null); setPreviewUrl(""); } }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-stone-200 rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <i className="fa-solid fa-camera text-lg" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bricolage text-xl font-black text-stone-900 uppercase">
                  VK {100 + editingItemId} Door Photograph
                </h3>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  Apne actual custom door design ki original High-Definition photo drop ya select karein. Hamara modern system image ko automatically shrink & optimize karke fast loading web-ready banata hai pehle git pe bhejta hai.
                </p>
              </div>

              <form onSubmit={handleSaveUploadedImage} className="space-y-4">
                {/* Visual Drag and Drop container panel with Live Preview */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative h-48 overflow-hidden flex flex-col items-center justify-center bg-stone-50/50 ${
                    previewUrl ? 'border-amber-500 bg-amber-500/5' : 'border-stone-300 hover:border-stone-900 hover:bg-stone-50'
                  }`}
                  onClick={() => document.getElementById('lookbook-image-file-input')?.click()}
                >
                  <input
                    type="file"
                    id="lookbook-image-file-input"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressAndPreview(file);
                      }
                    }}
                  />

                  {previewUrl ? (
                    <>
                      <img 
                        src={previewUrl} 
                        alt="Preloaded preview" 
                        className="absolute inset-0 w-full h-full object-contain p-2 z-10"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-stone-900/70 p-1.5 text-center text-[10px] text-white font-bold tracking-wider uppercase z-20">
                        Click to change photo
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 pointer-events-none">
                      <div className="text-3xl">📷</div>
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">Drag & Drop Image Here</p>
                      <p className="text-[10px] text-stone-400">or click to browse your devices</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => {
                      setShowUploadModal(false);
                      setEditingItemId(null);
                      setPreviewUrl("");
                    }}
                    className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer font-sans disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !previewUrl}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow-md font-sans flex items-center justify-center space-x-1.5"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up" />
                        <span>Save & Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM MINIMAL FULL SCREEN MODAL VIEW (SHOWS THE IMAGE FULL HEIGHT AND REDESIGNED COMPACT WHATSAPP BUTTON WITH WATERMARK) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/98 backdrop-blur-xl z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 select-none"
            onClick={() => setSelectedItem(null)}
          >
            {/* Float Close Button at top corner */}
            <div className="w-full flex justify-end shrink-0 max-w-lg md:max-w-xl">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-stone-800/80 hover:bg-stone-700/90 text-stone-200 hover:text-white rounded-full p-2.5 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Center Image Container - Flexible and full length with high quality */}
            <div className="relative flex-1 w-full max-w-lg md:max-w-xl max-h-[70vh] my-auto select-none flex flex-col items-center justify-center pointer-events-none">
              {selectedItem.customImage ? (
                <img
                  src={selectedItem.customImage}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[64vh] max-w-full object-contain select-none pointer-events-none z-10 rounded-2xl shadow-xl bg-transparent"
                />
              ) : (
                <div className="w-full h-full max-h-[64vh] p-8 flex items-center justify-center">
                  {renderFallbackSVG(selectedItem)}
                </div>
              )}

              {/* Watermark is exclusively below the door image - VK Copyright */}
              <div className="mt-4 text-center pointer-events-none select-none opacity-50 z-20">
                <p className="font-bricolage text-[11px] sm:text-xs uppercase text-stone-400 tracking-[0.25em] font-extrabold">
                  VK DOOR © COPYRIGHT RESERVED
                </p>
              </div>
            </div>

            {/* Bottom Panel - White Border/Bar with Name and Button in matching small compact design */}
            <div 
              className="w-full max-w-sm sm:max-w-md bg-white border border-stone-200 rounded-[1.75rem] p-3 px-4 sm:px-5 shadow-2xl flex items-center justify-between gap-4 shrink-0 z-10 mt-2 hover:shadow-3xl transition-shadow duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col text-left">
                <span className="font-bricolage text-xs uppercase tracking-widest text-stone-400 font-extrabold">
                  Model
                </span>
                <span className="font-bricolage text-base sm:text-lg font-black text-stone-900 tracking-wide mt-0.5">
                  VK {100 + selectedItem.id}
                </span>
              </div>

              <a
                href={generateWhatsAppLink(selectedItem)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full text-xs font-bricolage font-black tracking-wider uppercase transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer shadow-sm shrink-0"
              >
                <i className="fa-brands fa-whatsapp text-sm sm:text-base text-white" />
                <span>Inquire WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
