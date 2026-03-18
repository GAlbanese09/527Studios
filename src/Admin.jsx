import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://api.527studios.com";

const C = {
  rust: "#C17A45",
  rustLight: "#D4935E",
  cream: "#F4F1EA",
  charcoal: "#2E2E2E",
  darkBg: "#1a1a1a",
  panelBg: "#222222",
  cardBg: "#2a2a2a",
  borderDark: "#333333",
  white: "#FFFFFF",
  offWhite: "#FAF9F6",
  lightGray: "#E8E4DD",
  medGray: "#9A948B",
  green: "#4CAF50",
  red: "#E53935",
};

// ==================== AUTH ====================

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onLogin(data.token);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed — check API");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: C.darkBg, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: 360, textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: C.white, marginBottom: 4 }}>
          527<span style={{ color: C.rust }}>STUDIOS</span>
        </div>
        <div style={{ fontSize: 12, color: C.medGray, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 40 }}>
          Admin Panel
        </div>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            width: "100%", padding: "14px 16px", fontSize: 15, backgroundColor: C.panelBg,
            border: `1.5px solid ${C.borderDark}`, borderRadius: 6, color: C.white,
            outline: "none", boxSizing: "border-box", marginBottom: 16,
            fontFamily: "'DM Sans', sans-serif",
          }}
          autoFocus
        />
        {error && <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", fontSize: 13, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            backgroundColor: C.rust, color: C.white, border: "none",
            borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Enter"}
        </button>
      </div>
    </div>
  );
}

// ==================== SHARED COMPONENTS ====================

function AdminInput({ label, value, onChange, type = "text", placeholder, multiline, rows = 3 }) {
  const style = {
    width: "100%", padding: "10px 14px", fontSize: 14, backgroundColor: C.darkBg,
    border: `1px solid ${C.borderDark}`, borderRadius: 4, color: C.white,
    outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
    resize: multiline ? "vertical" : "none",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.medGray, marginBottom: 6 }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={style}
          onFocus={(e) => (e.target.style.borderColor = C.rust)} onBlur={(e) => (e.target.style.borderColor = C.borderDark)} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={style}
          onFocus={(e) => (e.target.style.borderColor = C.rust)} onBlur={(e) => (e.target.style.borderColor = C.borderDark)} />
      )}
    </div>
  );
}

function AdminButton({ children, onClick, variant = "primary", disabled, small, fullWidth }) {
  const styles = {
    primary: { backgroundColor: C.rust, color: C.white, border: "none" },
    secondary: { backgroundColor: "transparent", color: C.white, border: `1px solid ${C.borderDark}` },
    danger: { backgroundColor: C.red, color: C.white, border: "none" },
    success: { backgroundColor: C.green, color: C.white, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "6px 14px" : "10px 20px",
      fontSize: small ? 11 : 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
      borderRadius: 4, cursor: disabled ? "default" : "pointer",
      fontFamily: "'DM Sans', sans-serif", opacity: disabled ? 0.5 : 1,
      width: fullWidth ? "100%" : "auto", textAlign: "center",
      ...styles[variant],
    }}>
      {children}
    </button>
  );
}

function ImageUploader({ token, folder, onUpload, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const fileRef = useRef();

  const handleFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      setProgress(`Uploading ${file.name}...`);
      try {
        // Get presigned URL
        const res = await fetch(`${API_BASE}/api/upload/presign`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ folder, filename: file.name, contentType: file.type }),
        });
        const { uploadUrl, key, publicUrl } = await res.json();

        // Upload directly to R2
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        onUpload({ key, publicUrl, filename: file.name });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setProgress("");
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${C.borderDark}`, borderRadius: 8, padding: "32px 20px",
          textAlign: "center", cursor: "pointer", backgroundColor: C.darkBg,
          transition: "border-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.rust)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.borderDark)}
      >
        {uploading ? (
          <div style={{ color: C.rust, fontSize: 13 }}>{progress}</div>
        ) : (
          <>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 13, color: C.medGray }}>{label}</div>
            <div style={{ fontSize: 11, color: C.borderDark, marginTop: 4 }}>Drag & drop or click to browse</div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

// ==================== SECTION: PORTFOLIO ====================

function PortfolioSection({ manifest, setManifest, token, saveManifest }) {
  const [editing, setEditing] = useState(null);
  const [newProject, setNewProject] = useState(false);

  const addProject = () => {
    const id = `project-${Date.now()}`;
    const project = {
      id, title: "New Project", category: "Brand Identity",
      tags: ["Brand Identity"], description: "", images: [],
      coverImage: "", order: manifest.portfolio.length, featured: false,
    };
    setManifest({ ...manifest, portfolio: [...manifest.portfolio, project] });
    setEditing(id);
  };

  const updateProject = (id, updates) => {
    setManifest({
      ...manifest,
      portfolio: manifest.portfolio.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project and all its images?")) return;
    const project = manifest.portfolio.find((p) => p.id === id);
    // Delete images from R2
    for (const img of (project?.images || [])) {
      try {
        await fetch(`${API_BASE}/api/image`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ key: img.key }),
        });
      } catch {}
    }
    setManifest({ ...manifest, portfolio: manifest.portfolio.filter((p) => p.id !== id) });
    if (editing === id) setEditing(null);
  };

  const project = editing ? manifest.portfolio.find((p) => p.id === editing) : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.white }}>PORTFOLIO</h2>
        <AdminButton onClick={addProject}>+ New Project</AdminButton>
      </div>

      {!editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {manifest.portfolio.map((p) => (
            <div key={p.id} style={{ backgroundColor: C.cardBg, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
              onClick={() => setEditing(p.id)}>
              <div style={{
                height: 140, backgroundColor: p.coverImage ? undefined : (p.category === "Brand Identity" ? "#8C9A8C" : C.rust),
                backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                backgroundSize: "cover", backgroundPosition: "center",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.8)", fontFamily: "'Bebas Neue'", fontSize: 16,
              }}>
                {!p.coverImage && p.title}
              </div>
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.white, marginBottom: 4 }}>
                  {p.title}
                  {p.featured && <span style={{ color: C.rust, fontSize: 10, marginLeft: 8 }}>⭐ FEATURED</span>}
                </div>
                <div style={{ fontSize: 11, color: C.medGray, textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.category}</div>
                <div style={{ fontSize: 11, color: C.medGray, marginTop: 4 }}>{p.images?.length || 0} images</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: C.rust, cursor: "pointer", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans'" }}>
            ← Back to all projects
          </button>
          <div style={{ backgroundColor: C.cardBg, borderRadius: 8, padding: 24 }}>
            <AdminInput label="Project Title" value={project.title} onChange={(v) => updateProject(editing, { title: v })} />
            <AdminInput label="Category" value={project.category} onChange={(v) => updateProject(editing, { category: v })} placeholder="Brand Identity, Editorial Design, etc." />
            <AdminInput label="Tags (comma separated)" value={(project.tags || []).join(", ")}
              onChange={(v) => updateProject(editing, { tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} />
            <AdminInput label="Description" value={project.description} onChange={(v) => updateProject(editing, { description: v })} multiline rows={4} />

            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: C.white, fontSize: 14 }}>
                <input type="checkbox" checked={project.featured || false}
                  onChange={(e) => updateProject(editing, { featured: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: C.rust }} />
                <span>⭐ Feature on Homepage</span>
              </label>
              <div style={{ fontSize: 11, color: C.medGray, marginTop: 4, marginLeft: 28 }}>
                Featured projects appear in the "Featured Projects" section on the home page
              </div>
            </div>

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.medGray, marginBottom: 12 }}>Project Images</label>
              <ImageUploader
                token={token}
                folder={`portfolio/${project.id}`}
                label="Upload project images"
                onUpload={({ key, publicUrl, filename }) => {
                  const title = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                  const newImages = [...(project.images || []), { key, url: publicUrl, title, order: (project.images || []).length }];
                  updateProject(editing, { images: newImages, coverImage: project.coverImage || publicUrl });
                }}
              />
            </div>

            {(project.images || []).length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 16 }}>
                {project.images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", borderRadius: 6, overflow: "hidden" }}>
                    <img src={img.url} alt={img.title} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "6px 8px", backgroundColor: C.darkBg, fontSize: 11, color: C.medGray }}>{img.title}</div>
                    <button
                      onClick={async () => {
                        await fetch(`${API_BASE}/api/image`, {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ key: img.key }),
                        });
                        const newImages = project.images.filter((_, i) => i !== idx);
                        updateProject(editing, { images: newImages });
                      }}
                      style={{
                        position: "absolute", top: 4, right: 4, width: 20, height: 20,
                        borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.7)", color: C.white,
                        border: "none", cursor: "pointer", fontSize: 11, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                    >×</button>
                    {project.coverImage !== img.url && (
                      <button
                        onClick={() => updateProject(editing, { coverImage: img.url })}
                        style={{
                          position: "absolute", bottom: 30, left: 4, fontSize: 9,
                          padding: "2px 6px", backgroundColor: "rgba(0,0,0,0.7)", color: C.white,
                          border: "none", cursor: "pointer", borderRadius: 3,
                        }}
                      >Set Cover</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <AdminButton onClick={() => { saveManifest(); setEditing(null); }} variant="success">Save Project</AdminButton>
              <AdminButton onClick={() => deleteProject(editing)} variant="danger">Delete Project</AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SECTION: BLOG ====================

function BlogSection({ manifest, setManifest, token, saveManifest }) {
  const [editing, setEditing] = useState(null);

  const addPost = () => {
    const id = `post-${Date.now()}`;
    const post = {
      id, title: "New Post", excerpt: "", content: "",
      date: new Date().toISOString().split("T")[0],
      category: "Design", readTime: "3 min read", image: "",
    };
    setManifest({ ...manifest, blog: [post, ...manifest.blog] });
    setEditing(id);
  };

  const updatePost = (id, updates) => {
    setManifest({
      ...manifest,
      blog: manifest.blog.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const deletePost = (id) => {
    if (!confirm("Delete this blog post?")) return;
    setManifest({ ...manifest, blog: manifest.blog.filter((p) => p.id !== id) });
    if (editing === id) setEditing(null);
  };

  const post = editing ? manifest.blog.find((p) => p.id === editing) : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.white }}>BLOG</h2>
        <AdminButton onClick={addPost}>+ New Post</AdminButton>
      </div>

      {!editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {manifest.blog.map((p) => (
            <div key={p.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              backgroundColor: C.cardBg, padding: "16px 20px", borderRadius: 6, cursor: "pointer",
            }} onClick={() => setEditing(p.id)}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{p.title}</div>
                <div style={{ fontSize: 12, color: C.medGray, marginTop: 2 }}>{p.date} · {p.category} · {p.readTime}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deletePost(p.id); }}
                style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          ))}
          {manifest.blog.length === 0 && <div style={{ color: C.medGray, textAlign: "center", padding: 40 }}>No blog posts yet. Create your first one!</div>}
        </div>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: C.rust, cursor: "pointer", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans'" }}>
            ← Back to all posts
          </button>
          <div style={{ backgroundColor: C.cardBg, borderRadius: 8, padding: 24 }}>
            <AdminInput label="Title" value={post.title} onChange={(v) => updatePost(editing, { title: v })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <AdminInput label="Date" value={post.date} onChange={(v) => updatePost(editing, { date: v })} type="date" />
              <AdminInput label="Category" value={post.category} onChange={(v) => updatePost(editing, { category: v })} />
              <AdminInput label="Read Time" value={post.readTime} onChange={(v) => updatePost(editing, { readTime: v })} />
            </div>
            <AdminInput label="Excerpt" value={post.excerpt} onChange={(v) => updatePost(editing, { excerpt: v })} multiline rows={2} />
            <AdminInput label="Content (Markdown supported)" value={post.content} onChange={(v) => updatePost(editing, { content: v })} multiline rows={12} />

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.medGray, marginBottom: 12 }}>Cover Image</label>
              {post.image && <img src={post.image} alt="" style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 12, display: "block" }} />}
              <ImageUploader token={token} folder="blog" label="Upload cover image"
                onUpload={({ publicUrl }) => updatePost(editing, { image: publicUrl })} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <AdminButton onClick={() => { saveManifest(); setEditing(null); }} variant="success">Save Post</AdminButton>
              <AdminButton onClick={() => deletePost(editing)} variant="danger">Delete Post</AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SECTION: ABOUT ====================

function AboutSection({ manifest, setManifest, token, saveManifest }) {
  const about = manifest.about || {};

  const update = (field, value) => {
    setManifest({ ...manifest, about: { ...about, [field]: value } });
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.white, marginBottom: 24 }}>ABOUT PAGE</h2>
      <div style={{ backgroundColor: C.cardBg, borderRadius: 8, padding: 24 }}>
        <AdminInput label="Headline" value={about.headline || ""} onChange={(v) => update("headline", v)} />

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.medGray, marginBottom: 12 }}>Headshot</label>
        {about.headshot && <img src={about.headshot} alt="Headshot" style={{ width: 150, height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 12, display: "block" }} />}
        <ImageUploader token={token} folder="about" label="Upload headshot photo"
          onUpload={({ publicUrl }) => update("headshot", publicUrl)} />

        <div style={{ marginTop: 24 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.medGray, marginBottom: 12 }}>Bio Paragraphs</label>
          {(about.bio || []).map((paragraph, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <textarea value={paragraph} onChange={(e) => {
                const newBio = [...about.bio]; newBio[i] = e.target.value;
                update("bio", newBio);
              }} rows={3} style={{
                flex: 1, padding: "10px 14px", fontSize: 14, backgroundColor: C.darkBg,
                border: `1px solid ${C.borderDark}`, borderRadius: 4, color: C.white,
                outline: "none", fontFamily: "'DM Sans'", resize: "vertical",
              }} />
              <button onClick={() => update("bio", about.bio.filter((_, j) => j !== i))}
                style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
          ))}
          <AdminButton onClick={() => update("bio", [...(about.bio || []), ""])} variant="secondary" small>+ Add Paragraph</AdminButton>
        </div>

        <div style={{ marginTop: 24 }}>
          <AdminInput label="Closing Quote" value={about.quote || ""} onChange={(v) => update("quote", v)} multiline rows={2} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <AdminInput label="Email" value={about.email || ""} onChange={(v) => update("email", v)} />
          <AdminInput label="Phone" value={about.phone || ""} onChange={(v) => update("phone", v)} />
          <AdminInput label="Location" value={about.location || ""} onChange={(v) => update("location", v)} />
        </div>

        <div style={{ marginTop: 16 }}>
          <AdminInput label="Specialties (comma separated)" value={(about.specialties || []).join(", ")}
            onChange={(v) => update("specialties", v.split(",").map((s) => s.trim()).filter(Boolean))} />
          <AdminInput label="Tools (comma separated)" value={(about.tools || []).join(", ")}
            onChange={(v) => update("tools", v.split(",").map((s) => s.trim()).filter(Boolean))} />
        </div>

        <div style={{ marginTop: 24 }}>
          <AdminButton onClick={saveManifest} variant="success">Save About Page</AdminButton>
        </div>
      </div>
    </div>
  );
}

// ==================== SECTION: SERVICES ====================

function ServicesSection({ manifest, setManifest, saveManifest }) {
  const [editing, setEditing] = useState(null);

  const updateService = (id, updates) => {
    setManifest({
      ...manifest,
      services: manifest.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const service = editing ? manifest.services.find((s) => s.id === editing) : null;

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.white, marginBottom: 24 }}>SERVICES</h2>
      {!editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {manifest.services.map((s) => (
            <div key={s.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              backgroundColor: C.cardBg, padding: "16px 20px", borderRadius: 6, cursor: "pointer",
            }} onClick={() => setEditing(s.id)}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{s.name}</div>
                <div style={{ fontSize: 12, color: C.rust, marginTop: 2 }}>{s.price}</div>
              </div>
              <span style={{ color: C.medGray, fontSize: 12 }}>Edit →</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: C.rust, cursor: "pointer", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans'" }}>
            ← Back to services
          </button>
          <div style={{ backgroundColor: C.cardBg, borderRadius: 8, padding: 24 }}>
            <AdminInput label="Service Name" value={service.name} onChange={(v) => updateService(editing, { name: v })} />
            <AdminInput label="Price" value={service.price} onChange={(v) => updateService(editing, { price: v })} />
            <AdminInput label="Description" value={service.description} onChange={(v) => updateService(editing, { description: v })} multiline rows={3} />
            <AdminInput label="Timeline" value={service.timeline} onChange={(v) => updateService(editing, { timeline: v })} />
            <AdminInput label="Includes (comma separated)" value={(service.includes || []).join(", ")}
              onChange={(v) => updateService(editing, { includes: v.split(",").map((s) => s.trim()).filter(Boolean) })} multiline rows={3} />
            <div style={{ marginTop: 16 }}>
              <AdminButton onClick={() => { saveManifest(); setEditing(null); }} variant="success">Save Service</AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SECTION: STORE ====================

function StoreSection({ manifest, setManifest, saveManifest }) {
  const [editing, setEditing] = useState(null);

  const updatePackage = (id, updates) => {
    setManifest({
      ...manifest,
      store: manifest.store.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const pkg = editing ? manifest.store.find((s) => s.id === editing) : null;

  return (
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.white, marginBottom: 24 }}>STORE PACKAGES</h2>
      {!editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {manifest.store.map((s) => (
            <div key={s.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              backgroundColor: C.cardBg, padding: "16px 20px", borderRadius: 6, cursor: "pointer",
            }} onClick={() => setEditing(s.id)}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>
                  {s.name} {s.popular && <span style={{ color: C.rust, fontSize: 10, marginLeft: 8 }}>★ POPULAR</span>}
                </div>
                <div style={{ fontSize: 12, color: C.rust, marginTop: 2 }}>{s.price}</div>
              </div>
              <span style={{ color: C.medGray, fontSize: 12 }}>Edit →</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: C.rust, cursor: "pointer", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans'" }}>
            ← Back to packages
          </button>
          <div style={{ backgroundColor: C.cardBg, borderRadius: 8, padding: 24 }}>
            <AdminInput label="Package Name" value={pkg.name} onChange={(v) => updatePackage(editing, { name: v })} />
            <AdminInput label="Price" value={pkg.price} onChange={(v) => updatePackage(editing, { price: v })} />
            <AdminInput label="Description" value={pkg.description} onChange={(v) => updatePackage(editing, { description: v })} multiline rows={2} />
            <AdminInput label="Includes (comma separated)" value={(pkg.includes || []).join(", ")}
              onChange={(v) => updatePackage(editing, { includes: v.split(",").map((s) => s.trim()).filter(Boolean) })} multiline rows={3} />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: C.white, fontSize: 14 }}>
                <input type="checkbox" checked={pkg.popular || false}
                  onChange={(e) => updatePackage(editing, { popular: e.target.checked })} />
                Mark as "Most Popular"
              </label>
            </div>
            <AdminButton onClick={() => { saveManifest(); setEditing(null); }} variant="success">Save Package</AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN ADMIN PANEL ====================

export default function AdminPanel() {
  const [token, setToken] = useState(null);
  const [manifest, setManifest] = useState(null);
  const [activeSection, setActiveSection] = useState("portfolio");
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Load manifest on login
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/api/manifest`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setManifest(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const saveManifest = useCallback(async () => {
    setSaveStatus("Saving...");
    try {
      await fetch(`${API_BASE}/api/manifest`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(manifest),
      });
      setSaveStatus("Saved ✓");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      setSaveStatus("Save failed!");
    }
  }, [manifest, token]);

  if (!token) return <LoginScreen onLogin={setToken} />;
  if (loading || !manifest) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.darkBg, color: C.white }}>
        Loading...
      </div>
    );
  }

  const sections = [
    { id: "portfolio", label: "Portfolio", icon: "🖼️" },
    { id: "blog", label: "Blog", icon: "📝" },
    { id: "about", label: "About", icon: "👤" },
    { id: "services", label: "Services", icon: "💼" },
    { id: "store", label: "Store", icon: "🛒" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.darkBg, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, backgroundColor: C.panelBg, padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 20px", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: C.white }}>
            527<span style={{ color: C.rust }}>STUDIOS</span>
          </div>
          <div style={{ fontSize: 10, color: C.medGray, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin</div>
        </div>

        <nav style={{ flex: 1 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "12px 20px", border: "none",
                backgroundColor: activeSection === s.id ? "rgba(193,122,69,0.15)" : "transparent",
                borderLeft: activeSection === s.id ? `3px solid ${C.rust}` : "3px solid transparent",
                color: activeSection === s.id ? C.white : C.medGray,
                cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans'",
                textAlign: "left", transition: "all 0.2s",
              }}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "0 20px" }}>
          {saveStatus && (
            <div style={{ fontSize: 12, color: saveStatus.includes("✓") ? C.green : C.rust, marginBottom: 12, textAlign: "center" }}>
              {saveStatus}
            </div>
          )}
          <AdminButton onClick={saveManifest} variant="success" fullWidth>Save All</AdminButton>
          <div style={{ marginTop: 12 }}>
            <AdminButton onClick={() => { setToken(null); window.location.hash = ""; }} variant="secondary" fullWidth>
              Logout
            </AdminButton>
          </div>
          <a href="/" style={{ display: "block", textAlign: "center", fontSize: 11, color: C.medGray, marginTop: 16, textDecoration: "none" }}>
            ← View Public Site
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto", maxHeight: "100vh" }}>
        {activeSection === "portfolio" && <PortfolioSection manifest={manifest} setManifest={setManifest} token={token} saveManifest={saveManifest} />}
        {activeSection === "blog" && <BlogSection manifest={manifest} setManifest={setManifest} token={token} saveManifest={saveManifest} />}
        {activeSection === "about" && <AboutSection manifest={manifest} setManifest={setManifest} token={token} saveManifest={saveManifest} />}
        {activeSection === "services" && <ServicesSection manifest={manifest} setManifest={setManifest} saveManifest={saveManifest} />}
        {activeSection === "store" && <StoreSection manifest={manifest} setManifest={setManifest} saveManifest={saveManifest} />}
      </div>
    </div>
  );
}
