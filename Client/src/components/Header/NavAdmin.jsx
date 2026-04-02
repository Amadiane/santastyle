import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Home, Building2, UsersRound, Target, Mail,
  UserPlus, Users, Package, Briefcase, LogOut, Menu, X,
  ChevronDown, Zap, Grid3x3, FileText, Search, Bell, User,
  Sun, Moon
} from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTheme } from "../../context/ThemeContext";

const NavAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleTheme, isLight, tokens } = useTheme();

  const [counts, setCounts] = useState({ contacts: 0, community: 0, newsletter: 0 });
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const contactsRes = await fetch(CONFIG.API_CONTACT_LIST);
        if (contactsRes.ok) {
          const d = await contactsRes.json();
          setCounts(prev => ({ ...prev, contacts: (Array.isArray(d) ? d : d.results || []).length }));
        }
        const communityRes = await fetch(CONFIG.API_POSTULANT_LIST);
        if (communityRes.ok) {
          const d = await communityRes.json();
          setCounts(prev => ({ ...prev, community: (Array.isArray(d) ? d : d.results || []).length }));
        }
        const newsletterRes = await fetch(CONFIG.API_ABONNEMENT_LIST);
        if (newsletterRes.ok) {
          const d = await newsletterRes.json();
          setCounts(prev => ({ ...prev, newsletter: (Array.isArray(d) ? d : d.results || []).length }));
        }
      } catch (err) { console.error(err); }
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const getIcon = (path) => {
    const icons = {
      "/dashboardAdmin": <LayoutDashboard size={18} />,
      "/register-employee": <Home size={18} />,
      "/partnerPost": <Building2 size={18} />,
      "/teamMessage": <UsersRound size={18} />,
      "/missionPost": <Target size={18} />,
      "/listeContacts": <Mail size={18} />,
      "/listePostulantsCommunity": <UserPlus size={18} />,
      "/listeAbonnement": <Users size={18} />,
      "/servicePost": <Package size={18} />,
      "/portfolioPost": <Briefcase size={18} />,
    };
    return icons[path] || <FileText size={18} />;
  };

  const navCategories = [
    {
      title: "Dashboard",
      color: tokens.gold,
      items: [{ path: "/dashboardAdmin", label: "Tableau de bord" }]
    },
    {
      title: "Contenu Site",
      color: tokens.gold,
      items: [{ path: "/register-employee", label: "Register Employee" }]
    },
    {
      title: "Boutique",
      color: tokens.gold,
      items: [
        { path: "/categories", label: "Catégories" },
        { path: "/produits", label: "Produits" },
        { path: "/stocks", label: "Stocks" },
        { path: "/ventes", label: "Ventes" },
      ]
    },
  ];

  const quickAccess = [
    { path: "/dashboardAdmin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/produits", label: "Produits", icon: <Package size={20} /> },
    { path: "/ventes", label: "Ventes", icon: <Briefcase size={20} /> },
    { path: "/stocks", label: "Stocks", icon: <Grid3x3 size={20} /> },
  ];

  const totalNotifs = counts.contacts + counts.community + counts.newsletter;

  // ── Styles inline basés sur tokens ──────────────────────────────
  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0,
    height: "72px",
    background: tokens.navBg,
    borderBottom: `1px solid ${tokens.border}`,
    backdropFilter: "blur(16px)",
    zIndex: 200,
    transition: "background 0.3s, border-color 0.3s",
  };

  const btnNavStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: "8px 14px", borderRadius: "10px",
    fontSize: "14px", fontWeight: "600",
    color: isActive ? tokens.gold : tokens.navText,
    background: isActive ? `${tokens.gold}15` : "transparent",
    border: "none", cursor: "pointer",
    transition: "all 0.15s",
  });

  const dropdownStyle = {
    position: "absolute", top: "calc(100% + 8px)", left: 0,
    minWidth: "220px",
    background: tokens.dropdownBg,
    border: `1px solid ${tokens.border}`,
    borderRadius: "14px",
    boxShadow: `0 8px 32px ${tokens.gold}15`,
    overflow: "hidden",
    zIndex: 300,
  };

  const dropdownItemStyle = (isActive) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px",
    color: isActive ? "#fff" : tokens.navText,
    background: isActive
      ? `linear-gradient(135deg, ${tokens.gold}, ${tokens.goldDark})`
      : "transparent",
    textDecoration: "none", fontSize: "14px", fontWeight: "500",
    transition: "background 0.15s",
    cursor: "pointer",
  });

  const iconBtnStyle = {
    padding: "9px", borderRadius: "10px",
    border: `1px solid ${tokens.border}`,
    background: tokens.card,
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  };

  const searchStyle = {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 14px",
    background: tokens.card,
    border: `1px solid ${tokens.border}`,
    borderRadius: "10px",
  };

  const quickMenuStyle = {
    position: "fixed", top: "82px", right: "20px",
    width: "320px",
    background: tokens.dropdownBg,
    border: `1px solid ${tokens.border}`,
    borderRadius: "18px",
    boxShadow: `0 16px 48px ${tokens.gold}20`,
    zIndex: 300,
    overflow: "hidden",
  };

  const mobileMenuStyle = {
    position: "fixed", top: "72px", left: 0, right: 0, bottom: 0,
    background: tokens.navBg,
    overflowY: "auto",
    zIndex: 300,
  };

  return (
    <>
      {/* ── TOP BAR ── */}
      <nav style={navStyle}>
        <div style={{
          height: "100%", maxWidth: "1920px", margin: "0 auto",
          padding: "0 20px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: "16px",
        }}>

          {/* Gauche : Logo + Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Logo */}
            <Link to="/dashboardAdmin" style={{ textDecoration: "none" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 12px ${tokens.gold}40`,
              }}>
                <span style={{ color: "#fff", fontSize: "20px", fontWeight: "900" }}>S</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "8px" }}
              className="hidden lg:flex">
              {navCategories.map((cat, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <button
                    style={btnNavStyle(activeDropdown === idx)}
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    onMouseEnter={e => {
                      if (activeDropdown !== idx) {
                        e.currentTarget.style.background = `${tokens.gold}10`;
                        e.currentTarget.style.color = tokens.gold;
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeDropdown !== idx) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = tokens.navText;
                      }
                    }}
                  >
                    {cat.title}
                    <ChevronDown size={14} style={{
                      transition: "transform 0.2s",
                      transform: activeDropdown === idx ? "rotate(180deg)" : "rotate(0deg)",
                    }} />
                  </button>

                  {activeDropdown === idx && (
                    <div style={dropdownStyle}>
                      {cat.items.map((item, iIdx) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={iIdx}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            style={dropdownItemStyle(isActive)}
                            onMouseEnter={e => {
                              if (!isActive) e.currentTarget.style.background = `${tokens.gold}12`;
                            }}
                            onMouseLeave={e => {
                              if (!isActive) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ color: isActive ? "#fff" : tokens.gold }}>
                                {getIcon(item.path)}
                              </span>
                              {item.label}
                            </div>
                            {item.count > 0 && (
                              <span style={{
                                padding: "1px 8px", borderRadius: "20px", fontSize: "11px",
                                background: isActive ? "rgba(255,255,255,0.2)" : `${tokens.gold}20`,
                                color: isActive ? "#fff" : tokens.gold,
                              }}>
                                {item.count}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Droite : Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* Search */}
            <div style={searchStyle} className="hidden md:flex">
              <Search size={15} color={tokens.textDim} />
              <input
                placeholder="Rechercher..."
                style={{
                  background: "none", border: "none", outline: "none",
                  color: tokens.text, fontSize: "14px", width: "160px",
                }}
              />
            </div>

            {/* Notifications */}
            <button style={{ ...iconBtnStyle, position: "relative" }}>
              <Bell size={18} color={tokens.textMuted} />
              {totalNotifs > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: tokens.gold, color: "#1A1208",
                  fontSize: "10px", fontWeight: "700",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {totalNotifs}
                </span>
              )}
            </button>

            {/* Quick menu */}
            <button
              style={{
                ...iconBtnStyle,
                background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`,
                border: "none",
              }}
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="hidden sm:flex"
            >
              <Grid3x3 size={18} color="#fff" />
            </button>

            {/* Profil */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "6px 12px",
              background: tokens.card,
              border: `1px solid ${tokens.border}`,
              borderRadius: "10px",
            }} className="hidden md:flex">
              <div style={{
                width: "30px", height: "30px", borderRadius: "8px",
                background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <User size={16} color="#fff" />
              </div>
              <div className="hidden lg:block">
                <div style={{ fontSize: "13px", fontWeight: "600", color: tokens.text }}>Admin</div>
                <div style={{ fontSize: "11px", color: tokens.textDim }}>Santa'Style</div>
              </div>
            </div>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              title={isLight ? "Mode sombre" : "Mode clair"}
              style={iconBtnStyle}
            >
              {isLight
                ? <Moon size={17} color={tokens.gold} />
                : <Sun  size={17} color={tokens.gold} />
              }
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                ...iconBtnStyle,
                background: `${tokens.danger}15`,
                border: `1px solid ${tokens.danger}40`,
              }}
              className="hidden sm:flex"
              title="Déconnexion"
            >
              <LogOut size={17} color={tokens.danger} />
            </button>

            {/* Mobile toggle */}
            <button
              style={iconBtnStyle}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden"
            >
              {showMobileMenu
                ? <X size={18} color={tokens.text} />
                : <Menu size={18} color={tokens.text} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* ── QUICK MENU ── */}
      {showQuickMenu && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 250 }}
            onClick={() => setShowQuickMenu(false)}
          />
          <div style={quickMenuStyle}>
            <div style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${tokens.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap size={16} color={tokens.gold} />
                <span style={{ fontSize: "15px", fontWeight: "700", color: tokens.text }}>Accès rapide</span>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setShowQuickMenu(false)}>
                <X size={16} color={tokens.textMuted} />
              </button>
            </div>

            <div style={{ padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {quickAccess.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setShowQuickMenu(false)}
                    style={{
                      padding: "14px", borderRadius: "12px",
                      background: isActive
                        ? `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`
                        : tokens.card,
                      border: `1px solid ${isActive ? tokens.gold : tokens.border}`,
                      textDecoration: "none",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "8px",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: isActive ? "rgba(255,255,255,0.2)" : `${tokens.gold}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: isActive ? "#fff" : tokens.gold }}>{item.icon}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: isActive ? "#fff" : tokens.text }}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div style={{ padding: "14px", borderTop: `1px solid ${tokens.border}` }}>
              <div style={{ fontSize: "11px", color: tokens.textDim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                Navigation
              </div>
              {navCategories.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: "11px", color: tokens.gold, fontWeight: "700", padding: "6px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {cat.title}
                  </div>
                  {cat.items.map((item, iIdx) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={iIdx}
                        to={item.path}
                        onClick={() => setShowQuickMenu(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "8px 10px", borderRadius: "8px",
                          textDecoration: "none",
                          color: isActive ? tokens.gold : tokens.textMuted,
                          background: isActive ? `${tokens.gold}12` : "transparent",
                          fontSize: "13px", fontWeight: "500",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ color: tokens.gold }}>{getIcon(item.path)}</span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── MOBILE MENU ── */}
      {showMobileMenu && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 250 }}
            onClick={() => setShowMobileMenu(false)}
          />
          <div style={mobileMenuStyle} className="lg:hidden">

            {/* Header mobile */}
            <div style={{
              position: "sticky", top: 0,
              background: tokens.navBg,
              borderBottom: `1px solid ${tokens.border}`,
              padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              zIndex: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Menu size={18} color={tokens.gold} />
                <span style={{ fontSize: "16px", fontWeight: "700", color: tokens.text }}>Menu</span>
              </div>
              <button style={iconBtnStyle} onClick={() => setShowMobileMenu(false)}>
                <X size={18} color={tokens.text} />
              </button>
            </div>

            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "80px" }}>

              {/* User card */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", borderRadius: "12px",
                background: `${tokens.gold}12`,
                border: `1px solid ${tokens.gold}30`,
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: tokens.text }}>Admin</div>
                  <div style={{ fontSize: "12px", color: tokens.textMuted }}>Santa'Style</div>
                </div>
                {/* Toggle thème dans mobile */}
                <button onClick={toggleTheme} style={{ ...iconBtnStyle, marginLeft: "auto" }}>
                  {isLight ? <Moon size={16} color={tokens.gold} /> : <Sun size={16} color={tokens.gold} />}
                </button>
              </div>

              {/* Nav categories */}
              {navCategories.map((cat, idx) => (
                <div key={idx}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "6px 10px", marginBottom: "8px",
                  }}>
                    <div style={{ width: "3px", height: "18px", borderRadius: "2px", background: tokens.gold }} />
                    <span style={{ fontSize: "11px", fontWeight: "800", color: tokens.gold, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {cat.title}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {cat.items.map((item, iIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={iIdx}
                          to={item.path}
                          onClick={() => setShowMobileMenu(false)}
                          style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 16px", borderRadius: "10px",
                            textDecoration: "none",
                            background: isActive
                              ? `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`
                              : tokens.card,
                            border: `1px solid ${isActive ? tokens.gold : tokens.border}`,
                            color: isActive ? "#fff" : tokens.text,
                            fontSize: "14px", fontWeight: "600",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ color: isActive ? "#fff" : tokens.gold }}>
                            {getIcon(item.path)}
                          </span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Logout */}
              <button
                onClick={() => { setShowMobileMenu(false); handleLogout(); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  padding: "14px", borderRadius: "12px",
                  background: `${tokens.danger}15`,
                  border: `1px solid ${tokens.danger}40`,
                  color: tokens.danger, fontSize: "14px", fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>

            {/* Bouton fermeture flottant */}
            <button
              onClick={() => setShowMobileMenu(false)}
              style={{
                position: "fixed", bottom: "24px", right: "24px",
                width: "52px", height: "52px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`,
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 20px ${tokens.gold}40`,
                zIndex: 20,
              }}
            >
              <X size={24} color="#fff" />
            </button>
          </div>
        </>
      )}

      {activeDropdown !== null && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 150 }}
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default NavAdmin;