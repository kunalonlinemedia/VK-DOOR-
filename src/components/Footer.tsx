import { useState, useEffect } from 'react';

interface FooterProps {
  currentPage: 'home' | 'about' | 'contact' | 'lookbook';
  setPage: (page: 'home' | 'about' | 'contact' | 'lookbook') => void;
}

export default function Footer({ currentPage, setPage }: FooterProps) {
  const [logoState, setLogoState] = useState<'VK' | '1992'>('VK');

  // Synced 5-second switching logo
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoState((prev) => (prev === 'VK' ? '1992' : 'VK'));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const logoText = logoState === 'VK' ? 'VK DOOR' : 'Since 1992';
  const logoDotColor = logoState === 'VK' ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <footer className="bg-brand-dark text-stone-300 w-full p-8 md:p-14 font-bricolage relative overflow-hidden mt-10">
      {/* Subtle elegant backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#3a2c1d] via-[#1C1A17] to-[#1C1A17] opacity-65 z-0" />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 space-y-8 text-center flex flex-col items-center justify-center">
        
        <div className="space-y-4 max-w-2xl mx-auto border-b border-stone-800/80 pb-8 w-full flex flex-col items-center">
          {/* Centered Logo with dynamic switcher logic matching header */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-white font-bricolage transition-all duration-300 ease-in-out opacity-100 select-none">
              {logoText}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${logoDotColor} transition-colors duration-500`} />
          </div>
          
          <p className="text-xs text-stone-400 leading-relaxed font-normal">
            Thank you for visiting <strong className="text-white font-bold">VK DOOR</strong>. We are committed to crafting premium architectural timber panels with timeless design, superior security, and natural resilience. Helping shape fine homes and workspaces since 1992.
          </p>

          {/* Centered Quick Links (Excluding currently open page) */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-wider font-semibold text-stone-500 pt-2 font-bricolage">
            {currentPage !== 'home' && (
              <button 
                onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors cursor-pointer select-none"
              >
                Home
              </button>
            )}
            {currentPage !== 'lookbook' && (
              <button 
                onClick={() => { setPage('lookbook'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors cursor-pointer select-none"
              >
                Design Gallery
              </button>
            )}
            {currentPage !== 'about' && (
              <button 
                onClick={() => { setPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors cursor-pointer select-none"
              >
                Company About Us
              </button>
            )}
            {currentPage !== 'contact' && (
              <button 
                onClick={() => { setPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-white transition-colors cursor-pointer select-none"
              >
                Contact Us
              </button>
            )}
          </div>
        </div>
        
        {/* Centered Consultation WhatsApp Button */}
        <div className="flex justify-center w-full">
          <a 
            href={`https://wa.me/919050050120?text=${encodeURIComponent('Namaste! Mujhe aapke products ke baare me jankari chahiye. Mera detail/sawal hai: ')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white hover:bg-[#20ba5a] active:scale-95 transition-all rounded-full text-xs font-bold tracking-wide flex items-center space-x-1.5 shadow-sm"
          >
            <i className="fab fa-whatsapp text-sm" />
            <span>Get Professional Consultation</span>
          </a>
        </div>
        
        {/* Centered Copyright details */}
        <div className="w-full text-center text-[11px] text-stone-500 font-normal pt-2">
          <p>© 2026 VK DOOR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
