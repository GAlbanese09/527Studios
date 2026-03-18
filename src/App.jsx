import { useState, useEffect } from "react";

const COLORS = {
  rust: "#C17A45",
  rustLight: "#D4935E",
  cream: "#F4F1EA",
  charcoal: "#2E2E2E",
  warmTan: "#C7BFB6",
  sage: "#8C9A8C",
  darkSage: "#6B7A6B",
  white: "#FFFFFF",
  offWhite: "#FAF9F6",
  lightGray: "#E8E4DD",
  medGray: "#9A948B",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
`;

// ==================== DATA ====================
const portfolioProjects = [
  {
    id: 1,
    title: "Morning Light Memorials",
    category: "Brand Identity",
    tags: ["Brand Identity", "Service Design"],
    description: "A calm, respectful brand identity for a modern funeral service concept emphasizing clarity, warmth, and thoughtful guidance.",
    featured: true,
  },
  {
    id: 2,
    title: "Wedding Magazine — Dubon · Albanese",
    category: "Editorial Design",
    tags: ["Editorial", "Print"],
    description: "A custom-designed wedding magazine created as a personal gift, merging editorial structure with personal storytelling into a printed keepsake.",
    featured: true,
  },
  {
    id: 3,
    title: "SWAG — Personal Brand Identity",
    category: "Brand Identity",
    tags: ["Brand Identity", "Apparel"],
    description: "A personal brand identity using negative space to abstract a recognizable silhouette into a bold, adaptable mark for social media, apparel, and products.",
    featured: true,
  },
];

const services = [
  {
    name: "Brand Identity",
    price: "Starting at $1,500",
    description: "Complete visual identity including logo, color palette, typography, and brand guidelines.",
    includes: ["Logo Design & Variations", "Color Palette Development", "Typography Selection", "Brand Guidelines Document", "Business Card Design"],
    timeline: "2–3 weeks",
  },
  {
    name: "Editorial & Print Design",
    price: "Starting at $2,000",
    description: "Magazine layouts, brochures, catalogs, and print-ready production materials.",
    includes: ["Layout System Design", "Typography Hierarchy", "Image Curation & Placement", "Print-Ready Files", "Up to 3 Revision Rounds"],
    timeline: "2–4 weeks",
  },
  {
    name: "Marketing & Collateral",
    price: "Starting at $800",
    description: "Flyers, social media assets, signage, menus, and promotional materials.",
    includes: ["Custom Design Concepts", "Multiple Format Exports", "Social Media Templates", "Print & Digital Versions", "Source Files Included"],
    timeline: "1–2 weeks",
  },
  {
    name: "Apparel & Product Design",
    price: "Starting at $1,200",
    description: "Logo applications for merchandise, apparel mockups, and branded product design for print and production.",
    includes: ["Apparel Mockups (Hats, Shirts, Bags)", "Logo Adaptation for Products", "Print-Ready Production Files", "Pattern & Repeat Design", "Textile-Ready Exports"],
    timeline: "2–3 weeks",
  },
];

const storePackages = [
  {
    name: "Logo Starter",
    price: "$750",
    description: "Perfect for new businesses needing a professional mark.",
    includes: ["1 Logo Concept (3 rounds of revisions)", "Primary & Secondary Versions", "PNG, SVG, PDF Exports", "Basic Usage Guide"],
    popular: false,
  },
  {
    name: "Brand Essentials",
    price: "$1,800",
    description: "Everything you need to launch your brand with confidence.",
    includes: ["Full Logo System", "Color Palette & Typography", "Brand Guidelines PDF", "Business Card Design", "Social Media Profile Kit"],
    popular: true,
  },
  {
    name: "Full Brand Suite",
    price: "$3,500",
    description: "A comprehensive identity package for serious businesses.",
    includes: ["Everything in Brand Essentials", "Letterhead & Envelope", "Marketing Collateral Templates", "Signage & Environmental Design", "Brand Strategy Session"],
    popular: false,
  },
];

const blogPosts = [
  {
    id: 1,
    title: "Why Your Brand Identity Is More Than Just a Logo",
    excerpt: "A strong brand identity communicates who you are before a single word is spoken. Here's why investing in the full picture matters.",
    date: "March 10, 2026",
    category: "Branding",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "The Art of Typography in Print Design",
    excerpt: "Great typography doesn't just display text — it creates rhythm, hierarchy, and emotion. Lessons from editorial design.",
    date: "March 3, 2026",
    category: "Design",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Designing for Sensitive Industries: Lessons from Memorial Services",
    excerpt: "Creating visual identities for sensitive contexts demands empathy, restraint, and intentional warmth.",
    date: "February 24, 2026",
    category: "Case Study",
    readTime: "5 min read",
  },
];

// ==================== RESPONSIVE CSS ====================
const responsiveCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }
  body { background-color: ${COLORS.cream}; }
  ::selection { background-color: ${COLORS.rust}; color: ${COLORS.white}; }

  .nav-links-desktop { display: flex; gap: 32px; align-items: center; list-style: none; margin: 0; padding: 0; }
  .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 8px; z-index: 1001; flex-direction: column; gap: 5px; }
  .mobile-overlay { display: none; }

  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .hero-right { display: block; }
  .hero-heading { font-family: 'Bebas Neue', sans-serif; font-size: 86px; line-height: 0.95; letter-spacing: 0.01em; color: ${COLORS.charcoal}; margin-bottom: 8px; }
  .hero-bg-shape { display: block; }
  .section-heading { font-family: 'Bebas Neue', sans-serif; font-size: 64px; line-height: 1.0; letter-spacing: 0.02em; color: ${COLORS.charcoal}; margin-bottom: 24px; }
  .section-heading-md { font-family: 'Bebas Neue', sans-serif; font-size: 42px; line-height: 1.1; letter-spacing: 0.02em; color: ${COLORS.charcoal}; margin-bottom: 16px; }

  .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .projects-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
  .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .store-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .service-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .about-grid { display: grid; grid-template-columns: 380px 1fr; gap: 80px; align-items: start; }
  .about-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; }
  .blog-article { display: grid; grid-template-columns: 160px 1fr auto; gap: 40px; align-items: start; }
  .blog-thumb { display: block; }
  .blog-date-desktop { display: block; }
  .featured-header { display: flex; justify-content: space-between; align-items: flex-end; }
  .section-padding { padding: 120px 48px; }
  .section-padding-top { padding-top: 140px; }
  .nav-padding { padding: 0 48px; }
  .footer-padding { padding: 64px 48px 32px; }
  .hero-padding { padding: 120px 48px 80px; }
  .services-dark-padding { padding: 100px 48px; }
  .store-custom-row { display: flex; justify-content: space-between; align-items: center; }
  .filter-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
  .hero-buttons { display: flex; gap: 16px; }

  @media (max-width: 1024px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .about-grid { grid-template-columns: 1fr; }
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .hero-right { display: none; }
    .hero-bg-shape { display: none; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  }

  @media (max-width: 768px) {
    .nav-links-desktop { display: none !important; }
    .mobile-menu-btn { display: flex !important; }
    .mobile-overlay.open {
      display: flex !important;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(244,241,234,0.98);
      z-index: 999;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
    .hero-heading { font-size: 52px; }
    .section-heading { font-size: 42px; }
    .section-heading-md { font-size: 30px; }
    .projects-grid { grid-template-columns: 1fr; }
    .projects-grid-2col { grid-template-columns: 1fr; }
    .services-grid { grid-template-columns: 1fr; }
    .store-grid { grid-template-columns: 1fr; }
    .service-detail-grid { grid-template-columns: 1fr; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .about-meta-grid { grid-template-columns: 1fr; gap: 24px; }
    .contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
    .blog-article { grid-template-columns: 1fr; gap: 12px; }
    .blog-thumb { display: none; }
    .blog-date-desktop { display: none; }
    .featured-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .section-padding { padding: 80px 20px; }
    .section-padding-top { padding-top: 100px; }
    .nav-padding { padding: 0 20px; }
    .footer-padding { padding: 48px 20px 24px; }
    .hero-padding { padding: 100px 20px 60px; }
    .services-dark-padding { padding: 60px 20px; }
    .store-custom-row { flex-direction: column; gap: 16px; text-align: center; }
    .filter-row { gap: 8px; }
    .hero-buttons { flex-direction: column; gap: 12px; }
    .hero-buttons button { width: 100%; }
  }
`;

// ==================== SHARED STYLES ====================
const sectionLabel = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
  letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.rust, marginBottom: 12,
};

const accentLine = { width: 80, height: 3, backgroundColor: COLORS.rust, marginBottom: 32, borderRadius: 2 };

const bodyText = { fontSize: 16, lineHeight: 1.7, color: COLORS.medGray, maxWidth: 560 };

const btnBase = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
  letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 36px",
  border: "none", cursor: "pointer", transition: "all 0.3s ease",
};
const btnPrimary = { ...btnBase, backgroundColor: COLORS.rust, color: COLORS.white };
const btnOutline = { ...btnBase, backgroundColor: "transparent", color: COLORS.charcoal, border: `2px solid ${COLORS.charcoal}` };

// ==================== COMPONENTS ====================

function Navigation({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const pages = ["Home", "Portfolio", "About", "Services", "Store", "Blog", "Contact"];

  return (
    <>
      <nav
        className="nav-padding"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          ...(scrolled ? { backgroundColor: "rgba(244,241,234,0.95)", backdropFilter: "blur(12px)", boxShadow: "0 1px 0 rgba(0,0,0,0.06)" } : {}),
        }}
      >
        <div
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.04em", color: COLORS.charcoal, cursor: "pointer", userSelect: "none", zIndex: 1001 }}
          onClick={() => { setPage("Home"); setMobileOpen(false); window.scrollTo(0, 0); }}
        >
          527<span style={{ color: COLORS.rust }}>STUDIOS</span>
        </div>
        <ul className="nav-links-desktop">
          {pages.map((page) => (
            <li key={page} style={{ listStyle: "none" }}>
              <button
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: currentPage === page ? COLORS.rust : COLORS.charcoal,
                  cursor: "pointer", border: "none", background: "none", padding: "4px 0",
                }}
                onClick={() => { setPage(page); window.scrollTo(0, 0); }}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ zIndex: 1001 }}>
          <div style={{ width: 24, height: 2, backgroundColor: COLORS.charcoal, transition: "0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <div style={{ width: 24, height: 2, backgroundColor: COLORS.charcoal, transition: "0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <div style={{ width: mobileOpen ? 24 : 18, height: 2, backgroundColor: COLORS.charcoal, transition: "0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>
      <div className={`mobile-overlay ${mobileOpen ? "open" : ""}`}>
        {pages.map((page) => (
          <button
            key={page}
            style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.04em",
              color: currentPage === page ? COLORS.rust : COLORS.charcoal,
              cursor: "pointer", border: "none", background: "none", padding: "8px 0",
            }}
            onClick={() => { setPage(page); setMobileOpen(false); window.scrollTo(0, 0); }}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}

function ProjectCard({ project, large }) {
  const [hovered, setHovered] = useState(false);
  const bgColors = { "Brand Identity": COLORS.sage, "Editorial Design": COLORS.rust };
  const bg = bgColors[project.category] || COLORS.warmTan;

  return (
    <div
      style={{ cursor: "pointer", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: "100%", aspectRatio: large ? "16/10" : "4/3", backgroundColor: bg, borderRadius: 8,
        marginBottom: 16, position: "relative", overflow: "hidden",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.12)" : "0 4px 16px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.9)", fontFamily: "'Bebas Neue', sans-serif", fontSize: large ? 32 : 24,
          letterSpacing: "0.05em", textAlign: "center", padding: 24,
        }}>{project.title}</div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: COLORS.rust,
          transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray }}>{tag}</span>
        ))}
      </div>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{project.title}</h3>
      <p style={{ fontSize: 14, color: COLORS.medGray, lineHeight: 1.5 }}>{project.description}</p>
    </div>
  );
}

function HeroSection({ setPage }) {
  return (
    <section className="hero-padding" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div className="hero-bg-shape" style={{ position: "absolute", top: 0, right: 0, width: "45%", height: "100%", backgroundColor: COLORS.warmTan, opacity: 0.25, clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div>
            <p style={sectionLabel}>Graphic Design Studio</p>
            <h1 className="hero-heading">Great design<br />begins with<br /><span style={{ color: COLORS.rust }}>listening</span></h1>
            <div style={accentLine} />
            <p style={{ ...bodyText, marginBottom: 40 }}>Helping small businesses bring their ideas to life through clear, professional visuals that reflect who they are and what they offer.</p>
            <div className="hero-buttons">
              <button style={btnPrimary} onClick={() => { setPage("Portfolio"); window.scrollTo(0, 0); }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>View Work</button>
              <button style={btnOutline} onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = COLORS.charcoal; e.target.style.color = COLORS.white; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = COLORS.charcoal; }}>Get in Touch</button>
            </div>
          </div>
          <div className="hero-right" style={{ position: "relative" }}>
            <div style={{ width: "100%", aspectRatio: "4/5", backgroundColor: COLORS.warmTan, borderRadius: 12, position: "relative", overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.08)" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: COLORS.rust }} />
              <div style={{ padding: "48px 36px" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: COLORS.charcoal, marginBottom: 4 }}>JAMES ALBANESE</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: COLORS.medGray, fontStyle: "italic", marginBottom: 32 }}>Graphic Designer</div>
                {[{ label: "Brand Identity", color: COLORS.sage }, { label: "Editorial Design", color: COLORS.rust }, { label: "Apparel & Product", color: COLORS.charcoal }].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: item.color, opacity: 0.8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.charcoal }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: COLORS.medGray }}>View projects →</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, border: `3px solid ${COLORS.rust}`, borderRadius: 12, opacity: 0.4 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedWork({ setPage }) {
  return (
    <section className="section-padding" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 80 }}>
      <p style={sectionLabel}>Selected Work</p>
      <div className="featured-header" style={{ marginBottom: 48 }}>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>FEATURED PROJECTS</h2>
        <button style={{ ...btnBase, color: COLORS.rust, padding: 0, border: "none", background: "none" }}
          onClick={() => { setPage("Portfolio"); window.scrollTo(0, 0); }}>View All →</button>
      </div>
      <div className="projects-grid">
        {portfolioProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}

function ServicesPreview({ setPage }) {
  return (
    <section style={{ backgroundColor: COLORS.charcoal }} className="services-dark-padding">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ ...sectionLabel, color: COLORS.rustLight }}>What I Do</p>
        <h2 className="section-heading" style={{ color: COLORS.cream, marginBottom: 56 }}>SERVICES</h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} style={{ padding: "32px 24px", borderTop: `3px solid ${COLORS.rust}`, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "0 0 8px 8px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: COLORS.cream, marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontSize: 14, color: COLORS.warmTan, lineHeight: 1.6, marginBottom: 16 }}>{s.description}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.rust }}>{s.price}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button style={btnPrimary} onClick={() => { setPage("Services"); window.scrollTo(0, 0); }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>View All Services</button>
        </div>
      </div>
    </section>
  );
}

function CTASection({ setPage }) {
  return (
    <section className="section-padding" style={{ textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 className="section-heading">LET'S WORK <span style={{ color: COLORS.rust }}>TOGETHER</span></h2>
        <div style={{ ...accentLine, margin: "0 auto 24px" }} />
        <p style={{ ...bodyText, margin: "0 auto 40px", textAlign: "center" }}>I enjoy helping people turn ideas into clear, thoughtful visual communication.</p>
        <button style={btnPrimary} onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>Start a Conversation</button>
      </div>
    </section>
  );
}

// ==================== PAGES ====================

function HomePage({ setPage }) {
  return (<><HeroSection setPage={setPage} /><FeaturedWork setPage={setPage} /><ServicesPreview setPage={setPage} /><CTASection setPage={setPage} /></>);
}

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Brand Identity", "Editorial", "Print", "Apparel"];
  const filtered = activeFilter === "All" ? portfolioProjects : portfolioProjects.filter((p) => p.tags.some((t) => t.includes(activeFilter)));
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Portfolio</p>
      <h1 className="section-heading">SELECTED WORK</h1>
      <div style={accentLine} />
      <div className="filter-row">
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            ...btnBase, padding: "10px 20px", fontSize: 12, borderRadius: 4,
            backgroundColor: activeFilter === f ? COLORS.charcoal : "transparent",
            color: activeFilter === f ? COLORS.white : COLORS.charcoal,
            border: `1.5px solid ${activeFilter === f ? COLORS.charcoal : COLORS.warmTan}`,
          }}>{f}</button>
        ))}
      </div>
      <div className="projects-grid-2col">
        {filtered.map((p) => <ProjectCard key={p.id} project={p} large />)}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", color: COLORS.medGray, padding: "80px 0" }}>More projects in this category coming soon.</p>}
    </section>
  );
}

function AboutPage() {
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="about-grid">
        <div>
          <div style={{ width: "100%", aspectRatio: "3/4", backgroundColor: COLORS.warmTan, borderRadius: 8, overflow: "hidden", position: "relative", boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, backgroundColor: COLORS.rust }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: COLORS.medGray }}>Photo</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 300, color: COLORS.charcoal }}>James</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.charcoal }}>Albanese</div>
          </div>
        </div>
        <div>
          <p style={sectionLabel}>About</p>
          <h1 className="section-heading"><span style={{ color: COLORS.rust }}>GREAT</span> DESIGN<br />BEGINS WITH LISTENING</h1>
          <div style={accentLine} />
          <div style={{ maxWidth: 560 }}>
            <p style={{ ...bodyText, marginBottom: 24 }}>I'm a freelance graphic designer who enjoys helping small businesses bring their ideas to life through clear, professional visuals that reflect who they are and what they offer.</p>
            <p style={{ ...bodyText, marginBottom: 24 }}>I believe great design begins with listening. Many business owners know what they want to achieve, but putting those ideas into words — or visuals — isn't always easy. Through conversation, I take time to understand their goals and help shape those ideas into a clear direction.</p>
            <p style={{ ...bodyText, marginBottom: 24 }}>From early concepts to final delivery, I guide each project step by step toward a thoughtful and polished result. My goal is simple: to create design work that feels authentic, professional, and something a business owner can take pride in sharing.</p>
            <p style={{ ...bodyText, fontStyle: "italic", color: COLORS.charcoal }}>Good design makes a vision tangible — turning ideas into something people can see, recognize, and connect with.</p>
          </div>
          <div className="about-meta-grid" style={{ marginTop: 56, paddingTop: 48, borderTop: `1px solid ${COLORS.lightGray}` }}>
            {[
              { label: "Specialties", items: ["Brand Identity", "Editorial Design", "Print Production", "Apparel & Product Design"] },
              { label: "Tools", items: ["Adobe Creative Suite", "Print Production", "Typography & Layout", "Color Theory"] },
              { label: "Based In", items: ["Altamonte Springs, FL", "Available Remotely", "Nationwide Clients"] },
            ].map((col) => (
              <div key={col.label}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "0.1em", marginBottom: 12, color: COLORS.charcoal }}>{col.label}</h4>
                {col.items.map((item) => <p key={item} style={{ fontSize: 14, color: COLORS.medGray, marginBottom: 4 }}>{item}</p>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPage({ setPage }) {
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Services</p>
      <h1 className="section-heading">WHAT I OFFER</h1>
      <div style={accentLine} />
      <p style={{ ...bodyText, marginBottom: 64 }}>Every project is approached with the same commitment to quality, clarity, and thoughtful execution.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {services.map((s, i) => (
          <div key={i} className="service-detail-grid" style={{ padding: "48px 24px", backgroundColor: i % 2 === 0 ? COLORS.offWhite : COLORS.cream, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8 }}>
            <div>
              <h3 className="section-heading-md" style={{ marginBottom: 8 }}>{s.name.toUpperCase()}</h3>
              <div style={{ ...accentLine, width: 48, marginBottom: 16 }} />
              <p style={{ ...bodyText, marginBottom: 16 }}>{s.description}</p>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: COLORS.rust }}>{s.price}</div>
              <p style={{ fontSize: 13, color: COLORS.medGray, marginTop: 4 }}>Timeline: {s.timeline}</p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 16 }}>What's Included</h4>
              {s.includes.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: j < s.includes.length - 1 ? `1px solid ${COLORS.lightGray}` : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.rust, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: COLORS.charcoal }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 64, padding: "48px 24px", backgroundColor: COLORS.warmTan, borderRadius: 8 }}>
        <h3 className="section-heading-md">NEED SOMETHING CUSTOM?</h3>
        <p style={{ ...bodyText, margin: "0 auto 32px", textAlign: "center" }}>Every business is different. Let's talk about what you need.</p>
        <button style={btnPrimary} onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>Get a Custom Quote</button>
      </div>
    </section>
  );
}

function StorePage() {
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Store</p>
      <h1 className="section-heading">DESIGN PACKAGES</h1>
      <div style={accentLine} />
      <p style={{ ...bodyText, marginBottom: 64 }}>Ready-to-go design packages with clear deliverables and transparent pricing.</p>
      <div className="store-grid">
        {storePackages.map((pkg, i) => (
          <div key={i} style={{
            padding: "40px 32px", backgroundColor: pkg.popular ? COLORS.charcoal : COLORS.offWhite,
            color: pkg.popular ? COLORS.cream : COLORS.charcoal, borderRadius: 8,
            border: pkg.popular ? "none" : `1px solid ${COLORS.lightGray}`, position: "relative",
          }}>
            {pkg.popular && <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 4, backgroundColor: COLORS.rust, borderRadius: "8px 8px 0 0" }} />}
            {pkg.popular && <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.rust, marginBottom: 16 }}>Most Popular</span>}
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginBottom: 4 }}>{pkg.name}</h3>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: COLORS.rust, marginBottom: 16 }}>{pkg.price}</div>
            <p style={{ fontSize: 14, color: pkg.popular ? COLORS.warmTan : COLORS.medGray, lineHeight: 1.6, marginBottom: 24 }}>{pkg.description}</p>
            <div style={{ borderTop: `1px solid ${pkg.popular ? "rgba(255,255,255,0.1)" : COLORS.lightGray}`, paddingTop: 24, marginBottom: 32 }}>
              {pkg.includes.map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: COLORS.rust, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: pkg.popular ? COLORS.warmTan : COLORS.charcoal }}>{item}</span>
                </div>
              ))}
            </div>
            <button style={{
              ...btnBase, width: "100%", textAlign: "center", borderRadius: 4,
              backgroundColor: pkg.popular ? COLORS.rust : "transparent",
              color: pkg.popular ? COLORS.white : COLORS.charcoal,
              border: pkg.popular ? "none" : `2px solid ${COLORS.charcoal}`,
            }}>Get Started</button>
          </div>
        ))}
      </div>
      <div className="store-custom-row" style={{ marginTop: 64, padding: "40px 24px", backgroundColor: COLORS.offWhite, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8 }}>
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, marginBottom: 4 }}>NEED A CUSTOM PACKAGE?</h4>
          <p style={{ fontSize: 14, color: COLORS.medGray }}>Have something specific in mind? Let's build a custom scope together.</p>
        </div>
        <button style={{ ...btnOutline, whiteSpace: "nowrap" }}>Contact Me</button>
      </div>
    </section>
  );
}

function BlogPage() {
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Blog</p>
      <h1 className="section-heading">INSIGHTS & PROCESS</h1>
      <div style={accentLine} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {blogPosts.map((post, i) => (
          <article key={post.id} className="blog-article" style={{ padding: "40px 0", borderBottom: i < blogPosts.length - 1 ? `1px solid ${COLORS.lightGray}` : "none", cursor: "pointer" }}>
            <div className="blog-thumb" style={{ width: 160, height: 120, backgroundColor: [COLORS.sage, COLORS.warmTan, COLORS.rust][i % 3], borderRadius: 6, opacity: 0.8 }} />
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.rust }}>{post.category}</span>
                <span style={{ fontSize: 12, color: COLORS.medGray }}>{post.readTime}</span>
              </div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8, color: COLORS.charcoal }}>{post.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.medGray, lineHeight: 1.6 }}>{post.excerpt}</p>
              <p style={{ fontSize: 12, color: COLORS.medGray, marginTop: 8 }}>{post.date}</p>
            </div>
            <span className="blog-date-desktop" style={{ fontSize: 12, color: COLORS.medGray, whiteSpace: "nowrap", paddingTop: 4 }}>{post.date}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", project: "", message: "" });
  const inputStyle = { width: "100%", padding: "12px 16px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", border: `1.5px solid ${COLORS.lightGray}`, borderRadius: 4, backgroundColor: COLORS.white, color: COLORS.charcoal, outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.charcoal, marginBottom: 8 };

  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="contact-grid">
        <div>
          <p style={sectionLabel}>Contact</p>
          <h1 className="section-heading">LET'S START A<br /><span style={{ color: COLORS.rust }}>CONVERSATION</span></h1>
          <div style={accentLine} />
          <p style={{ ...bodyText, marginBottom: 48 }}>Whether you have a clear vision or just a rough idea, I'd love to hear about your project. Reach out and let's talk about how we can bring it to life.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[{ label: "Email", value: "Jalbanese79@gmail.com" }, { label: "Phone", value: "407.516.6193" }, { label: "Location", value: "Altamonte Springs, FL" }].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, color: COLORS.charcoal }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "40px 24px", backgroundColor: COLORS.offWhite, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[{ key: "name", label: "Name", type: "text", ph: "Your name" }, { key: "email", label: "Email", type: "email", ph: "your@email.com" }, { key: "project", label: "Project Type", type: "text", ph: "Brand Identity, Editorial, etc." }].map((f) => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.rust)} onBlur={(e) => (e.target.style.borderColor = COLORS.lightGray)} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Message</label>
              <textarea rows={5} placeholder="Tell me about your project..." value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.rust)} onBlur={(e) => (e.target.style.borderColor = COLORS.lightGray)} />
            </div>
            <button style={{ ...btnPrimary, width: "100%", textAlign: "center", borderRadius: 4, marginTop: 8 }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>Send Message</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="footer-padding" style={{ backgroundColor: COLORS.charcoal, color: COLORS.warmTan }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: COLORS.cream, marginBottom: 12 }}>527<span style={{ color: COLORS.rust }}>STUDIOS</span></div>
            <p style={{ fontSize: 14, color: COLORS.warmTan, lineHeight: 1.6, maxWidth: 300 }}>Graphic design studio helping small businesses bring their ideas to life through clear, professional visuals.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "0.15em", color: COLORS.cream, marginBottom: 16 }}>NAVIGATION</h4>
            {["Home", "Portfolio", "About", "Services"].map((p) => <p key={p} style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8, cursor: "pointer" }} onClick={() => { setPage(p); window.scrollTo(0, 0); }}>{p}</p>)}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "0.15em", color: COLORS.cream, marginBottom: 16 }}>MORE</h4>
            {["Store", "Blog", "Contact"].map((p) => <p key={p} style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8, cursor: "pointer" }} onClick={() => { setPage(p); window.scrollTo(0, 0); }}>{p}</p>)}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "0.15em", color: COLORS.cream, marginBottom: 16 }}>CONTACT</h4>
            <p style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8 }}>Jalbanese79@gmail.com</p>
            <p style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8 }}>407.516.6193</p>
            <p style={{ fontSize: 14, color: COLORS.warmTan }}>Altamonte Springs, FL</p>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: COLORS.medGray }}>© 2026 527 Studios. All rights reserved.</p>
          <p style={{ fontSize: 12, color: COLORS.medGray }}>Designed by James Albanese</p>
        </div>
      </div>
    </footer>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [currentPage, setPage] = useState("Home");
  const renderPage = () => {
    switch (currentPage) {
      case "Home": return <HomePage setPage={setPage} />;
      case "Portfolio": return <PortfolioPage />;
      case "About": return <AboutPage />;
      case "Services": return <ServicesPage setPage={setPage} />;
      case "Store": return <StorePage />;
      case "Blog": return <BlogPage />;
      case "Contact": return <ContactPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.charcoal, backgroundColor: COLORS.cream, lineHeight: 1.6, WebkitFontSmoothing: "antialiased", overflowX: "hidden", width: "100%" }}>
      <style>{FONTS}</style>
      <style>{responsiveCSS}</style>
      <Navigation currentPage={currentPage} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
    </div>
  );
}
