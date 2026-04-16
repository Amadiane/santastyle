import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, DollarSign, Layers,
  Tag, Users, LogOut, ChevronLeft, ChevronRight,
  Sun, Moon, Bell, User, Clock
} from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTheme } from "../../context/ThemeContext";

const SIDEBAR_WIDTH     = 240;
const SIDEBAR_COLLAPSED = 64;

const NavAdmin = ({ onToggle }) => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { toggleTheme, isLight, tokens } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts]       = useState({ contacts: 0, community: 0, newsletter: 0 });

  // ✅ Rôle lu depuis localStorage
  const user    = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return; // vendeur n'a pas accès à ces listes
    const fetchCounts = async () => {
      try {
        const r1 = await fetch(CONFIG.API_CONTACT_LIST);
        if (r1.ok) { const d = await r1.json(); setCounts(p => ({ ...p, contacts: (Array.isArray(d) ? d : d.results || []).length })); }
        const r2 = await fetch(CONFIG.API_POSTULANT_LIST);
        if (r2.ok) { const d = await r2.json(); setCounts(p => ({ ...p, community: (Array.isArray(d) ? d : d.results || []).length })); }
        const r3 = await fetch(CONFIG.API_ABONNEMENT_LIST);
        if (r3.ok) { const d = await r3.json(); setCounts(p => ({ ...p, newsletter: (Array.isArray(d) ? d : d.results || []).length })); }
      } catch {}
    };
    fetchCounts();
  }, [isAdmin]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Sections adaptées au rôle
  const navSections = [
    // Dashboard — pointe vers la bonne page selon le rôle
    {
      label: "Dashboard",
      items: [
        {
          path:  isAdmin ? "/dashboardAdmin" : "/vendeurDashboard",
          label: "Tableau de bord",
          icon:  LayoutDashboard,
        },
      ],
    },

    // Boutique — visible pour admin ET vendeur
    {
      label: "Boutique",
      items: [
        { path: "/categories", label: "Catégories", icon: Tag       },
        { path: "/produits",   label: "Produits",   icon: Package   },
        { path: "/stocks",     label: "Stocks",     icon: Layers    },
        { path: "/ventes",     label: "Ventes",     icon: DollarSign },
      ],
    },

    // Équipe + Historique — admin seulement
    ...(isAdmin ? [
      {
        label: "Équipe",
        items: [
          { path: "/register-employee", label: "Employés",         icon: Users },
        ],
      },
      {
        label: "Supervision",
        items: [
          { path: "/activity", label: "Historique global", icon: Clock },
        ],
      },
    ] : []),
  ];

  const totalNotifs = counts.contacts + counts.community + counts.newsletter;
  const w = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0,
      width: `${w}px`,
      background: tokens.navBg,
      borderRight: `1px solid ${tokens.border}`,
      display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      zIndex: 200,
      overflow: "hidden",
    }}>

      {/* Header sidebar */}
      <div style={{ height: "64px", padding: "0 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: `1px solid ${tokens.border}`, flexShrink: 0 }}>
        <Link to={isAdmin ? "/dashboardAdmin" : "/vendeurDashboard"} style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 10px ${tokens.gold}40` }}>
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: "900" }}>S</span>
          </div>
        </Link>

        {!collapsed && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: tokens.goldDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Santa'Style
            </div>
            {/* ✅ Rôle affiché */}
            <div style={{ fontSize: "11px", color: tokens.textDim }}>
              {isAdmin ? "Administration" : "Espace vendeur"}
            </div>
          </div>
        )}

        <button onClick={toggle} style={{ width: "28px", height: "28px", borderRadius: "8px", border: `1px solid ${tokens.border}`, background: tokens.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: collapsed ? "auto" : 0, transition: "all 0.2s" }}>
          {collapsed ? <ChevronRight size={14} color={tokens.textMuted} /> : <ChevronLeft size={14} color={tokens.textMuted} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navSections.map((section, si) => (
          <div key={si} style={{ marginBottom: "8px" }}>
            {!collapsed && (
              <div style={{ fontSize: "10px", fontWeight: "800", color: tokens.textDim, textTransform: "uppercase", letterSpacing: "0.1em", padding: "6px 10px 4px", whiteSpace: "nowrap", overflow: "hidden" }}>
                {section.label}
              </div>
            )}
            {collapsed && si > 0 && (
              <div style={{ height: "1px", background: tokens.border, margin: "6px 8px" }} />
            )}
            {section.items.map((item, ii) => {
              const isActive = location.pathname === item.path;
              const Icon     = item.icon;
              return (
                <Link key={ii} to={item.path} title={collapsed ? item.label : ""}
                  style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : "10px", padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: "10px", textDecoration: "none", background: isActive ? `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})` : "transparent", color: isActive ? "#fff" : tokens.textMuted, fontSize: "13px", fontWeight: "600", transition: "all 0.15s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = `${tokens.gold}12`; e.currentTarget.style.color = tokens.gold; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = tokens.textMuted; } }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.label}
                    </span>
                  )}
                  {collapsed && isActive && (
                    <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "3px", height: "20px", borderRadius: "2px 0 0 2px", background: tokens.gold }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div style={{ borderTop: `1px solid ${tokens.border}`, padding: "10px 8px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>

        <div style={{ display: "flex", gap: "6px", justifyContent: collapsed ? "center" : "flex-start" }}>
          <button onClick={toggleTheme} title={isLight ? "Mode sombre" : "Mode clair"}
            style={{ padding: "8px", borderRadius: "8px", border: `1px solid ${tokens.border}`, background: tokens.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isLight ? <Moon size={15} color={tokens.gold} /> : <Sun size={15} color={tokens.gold} />}
          </button>

          {/* Notifications — admin seulement */}
          {isAdmin && !collapsed && (
            <button title="Notifications"
              style={{ padding: "8px", borderRadius: "8px", border: `1px solid ${tokens.border}`, background: tokens.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Bell size={15} color={tokens.textMuted} />
              {totalNotifs > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "16px", height: "16px", borderRadius: "50%", background: tokens.gold, color: "#1A1208", fontSize: "9px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {totalNotifs}
                </span>
              )}
            </button>
          )}
        </div>

        {/* ✅ Profil avec nom réel + rôle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: collapsed ? "8px 0" : "8px 10px", borderRadius: "10px", background: `${tokens.gold}10`, border: `1px solid ${tokens.gold}25`, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `linear-gradient(135deg, ${tokens.goldDark}, ${tokens.gold})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={16} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: tokens.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || "Utilisateur"}
              </div>
              <div style={{ fontSize: "11px", color: tokens.textDim }}>
                {isAdmin ? "Administrateur" : "Vendeur"}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleLogout} title="Déconnexion"
          style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: "8px", padding: collapsed ? "9px 0" : "9px 12px", borderRadius: "10px", border: `1px solid ${tokens.danger}40`, background: `${tokens.danger}12`, color: tokens.danger, fontSize: "13px", fontWeight: "600", cursor: "pointer", width: "100%" }}>
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default NavAdmin;