import { useState, useEffect } from "react";
import AdminPanel from "./Admin.jsx";

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

const API_BASE = "https://api.527studios.com";

// Fallback data used while manifest loads or if API is unreachable
const FALLBACK = {
  portfolio: [],
  blog: [],
  faq: [],
  customTags: [],
  about: {
    headline: "Great design begins with listening",
    bio: [
      "I'm a freelance graphic designer who enjoys helping small businesses bring their ideas to life through clear, professional visuals that reflect who they are and what they offer.",
      "I believe great design begins with listening. Many business owners know what they want to achieve, but putting those ideas into words — or visuals — isn't always easy. Through conversation, I take time to understand their goals and help shape those ideas into a clear direction.",
      "From early concepts to final delivery, I guide each project step by step toward a thoughtful and polished result. My goal is simple: to create design work that feels authentic, professional, and something a business owner can take pride in sharing."
    ],
    quote: "Good design makes a vision tangible — turning ideas into something people can see, recognize, and connect with.",
    headshot: "",
    specialties: ["Brand Identity", "Editorial Design", "Print Production", "Apparel & Product Design"],
    tools: ["Adobe Creative Suite", "Print Production", "Typography & Layout", "Color Theory"],
    location: "Altamonte Springs, FL",
    email: "Jalbanese79@gmail.com",
    phone: "407.516.6193",
  },
  services: [
    { id: "brand-identity", name: "Brand Identity", price: "Starting at $1,500", description: "Complete visual identity including logo, color palette, typography, and brand guidelines.", includes: ["Logo Design & Variations", "Color Palette Development", "Typography Selection", "Brand Guidelines Document", "Business Card Design"], timeline: "2–3 weeks" },
    { id: "editorial-print", name: "Editorial & Print Design", price: "Starting at $2,000", description: "Magazine layouts, brochures, catalogs, and print-ready production materials.", includes: ["Layout System Design", "Typography Hierarchy", "Image Curation & Placement", "Print-Ready Files", "Up to 3 Revision Rounds"], timeline: "2–4 weeks" },
    { id: "marketing-collateral", name: "Marketing & Collateral", price: "Starting at $800", description: "Flyers, social media assets, signage, menus, and promotional materials.", includes: ["Custom Design Concepts", "Multiple Format Exports", "Social Media Templates", "Print & Digital Versions", "Source Files Included"], timeline: "1–2 weeks" },
    { id: "apparel-product", name: "Apparel & Product Design", price: "Starting at $1,200", description: "Logo applications for merchandise, apparel mockups, and branded product design for print and production.", includes: ["Apparel Mockups (Hats, Shirts, Bags)", "Logo Adaptation for Products", "Print-Ready Production Files", "Pattern & Repeat Design", "Textile-Ready Exports"], timeline: "2–3 weeks" },
  ],
  store: [
    { id: "logo-starter", name: "Logo Starter", price: "$750", description: "Perfect for new businesses needing a professional mark.", includes: ["1 Logo Concept (3 rounds of revisions)", "Primary & Secondary Versions", "PNG, SVG, PDF Exports", "Basic Usage Guide"], popular: false },
    { id: "brand-essentials", name: "Brand Essentials", price: "$1,800", description: "Everything you need to launch your brand with confidence.", includes: ["Full Logo System", "Color Palette & Typography", "Brand Guidelines PDF", "Business Card Design", "Social Media Profile Kit"], popular: true },
    { id: "full-brand-suite", name: "Full Brand Suite", price: "$3,500", description: "A comprehensive identity package for serious businesses.", includes: ["Everything in Brand Essentials", "Letterhead & Envelope", "Marketing Collateral Templates", "Signage & Environmental Design", "Brand Strategy Session"], popular: false },
  ],
};

// ==================== RESPONSIVE CSS ====================
const responsiveCSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }
  body { background-color: ${COLORS.cream}; }
  ::selection { background-color: ${COLORS.rust}; color: ${COLORS.white}; }

  .nav-links-desktop { display: flex; gap: 32px; align-items: center; list-style: none; margin: 0; padding: 0; }
  .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 8px; z-index: 1001; flex-direction: column; gap: 5px; }
  .mobile-overlay { display: none; }

  .hero-heading { font-family: 'Bebas Neue', sans-serif; font-size: 86px; line-height: 0.95; letter-spacing: 0.01em; color: ${COLORS.charcoal}; margin-bottom: 8px; }
  .section-heading { font-family: 'Bebas Neue', sans-serif; font-size: 64px; line-height: 1.0; letter-spacing: 0.02em; color: ${COLORS.charcoal}; margin-bottom: 24px; }
  .section-heading-md { font-family: 'Bebas Neue', sans-serif; font-size: 42px; line-height: 1.1; letter-spacing: 0.02em; color: ${COLORS.charcoal}; margin-bottom: 16px; }

  .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .projects-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }

  /* Bento grid for portfolio */
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    grid-auto-flow: dense;
  }
  .bento-grid .bento-wide { grid-column: span 2; }
  .bento-grid .bento-featured { grid-column: span 2; }
  .bento-grid .bento-featured .bento-image { aspect-ratio: 16/9; }
  .bento-grid .bento-standard .bento-image { aspect-ratio: 4/3; }
  .bento-grid .bento-wide .bento-image { aspect-ratio: 21/9; }

  /* Project detail responsive */
  .project-nav { display: flex; justify-content: space-between; align-items: center; }
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

  .featured-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .home-services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .home-about-grid { display: grid; grid-template-columns: 300px 1fr; gap: 64px; align-items: center; }

  @media (max-width: 1024px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .about-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .featured-cards-grid { grid-template-columns: repeat(2, 1fr); }
    .home-services-grid { grid-template-columns: repeat(2, 1fr); }
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
    .bento-grid { grid-template-columns: 1fr; }
    .bento-grid .bento-wide, .bento-grid .bento-featured { grid-column: span 1; }
    .project-nav { flex-direction: column; gap: 16px; }
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
    .featured-cards-grid { grid-template-columns: 1fr; }
    .home-services-grid { grid-template-columns: 1fr; }
    .home-about-grid { grid-template-columns: 1fr; gap: 40px; }
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

  const pages = ["Home", "Portfolio", "FAQ", "Contact"];

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

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  const firstTag = (project.tags || [])[0] || "";
  const bg = firstTag.includes("Brand") ? COLORS.sage : firstTag.includes("Editorial") ? COLORS.rust : COLORS.warmTan;
  const hasCover = !!project.coverImage;
  const size = project.displaySize || "standard";
  const sizeClass = `bento-${size}`;
  const titleSize = size === "featured" ? 32 : size === "wide" ? 28 : 24;

  return (
    <div
      className={sizeClass}
      style={{ cursor: "pointer", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onClick && onClick(project)}
    >
      <div className="bento-image" style={{
        width: "100%", backgroundColor: bg, borderRadius: 8,
        marginBottom: 16, position: "relative", overflow: "hidden",
        backgroundImage: hasCover ? `url(${encodeURI(project.coverImage)})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.12)" : "0 4px 16px rgba(0,0,0,0.04)",
      }}>
        {hasCover && <div style={{ position: "absolute", inset: 0, backgroundColor: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)", transition: "background-color 0.3s" }} />}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.9)", fontFamily: "'Bebas Neue', sans-serif", fontSize: titleSize,
          letterSpacing: "0.05em", textAlign: "center", padding: 24,
        }}>{project.title}</div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: COLORS.rust,
          transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {(project.tags || []).map((tag) => (
          <span key={tag} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray }}>{tag}</span>
        ))}
      </div>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{project.title}</h3>
    </div>
  );
}

function ProjectDetailPage({ project, manifest, onBack, onNavigate }) {
  const portfolio = manifest.portfolio || [];
  const currentIdx = portfolio.findIndex((p) => p.id === project.id);
  const prevProject = currentIdx > 0 ? portfolio[currentIdx - 1] : null;
  const nextProject = currentIdx < portfolio.length - 1 ? portfolio[currentIdx + 1] : null;

  const handleNavigate = (proj) => {
    onNavigate(proj);
    window.scrollTo(0, 0);
  };

  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.rust, marginBottom: 32, padding: 0 }}
      >
        ← Back to Portfolio
      </button>

      {/* Hero image */}
      <div style={{ width: "100%", backgroundColor: "#f0ece4", borderRadius: 8, overflow: "hidden", marginBottom: 48 }}>
        <img
          src={encodeURI(project.coverImage || "")}
          alt={project.title}
          style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", display: "block", margin: "0 auto" }}
        />
      </div>

      {/* Metadata */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {(project.tags || []).map((tag) => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.rust }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, letterSpacing: "0.02em", color: COLORS.charcoal, marginBottom: 16 }}>{project.title}</h1>
        <div style={accentLine} />
        {project.description && <p style={{ ...bodyText }}>{project.description}</p>}
      </div>

      {/* Image gallery */}
      {(project.images || []).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 64 }}>
          {project.images.map((img, idx) => (
            <div key={idx} style={{ borderRadius: 8, overflow: "hidden", backgroundColor: "#f0ece4" }}>
              <img
                src={encodeURI(img.url || "")}
                alt={img.title || ""}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {img.title && (
                <div style={{ padding: "12px 16px", fontSize: 14, color: COLORS.medGray }}>{img.title}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Next/Previous navigation */}
      <div className="project-nav" style={{ borderTop: `1px solid ${COLORS.lightGray}`, paddingTop: 32 }}>
        <div>
          {prevProject && (
            <button onClick={() => handleNavigate(prevProject)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", padding: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 4 }}>← Previous</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>{prevProject.title}</div>
            </button>
          )}
        </div>
        <div>
          {nextProject && (
            <button onClick={() => handleNavigate(nextProject)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "right", padding: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 4 }}>Next →</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>{nextProject.title}</div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroSection({ setPage }) {
  return (
    <section className="hero-padding" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <p style={{ ...sectionLabel, textAlign: "center" }}>Graphic Design Studio</p>
        <h1 className="hero-heading" style={{ textAlign: "center" }}>Great design<br />begins with<br /><span style={{ color: COLORS.rust }}>listening</span></h1>
        <div style={{ ...accentLine, margin: "0 auto 32px" }} />
        <p style={{ ...bodyText, textAlign: "center", margin: "0 auto 40px", maxWidth: 600 }}>Helping small businesses bring their ideas to life through clear, professional visuals that reflect who they are and what they offer.</p>
        <div className="hero-buttons" style={{ justifyContent: "center" }}>
          <button style={btnPrimary} onClick={() => { setPage("Portfolio"); window.scrollTo(0, 0); }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>View Work</button>
          <button style={btnOutline} onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = COLORS.charcoal; e.target.style.color = COLORS.white; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = COLORS.charcoal; }}>Contact Me</button>
        </div>
      </div>
    </section>
  );
}

function FeaturedWork({ setPage, manifest, onProjectClick }) {
  const featured = (manifest.portfolio || []).filter(p => p.featured);
  if (featured.length === 0) return null;
  return (
    <section className="section-padding" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 80 }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{ ...sectionLabel, textAlign: "center" }}>Selected Work</p>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>FEATURED WORK</h2>
      </div>
      <div className="featured-cards-grid">
        {featured.slice(0, 3).map((p) => (
          <FeaturedCard key={p.id} project={p} onClick={() => onProjectClick && onProjectClick(p)} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 56 }}>
        <button style={btnOutline} onClick={() => setPage("Portfolio")}
          onMouseEnter={(e) => { e.target.style.backgroundColor = COLORS.charcoal; e.target.style.color = COLORS.white; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = COLORS.charcoal; }}>View Portfolio</button>
      </div>
    </section>
  );
}

function FeaturedCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  const firstTag = (project.tags || [])[0] || "";
  const bg = firstTag.includes("Brand") ? COLORS.sage : firstTag.includes("Editorial") ? COLORS.rust : COLORS.warmTan;
  const hasCover = !!project.coverImage;
  return (
    <div
      style={{
        backgroundColor: COLORS.offWhite, borderRadius: 8, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${COLORS.lightGray}`,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{
        width: "100%", aspectRatio: "16/10", backgroundColor: bg,
        backgroundImage: hasCover ? `url(${encodeURI(project.coverImage)})` : undefined,
        backgroundSize: "cover", backgroundPosition: "center",
        position: "relative",
      }}>
        {!hasCover && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.8)", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: "0.05em" }}>{project.title}</div>
        )}
      </div>
      <div style={{ padding: "20px 24px 24px" }}>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: COLORS.charcoal, marginBottom: 8 }}>{project.title}</h3>
        {project.description && (
          <p style={{ fontSize: 14, color: COLORS.medGray, lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(project.tags || []).map((tag) => (
            <span key={tag} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesPreview({ setPage, manifest }) {
  const iconColors = [COLORS.sage, COLORS.rust, COLORS.warmTan, COLORS.charcoal];
  return (
    <section className="section-padding" style={{ backgroundColor: COLORS.offWhite }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ ...sectionLabel, textAlign: "center" }}>What I Do</p>
          <h2 className="section-heading">SERVICES</h2>
        </div>
        <div className="home-services-grid">
          {(manifest.services || []).map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "32px 20px", backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.lightGray}` }}>
              {s.icon ? (
                <img src={encodeURI(s.icon)} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", margin: "0 auto 20px", display: "block" }} />
              ) : (
                <div style={{
                  width: 52, height: 52, borderRadius: "50%", backgroundColor: iconColors[i % iconColors.length],
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                  color: COLORS.white, fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                }}>{s.name.charAt(0)}</div>
              )}
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: COLORS.charcoal, marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontSize: 14, color: COLORS.medGray, lineHeight: 1.6 }}>{s.description}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <button style={btnPrimary} onClick={() => setPage("Services")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.rustLight)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.rust)}>View Services</button>
        </div>
      </div>
    </section>
  );
}

function AboutPreview({ manifest }) {
  const about = manifest.about || FALLBACK.about;
  const firstBio = (about.bio || [])[0] || "";
  return (
    <section className="section-padding" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="home-about-grid">
        <div style={{ width: "100%", aspectRatio: "3/4", backgroundColor: COLORS.warmTan, borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, backgroundColor: COLORS.rust }} />
          {about.headshot ? (
            <img src={encodeURI(about.headshot)} alt="James Albanese" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: COLORS.medGray }}>Photo</div>
            </div>
          )}
        </div>
        <div>
          <p style={sectionLabel}>About 527 Studios</p>
          <h2 className="section-heading"><span style={{ color: COLORS.rust }}>GREAT</span> DESIGN<br />BEGINS WITH LISTENING</h2>
          <div style={accentLine} />
          <p style={{ ...bodyText, marginBottom: 24 }}>{firstBio}</p>
          {about.quote && (
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, fontStyle: "italic", lineHeight: 1.6, color: COLORS.charcoal, borderLeft: `3px solid ${COLORS.rust}`, paddingLeft: 20, marginBottom: 24 }}>
              {about.quote}
            </p>
          )}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 32 }}>
            {[
              { label: "Location", value: about.location || "Altamonte Springs, FL" },
              { label: "Specialties", value: (about.specialties || []).slice(0, 3).join(", ") },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.rust, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: COLORS.medGray }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQPreview({ setPage, manifest }) {
  const faqs = (manifest.faq || []).slice(0, 3);
  const [openId, setOpenId] = useState(null);
  if (faqs.length === 0) return null;
  return (
    <section className="section-padding" style={{ backgroundColor: COLORS.offWhite }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ ...sectionLabel, textAlign: "center" }}>Common Questions</p>
          <h2 className="section-heading">FREQUENTLY ASKED<br /><span style={{ color: COLORS.rust }}>QUESTIONS</span></h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} style={{ borderBottom: `1px solid ${COLORS.lightGray}` }}>
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "24px 0", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.charcoal, paddingRight: 24 }}>{faq.question}</span>
                  <span style={{
                    fontSize: 24, color: COLORS.rust, flexShrink: 0, fontWeight: 300,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: isOpen ? 500 : 0, overflow: "hidden",
                  transition: "max-height 0.3s ease, padding 0.3s ease",
                  paddingBottom: isOpen ? 24 : 0,
                }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.medGray }}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button style={{ ...btnBase, color: COLORS.rust, padding: 0, border: "none", background: "none" }}
            onClick={() => setPage("FAQ")}>View All FAQs →</button>
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

function HomePage({ setPage, manifest, onProjectClick }) {
  return (
    <>
      <HeroSection setPage={setPage} />
      <FeaturedWork setPage={setPage} manifest={manifest} onProjectClick={onProjectClick} />
      <ServicesPreview setPage={setPage} manifest={manifest} />
      <AboutPreview manifest={manifest} />
      <FAQPreview setPage={setPage} manifest={manifest} />
      <CTASection setPage={setPage} />
    </>
  );
}

function PortfolioPage({ manifest, onProjectClick }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const allProjects = manifest.portfolio || [];
  const allTags = [...new Set((manifest.portfolio || []).flatMap(p => p.tags || []))].sort();
  const filters = ["All", ...allTags];
  const filtered = activeFilter === "All" ? allProjects : allProjects.filter((p) => (p.tags || []).includes(activeFilter));
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
      <div className="bento-grid">
        {filtered.map((p) => <ProjectCard key={p.id} project={p} onClick={onProjectClick} />)}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", color: COLORS.medGray, padding: "80px 0" }}>More projects in this category coming soon.</p>}
    </section>
  );
}

function AboutPage({ manifest }) {
  const about = manifest.about || FALLBACK.about;
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="about-grid">
        <div>
          <div style={{ width: "100%", aspectRatio: "3/4", backgroundColor: COLORS.warmTan, borderRadius: 8, overflow: "hidden", position: "relative", boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, backgroundColor: COLORS.rust }} />
            {about.headshot ? (
              <img src={about.headshot} alt="James Albanese" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 18, fontFamily: "'DM Sans', sans-serif", color: COLORS.medGray }}>Photo</div>
              </div>
            )}
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
            {(about.bio || []).map((paragraph, i) => (
              <p key={i} style={{ ...bodyText, marginBottom: 24 }}>{paragraph}</p>
            ))}
            {about.quote && <p style={{ ...bodyText, fontStyle: "italic", color: COLORS.charcoal }}>{about.quote}</p>}
          </div>
          <div className="about-meta-grid" style={{ marginTop: 56, paddingTop: 48, borderTop: `1px solid ${COLORS.lightGray}` }}>
            {[
              { label: "Specialties", items: about.specialties || [] },
              { label: "Tools", items: about.tools || [] },
              { label: "Based In", items: [about.location || "Altamonte Springs, FL", "Available Remotely", "Nationwide Clients"] },
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

function ServicesPage({ setPage, manifest }) {
  const srvcs = manifest.services || FALLBACK.services;
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Services</p>
      <h1 className="section-heading">WHAT I OFFER</h1>
      <div style={accentLine} />
      <p style={{ ...bodyText, marginBottom: 64 }}>Every project is approached with the same commitment to quality, clarity, and thoughtful execution.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {srvcs.map((s, i) => (
          <div key={i} className="service-detail-grid" style={{ padding: "48px 24px", backgroundColor: i % 2 === 0 ? COLORS.offWhite : COLORS.cream, border: `1px solid ${COLORS.lightGray}`, borderRadius: 8 }}>
            <div>
              {s.icon && <img src={encodeURI(s.icon)} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", marginBottom: 16, display: "block" }} />}
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

function StorePage({ manifest }) {
  const packages = manifest.store || FALLBACK.store;
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Store</p>
      <h1 className="section-heading">DESIGN PACKAGES</h1>
      <div style={accentLine} />
      <p style={{ ...bodyText, marginBottom: 64 }}>Ready-to-go design packages with clear deliverables and transparent pricing.</p>
      <div className="store-grid">
        {packages.map((pkg, i) => (
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

function BlogDetailPage({ post, manifest, onBack, onNavigate }) {
  const posts = manifest.blog || [];
  const currentIdx = posts.findIndex((p) => p.id === post.id);
  const prevPost = currentIdx > 0 ? posts[currentIdx - 1] : null;
  const nextPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;

  return (
    <section className="section-padding" style={{ maxWidth: 800, margin: "0 auto", paddingTop: 140 }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.rust, marginBottom: 32, padding: 0 }}
      >
        ← Back to Blog
      </button>

      {post.image && (
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 48, backgroundColor: "#f0ece4" }}>
          <img src={encodeURI(post.image)} alt={post.title} style={{ width: "100%", maxHeight: "50vh", objectFit: "cover", display: "block" }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.rust }}>{post.category}</span>
        <span style={{ fontSize: 12, color: COLORS.medGray }}>{post.readTime}</span>
      </div>

      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1.0, letterSpacing: "0.02em", color: COLORS.charcoal, marginBottom: 12 }}>{post.title}</h1>
      <p style={{ fontSize: 14, color: COLORS.medGray, marginBottom: 24 }}>{post.date}</p>
      <div style={accentLine} />

      <div style={{ marginBottom: 64 }}>
        {(post.content || post.excerpt || "").split("\n").filter(Boolean).map((para, i) => (
          <p key={i} style={{ ...bodyText, marginBottom: 24, maxWidth: "none" }}>{para}</p>
        ))}
      </div>

      <div className="project-nav" style={{ borderTop: `1px solid ${COLORS.lightGray}`, paddingTop: 32 }}>
        <div>
          {prevPost && (
            <button onClick={() => onNavigate(prevPost)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", padding: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 4 }}>← Previous</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>{prevPost.title}</div>
            </button>
          )}
        </div>
        <div>
          {nextPost && (
            <button onClick={() => onNavigate(nextPost)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "right", padding: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.medGray, marginBottom: 4 }}>Next →</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>{nextPost.title}</div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function BlogPage({ manifest, onPostClick }) {
  const posts = manifest.blog || [];
  if (posts.length === 0) {
    return (
      <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={sectionLabel}>Blog</p>
        <h1 className="section-heading">INSIGHTS & PROCESS</h1>
        <div style={accentLine} />
        <p style={{ textAlign: "center", color: COLORS.medGray, padding: "80px 0" }}>Blog posts coming soon. Check back later!</p>
      </section>
    );
  }
  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <p style={sectionLabel}>Blog</p>
      <h1 className="section-heading">INSIGHTS & PROCESS</h1>
      <div style={accentLine} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map((post, i) => (
          <article key={post.id} className="blog-article" style={{ padding: "40px 0", borderBottom: i < posts.length - 1 ? `1px solid ${COLORS.lightGray}` : "none", cursor: "pointer" }}
            onClick={() => onPostClick && onPostClick(post)}>
            <div className="blog-thumb" style={{
              width: 160, height: 120, borderRadius: 6, opacity: 0.8,
              backgroundColor: post.image ? undefined : [COLORS.sage, COLORS.warmTan, COLORS.rust][i % 3],
              backgroundImage: post.image ? `url(${encodeURI(post.image)})` : undefined,
              backgroundSize: "cover", backgroundPosition: "center",
            }} />
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

function FAQPage({ manifest }) {
  const faqs = manifest.faq || [];
  const [openId, setOpenId] = useState(null);

  if (faqs.length === 0) {
    return (
      <section className="section-padding section-padding-top" style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={sectionLabel}>FAQ</p>
        <h1 className="section-heading">FREQUENTLY ASKED<br /><span style={{ color: COLORS.rust }}>QUESTIONS</span></h1>
        <div style={accentLine} />
        <p style={{ textAlign: "center", color: COLORS.medGray, padding: "80px 0" }}>FAQs coming soon.</p>
      </section>
    );
  }

  return (
    <section className="section-padding section-padding-top" style={{ maxWidth: 800, margin: "0 auto" }}>
      <p style={sectionLabel}>FAQ</p>
      <h1 className="section-heading">FREQUENTLY ASKED<br /><span style={{ color: COLORS.rust }}>QUESTIONS</span></h1>
      <div style={accentLine} />
      <p style={{ ...bodyText, marginBottom: 48 }}>Have a question about working together? Here are some answers to the most common ones.</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} style={{ borderBottom: `1px solid ${COLORS.lightGray}` }}>
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "24px 0", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.charcoal, paddingRight: 24 }}>{faq.question}</span>
                <span style={{
                  fontSize: 24, color: COLORS.rust, flexShrink: 0, fontWeight: 300,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? 500 : 0, overflow: "hidden",
                transition: "max-height 0.3s ease, padding 0.3s ease",
                paddingBottom: isOpen ? 24 : 0,
              }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.medGray }}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ContactPage({ manifest }) {
  const about = manifest.about || FALLBACK.about;
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
            {[{ label: "Email", value: about.email || "Jalbanese79@gmail.com" }, { label: "Phone", value: about.phone || "407.516.6193" }, { label: "Location", value: about.location || "Altamonte Springs, FL" }].map((item) => (
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

function Footer({ setPage, manifest }) {
  const about = manifest.about || FALLBACK.about;
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
            {["Store", "FAQ", "Contact"].map((p) => <p key={p} style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8, cursor: "pointer" }} onClick={() => { setPage(p); window.scrollTo(0, 0); }}>{p}</p>)}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: "0.15em", color: COLORS.cream, marginBottom: 16 }}>CONTACT</h4>
            <p style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8 }}>{about.email}</p>
            <p style={{ fontSize: 14, color: COLORS.warmTan, marginBottom: 8 }}>{about.phone}</p>
            <p style={{ fontSize: 14, color: COLORS.warmTan }}>{about.location}</p>
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");
  const [manifest, setManifest] = useState(FALLBACK);

  const navigateTo = (page) => {
    setSelectedProject(null);
    setSelectedPost(null);
    setPage(page);
    window.scrollTo(0, 0);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setPage("Portfolio");
    window.scrollTo(0, 0);
  };

  // Fetch manifest from API on load
  useEffect(() => {
    fetch(`${API_BASE}/api/manifest`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setManifest(data);
      })
      .catch(() => {
        // Silently fall back to defaults — site still works
      });
  }, []);

  useEffect(() => {
    const handleHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (isAdmin) return <AdminPanel />;

  const renderPage = () => {
    if (selectedProject) {
      return <ProjectDetailPage project={selectedProject} manifest={manifest} onBack={() => { setSelectedProject(null); setPage("Portfolio"); }} onNavigate={setSelectedProject} />;
    }
    if (selectedPost) {
      return <BlogDetailPage post={selectedPost} manifest={manifest} onBack={() => { setSelectedPost(null); }} onNavigate={(post) => { setSelectedPost(post); window.scrollTo(0, 0); }} />;
    }
    switch (currentPage) {
      case "Home": return <HomePage setPage={navigateTo} manifest={manifest} onProjectClick={handleProjectClick} />;
      case "Portfolio": return <PortfolioPage manifest={manifest} onProjectClick={handleProjectClick} />;
      case "About": return <AboutPage manifest={manifest} />;
      case "Services": return <ServicesPage setPage={navigateTo} manifest={manifest} />;
      case "Store": return <StorePage manifest={manifest} />;
      case "FAQ": return <FAQPage manifest={manifest} />;
      case "Blog": return <BlogPage manifest={manifest} onPostClick={(post) => { setSelectedPost(post); window.scrollTo(0, 0); }} />;
      case "Contact": return <ContactPage manifest={manifest} />;
      default: return <HomePage setPage={navigateTo} manifest={manifest} onProjectClick={handleProjectClick} />;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.charcoal, backgroundColor: COLORS.cream, lineHeight: 1.6, WebkitFontSmoothing: "antialiased", overflowX: "hidden", width: "100%" }}>
      <style>{FONTS}</style>
      <style>{responsiveCSS}</style>
      <Navigation currentPage={currentPage} setPage={navigateTo} />
      {renderPage()}
      <Footer setPage={navigateTo} manifest={manifest} />
    </div>
  );
}
