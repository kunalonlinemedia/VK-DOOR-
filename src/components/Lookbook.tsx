import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface LookbookItem {
  id: number;
  title: string;
  category: string;
  woodType: string;
  customImage?: string; // Base64 or URL
  pin?: string;
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

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress heavily for Firestore (0.65 quality WebP)
        const dataUrl = canvas.toDataURL('image/webp', 0.65);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

interface LookbookImageProps {
  src: string;
  alt: string;
  className?: string;
}

function LookbookImage({ src, alt, className = "" }: LookbookImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorLoaded, setErrorLoaded] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] bg-white flex items-center justify-center overflow-hidden">
      {(!isLoaded && !errorLoaded) && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-20 pointer-events-none" id="img-loader">
          <div className="w-8 h-8 border-3 border-stone-100 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-sans font-semibold tracking-wider text-stone-400 mt-2.5 uppercase">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setErrorLoaded(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
}

function LookbookDetailImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorLoaded, setErrorLoaded] = useState(false);

  return (
    <div className="relative max-h-[64vh] max-w-full flex items-center justify-center rounded-2xl overflow-hidden bg-stone-900/10 min-h-[250px] min-w-[200px]" id="detail-img-loader-parent">
      {(!isLoaded && !errorLoaded) && (
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex flex-col items-center justify-center z-20 pointer-events-none" id="detail-img-loader">
          <div className="w-10 h-10 border-4 border-stone-800/80 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-sans font-bold tracking-widest text-white/70 mt-3 uppercase">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setErrorLoaded(true)}
        className={`max-h-[64vh] max-w-full object-contain select-none pointer-events-none z-10 rounded-2xl shadow-xl bg-transparent transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function Lookbook() {
  const [items, setItems] = useState<LookbookItem[]>([...PRESET_DESIGNS]);
  const [isFirestoreLoaded, setIsFirestoreLoaded] = useState<boolean>(false);
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

  // Drag and drop states
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processLocalFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processLocalFile(e.target.files[0]);
    }
  };

  const processLocalFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
       setUploadFeedback("❌ Please drop image files only!");
       setTimeout(() => setUploadFeedback(""), 3000);
       return;
    }
    setIsUploading(true);
    setUploadFeedback("Compressing image...");
    try {
      const compressedDataUrl = await compressImage(file);
      setPreviewUrl(compressedDataUrl);
      setUploadFeedback("✨ Image ready! Click 'Save & Publish' below.");
      setTimeout(() => setUploadFeedback(""), 5000);
    } catch (err) {
      console.error(err);
      setUploadFeedback("❌ Failed to process image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Firestore Live Listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lookbook-items"), (snapshot) => {
      const fbItems = snapshot.docs.map(d => d.data() as LookbookItem);
      
      setItems((prev) => {
        let baseItems = [...PRESET_DESIGNS];
        
        // Merge preset designs with Firestore overrides
        fbItems.forEach(fbItem => {
          if (!fbItem.customImage) return; // Skip if empty (deleted/reset)
          
          const index = baseItems.findIndex(b => b.id === fbItem.id);
          if (index !== -1) {
             baseItems[index].customImage = fbItem.customImage;
          } else {
             // For dynamic items generated by '+' button
             baseItems.push({
                id: fbItem.id,
                title: `Bespoke Premium Design VK ${100 + fbItem.id}`,
                category: "Custom Design",
                woodType: "Selected Hardwood",
                customImage: fbItem.customImage
             });
          }
        });
        
        // Sort to keep ordered
        return baseItems.sort((a,b) => a.id - b.id);
      });
      setIsFirestoreLoaded(true);
    }, (error) => {
      console.error("Firestore error: ", error);
      setIsFirestoreLoaded(true);
    });

    return () => unsub();
  }, []);

  const [uploadFeedback, setUploadFeedback] = useState<string>("");

  const handleVerifyPin = () => {
    if (pinInput === "2005") {
      setIsAdminMode(true);
      setShowPinModal(false);
      setPinError("");
      setUploadFeedback("🔓 Access granted: Admin system started!");
      setTimeout(() => setUploadFeedback(""), 3000);
    } else if (pinInput.length === 0) {
      setPinError("Please enter the security PIN.");
    } else {
      setPinError("Invalid security PIN. Please try again.");
    }
  };

  const saveCustomPhoto = async (id: number, imgDataUrl: string | null) => {
    setIsUploading(true);
    setUploadFeedback(imgDataUrl ? "Publishing image link..." : "Removing design...");
    
    try {
      // Set to empty string for resets to adhere to Firestore rules (customImage is string required)
      await setDoc(doc(db, "lookbook-items", String(id)), {
        id,
        customImage: imgDataUrl || "",
        pin: pinInput || "2005" // Pass the PIN to bypass security rules 
      });
      setUploadFeedback(imgDataUrl ? "🚀 Picture saved and published live!" : "🗑️ Design reset successfully!");
    } catch (e) {
      console.error("Firestore sync failure:", e);
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
    return (
      <div className="w-full h-full min-h-[280px] sm:min-h-[340px] bg-white flex flex-col items-center justify-center relative overflow-hidden p-6 text-center select-none border border-stone-100/40 rounded-3xl">
        {!isFirestoreLoaded ? (
          <>
            <div className="w-8 h-8 border-3 border-stone-100 border-t-amber-500 rounded-full animate-spin"></div>
            <span className="text-[10px] font-sans font-bold tracking-widest text-stone-400 mt-3 uppercase">Loading Design...</span>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center mb-3">
              <i className="fa-solid fa-door-open text-stone-300 text-lg"></i>
            </div>
            <span className="text-[11px] font-sans font-extrabold tracking-widest text-stone-400 uppercase">VK {100 + item.id}</span>
            <span className="text-[9px] font-sans text-stone-400 mt-1 uppercase tracking-wider">Premium Wooden Door</span>
          </>
        )}
      </div>
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
                  : "💡 ADMIN ACTIVE: Click 'Add Link' on any card to update its design using a direct Image URL."}
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
                  <LookbookImage
                    src={item.customImage}
                    alt={item.title}
                    className="w-full h-auto block select-none pointer-events-none transition-transform duration-500 group-hover:scale-103 bg-transparent"
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
                      <i className="fa-solid fa-link" />
                      <span>Add Link</span>
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
                    Click to add a direct image link for this new design
                  </p>
                </div>

                <div className="p-3.5 text-center bg-stone-100/40 border-t border-stone-200/50 flex justify-center">
                  <button
                    onClick={() => openUploadModal(nextId)}
                    className="inline-flex items-center space-x-1 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-link" />
                    <span>Add Link</span>
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
                  Enter the 4-digit verification code to access the image link system.
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
                  Provide a direct image URL (link) for this design. (e.g., from an image hosting service, Google Drive public link, etc.) The system will display this image across the application.
                </p>
              </div>

              <form onSubmit={handleSaveUploadedImage} className="space-y-4">
                {/* Drag and Drop Zone */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-stone-300 bg-stone-50 hover:bg-stone-100'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="imageUpload" 
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-stone-400 mb-3 hover:-translate-y-1 transition-transform"></i>
                    <p className="text-sm font-bold text-stone-700 font-sans">Tap to upload or drag image here</p>
                    <p className="text-[10px] text-stone-500 mt-1 uppercase font-bold tracking-wider">Fast auto-compression built-in</p>
                  </label>
                </div>

                <div className="flex items-center my-2">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="mx-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">OR PASTE LINK</span>
                    <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <div className="space-y-3">
                  <input
                    type="url"
                    placeholder="https://i.postimg.cc/example.jpg"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    className="w-full text-sm font-sans font-medium py-3 px-4 border border-stone-300 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                {previewUrl && (
                  <div className="h-48 rounded-xl border border-stone-200 overflow-hidden relative bg-stone-100 flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Link preview" 
                      className="absolute inset-0 w-full h-full object-contain p-2 z-10"
                      onError={() => setUploadFeedback("⚠️ Image link seems broken or not public.")}
                    />
                  </div>
                )}

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
                <LookbookDetailImage
                  src={selectedItem.customImage}
                  alt={selectedItem.title}
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
