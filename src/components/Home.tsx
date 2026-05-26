import React, { useState, useEffect, useRef, MouseEvent } from 'react';

const ORDER_ADVISORY = [
  {
    title: "50% एडवांस भुगतान",
    desc: "50% एडवांस राशि देने पर ही आर्डर पक्का माना जायेगा।"
  },
  {
    title: "लॉक फिटिंग चार्ज",
    desc: "दरवाजे में लॉक फिटिंग का चार्ज अलग से देय होगा।"
  },
  {
    title: "प्राकृतिक सफेदी",
    desc: "दरवाजों में लगभग 8 से 10 प्रतिशत प्राकृतिक सफेदी (Sapwood) होना सामान्य है।"
  },
  {
    title: "मानक माप प्रणाली",
    desc: "दरवाजे व खिड़कियों की पैमाईस मानक (Standard Size) के आधार पर ही की जाएगी।"
  },
  {
    title: "एकतरफा डिजाइन दरें",
    desc: "सभी दरवाजो के बुनियादी रेट सिंगल साइड डिजाइन के हैं। डबल साइड डिजाइन के रेट अलग से चार्ज होंगे।"
  },
  {
    title: "निःशुल्क 4mm ग्लास",
    desc: "दरवाजों व खिड़कियों मे 4 एम. एम. प्लेन ग्लास हमारी तरफ से रहेगा। यदि ग्लास का कोई भी अन्य डिजाईन या रंगीन ग्लास चहिये, तो उसका चार्ज अलग से होगा।"
  },
  {
    title: "चौखट अतिरिक्त कार्य",
    desc: "चौखट की विशेष मोल्डिंग, फिक्स ग्लास और फिक्स ग्लास की लकड़ी की गोलाई (गोला) का काम अलग से चार्ज होगा।"
  },
  {
    title: "पॉलिश एवं पेंट शुल्क",
    desc: "दरवाजो व खिड़कियों की पॉलिश व पेन्ट का चार्ज अलग से लिया जाएगा।"
  },
  {
    title: "हार्डवेयर का सामान",
    desc: "दरवाजे-खिड़की के हैंडल, कुंडी, ताला आदि सभी प्रकार का हार्डवेयर सामान मालिक (ग्राहक) का होगा।"
  },
  {
    title: "टैक्स व परिवहन किराया",
    desc: "GST, परिवहन किराया (मालभाड़ा), लोडिंग व सुरक्षित पैकिंग का चार्ज अलग से जोड़ा जाएगा।"
  },
  {
    title: "पूर्ण भुगतान आवश्यक",
    desc: "फैक्ट्री से माल तभी रवाना किया जाएगा जब 100% पेमेंट (पूर्ण भुगतान) जमा हो।"
  }
];

const TECHNICAL_ADVISORY = [
  {
    title: "सूखी लकड़ी (Seasoned Wood)",
    desc: "हमारी कंपनी में सारी लकड़ियां पूरी तरह सूखी हैं। इसमें घटने-बढ़ने व क्रैक होने के 80% चांस नहीं हैं। सीजनिंग होने के कारण मौसम का इस पर ज्यादा प्रभाव नहीं पड़ता।"
  },
  {
    title: "मौसम का 80% प्रभाव कवर",
    desc: "लकड़ी का दरवाजा 80% मौसम के प्रभाव (Weather Effect) को कवर कर सकता है। बाकी का 20% प्राकृतिक कारणों से कवर नहीं हो सकता व जगह न मिलने पर लकड़ी क्रैक भी हो सकती है। यदि दरवाजा सीधे धूप व पानी में हो तो प्रभाव दोगुना हो जाता है, अंदर के द्वारों में यह प्रभाव आधा रह जाता है।"
  },
  {
    title: "नमी का असंतुलन (Twisting)",
    desc: "यदि लकड़ी को एक तरफ से नमी मिल रही हो और दूसरी तरफ से हवा सूखी हो, तो उसमें ऐंठ आना स्वाभाविक है, क्योंकि लकड़ी एक साइड में मॉइस्चर अब्जॉर्ब कर रही है और दूसरी तरफ से नहीं। इसके कारण लकड़ियों में क्रैक इत्यादि आना शुरू हो सकते हैं।"
  },
  {
    title: "लकड़ी जीवित है (Touch Wood)",
    desc: "लकड़ी जीवन में कभी भी पूरी तरह 'डैड' (मृत) नहीं हो सकती। यह प्राकृतिक रूप से सांस लेती है, जिसका अर्थ है मौसम अनुसार घटना-बढ़ना इसके साथ ही रहता है। बेहतर सीजनिंग व सर्वश्रेष्ठ सुरक्षा के बाद भी हम सिर्फ 80% मौसम प्रभाव ही नियंत्रित रख सकते हैं। इसकी नियमित समय-समय पर मेंटेनेंस करते रहें और धूप-नमी से बचाएं।"
  },
  {
    title: "माइल्ड प्राकृतिक भिन्नताएं",
    desc: "आधुनिक तकनीकों के बाद भी लकड़ी के प्राकृतिक रेशों के कारण मामूली फ्रैंक (बारीक दरार), सूक्ष्म जॉइंट वेरिएशन व हल्का-फुल्का घटना-बढ़ना आना स्वाभाविक है।"
  },
  {
    title: "स्थिर होने का समय (Setting)",
    desc: "नए दरवाजों को आपके चोखट स्थल पर पूरी तरह से सेट होने में कम से कम एक पूरे मौसम (One Season) का वक्त लगता है। इसके बाद वह प्रॉपर स्थिर हो जाता है, बशर्ते दरवाजे पर अच्छी पॉलिश, पेंट या मेंटेनेंस की गई हो।"
  },
  {
    title: "सन लाइन का प्रभाव (Sun Line)",
    desc: "सीएनसी (Carving/नक्काशी) के दरवाजों के काम में बारीक सन लाइन (Sun Line) की धारियां दिखना प्राकृतिक है।"
  },
  {
    title: "अनिवार्य रखरखाव",
    desc: "कीमती लकड़ी के द्वारों की देखभाल जरूरी है। नियमित रूप से सूखी धूल-सफाई करें, लकड़ी को सूखा रखें और नमी से बचाकर पेंट या पॉलिश को मेंटेन रखें।"
  },
  {
    title: "फायदे और नुकसान की समझ",
    desc: "यदि आप लकड़ी के सुंदर दरवाजे बनवाने का निर्णय ले रहे हैं, तो इसके इन प्राकृतिक फायदों और प्राकृतिक मौसम संबंधी स्वभावों को अवश्य ध्यान में रखें।"
  }
];

export default function Home() {
  // Wood type switcher selection
  const [woodIndex, setWoodIndex] = useState<number>(0);

  // Auto sliding carousel wood carousel
  const [activeSlide, setActiveSlide] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3D Door Card Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0, isActive: false });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setTilt({ x: rotateX, y: rotateY, isActive: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, isActive: false });
  };

  // Wood tab details
  const woodSpecs = [
    {
      name: 'Teak Wood (Sagwan)',
      text: 'Teak wood is premium timber recognized for its outstanding golden shade and high weather-resistance. With rich natural oils, it stays immune to moisture and pests, making it our primary recommendation for main exterior entrance systems.',
      glow: 'from-amber-600/15',
    },
    {
      name: 'Sheesham Wood (Rosewood)',
      text: 'Highly respected for its gorgeous dark grain contrasting, Sheesham delivers robust density and structural hardness. Our craftsmen utilize seasoned Sheesham wood to make highly detailed carved panels and high-strength frames.',
      glow: 'from-amber-950/25',
    },
    {
      name: 'Dake Wood (Bakain)',
      text: 'A modern, sustainable hardwood with beautiful linear grain textures and lighter restoration. Excellent for contemporary interior designs, windows, and smooth framing details requiring clean aesthetic lines.',
      glow: 'from-amber-400/10',
    }
  ];

  // Form states
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formRequirement, setFormRequirement] = useState('');
  const [formLocation, setFormLocation] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMobile) {
      alert("Please fill in both Name and Mobile Number details to continue.");
      return;
    }
    const message = `Hello VK DOOR,\n\nI filled the enquiry form on your website:\n\n*Name:* ${formName}\n*Mobile:* ${formMobile}\n*Requirement:* ${formRequirement || 'N/A'}\n*Location:* ${formLocation || 'N/A'}`;
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/919050050120?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="bg-white rounded-[2.5rem] border border-brand-border/50 p-8 pb-0 md:p-16 md:pb-0 relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
        {/* Glow Sphere behind the product */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] hero-glow pointer-events-none z-0" />

        <div className="relative z-10 text-center space-y-4 md:space-y-5 max-w-4xl">
          {/* Glowing Badge */}
          <div className="inline-block">
            <p className="font-bricolage text-sm uppercase tracking-[0.25em] font-semibold light-glow-text">
              It's Wooden Now
            </p>
          </div>

          {/* Editorial Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-tight tracking-tight text-stone-900">
            Build Premium Wooden <br />
            <span className="italic text-brand-wood font-normal">Doors & Brand Experience</span>.
          </h1>

          {/* Subtext Line */}
          <div className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-stone-500 uppercase flex items-center justify-center space-x-2 sm:space-x-4 pt-2">
            <span>Elegance</span>
            <span className="h-1 w-1 rounded-full bg-brand-wood/60" />
            <span>Craftsmanship</span>
            <span className="h-1 w-1 rounded-full bg-brand-wood/60" />
            <span>Durability</span>
          </div>
        </div>

        {/* Interactive 3D Card Area with Bigger Door and NO EXTRA PADDING ABOVE/BELOW IMAGE */}
        <div className="relative w-full max-w-xs sm:max-w-sm h-auto mt-4 sm:mt-5 z-10 flex items-end justify-center perspective-container">
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.isActive ? 1.05 : 1})`,
              transition: tilt.isActive ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="relative w-[190px] sm:w-[260px] md:w-[310px] cursor-grab active:cursor-grabbing transition-all duration-300 flex items-end justify-center bg-transparent rounded-none border-0 overflow-visible"
          >
            {/* Real Wooden Door Image with Object Contain - Configured to fit exactly */}
            <img 
              src="https://i.postimg.cc/xTWDVSCk/20260522135754195.png" 
              alt="Premium Wooden Door" 
              className="w-full h-auto block pointer-events-none select-none drop-shadow-[0_20px_45px_rgba(139,90,43,0.32)] filter"
            />
          </div>
        </div>
      </section>

      {/* LEADING WOODEN DOOR MANUFACTURER SECTION */}
      <section id="about" className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 relative overflow-hidden shadow-sm active-reveal text-stone-800">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Elegant wooden subtitle */}
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-brand-wood font-bricolage">Heritage & Innovation</span>
          {/* Title in Bricolage Grotesque font */}
          <h2 className="font-bricolage text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight animate-black-brown">
            LEADING WOODEN DOOR MANUFACTURER FROM INDIA
          </h2>
          {/* Details Description in Bricolage Grotesque */}
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-bricolage font-normal max-w-3xl mx-auto">
            Elevate your home with <span className="whitespace-nowrap text-brand-wood font-bold">VK DOOR</span>, India’s leading luxury wooden door manufacturer. We combine precision machinery with meticulous craftsmanship to create exquisite, custom-made doors that blend artistry and innovation seamlessly. From pre-hung convenience to solid security, <span className="whitespace-nowrap">VK DOOR</span> offers an unparalleled selection of high-lasting doors crafted exclusively for discerning homeowners.
          </p>
        </div>
      </section>

      {/* MATERIALS CONTAINER (Detailed tab switcher) */}
      <section id="materials" className="reveal-on-scroll grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch active-reveal">
        {/* Left Side: Wood tab switcher */}
        <div className="lg:col-span-6 bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs tracking-widest uppercase font-bold text-stone-400 block mb-6 font-bricolage">01 / Material Selection</span>
            <h2 className="font-bricolage text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-stone-950">Naturally aged timber for generational durability.</h2>
            
            {/* Dynamic Text Blocks */}
            <div className="min-h-[160px]">
              <div className="space-y-4 font-bricolage">
                <h3 className="text-xl font-bold text-brand-dark">{woodSpecs[woodIndex].name}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-normal">{woodSpecs[woodIndex].text}</p>
              </div>
            </div>
          </div>

          {/* Custom Slider Switch Controls in Bricolage Grotesque */}
          <div className="flex items-center space-x-6 mt-8 border-t border-stone-300/50 pt-6 font-bricolage">
            <button 
              onClick={() => setWoodIndex(0)} 
              className={`text-xs font-semibold py-1 transition-all ${
                woodIndex === 0 ? 'border-b-2 border-brand-dark text-brand-dark font-extrabold' : 'text-stone-400 hover:text-brand-dark'
              }`}
            >
              01. Teak
            </button>
            <button 
              onClick={() => setWoodIndex(1)} 
              className={`text-xs font-semibold py-1 transition-all ${
                woodIndex === 1 ? 'border-b-2 border-brand-dark text-brand-dark font-extrabold' : 'text-stone-400 hover:text-brand-dark'
              }`}
            >
              02. Sheesham
            </button>
            <button 
              onClick={() => setWoodIndex(2)} 
              className={`text-xs font-semibold py-1 transition-all ${
                woodIndex === 2 ? 'border-b-2 border-brand-dark text-brand-dark font-extrabold' : 'text-stone-400 hover:text-brand-dark'
              }`}
            >
              03. Dake
            </button>
          </div>
        </div>

        {/* Right Side: Auto-Sliding Wood Images inside a Single Small Card (Oversized display inside the card) */}
        <div className="lg:col-span-6 bg-white rounded-[2.5rem] border border-brand-border/50 p-8 flex flex-col justify-center items-center relative overflow-hidden min-h-[420px]">
          <div className={`absolute inset-0 bg-gradient-to-br ${woodSpecs[woodIndex].glow} to-transparent blur-3xl transition-all duration-500`} />
          <span className="text-[10px] tracking-widest text-stone-400 uppercase font-bold relative z-10 mb-6 font-bricolage">Auto-Sliding Wood Types</span>
          
          {/* Single Small Card Container with Auto side scroll system */}
          <div className="relative overflow-hidden w-full max-w-[340px] aspect-[1.15/1] rounded-[2rem] border border-brand-border/40 bg-stone-50 p-3 shadow-inner z-10">
            <div 
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              className="flex w-full h-full transition-transform duration-700 ease-in-out"
            >
              {/* Slide 1 (Teak Wood - Configured to display fully) */}
              <div className="w-full h-full flex-shrink-0 p-4 flex flex-col justify-between rounded-2xl relative overflow-hidden bg-stone-100">
                <img src="https://i.postimg.cc/Dy40PBs2/fd538faf-14da-47da-818a-1ed00915359b.png" alt="Teak Wood" className="absolute inset-0 w-full h-full object-contain p-2" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent z-10" />
                <span className="z-20 text-[9px] font-mono tracking-widest text-white/95 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full uppercase w-max font-semibold font-bricolage">Teak Wood</span>
                <span className="z-20 text-white font-bricolage text-base font-bold">Sagwan</span>
              </div>
              {/* Slide 2 (Sheesham Wood - Configured to display fully) */}
              <div className="w-full h-full flex-shrink-0 p-4 flex flex-col justify-between rounded-2xl relative overflow-hidden bg-stone-100">
                <img src="https://i.postimg.cc/XqGjxYZ3/854b203a-b6ef-4bdd-bf08-4e888c1019c8.png" alt="Sheesham Wood" className="absolute inset-0 w-full h-full object-contain p-2" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent z-10" />
                <span className="z-20 text-[9px] font-mono tracking-widest text-white/95 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full uppercase w-max font-semibold font-bricolage">Sheesham Wood</span>
                <span className="z-20 text-white font-bricolage text-base font-bold">Rosewood</span>
              </div>
              {/* Slide 3 (Dake Wood - Configured to display fully) */}
              <div className="w-full h-full flex-shrink-0 p-4 flex flex-col justify-between rounded-2xl relative overflow-hidden bg-stone-100">
                <img src="https://i.postimg.cc/g0zGQDw3/48e6ae17-4264-4ea7-8688-0062a93b21ed.png" alt="Dake Wood" className="absolute inset-0 w-full h-full object-contain p-2" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent z-10" />
                <span className="z-20 text-[9px] font-mono tracking-widest text-white/95 bg-brand-dark/80 backdrop-blur-md px-3 py-1 rounded-full uppercase w-max font-semibold font-bricolage">Dake Wood</span>
                <span className="z-20 text-white font-bricolage text-base font-bold">Bakain</span>
              </div>
            </div>
            
            {/* Tiny slide-tracker dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 0 ? 'bg-white' : 'bg-white/40'}`} />
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 1 ? 'bg-white' : 'bg-white/40'}`} />
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 2 ? 'bg-white' : 'bg-white/40'}`} />
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-stone-400 mt-6 font-medium font-bricolage">Automatic cycle running continuously</div>
        </div>
      </section>

      {/* CUSTOM DOOR SECTION WITH GRAPHICS */}
      <section className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden active-reveal text-stone-800">
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-brand-wood font-bricolage">Bespoke Architectural Engineering</span>
          {/* Title in Bricolage Grotesque */}
          <h2 className="font-bricolage text-3xl sm:text-4xl font-black tracking-tight animate-black-brown">
            CUSTOM DOOR
          </h2>
          {/* Details Description in Bricolage Grotesque */}
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-bricolage font-normal">
            From rustic warmth to modern minimalism, explore unique design possibilities with <span className="whitespace-nowrap text-brand-wood font-bold">VK DOOR</span>. Our wide selection of wood species, finishes, and hardware allows you to craft a door as unique as you are. Let your imagination be your guide, and together, we’ll turn your dream door into a reality.
          </p>
        </div>

        {/* Premium Style Architectural Schema Graphic (Right Side) */}
        <div className="lg:col-span-5 flex justify-center relative z-10 w-full">
          <div className="w-full max-w-[320px] aspect-[4/5] border border-brand-border/70 rounded-2xl bg-brand-light p-6 flex flex-col justify-between shadow-inner relative">
            {/* Technical Grid lines overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl pointer-events-none" />
            
            {/* Schematic Door Graphics drawing lines */}
            <div className="border border-brand-wood/40 w-full h-[85%] rounded relative flex flex-col justify-around p-3 bg-white/40">
              <div className="border border-brand-wood/30 h-[28%] rounded bg-white/60" />
              <div className="border border-brand-wood/30 h-[58%] rounded bg-white/60 flex items-center justify-between px-3">
                <span className="w-[1px] h-full bg-brand-wood/20" />
                <span className="w-1.5 h-4 bg-brand-wood/60 rounded" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
              <span>SCALE: 1:15</span>
              <span>VK_CUSTOM_D_09</span>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSHOP VIEW SECTION */}
      <section className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 space-y-10 shadow-sm relative overflow-hidden active-reveal">
        <div className="max-w-2xl space-y-4">
          {/* Title in Bricolage Grotesque */}
          <h2 className="font-bricolage text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark">WorkShop View</h2>
          {/* Workshop details in Bricolage Grotesque */}
          <p className="text-stone-500 text-sm md:text-base leading-relaxed font-bricolage font-normal">
            Step inside our modern production plant. Our facility utilizes vacuum kiln seasoning tunnels alongside high-end computerized calibration networks. Here, we run precision sawing setups and expert manual styling checks to turn crude premium timber logs into engineered masterpiece frameworks.
          </p>
        </div>

        {/* 10 Small size Image Holders */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 font-bricolage">
          {/* Holder 1 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">01 / LOG SELECTION</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" /></svg>
            </div>
          </div>
          {/* Holder 2 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">02 / KILN DRYING</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
            </div>
          </div>
          {/* Holder 3 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">03 / MOISTURE SCAN</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
            </div>
          </div>
          {/* Holder 4 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">04 / SIZING & SLICE</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75-4.5h10.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 5.25v7.5a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
          </div>
          {/* Holder 5 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">05 / HYDRAULIC GLUE</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
          </div>
          {/* Holder 6 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">06 / CNC ROUTING</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 1019.5 18.75l-5.83-5.83m-2.25 2.25a2.25 2.25 0 11-3.182-3.182 2.25 2.25 0 013.182 3.182zm2.25-2.25h-.008v.008H13.5v-.008z" /></svg>
            </div>
          </div>
          {/* Holder 7 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">07 / HAND FINISH</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.078 0L2.25 18.412a2.25 2.25 0 001.125 3.903h17.25a2.25 2.25 0 001.125-3.903l-4.202-2.29a3 3 0 00-3.078 0L9.53 16.122zM12 13.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" /></svg>
            </div>
          </div>
          {/* Holder 8 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">08 / HARDWARE FIT</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
            </div>
          </div>
          {/* Holder 9 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">09 / SEAL COAT</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v17.792M14.25 3.104v17.792" /></svg>
            </div>
          </div>
          {/* Holder 10 */}
          <div className="aspect-square bg-stone-50 rounded-2xl border border-brand-border/40 p-4 flex flex-col justify-between hover:shadow-md transition-all">
            <span className="text-[10px] font-mono text-stone-400 font-bold">10 / QUALITY CERT</span>
            <div className="w-6 h-6 text-brand-gold self-end">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP GRID */}
      <section id="products" className="reveal-on-scroll space-y-8 font-bricolage active-reveal">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Our Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">Custom Architectural Carpentry</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 (Doors) */}
          <div className="bg-white rounded-[2rem] border border-brand-border/50 p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="1" />
                <rect x="7" y="5" width="4" height="6" rx="0.5" />
                <rect x="13" y="5" width="4" height="6" rx="0.5" />
                <rect x="7" y="13" width="4" height="6" rx="0.5" />
                <rect x="13" y="13" width="4" height="6" rx="0.5" />
                <circle cx="17" cy="11.5" r="0.75" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark">Wooden Doors</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-normal">Custom main entrance double doors, modern modular panel models, and high-security solid interior panels.</p>
            </div>
          </div>

          {/* Card 2 (Windows) */}
          <div className="bg-white rounded-[2rem] border border-brand-border/50 p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="1" />
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <rect x="6" y="6" width="4" height="4" rx="0.5" opacity="0.3" fill="currentColor" />
                <rect x="14" y="6" width="4" height="4" rx="0.5" opacity="0.3" fill="currentColor" />
                <rect x="6" y="14" width="4" height="4" rx="0.5" opacity="0.3" fill="currentColor" />
                <rect x="14" y="14" width="4" height="4" rx="0.5" opacity="0.3" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark">Wooden Windows</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-normal">French windows, heavy-duty sliding casements, and vintage glass pane framing options.</p>
            </div>
          </div>

          {/* Card 3 (Mouldings) */}
          <div className="bg-white rounded-[2rem] border border-brand-border/50 p-8 md:p-10 space-y-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 20h16M6 17h12M8 14h8M10 11h4" strokeLinecap="round" />
                <path d="M4 4h16v16H4V4z" opacity="0.25" />
                <path d="M6 6h12v14H6V6z" opacity="0.5" />
                <path d="M12 4v16" strokeDasharray="2 2" opacity="0.75" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark">Frames, Mouldings & Chaukhats</h3>
              <p className="text-sm text-stone-500 leading-relaxed font-normal">High-precision door/window framing chaukhats, modern designer architraves, skirtings, and decorative trim profiles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER ADVISORY & GUIDELINES (HINDI - TEXT SMALL) */}
      <section className="reveal-on-scroll bg-[#FAF9F5]/40 rounded-[2rem] border border-brand-border/40 p-6 md:p-10 space-y-8 active-reveal font-sans">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold text-brand-wood uppercase tracking-widest bg-brand-light px-3 py-1 rounded-full">
            Customer Guide • आवश्यक दिशा-निर्देश
          </span>
          <h2 className="text-xl md:text-2xl font-black text-brand-dark font-bricolage">
            महत्वपूर्ण दिशानिर्देश और जानकारी
          </h2>
          <p className="text-[11px] text-stone-400 max-w-md mx-auto">
            उत्कृष्ट फिनिशिंग, समय पर डिलीवरी और लकड़ी के द्वारों के सर्वोत्तम रखरखाव के लिए कृपया इन महत्वपूर्ण बातों को ध्यानपूर्वक पढ़ें।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order guidelines column */}
          <div className="bg-white rounded-2xl border border-brand-border/30 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center text-brand-wood text-[11px]">
                📝
              </div>
              <div>
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-tight font-bricolage">
                  कृपया ऑर्डर से पहले ध्यान दें...
                </h3>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold">Order Terms &amp; Conditions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {ORDER_ADVISORY.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="flex-none w-4 h-4 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-[9px] font-bold text-brand-wood mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 leading-normal">
                    <span className="font-semibold text-stone-800 pr-1">{point.title}:</span>{point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical and weather specifications column */}
          <div className="bg-white rounded-2xl border border-brand-border/30 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center text-brand-wood text-[11px]">
                ⚙️
              </div>
              <div>
                <h3 className="text-xs font-bold text-brand-dark uppercase tracking-tight font-bricolage">
                  कुछ तकनीकी बातें जिनपर हमें गौर करना चाहिए
                </h3>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold">Technical &amp; Wood Care</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {TECHNICAL_ADVISORY.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="flex-none w-4 h-4 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-[9px] font-bold text-amber-600/80 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 leading-normal">
                    <span className="font-semibold text-stone-800 pr-1">{point.title}:</span>{point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-brand-border/10">
          <p className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold font-bricolage">
            © VK DOOR • SINCERE WOOD CRAFTING SINCE 1992
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 shadow-sm font-bricolage space-y-10 active-reveal text-stone-800">
        <div className="text-center max-w-xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Core Values & Strengths</span>
          <h2 className="text-3xl md:text-4xl font-black leading-tight animate-black-brown animate-black-brown-heading">Why Choose Us</h2>
        </div>

        {/* Grid container for the 6 points with detailed matching SVGs with vibrant design color accents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* 1. UNMATCHED PRICE */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 001.59 0l5.881-5.881a1.125 1.125 0 000-1.59l-9.581-9.581A2.25 2.25 0 009.568 3z" />
                  <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">1. UNMATCHED PRICE</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Unbeatable prices for premium wooden doors! Get top-quality craftsmanship, durability, and style without overspending. Luxury meets affordability like never before.</p>
            </div>
          </div>

          {/* 2. TWIST & BEND RESISTANT */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.25 5.25l13.5 13.5M18.75 5.25l-13.5 13.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">2. TWIST & BEND RESISTANT</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Engineered for strength! Our wooden doors are twist & bend resistant, ensuring long-lasting durability and perfect shape for years.</p>
            </div>
          </div>

          {/* 3. CUSTOM MADE */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">3. CUSTOM MADE</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Tailored to perfection! Our custom-made wooden doors are designed to match your style, size, and finish for a unique touch.</p>
            </div>
          </div>

          {/* 4. TERMITE RESISTANT */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">4. TERMITE RESISTANT</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Shielded against termites! Our termite-resistant wooden doors ensure lasting durability, keeping your home protected and stylish for years.</p>
            </div>
          </div>

          {/* 5. 100% NATURAL WOOD */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">5. 100% NATURAL WOOD</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Crafted from 100% natural wood, our doors bring unmatched strength, elegance, and authenticity, ensuring a timeless and durable addition to your space.</p>
            </div>
          </div>

          {" "}
          {/* 6. 34+ YEARS OF EXPERIENCE */}
          <div className="bg-stone-50/50 hover:bg-white rounded-2xl border border-brand-border/40 p-6 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-wood shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.75a1.125 1.125 0 01-1.125-1.125V11.25m9 7.5V11.25M7.5 11.25H16.5M12 3v3" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-brand-dark uppercase tracking-tight">6. 34+ YEARS OF EXPERIENCE</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal font-normal">Since 1992, we’ve built years of expertise in crafting premium wooden doors, delivering unmatched quality, durability, and elegance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH FORM CARD */}
      <section id="contact" className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-6 md:p-12 shadow-sm font-bricolage space-y-8 active-reveal">
        <div className="text-center max-w-md mx-auto space-y-3">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Enquiry System</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">Get In Touch</h2>
          <p className="text-xs text-stone-500 font-normal">Enter your requirement details below to dynamically generate and submit your enquiry to our official WhatsApp sales line.</p>
        </div>

        {/* Form Wrapper with internal architectural alignment */}
        <div className="max-w-md mx-auto bg-stone-50/50 p-5 md:p-7 rounded-3xl border border-brand-border/40 space-y-5">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Name</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name" 
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:outline-none focus:border-brand-gold text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Mobile Number</label>
                <input 
                  type="tel" 
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  placeholder="Enter phone number" 
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:outline-none focus:border-brand-gold text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Requirement</label>
              <textarea 
                value={formRequirement}
                onChange={(e) => setFormRequirement(e.target.value)}
                rows={3} 
                placeholder="Describe the doors, windows, wood types or custom sizes required..." 
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:outline-none focus:border-brand-gold text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">Location</label>
              <input 
                type="text" 
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="City, State" 
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:outline-none focus:border-brand-gold text-xs font-medium text-brand-dark transition-all placeholder:text-stone-400" 
              />
            </div>

            {/* Interactive Button with instant tap feel */}
            <button 
              type="submit"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-100 active:scale-[0.97] focus:outline-none flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.472 5.358 1.473 5.348 0 9.7-4.351 9.703-9.702.002-2.593-1.007-5.031-2.842-6.866C16.983 2.224 14.54 1.21 11.99 1.21c-5.353 0-9.709 4.357-9.712 9.708-.002 2.18.58 4.15 1.587 5.75L2.833 21.05l4.526-1.187-.712-.709z" />
              </svg>
              <span>Send on WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* REGISTERED BY SECTION (Featuring minimal brand verification badges with an Infinite Auto-Scroll) */}
      <section className="reveal-on-scroll bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-12 shadow-sm font-bricolage space-y-6 overflow-hidden active-reveal">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest text-[10px]">Corporate Validation</span>
          <h3 className="text-xl font-extrabold text-stone-800">Registered By</h3>
        </div>
        
        {/* Horizontal Carousel container (Infinite Right-to-Left Ticker scroll) */}
        <div className="relative w-full overflow-hidden py-4 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-white after:to-transparent">
          <div className="animate-ticker flex space-x-8 items-center">
            {/* Original Badge Items */}
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349120219.png" alt="Brand Logo 1" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349390201.png" alt="Brand Logo 2" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349540233.png" alt="Brand Logo 3" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212350110215.jpg" alt="Brand Logo 4" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>

            {/* Duplicated Items for seamless loop transition */}
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349120219.png" alt="Brand Logo 1" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349390201.png" alt="Brand Logo 2" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212349540233.png" alt="Brand Logo 3" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="flex-shrink-0 w-44 bg-stone-50/80 border border-brand-border/30 rounded-2xl p-4 flex items-center justify-center h-24 hover:shadow-sm transition-all duration-300">
              <img src="https://www.hostpic.org/images/2605212350110215.jpg" alt="Brand Logo 4" className="max-h-14 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
