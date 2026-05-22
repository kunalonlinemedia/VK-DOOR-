export default function About() {
  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="bg-white rounded-[2.5rem] border border-brand-border/50 p-8 md:p-16 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh] shadow-sm">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] hero-glow pointer-events-none z-0" />

        <div className="relative z-10 text-center space-y-6 max-w-4xl">
          <div className="inline-block">
            <p className="font-bricolage text-sm uppercase tracking-[0.25em] font-semibold text-[#000000]">
              Established Legacy
            </p>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-tight tracking-tight text-stone-900">
            Our Roots & <br />
            <span className="italic text-[#000000] font-normal">Company Story</span>.
          </h1>

          <div className="text-[10px] sm:text-xs tracking-[0.2em] font-semibold text-stone-500 uppercase flex items-center justify-center space-x-2 sm:space-x-4 pt-2">
            <span>Trust</span>
            <span className="h-1 w-1 rounded-full bg-black/60" />
            <span>Commitment</span>
            <span className="h-1 w-1 rounded-full bg-black/60" />
            <span>Craftsmanship</span>
          </div>
        </div>
      </section>

      {/* OUR JOURNEY SECTION */}
      <section id="journey" className="reveal-on-scroll py-6 relative overflow-hidden active-reveal">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest font-bricolage">Our Narrative</span>
            <h2 className="font-bricolage text-3xl md:text-4xl font-extrabold tracking-tight text-brand-dark uppercase">
              Our Journey
            </h2>
            <div className="h-[1px] w-16 bg-brand-gold mx-auto" />
          </div>

          {/* Open Timeline Structure */}
          <div className="space-y-10 text-stone-600 font-sans text-xs md:text-sm leading-relaxed max-w-3xl mx-auto px-4">
            <div className="border-l border-black/30 pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-black" />
              <p className="italic text-stone-950 font-medium col-span-3">
                <strong className="whitespace-nowrap text-[#000000] font-bold">VK DOOR</strong> is not just a wooden door manufacturing company; it is a legacy built on hard work, trust, and generations of craftsmanship.
              </p>
            </div>

            <div className="border-l border-brand-border pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-stone-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">1992 · Foundation</span>
              <p>
                Our journey began in <strong className="text-stone-900">1992</strong> under the guidance of <strong className="text-[#D32F2F] whitespace-nowrap font-bold">Late Sh. Dharmpal Jangra</strong>, who started wooden door work at a local level. With limited resources but unlimited dedication, he focused on quality workmanship, honesty, and customer trust. His skills and values laid the foundation of what would later become <strong className="text-[#000000] font-bold">VK DOOR</strong>.
              </p>
            </div>

            <div className="border-l border-brand-border pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-stone-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">The Next Phase</span>
              <p>
                After the unfortunate passing of <strong className="text-[#D32F2F] whitespace-nowrap font-bold">Late Sh. Dharmpal Jangra</strong>, the responsibility of the business fell on his son, <strong className="text-[#D32F2F] whitespace-nowrap font-bold">Mr. Vinod Kumar Jangra</strong>. At a time filled with challenges and responsibilities, he showed strength, determination, and vision. Instead of giving up, he decided to move forward and take his father’s work to a new level.
              </p>
            </div>

            <div className="border-l border-brand-border pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-stone-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">Expansion & Modernity</span>
              <p>
                Through years of tireless effort, learning, and innovation, <strong className="text-[#D32F2F] whitespace-nowrap font-bold">Mr. Vinod Kumar Jangra</strong> expanded the business, improved manufacturing processes, and formally established the company under the name <strong className="whitespace-nowrap font-bold text-[#000000]">VK DOOR</strong>. What once started as local work gradually grew into a recognized wooden door manufacturing brand known for reliability.
              </p>
            </div>

            <div className="border-l border-brand-border pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-stone-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">Generation Handover</span>
              <p>
                Today, <strong className="whitespace-nowrap text-[#000000] font-bold">VK DOOR</strong> continues to grow with the involvement of the next generation. <strong className="text-[#1565C0] whitespace-nowrap font-bold">Mr. Rajkumar Jangra</strong>, son of <strong className="text-[#D32F2F] whitespace-nowrap font-bold">Mr. Vinod Kumar Jangra</strong>, has joined the business, bringing modern ideas, fresh energy, and updated techniques while respecting and preserving traditional craftsmanship. His involvement has strengthened operations and helped <strong className="whitespace-nowrap text-[#000000] font-bold">VK DOOR</strong> adapt to changing market demands.
              </p>
            </div>

            <div className="border-l border-brand-border pl-6 pb-2 space-y-3 relative">
              <span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-stone-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">2026 · Complete Support</span>
              <p>
                In addition, from the year <strong className="text-stone-900">2026</strong>, <strong className="text-[#1565C0] whitespace-nowrap font-bold">Mr. Kunal Jangra</strong>, brother of <strong className="text-[#1565C0] whitespace-nowrap font-bold">Mr. Rajkumar Jangra</strong>, has also become a part of <strong className="whitespace-nowrap text-[#000000] font-bold">VK DOOR</strong>. He actively supports and helps manage the business, contributing to daily operations, growth, and future expansion. His involvement further strengthens the family-driven foundation of the company.
              </p>
            </div>

            <div className="border-l border-black/30 pl-6 pb-2 space-y-2 relative">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-black" />
              <p>
                With more than <strong className="text-[#D32F2F] whitespace-nowrap font-bold">34 years</strong> of industry experience, <strong className="whitespace-nowrap text-[#000000] font-bold">VK DOOR</strong> specializes in manufacturing a wide range of wooden doors that are strong, durable, aesthetically appealing, and crafted to meet customer-specific requirements.
              </p>
            </div>
          </div>

          {/* Grand Luxury Accent Text */}
          <div className="text-center pt-4">
            <span className="font-luxury text-6xl md:text-8xl bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 bg-clip-text text-transparent select-none">Since 1992</span>
          </div>
        </div>
      </section>

      {/* INTRODUCTION, OVERVIEW, VISION & MISSION */}
      <section className="reveal-on-scroll grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-stretch border-t border-b border-stone-200/60 py-12 active-reveal">
        {/* Intro */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">01 / Introduction</span>
            <h3 className="font-bricolage text-xl font-extrabold text-[#1565C0]">Company Intro</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              <strong className="text-[#000000] font-bold">VK DOOR</strong> is a trusted wooden door manufacturing brand known for quality, craftsmanship, and long-lasting durability. Established in 1992, the company has grown from a small workshop into a professional manufacturing unit led by multiple generations of the Jangra family. We blend traditional woodworking skills with modern techniques to create premium wooden doors that enhance any space.
            </p>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">02 / Corporate Overview</span>
            <h3 className="font-bricolage text-xl font-extrabold text-[#D32F2F]">Company Overview</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              <strong className="text-[#000000] font-bold">VK DOOR</strong> is a family-led wooden door manufacturing company. Built on a foundation of trust, craftsmanship, and quality, we combine traditional skills with modern techniques to create durable, stylish, and high-quality wooden doors. With over 34 years of experience, we remain committed to excellence and innovation in every single product we deliver.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="space-y-3 flex flex-col justify-between border-t border-stone-100 pt-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">03 / Future Outlook</span>
            <h3 className="font-bricolage text-xl font-extrabold text-[#1565C0]">Our Vision</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              <strong className="text-[#000000] font-bold">VK DOOR</strong> envisions becoming a benchmark in the wooden door industry by shaping a future where craftsmanship and innovation work hand in hand. Our goal is to build a brand representing trust, refined quality, and timeless design. We strive to expand our presence, elevate our technology, and create products that redefine standards of durability.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="space-y-3 flex flex-col justify-between border-t border-stone-100 pt-8">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">04 / Core Operational Goal</span>
            <h3 className="font-bricolage text-xl font-extrabold text-[#D32F2F]">Our Mission</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              Our mission is to manufacture wooden doors with unmatched precision, reliability, and craftsmanship while maintaining complete dedication to customer satisfaction. We are committed to operating with discipline, advanced manufacturing practices, and continuous improvement, ensuring every door meets the highest standards.
            </p>
          </div>
        </div>
      </section>

      {/* OUR WORKSHOP & BRAND PROMISE */}
      <section className="reveal-on-scroll grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-stretch border-b border-stone-200/60 pb-12 active-reveal">
        {/* Block 1: Workshop */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Behind The Scenes</span>
            <h3 className="font-bricolage text-xl font-extrabold text-stone-950">Our Workshop</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              Our workshop combines skilled craftsmanship with modern machinery to create high-quality wooden doors. Every step, from material selection to finishing, is handled with precision and strict quality control to ensure durability and flawless results.
            </p>
          </div>
        </div>

        {/* Block 2: Brand Promise */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-bricolage">Our Dedication</span>
            <h3 className="font-bricolage text-xl font-extrabold text-[#000000]">The VK DOOR Promise</h3>
            <p className="text-stone-500 font-sans text-xs leading-relaxed">
              <strong className="text-[#000000] font-bold">VK DOOR</strong> promises to deliver wooden doors that embody strength, beauty, and long-lasting quality. Every product we craft reflects our commitment to precision, honesty, and customer satisfaction. We provide trusted quality you can feel and durability you can rely on.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="reveal-on-scroll py-6 font-bricolage space-y-10 border-t border-stone-200/60 pt-12 active-reveal">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Philosophy</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">Core Values</h2>
          <div className="h-[1px] w-16 bg-brand-gold mx-auto" />
        </div>

        {/* Sleek Minimalist Rows */}
        <div className="max-w-4xl mx-auto divide-y divide-stone-100 text-xs font-sans">
          
          {/* Value 1 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-compass-drafting text-xs text-black" />
              <span>1. Quality Craftsmanship</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              We take pride in delivering doors made with precision, strength, and attention to every detail.
            </div>
          </div>

          {/* Value 2 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-handshake text-xs text-black" />
              <span>2. Trust & Transparency</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              Honesty is at the heart of our business, ensuring clear communication and reliable service.
            </div>
          </div>

          {/* Value 3 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-users text-xs text-black" />
              <span>3. Customer Commitment</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              We focus on understanding customer needs and providing products that offer long-lasting value.
            </div>
          </div>

          {/* Value 4 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-gears text-xs text-black" />
              <span>4. Innovation & Improvement</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              We continuously upgrade our processes, techniques, and designs to stay ahead of industry standards.
            </div>
          </div>

          {/* Value 5 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-crown text-xs text-black" />
              <span>5. Family Legacy</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              Our work reflects generations of dedication, values, and craftsmanship carried forward with pride.
            </div>
          </div>

          {/* Value 6 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-shield-halved text-xs text-black" />
              <span>6. Durability & Reliability</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              Every door we produce is built to last, offering dependable performance for years.
            </div>
          </div>

          {/* Value 7 */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="flex items-center space-x-2 text-[#000000] font-bold font-bricolage">
              <i className="fa-solid fa-medal text-xs text-black" />
              <span>7. Integrity in Work</span>
            </div>
            <div className="sm:col-span-2 text-stone-500 font-normal">
              We deliver exactly what we promise without compromise in quality or ethics.
            </div>
          </div>

        </div>
      </section>

      {/* UNIQUE SELLING POINTS */}
      <section className="reveal-on-scroll space-y-8 font-bricolage border-t border-stone-200/60 pt-12 active-reveal">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Why VK DOOR Stands Out</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">Unique Selling Points</h2>
        </div>

        {/* Grid with borderless minimal typographic entries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 text-xs font-sans">
          {/* USP 1 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">01. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Superior Craftsmanship</h3>
            <p className="text-stone-500 font-normal">Every door is crafted with precision, combining traditional skills with modern standards.</p>
          </div>
          {/* USP 2 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">02. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Premium Quality Wood</h3>
            <p className="text-stone-500 font-normal">We use high-grade, durable wood ensuring long life, strength, and excellent performance.</p>
          </div>
          {/* USP 3 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">03. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">34+ Years of Expertise</h3>
            <p className="text-stone-500 font-normal">Decades of hands-on experience allow us to deliver products that truly stand out in the industry.</p>
          </div>
          {/* USP 4 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">04. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Custom-Made Designs</h3>
            <p className="text-stone-500 font-normal">From size to style, we offer fully customizable wooden doors tailored to your specific needs.</p>
          </div>
          {/* USP 5 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">05. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Family-Led Legacy</h3>
            <p className="text-stone-500 font-normal">A trusted brand built on generations of dedication, honesty, and consistent workmanship.</p>
          </div>
          {/* USP 6 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">06. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Advanced Manufacturing</h3>
            <p className="text-stone-500 font-normal">Modern techniques and updated machinery ensure flawless finishing and consistent quality.</p>
          </div>
          {/* USP 7 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">07. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Strong Construction</h3>
            <p className="text-stone-500 font-normal">Our doors are built to withstand daily heavy use, climate variations, and long-term wear.</p>
          </div>
          {/* USP 8 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">08. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Trustworthy Service</h3>
            <p className="text-stone-500 font-normal">From consultation to delivery, we maintain complete transparency and timely communication.</p>
          </div>
          {/* USP 9 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">09. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Aesthetic Appeal</h3>
            <p className="text-stone-500 font-normal">We create doors that are not only strong but also stylish, adding elegance to any space.</p>
          </div>
          {/* USP 10 */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <span className="text-[10px] font-mono font-bold text-stone-400 font-bricolage">10. USP</span>
            <h3 className="font-bold text-brand-dark font-bricolage">Tested Reliability</h3>
            <p className="text-stone-500 font-normal">Every single product is thoroughly tested for performance, durability, and finishing before delivery.</p>
          </div>
        </div>
      </section>

      {/* PRODUCT LINE SECTION */}
      <section className="reveal-on-scroll py-6 font-bricolage space-y-6 border-t border-stone-200/60 pt-12 active-reveal">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Product Catalog Overview</span>
          <h3 className="text-2xl font-extrabold text-stone-900">Our Products</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-door-closed text-black" />
            <span>Wooden Doors</span>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-door-open text-black" />
            <span>Designer Doors</span>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-door-closed text-black" />
            <span>Flush Doors</span>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-window-maximize text-black" />
            <span>Windows</span>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-door-closed text-black" />
            <span>Plywood Doors</span>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-stone-200 bg-white flex items-center space-x-2 text-stone-700 text-xs font-bold hover:border-brand-gold transition-colors">
            <i className="fa-solid fa-wand-magic-sparkles text-black" />
            <span>Custom-Designed Doors</span>
          </div>
        </div>
      </section>

      {/* CORPORATE & BUSINESS INFORMATION */}
      <section className="reveal-on-scroll py-6 font-bricolage space-y-10 border-t border-stone-200/60 pt-12 active-reveal">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Transparency Data</span>
          <h3 className="text-2xl font-extrabold text-stone-900">Business Information</h3>
          <div className="h-[1px] w-16 bg-brand-gold mx-auto" />
        </div>

        {/* Highly Detailed Spaced Editorial Table Layout */}
        <div className="max-w-3xl mx-auto space-y-6 text-xs px-4">
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Business Name</span>
              <span className="font-bold text-[#000000] text-xs">VK DOOR</span>
            </div>
            
            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Established Since</span>
              <span className="font-bold text-brand-dark text-xs">Year 1992</span>
            </div>
            
            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Business Type</span>
              <span className="font-bold text-brand-dark text-xs">Wooden Door Manufacturer / Supplier</span>
            </div>
            
            {/* Row 4 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Founder</span>
              <span className="font-semibold text-brand-dark text-xs">
                <span className="text-[#1565C0] whitespace-nowrap font-bold">Mr. Vinod Kumar</span> S/o <span className="text-[#D32F2F] whitespace-nowrap font-bold">Late Sh. Dharampal Jangra</span>
              </span>
            </div>
            
            {/* Row 5 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Company CEO</span>
              <span className="font-semibold text-brand-dark text-xs">
                <span className="text-[#1565C0] whitespace-nowrap font-bold">Mr. Rajkumar</span> S/o <span className="text-[#D32F2F] whitespace-nowrap font-bold">Mr. Vinod Kumar Jangra</span>
              </span>
            </div>
            
            {/* Row 6 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">GSTIN</span>
              <span className="font-mono font-bold text-brand-dark text-xs bg-stone-100/80 px-2 py-0.5 rounded">06AXYPK8354Q1Z8</span>
            </div>
            
            {/* Row 7 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Estimated Turnover</span>
              <span className="font-bold text-brand-dark text-xs">2 - 4 Cr</span>
            </div>
            
            {/* Row 8 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 border-b border-stone-200/50 gap-1">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Total Strength</span>
              <span className="font-bold text-brand-dark text-xs">5 - 10 People</span>
            </div>
            
            {/* Row 9 */}
            <div className="flex flex-col py-3.5 border-b border-stone-200/50 gap-1.5 text-left">
              <span className="text-stone-400 uppercase font-bold tracking-wider text-[10px]">Factory Location Address</span>
              <span className="font-bold text-brand-dark text-xs font-sans leading-relaxed">Sarsana - Basra Road, Near Balsamand, Dist. Hisar, 125001 (Haryana) India</span>
            </div>
          </div>

          {/* Spaced & Detailed Contacts Section */}
          <div className="pt-6">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest block mb-4 font-bold border-b border-stone-200 pb-2">Contact Details</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Production & Quality Head</p>
                <p className="font-bold text-stone-900 whitespace-nowrap text-sm">Mr. Vinod Kumar Jangra</p>
                <a href="tel:+919416193735" className="text-emerald-600 hover:underline font-bold text-sm inline-block pt-1">+91 94161 93735</a>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Business Management & Sales</p>
                <p className="font-bold text-stone-900 whitespace-nowrap text-sm">Mr. Rajkumar Jangra</p>
                <a href="tel:+919050120110" className="text-emerald-600 hover:underline font-bold text-sm inline-block pt-1 mr-4">+91 90501 20110</a>
                <a href="tel:+918221800345" className="text-emerald-600 hover:underline font-bold text-sm inline-block pt-1">+91 82218 00345</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAKE IN INDIA BADGE SECTION */}
      <section className="reveal-on-scroll py-8 font-bricolage text-center space-y-4 border-t border-stone-200/60 max-w-4xl mx-auto active-reveal">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest text-[10px]">National Pride & Craftsmanship</span>
        <div className="flex justify-center items-center">
          <img src="https://i.postimg.cc/G28587FX/Make-in-India-Logo-Vector.png" alt="Make in India" className="h-20 md:h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
        </div>
        <p className="text-xs text-stone-400 font-sans max-w-md mx-auto leading-relaxed">
          Every <strong className="text-[#000000] font-bold">VK DOOR</strong> product is engineered, sourced, and completely handcrafted within India, supporting our local artisans and domestic economy.
        </p>
      </section>

    </div>
  );
}
