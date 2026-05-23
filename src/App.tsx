import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Lookbook from './components/Lookbook';

export default function App() {
  const [page, setPage] = useState<'home' | 'about' | 'contact' | 'lookbook'>('home');

  // Page switching & smooth scroll logic
  const handleNavigateAnchor = (anchorId: string) => {
    if (page !== 'home') {
      setPage('home');
      // Delay slightly to allow the home page DOM to mount
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Setup security constraints & swipe gestures from the original code
  useEffect(() => {
    // 1. Right Click blocker
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', preventContextMenu);

    // 2. Keyboard F12 or Copy command blocker
    const preventKeyActions = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'u' || e.key === 'U')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventKeyActions);

    // 3. Prevent text copy event
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    document.addEventListener('copy', preventCopy);

    // 4. Prevent text selection start
    const preventSelectStart = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener('selectstart', preventSelectStart);

    // 5. Prevent dragging of images to prevent downloads
    const preventDragStart = (e: DragEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };
    document.addEventListener('dragstart', preventDragStart);

    // 6. Swipe gesture detection (for returning to home or going back)
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX < 30) {
        if (touchEndX > touchStartX + 50) {
          // If in sub-page, swipe-right returns to home page
          if (page !== 'home') {
            setPage('home');
          } else {
            window.history.back();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Dynamic scroll reveal observer mockup helper
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    reveals.forEach((el) => el.classList.add('active'));

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventKeyActions);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('selectstart', preventSelectStart);
      document.removeEventListener('dragstart', preventDragStart);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [page]);

  // Clean trigger to scroll to top every time page state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [page]);

  return (
    <div className="noise-texture text-brand-dark min-h-screen relative font-sans antialiased selection:bg-brand-gold selection:text-white bg-white">
      {/* GLOBAL FRAME WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-12 relative z-10">
        
        {/* SHARED HEADER NAVIGATION */}
        <Header 
          currentPage={page} 
          setPage={setPage} 
          onNavigateAnchor={handleNavigateAnchor} 
        />

        {/* ACTIVE MAIN CONTENT AREA */}
        <main className="min-h-[60vh] transition-all duration-300">
          {page === 'home' && <Home />}
          {page === 'about' && <About />}
          {page === 'contact' && <Contact />}
          {page === 'lookbook' && <Lookbook />}
        </main>
      </div>

      {/* COMPLETED SHARED FOOTER WITH REVOLUTIONIZED CONTEXT LINKS S/O */}
      <Footer 
        currentPage={page} 
        setPage={setPage} 
      />
    </div>
  );
}
