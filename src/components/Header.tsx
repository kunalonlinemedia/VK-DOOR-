import { useState, useEffect } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'about' | 'contact' | 'lookbook';
  setPage: (page: 'home' | 'about' | 'contact' | 'lookbook') => void;
  onNavigateAnchor: (anchorId: string) => void;
}

export default function Header({ currentPage, setPage, onNavigateAnchor }: HeaderProps) {
  const [logoState, setLogoState] = useState<'VK' | '1992'>('VK');
  const [menuOpen, setMenuOpen] = useState(false);

  // Synced 5-second logo text switcher
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoState((prev) => (prev === 'VK' ? '1992' : 'VK'));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const logoText = logoState === 'VK' ? 'VK DOOR' : 'Since 1992';
  const logoDotColor = logoState === 'VK' ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <>
      {/* FIXED DRAWER MENU BACKDROP */}
      <div 
        id="menu-backdrop" 
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-500 bg-[#1C1A17]/60 backdrop-blur-3xl w-screen h-screen ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* FIXED COMPACT DROPDOWN DRAWERS */}
      <div 
        id="menu-drawer" 
        className={`fixed top-[76px] right-4 sm:right-6 md:right-10 w-[260px] bg-white border border-brand-border/60 shadow-2xl rounded-2xl z-50 transform transition-all duration-300 origin-top-right flex flex-col p-5 space-y-5 ${
          menuOpen ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto' : 'scale-95 translate-y-1 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2 pb-3 border-b border-brand-border/40">
          <span className="font-bricolage text-base font-bold tracking-tight text-brand-dark whitespace-nowrap">Menu</span>
          <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
        </div>

        <div className="flex flex-col space-y-2">
          <button 
            onClick={() => { setPage('home'); setMenuOpen(false); }}
            className={`w-full text-left font-bricolage text-xs font-semibold py-2.5 px-4 rounded-xl border border-brand-border/20 transition-all active:scale-[0.98] ${
              currentPage === 'home' 
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100/80 text-brand-dark'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => { setPage('lookbook'); setMenuOpen(false); }}
            className={`w-full text-left font-bricolage text-xs font-semibold py-2.5 px-4 rounded-xl border border-brand-border/20 transition-all active:scale-[0.98] ${
              currentPage === 'lookbook' 
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100/80 text-brand-dark'
            }`}
          >
            Design Lookbook & Gallery
          </button>
          <button 
            onClick={() => { setPage('about'); setMenuOpen(false); }}
            className={`w-full text-left font-bricolage text-xs font-semibold py-2.5 px-4 rounded-xl border border-brand-border/20 transition-all active:scale-[0.98] ${
              currentPage === 'about'
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100/80 text-brand-dark'
            }`}
          >
            Company About Us
          </button>
          <button 
            onClick={() => { setPage('contact'); setMenuOpen(false); }}
            className={`w-full text-left font-bricolage text-xs font-semibold py-2.5 px-4 rounded-xl border border-brand-border/20 transition-all active:scale-[0.98] ${
              currentPage === 'contact' 
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                : 'bg-stone-50 hover:bg-stone-100/80 text-brand-dark'
            }`}
          >
            Contact Us
          </button>
          <a 
            href={`https://wa.me/919050050120?text=${encodeURIComponent('Namaste! Mujhe aapke products ke baare me jankari chahiye. Mera detail/sawal hai: ')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full text-center font-bricolage text-xs font-bold py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] transition-all flex items-center justify-center text-white border border-[#25D366]"
          >
            WhatsApp
          </a>
        </div>

        <button 
          onClick={() => setMenuOpen(false)}
          className="w-full font-bricolage text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-xl bg-brand-dark hover:bg-stone-800 active:scale-95 transition-all text-white text-center"
        >
          OFF
        </button>
      </div>

      {/* HEADER BAR */}
      <header className="w-full flex justify-between items-center py-4 px-6 md:px-10 bg-white/75 backdrop-blur-md border border-brand-border/40 rounded-full transition-all relative z-30">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setPage('home')}
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <span className="font-bricolage text-2xl font-bold tracking-tight text-[#000000] whitespace-nowrap select-none transition-all duration-300">
              {logoText}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${logoDotColor} transition-colors duration-500`} />
          </button>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold tracking-wider uppercase text-stone-500 font-bricolage">
          <button 
            onClick={() => setPage('home')}
            className={`transition-all rounded-full px-3 py-1.5 ${
              currentPage === 'home' 
                ? 'bg-brand-dark text-white font-bold' 
                : 'hover:text-brand-dark text-stone-500'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigateAnchor('about')}
            className="hover:text-brand-dark text-stone-500 transition-colors py-1.5 px-0.5"
          >
            Our Craft
          </button>
          <button 
            onClick={() => onNavigateAnchor('materials')}
            className="hover:text-brand-dark text-stone-500 transition-colors py-1.5 px-0.5"
          >
            Premium Woods
          </button>
          <button 
            onClick={() => onNavigateAnchor('products')}
            className="hover:text-brand-dark text-stone-500 transition-colors py-1.5 px-0.5"
          >
            Products
          </button>
          
          <span className="h-4 w-[1px] bg-stone-200" />

          <button 
            onClick={() => setPage('lookbook')}
            className={`transition-all rounded-full px-3.5 py-1.5 border text-[11px] font-bold ${
              currentPage === 'lookbook'
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'border-amber-500/30 text-amber-600 hover:bg-amber-500/5 hover:border-amber-500/50'
            }`}
          >
            ⭐ Design Gallery
          </button>
          
          <button 
            onClick={() => setPage('about')}
            className={`transition-all rounded-full px-3.5 py-1.5 ${
              currentPage === 'about'
                ? 'bg-brand-dark text-white font-bold'
                : 'hover:text-brand-dark text-stone-500'
            }`}
          >
            Company About Us
          </button>
          
          <button 
            onClick={() => setPage('contact')}
            className={`transition-all rounded-full px-3.5 py-1.5 ${
              currentPage === 'contact'
                ? 'bg-brand-dark text-white font-bold'
                : 'hover:text-brand-dark text-stone-500'
            }`}
          >
            Contact Us
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <span className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold bg-stone-50 px-3 py-1.5 border border-brand-border/40 rounded-full select-none">
            <i className="fa-solid fa-chevron-left animate-pulse"></i> Swipe to Back
          </span>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center justify-center p-2.5 rounded-full hover:bg-stone-100/60 active:scale-90 transition-all focus:outline-none" 
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col space-y-1.5 w-5 h-5 items-center justify-center">
              <span className={`w-5 h-[2px] bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-[2px] bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[2px] bg-stone-700 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
