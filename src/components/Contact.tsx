import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const sendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert("Please fill in the required details.");
      return;
    }

    const subjectText = `Hello VK DOOR,\n\nI filled the contact form on your website:\n\n*Name:* ${name}\n*Mobile:* ${mobile}\n*Location:* ${location}\n*Message:* ${message}`;
    const encodedText = encodeURIComponent(subjectText);
    const waUrl = `https://wa.me/919050050120?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 relative overflow-hidden flex flex-col items-center justify-center min-h-[35vh] shadow-sm">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] hero-glow pointer-events-none z-0" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl">
          <div className="inline-block">
            <p className="font-bricolage text-sm uppercase tracking-[0.25em] font-semibold text-[#000000]">
              Connect With Us
            </p>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-tight tracking-tight text-stone-900">
            Reach Out & <br />
            <span className="italic text-[#000000] font-normal">Let's Connect</span>.
          </h1>

          <div className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-stone-500 uppercase flex items-center justify-center space-x-2 sm:space-x-4 pt-2">
            <span>Inquiries</span>
            <span className="h-1 w-1 rounded-full bg-black/60" />
            <span>Support</span>
            <span className="h-1 w-1 rounded-full bg-black/60" />
            <span>Locations</span>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT GRID (Split into Details + Map & Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
          
        {/* LEFT COLUMN (Contact Details & Maps) */}
        <div className="lg:col-span-7 space-y-12">
            
          {/* Section: Contact details */}
          <section className="reveal-on-scroll space-y-6 active-reveal">
            <div className="space-y-2 border-b border-stone-200/60 pb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Direct Line</span>
              <h2 className="font-bricolage text-2xl font-extrabold text-[#D32F2F] uppercase">Contact Details</h2>
            </div>

            <div className="space-y-6 text-xs font-sans">
              {/* Founder Details */}
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-[#000000] flex-shrink-0">
                  <i className="fa-solid fa-user-tie text-xs" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Founder</p>
                  <p className="font-bold text-stone-900 text-sm whitespace-nowrap"><strong className="text-[#D32F2F] font-bold">Vinod Kumar Jangra</strong></p>
                  <a href="tel:+919416193735" className="text-[#008000] hover:underline font-bold text-sm inline-block">+91 94161 93735</a>
                </div>
              </div>

              {/* CEO Details */}
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-[#000000] flex-shrink-0">
                  <i className="fa-solid fa-id-card-clip text-xs" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Company CEO</p>
                  <p className="font-bold text-stone-900 text-sm whitespace-nowrap"><strong className="text-[#1565C0] font-bold">Rajkumar Jangra</strong></p>
                  <div className="space-x-4">
                    <a href="tel:+919050120110" className="text-[#008000] hover:underline font-bold text-sm inline-block mr-4">+91 90501 20110</a>
                    <a href="tel:+918221800345" className="text-[#008000] hover:underline font-bold text-sm inline-block">+91 82218 00345</a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct Link */}
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-[#000000] flex-shrink-0">
                  <i className="fab fa-whatsapp text-xs" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Chat On WhatsApp</p>
                  <p className="font-bold text-stone-900 text-sm whitespace-nowrap"><strong className="text-[#1565C0] font-bold">Rajkumar Jangra</strong> <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded ml-2">CEO</span></p>
                  <a href="https://wa.me/919050120110" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-bold text-sm inline-block">+91 90501 20110</a>
                </div>
              </div>

              {/* Shipping Policy */}
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-[#000000] flex-shrink-0">
                  <i className="fa-solid fa-truck text-xs" />
                </div>
                <div className="space-y-1 leading-relaxed">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Domestic & International Shipping</p>
                  <p className="font-bold text-stone-900 text-sm whitespace-nowrap"><strong className="text-[#000000] font-bold">All Over India</strong></p>
                  <span className="text-[10px] text-stone-400 font-bold tracking-wide block uppercase">Coming Soon Global Shipping</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Find us map */}
          <section className="reveal-on-scroll space-y-6 border-t border-stone-200/60 pt-8 active-reveal">
            <div className="space-y-2 pb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Google Maps</span>
              <h2 className="font-bricolage text-2xl font-extrabold text-[#1565C0] uppercase">Find Us On Google</h2>
            </div>

            {/* Factory Location Block */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-xs font-sans">
                <i className="fa-solid fa-industry text-stone-400 text-sm" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Factory Location</p>
                  <p className="font-bold text-stone-800">Sarsana - Basra Road, Near Balsamand, Dist. Hisar 125001, Haryana, India</p>
                </div>
              </div>
              <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-brand-border/40 bg-stone-50 shadow-sm relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Sarsana+Basra+Road,+Hisar&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  title="Factory Location Map"
                  className="absolute inset-0 w-full h-full border-none" 
                />
              </div>
            </div>

            {/* Showroom Location Block */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center space-x-3 text-xs font-sans">
                <i className="fa-solid fa-store text-stone-400 text-sm" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider font-bricolage">Showroom Location</p>
                  <p className="font-bold text-stone-800">Vishwakarma Chowk, Bhadra 335501, Rajasthan, India</p>
                  <p className="text-[10px] text-stone-400 mt-1 font-semibold">Landmark: Mahindra Tractor Agency (Tirupati Automobile)</p>
                </div>
              </div>
              <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-brand-border/40 bg-stone-50 shadow-sm relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Vishwakarma+Chowk,+Bhadra&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  title="Showroom Location Map"
                  className="absolute inset-0 w-full h-full border-none" 
                />
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Form & Social Media) */}
        <div className="lg:col-span-15 lg:col-span-5 space-y-12">
            
          {/* Section: Inquiry Form */}
          <section className="reveal-on-scroll space-y-6 active-reveal">
            <div className="space-y-2 border-b border-stone-200/60 pb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Digital Inquiry</span>
              <h2 className="font-bricolage text-2xl font-extrabold text-[#D32F2F] uppercase">Let's Get In Touch</h2>
            </div>

            <form onSubmit={sendWhatsApp} className="space-y-5 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-500 uppercase tracking-wider text-[10px]">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-brand-border/50 bg-stone-50/50 focus:outline-none focus:border-brand-gold focus:bg-white text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-500 uppercase tracking-wider text-[10px]">Mobile Number</label>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-brand-border/50 bg-stone-50/50 focus:outline-none focus:border-brand-gold focus:bg-white text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-500 uppercase tracking-wider text-[10px]">Location (City)</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city/state" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-brand-border/50 bg-stone-50/50 focus:outline-none focus:border-brand-gold focus:bg-white text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-500 uppercase tracking-wider text-[10px]">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3} 
                  placeholder="Describe your doors/windows custom requirements..." 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-brand-border/50 bg-stone-50/50 focus:outline-none focus:border-brand-gold focus:bg-white text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
              {/* Green Dynamic Submit Button with active tap scaling effect */}
              <button 
                type="submit" 
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bricolage font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-[0.95] flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <i className="fab fa-whatsapp text-sm animate-pulse" />
                <span>Send Details on WhatsApp</span>
              </button>
            </form>
          </section>

          {/* Section: Social Media */}
          <section className="reveal-on-scroll space-y-6 border-t border-stone-200/60 pt-8 active-reveal">
            <div className="space-y-2 pb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Corporate Networks</span>
              <h2 className="font-bricolage text-2xl font-extrabold text-[#000000] uppercase">Social Media</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 font-bricolage">
              {/* Instagram Link */}
              <a href="https://www.instagram.com/vkdoor.in?igsh=eHEzMmZrbnkwa3U4" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3.5 bg-stone-50 hover:bg-stone-100/75 border border-brand-border/40 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-sm">
                  <i className="fab fa-instagram" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Instagram</p>
                  <p className="text-xs font-bold text-stone-900">Vkdoor.in</p>
                </div>
              </a>
              {/* Facebook Link */}
              <a href="#facebook" className="flex items-center space-x-3 p-3.5 bg-stone-50 hover:bg-stone-100/75 border border-brand-border/40 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white text-sm">
                  <i className="fab fa-facebook-f" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Facebook</p>
                  <p className="text-xs font-bold text-stone-900">Facebook</p>
                </div>
              </a>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
