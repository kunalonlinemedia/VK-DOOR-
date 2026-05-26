import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Star, 
  Camera, 
  Upload, 
  User, 
  Calendar, 
  CheckCircle, 
  X, 
  Sparkles, 
  MessageSquare,
  BarChart3,
  Image as ImageIcon,
  Home,
  Trash2
} from 'lucide-react';

export interface CustomerReview {
  id: string;
  name: string;
  rating: number; // 1 to 5
  feedback: string;
  photoUrl: string; // Base64 compressed representation
  timestamp: number;
}

// Low compression quality for high definition (0.85) while staying safely inside Firestore limits
const compressImageToHD = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Fit within HD limits e.g. 1400px side
        const MAX_WIDTH = 1400;
        const MAX_HEIGHT = 1400;
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

        // WebP high-grade compression at 0.85 & fallback
        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        if (dataUrl.length > 900000) {
          // If still too large, compress slightly more to stay inside Firestore limits
          dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        }
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form states
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [uploadedBase64, setUploadedBase64] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // File capture and drag-drop cues
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Active fullscreen lightbox/viewer for HD photos
  const [selectedHDPhoto, setSelectedHDPhoto] = useState<string | null>(null);

  // Delete item on demand
  const handleDeleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, "customer-reviews", id));
    } catch (err) {
      console.error("Failed to delete review: ", err);
    }
  };

  // Firestore live collection connection
  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "customer-reviews"), (snapshot) => {
      const fbReviews = snapshot.docs.map(docRef => {
        const data = docRef.data() as CustomerReview;
        const nameL = (data.name || '').toLowerCase();
        const feedbackL = (data.feedback || '').toLowerCase();
        
        // Auto-purge any test logs and test variants from Firestore storage
        const isTest = nameL.includes('test') || feedbackL.includes('test') || 
                       nameL.includes('demo') || feedbackL.includes('demo') ||
                       nameL.includes('checking') || feedbackL.includes('checking') ||
                       nameL.includes('kunal') || nameL.includes('admin') || 
                       nameL === 'hello' || nameL === 'abc' || nameL === 'asd' ||
                       feedbackL.includes('fake') || feedbackL.includes('dummy');

        if (isTest) {
          deleteDoc(docRef.ref).catch((err: any) => console.error("Auto-delete failed: ", err));
        }
        return data;
      });

      // Pure filter on localized state for pristine security
      const filtered = fbReviews.filter(r => {
        const nameL = (r.name || '').toLowerCase();
        const feedbackL = (r.feedback || '').toLowerCase();
        const isTest = nameL.includes('test') || feedbackL.includes('test') || 
                       nameL.includes('demo') || feedbackL.includes('demo') ||
                       nameL.includes('checking') || feedbackL.includes('checking') ||
                       nameL.includes('kunal') || nameL.includes('admin') || 
                       nameL === 'hello' || nameL === 'abc' || nameL === 'asd' ||
                       feedbackL.includes('fake') || feedbackL.includes('dummy');
        return !isTest && r.name.trim().length > 0;
      });

      // Sort newest first
      const sorted = filtered.sort((a, b) => b.timestamp - a.timestamp);
      setReviewsList(sorted);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Listen Error: ", error);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  // Compute rating metrics & aggregates
  const totalReviews = reviewsList.length;
  const ratingSpread = {
    5: reviewsList.filter(r => r.rating === 5).length,
    4: reviewsList.filter(r => r.rating === 4).length,
    3: reviewsList.filter(r => r.rating === 3).length,
    2: reviewsList.filter(r => r.rating === 2).length,
    1: reviewsList.filter(r => r.rating === 1).length,
  };

  const averageRating = totalReviews > 0 
    ? Number((reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
    : 5.0;

  // File processors
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage("Please select an image file only.");
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const hdRepresentation = await compressImageToHD(file);
      setUploadedBase64(hdRepresentation);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not process the selected image. Please try another photo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImageFile(e.target.files[0]);
    }
  };

  // Submit functions (Upload "Done")
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      setErrorMessage("Please write your name.");
      return;
    }
    if (!uploadedBase64) {
      setErrorMessage("Please upload or click a photo of your installed VK Door.");
      return;
    }
    if (!feedbackText.trim()) {
      setErrorMessage("Please write down your feedback.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const newReview: CustomerReview = {
        id: reviewId,
        name: customerName.trim(),
        rating: selectedRating,
        feedback: feedbackText.trim(),
        photoUrl: uploadedBase64,
        timestamp: Date.now()
      };

      await setDoc(doc(db, "customer-reviews", reviewId), newReview);
      
      // Clean up & trigger Success UI
      setFormSuccess(true);
      setCustomerName('');
      setSelectedRating(5);
      setFeedbackText('');
      setUploadedBase64('');
      
      setTimeout(() => {
        setFormSuccess(false);
      }, 7000);

    } catch (err: any) {
      console.error("Firestore Upload Error: ", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'create',
        path: 'customer-reviews'
      };
      console.error('Firestore Error Payload:', JSON.stringify(errInfo));
      setErrorMessage("Server error: Unable to publish. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16 font-bricolage text-brand-dark max-w-6xl mx-auto px-4 md:px-0">
      
      {/* HEADER STATEMENT (PREMIUM ENGLISH TRIPLE GRID ARCHITECTURE) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-black text-black bg-neutral-900/10 px-4 py-1.5 rounded-full uppercase tracking-widest font-sans inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-black" /> Customer Happiness Hub
        </span>
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-neutral-900 tracking-tight">
          VK DOOR <span className="font-light italic text-stone-600">Client Installations</span>
        </h1>
        <p className="text-stone-500 text-sm md:text-base font-sans leading-relaxed max-w-2xl mx-auto">
          Behold the real results of premium architectural timber doors styled inside our clients' gorgeous residences. View authentic high-definition installations, and publish your own experience below.
        </p>
      </div>

      {/* PREMIUM SOLID BLACK GUARANTEES HEADER CORNER */}
      <div className="bg-white border-y md:border border-neutral-900/10 py-6 px-8 rounded-none md:rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
            <Home className="w-5 h-5 text-black" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Perfect Fit Guarantee</h3>
            <p className="text-[11px] font-sans text-stone-400 leading-normal">
              Precision seasoned timber panels calibrated to match standard frame openings flawlessly.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 border-t md:border-t-0 md:border-x border-neutral-900/10 pt-4 md:pt-0 md:px-6">
          <div className="p-2.5 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
            <CheckCircle className="w-5 h-5 text-black" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Secured Verification</h3>
            <p className="text-[11px] font-sans text-stone-400 leading-normal">
              100% genuine inputs protected from marketing spam. Your feedback is fully validated.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="p-2.5 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
            <ImageIcon className="w-5 h-5 text-black" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">Preserved HD Imagery</h3>
            <p className="text-[11px] font-sans text-stone-400 leading-normal">
              All installation pictures are rendered in full, crisp definition to capture fine grains.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: THE PREMIUM FEEDBACK SUBMISSION ENGINE (40%) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[2rem] border border-neutral-900/15 p-6 md:p-8 shadow-sm relative overflow-hidden space-y-6">
            
            {/* Elegant Top Border Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-black" />
            
            <div className="space-y-1 pb-1">
              <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-black" /> Share Installation
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                Once doors are lag-fitted at your home, capture, rate, and press Publish!
              </p>
            </div>

            <AnimatePresence mode="wait">
              {formSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-50 border border-neutral-900/10 rounded-2xl p-6 text-center space-y-4 py-10"
                >
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-neutral-900 text-lg">Upload Successful!</h3>
                    <p className="text-stone-500 text-xs font-sans px-2 leading-relaxed">
                      Thank you for joining the VK DOOR family of happy homeowners! Your custom door is now live inside our public portfolio gallery.
                    </p>
                  </div>
                  <button 
                    onClick={() => setFormSuccess(false)}
                    className="text-xs font-bold font-sans text-white bg-black px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-all active:scale-95"
                  >
                    Publish Another Photo
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-4 h-4 text-black" /> Your Full Name <span className="text-stone-400 font-normal">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Rajesh Kumar"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs font-sans px-4 py-3 rounded-xl border border-neutral-900/10 bg-stone-50 hover:border-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                    />
                  </div>

                  {/* 5-Star Rating Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-widest block">
                      Star Rating
                    </label>
                    <div className="bg-stone-50 border border-neutral-900/10 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isActive = starVal <= selectedRating;
                          return (
                            <button
                              type="button"
                              key={starVal}
                              onClick={() => setSelectedRating(starVal)}
                              className="focus:outline-none transition-transform active:scale-125 hover:scale-110"
                            >
                              <Star 
                                className={`w-8 h-8 transition-colors ${
                                  isActive 
                                    ? 'fill-amber-500 text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]' 
                                    : 'text-stone-300 hover:text-amber-400/50'
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-black text-black tracking-wide uppercase">
                        {selectedRating === 5 && "⭐⭐⭐⭐⭐ Gold Standard (5/5)"}
                        {selectedRating === 4 && "⭐⭐⭐⭐ Very Good Satisfaction (4/5)"}
                        {selectedRating === 3 && "⭐⭐⭐ Standard Quality (3/5)"}
                        {selectedRating === 2 && "⭐⭐ Average Fitting (2/5)"}
                        {selectedRating === 1 && "⭐ Needs Improvement (1/5)"}
                      </span>
                    </div>
                  </div>

                  {/* Image collector block */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-black" /> Door Installation Photo <span className="text-stone-400 font-normal">*</span>
                    </label>

                    {/* Hidden Native File Inputs */}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <input 
                      type="file" 
                      ref={cameraInputRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {uploadedBase64 ? (
                      <div className="relative rounded-2xl overflow-hidden border border-black bg-stone-900 group aspect-video">
                        <img 
                          src={uploadedBase64} 
                          alt="VK Door Pre-upload"
                          className="w-full h-full object-cover opacity-90 transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setUploadedBase64('')}
                            className="bg-black hover:bg-neutral-900 text-white rounded-full p-2.5 shadow-lg active:scale-90 transition-transform flex items-center justify-center border border-white/20"
                            title="Remove Photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border border-dashed rounded-2xl p-5 text-center transition-all ${
                          dragActive 
                            ? 'border-black bg-neutral-50 scale-[1.01]' 
                            : 'border-stone-200 hover:border-black/55 bg-stone-50/50'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black">
                            <Upload className="w-5 h-5 text-black" />
                          </div>
                          
                          <div className="space-y-1 block">
                            <p className="text-[11px] font-bold text-stone-700">
                              Drag snapshot here, or choose source
                            </p>
                            <p className="text-[9px] text-stone-400 font-sans uppercase tracking-wider">
                              Supports raw JPEG/PNG • Auto-optimized to HD WebP
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 w-full pt-1.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white hover:bg-stone-50 text-black border border-stone-200 rounded-xl py-2 px-1 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-black" /> Browse File
                            </button>
                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="bg-black hover:bg-neutral-800 text-white rounded-xl py-2 px-1 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                            >
                              <Camera className="w-3.5 h-3.5 text-white" /> Click Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-black" /> Your Feedback / Review <span className="text-stone-400 font-normal">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="How is the wood quality, custom carving, premium finish, or carpentry fitting?"
                      className="w-full text-xs font-sans px-4 py-3 rounded-xl border border-neutral-900/10 bg-stone-50 hover:border-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-[11px] font-sans font-bold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl">
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit done button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-stone-400 cursor-not-allowed' 
                        : 'bg-black hover:bg-neutral-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Publish
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-stone-400 font-sans text-center">
                    Secured submissions linked instantly to the public VK DOOR portfolio log.
                  </p>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: REVIEWS ANALYTICS DASHBOARD & DETAILED LIST (80%) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STATS ANALYTICS VISUAL CORNER */}
          <div className="bg-stone-50 rounded-[2rem] border border-neutral-900/10 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-black flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-black" /> Live Rating Metrics
                </h2>
                <p className="text-xs text-stone-400 font-sans">
                  Sourced from real-time customer data point clusters
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-black text-neutral-900 leading-none">{averageRating}</p>
                  <p className="text-[9px] font-sans font-bold text-stone-400 uppercase tracking-widest pt-0.5">Avg Score</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex text-black">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-black text-black" />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#222] font-sans font-bold leading-normal">
                    {totalReviews} Verified Customer Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Progress Distribution Bars */}
            <div className="space-y-3 font-sans">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingSpread[stars as keyof typeof ratingSpread] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="grid grid-cols-12 items-center gap-3">
                    <span className="col-span-2 text-xs font-bold text-stone-600 whitespace-nowrap flex items-center gap-1 justify-end">
                      {stars} <Star className="w-3 h-3 fill-black text-black" />
                    </span>
                    <div className="col-span-8 h-2.5 bg-stone-200/50 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-black"
                      />
                    </div>
                    <span className="col-span-2 text-[10px] font-semibold text-stone-600">
                      {count} {count === 1 ? 'review' : 'reviews'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE REVIEWS HD GALLERY LIST */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="inline-flex items-center bg-black text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest select-none shadow-sm cursor-default border border-neutral-800 whitespace-nowrap">
                Customer Gallery
              </div>
              <div className="h-0.5 flex-1 bg-stone-200/50 min-w-[15px] hidden sm:block" />
              <span className="text-[9px] whitespace-nowrap font-bold text-stone-400 uppercase tracking-widest font-sans bg-stone-50 border border-neutral-900/10 px-2.5 py-1 rounded-full select-none">
                Pruned &amp; Genuine
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-2">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-black rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-400 font-sans tracking-wider uppercase font-semibold">Loading installations...</p>
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="border border-neutral-900/10 border-dashed rounded-3xl p-12 text-center space-y-4 bg-white">
                <div className="h-12 w-12 bg-neutral-100 text-black rounded-full flex items-center justify-center mx-auto text-xl">
                  🖼️
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">No Client Photos Yet</h4>
                  <p className="text-xs text-stone-400 font-sans mt-1 max-w-sm mx-auto">
                    Be the very first VK DOOR homeowner to publish a scenic installation picture! Tap "Share Installation" on the left to begin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence>
                  {reviewsList.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.5) }}
                      className="bg-white rounded-3xl border border-neutral-900/10 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                    >
                      {/* Full Photo HD Container */}
                      <div className="relative w-full aspect-[4/5] bg-stone-900 flex items-center justify-center overflow-hidden">
                        <img 
                          src={review.photoUrl} 
                          alt={`${review.name}'s installed door`}
                          onClick={() => setSelectedHDPhoto(review.photoUrl)}
                          className="w-full h-full object-cover opacity-95 hover:scale-[1.03] transition-all cursor-zoom-in"
                          referrerPolicy="no-referrer"
                        />
                        {/* Overlay Rating badge with luxury yellow star representation */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-neutral-900/10 z-10">
                          <span className="text-[10px] font-black text-black flex items-center gap-0.5">
                            {review.rating} <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                          </span>
                        </div>
                      </div>

                      {/* Info & Feedback Details */}
                      <div className="p-4 space-y-3 bg-white">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                              {review.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                              {review.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2.5">
                            <span className="text-[9px] text-stone-400 font-bold font-sans flex items-center gap-1 select-none">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              {new Date(review.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}
                            </span>

                            {/* Discrete Premium Delete Action */}
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-stone-300 hover:text-red-600 transition-colors duration-200 p-1 rounded-md hover:bg-stone-100 flex items-center justify-center"
                              title="Delete review log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 min-h-[45px]">
                          <p className="text-[11px] sm:text-xs text-stone-500 leading-normal font-sans italic">
                            "{review.feedback}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN HD LIGHTBOX VIEWER */}
      <AnimatePresence>
        {selectedHDPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/98 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedHDPhoto(null)}
          >
            <button 
              onClick={() => setSelectedHDPhoto(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-white/20 active:scale-95 text-white p-3 rounded-full transition-all border border-white/10 flex items-center justify-center"
              style={{ zIndex: 10001 }}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-h-screen max-w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl mr-2 ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedHDPhoto} 
                alt="Fullscreen Door Installation HD Photo"
                className="max-h-[85vh] max-w-[95vw] sm:max-h-[90vh] sm:max-w-[85vw] object-contain rounded-2xl border border-white/10 shadow-2xl pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[10px] font-bold tracking-widest font-mono select-none border border-white/10 uppercase">
                VK DOOR • True High Definition Gallery Masterpiece
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
