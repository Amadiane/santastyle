import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Users, ChevronDown, ArrowRight, ShoppingBag, Sparkles, Phone, Info } from "lucide-react";

const WAsvg = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const Navlinks = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const dropdownRef     = useRef(null);
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    const onClick  = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const onEnter = (i) => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); setActiveDropdown(i); };
  const onLeave = () => { dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 350); };

  const navItems = [
    {
      title: "Boutique", path: "/boutique", icon: ShoppingBag, hasDropdown: true,
      subItems: [
        { title: "Tous les articles",  path: "/boutique",               icon: ShoppingBag },
        { title: "Nouveautés",         path: "/boutique?filtre=nouveau", icon: Sparkles    },
        { title: "Hommes",             path: "/boutique?cat=hommes",     icon: Users       },
        { title: "Femmes",             path: "/boutique?cat=femmes",     icon: Users       },
      ],
    },
    {
      title: "À propos", path: "/nosMissions", icon: Info, hasDropdown: true,
      subItems: [
        { title: "Qui sommes-nous", path: "/nosMissions", icon: Info  },
        { title: "Notre équipe",    path: "/notreEquipe", icon: Users },
      ],
    },
    { title: "Contact", path: "/contacternous", icon: Phone },
  ];

  const ouvrirWA = () => {
    window.open(`https://wa.me/224620762508?text=${encodeURIComponent("Bonjour Santa'Style ! 👋\nJe souhaite avoir des informations sur vos articles.")}`, "_blank");
  };

  const handleSearch = (q) => {
    navigate(`/boutique?q=${encodeURIComponent(q)}`);
    setSearchOpen(false); setSearchQuery("");
  };

  // Couleurs selon scroll
  const isLight  = scrolled; // après scroll = fond crème = texte sombre
  const txtColor = isLight ? "#5C3D00" : "rgba(255,255,255,0.95)";
  const hoverBg  = isLight ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.15)";

  return (
    <>
      {/* ── BARRE NAV ── */}
      <div style={{
        // ✅ Pas scrollé : totalement transparent sur le dégradé doré
        // ✅ Scrollé : fond crème opaque
        background: scrolled
          ? "rgba(247,243,236,0.97)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(212,192,138,0.5)"
          : "none",
        boxShadow: scrolled
          ? "0 2px 20px rgba(92,61,0,0.10)"
          : "none",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        // ✅ Pleine largeur — pas de padding latéral créant des espaces gris
        width: "100%",
      }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto", padding: scrolled ? "8px 32px" : "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "padding 0.4s" }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex" }}>
            <div style={{
              padding: "6px 16px 6px 8px", borderRadius: "30px", display: "flex", alignItems: "center", gap: "8px",
              background: scrolled
                ? "linear-gradient(135deg, #5C3D00, #8A6A20)"
                : "rgba(255,255,255,0.14)",
              border: scrolled
                ? "none"
                : "1px solid rgba(255,255,255,0.25)",
              boxShadow: scrolled ? "0 2px 12px rgba(201,168,76,0.4)" : "none",
              transition: "all 0.4s",
            }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: scrolled ? "rgba(255,255,255,0.15)" : "rgba(201,168,76,0.25)", border: "1px solid rgba(201,168,76,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#C9A84C", fontSize: "14px", fontWeight: "900", fontFamily: "serif", lineHeight: 1 }}>S</span>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, whiteSpace: "nowrap" }}>Santa'Style</div>
                {!scrolled && <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1, marginTop: "2px" }}>Mode · Accessoires</div>}
              </div>
            </div>
          </a>

          {/* Nav desktop */}
          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} ref={dropdownRef}>
            {navItems.map((item, idx) => {
              if (item.hasDropdown) return (
                <div key={idx} style={{ position: "relative" }}
                  onMouseEnter={() => onEnter(idx)} onMouseLeave={onLeave}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: "5px", padding: "8px 14px", borderRadius: "10px",
                    background: activeDropdown === idx ? hoverBg : "transparent",
                    border: "none", cursor: "pointer", color: txtColor,
                    fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => { if (activeDropdown !== idx) e.currentTarget.style.background = "transparent"; }}>
                    {item.title}
                    <ChevronDown size={12} style={{ transition: "transform 0.3s", transform: activeDropdown === idx ? "rotate(180deg)" : "none", color: activeDropdown === idx ? "#C9A84C" : "inherit" }} />
                  </button>

                  {activeDropdown === idx && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", width: "240px", zIndex: 200 }}>
                      <div style={{ position: "absolute", top: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "10px", height: "10px", background: "#F0E8D5", border: "1px solid #D4C08A", borderBottom: "none", borderRight: "none" }} />
                      <div style={{ background: "#F0E8D5", border: "1px solid #D4C08A", borderRadius: "14px", overflow: "hidden", boxShadow: "0 20px 60px rgba(92,61,0,0.2)" }}>
                        <div style={{ height: "2px", background: "linear-gradient(90deg, #C9A84C, #F0D080, #C9A84C)" }} />
                        <div style={{ padding: "6px" }}>
                          {item.subItems.map((sub, i) => {
                            const Icon = sub.icon;
                            return (
                              <NavLink key={i} to={sub.path} onClick={() => setActiveDropdown(null)}
                                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", background: "transparent", transition: "background 0.15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#EDE5D0"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <Icon size={14} color="#C9A84C" />
                                </div>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#5C3D00", flex: 1 }}>{sub.title}</span>
                                <ArrowRight size={12} color="#C9A84C" style={{ opacity: 0.5 }} />
                              </NavLink>
                            );
                          })}
                        </div>
                        <div style={{ padding: "6px 8px 8px", borderTop: "1px solid rgba(212,192,138,0.5)" }}>
                          <button onClick={ouvrirWA}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: "#D4EDDF", border: "1px solid rgba(26,107,60,0.2)", color: "#1A6B3C", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#C4E8CF"}
                            onMouseLeave={e => e.currentTarget.style.background = "#D4EDDF"}>
                            <WAsvg size={14} color="#1A6B3C" /> Commander sur WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );

              return (
                <NavLink key={idx} to={item.path}
                  style={({ isActive }) => ({
                    padding: "8px 14px", borderRadius: "10px", textDecoration: "none",
                    color: isActive ? (scrolled ? "#5C3D00" : "#fff") : txtColor,
                    background: isActive ? hoverBg : "transparent",
                    fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", transition: "all 0.2s",
                  })}
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={ouvrirWA} style={{
              display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", borderRadius: "10px",
              background: "rgba(37,211,102,0.18)", border: "1px solid rgba(37,211,102,0.35)",
              color: scrolled ? "#1A6B3C" : "#5bef93",
              fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.18)"}>
              <WAsvg size={13} color={scrolled ? "#1A6B3C" : "#5bef93"} /> WhatsApp
            </button>

            <NavLink to="/boutique" style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "10px",
              background: isActive ? "linear-gradient(135deg, #5C3D00, #C9A84C)" : "linear-gradient(135deg, #C9A84C, #8A6A20)",
              color: "#fff", border: "1px solid rgba(201,168,76,0.5)",
              fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em",
              textDecoration: "none", transition: "all 0.3s", boxShadow: "0 2px 12px rgba(201,168,76,0.4)",
            })}>
              <ShoppingBag size={14} /> Boutique
            </NavLink>

            <button onClick={() => setSearchOpen(true)} style={{
              padding: "9px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center",
              background: scrolled ? "#EDE5D0" : "rgba(255,255,255,0.15)",
              border: scrolled ? "1px solid #D4C08A" : "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.2s",
            }}>
              <Search size={16} color={scrolled ? "#8A6A20" : "rgba(255,255,255,0.85)"} />
            </button>

            {/* Mobile */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
              padding: "9px", borderRadius: "10px", cursor: "pointer", display: "none", alignItems: "center",
              background: scrolled ? "#EDE5D0" : "rgba(255,255,255,0.15)",
              border: scrolled ? "1px solid #D4C08A" : "1px solid rgba(255,255,255,0.2)",
            }} className="lg-hidden">
              {mobileMenuOpen ? <X size={18} color={txtColor} /> : <Menu size={18} color={txtColor} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{ margin: "8px 16px", padding: "12px", borderRadius: "16px", background: "#F0E8D5", border: "1px solid #D4C08A", boxShadow: "0 8px 32px rgba(92,61,0,0.15)" }}>
          <NavLink to="/boutique" onClick={() => setMobileMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px", marginBottom: "6px", background: "linear-gradient(135deg, #C9A84C, #8A6A20)", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
            <ShoppingBag size={16} /> Boutique Santa'Style
          </NavLink>
          <button onClick={() => { ouvrirWA(); setMobileMenuOpen(false); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px", marginBottom: "8px", background: "#D4EDDF", border: "1px solid rgba(26,107,60,0.2)", color: "#1A6B3C", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            <WAsvg size={16} color="#1A6B3C" /> Commander sur WhatsApp
          </button>
          <div style={{ height: "1px", background: "rgba(212,192,138,0.4)", margin: "4px 0 8px" }} />
          {navItems.map((item, idx) => (
            <div key={idx}>
              <NavLink to={item.path} onClick={() => !item.subItems && setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", borderRadius: "10px", textDecoration: "none", color: "#5C3D00", fontSize: "14px", fontWeight: "600" }}
                onMouseEnter={e => e.currentTarget.style.background = "#EDE5D0"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {item.icon && <item.icon size={15} color="#C9A84C" />} {item.title}
              </NavLink>
              {item.subItems && (
                <div style={{ marginLeft: "28px", paddingLeft: "12px", borderLeft: "2px solid rgba(212,192,138,0.5)" }}>
                  {item.subItems.map((sub, i) => (
                    <NavLink key={i} to={sub.path} onClick={() => setMobileMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", color: "#8A6A20", fontSize: "13px" }}>
                      <ArrowRight size={11} color="#C9A84C" /> {sub.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,26,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "120px", zIndex: 300 }}
          onClick={() => setSearchOpen(false)}>
          <div style={{ width: "100%", maxWidth: "540px", margin: "0 16px", background: "#F0E8D5", borderRadius: "20px", padding: "24px", border: "1px solid #D4C08A", boxShadow: "0 24px 64px rgba(92,61,0,0.3)", position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #C9A84C, #F0D080, #C9A84C)", borderRadius: "20px 20px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#5C3D00", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rechercher</span>
              <button onClick={() => setSearchOpen(false)} style={{ padding: "6px", borderRadius: "8px", background: "#EDE5D0", border: "none", cursor: "pointer" }}>
                <X size={15} color="#8A6A20" />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#fff", border: "1px solid #D4C08A", borderRadius: "12px", marginBottom: "16px" }}>
              <Search size={16} color="#C9A84C" />
              <input autoFocus placeholder="Robe, bazin, abaya..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) handleSearch(searchQuery.trim()); }}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#2C1A00", fontSize: "14px" }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} color="#B8A070" /></button>}
            </div>
            <div style={{ fontSize: "11px", color: "#B8A070", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em" }}>Populaires</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Robe", "Bazin", "Abaya", "Veste", "Accessoires"].map(s => (
                <button key={s} onClick={() => handleSearch(s)}
                  style={{ padding: "6px 14px", borderRadius: "20px", background: "#EDE5D0", border: "1px solid #D4C08A", color: "#5C3D00", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#EDE5D0"; e.currentTarget.style.color = "#5C3D00"; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;