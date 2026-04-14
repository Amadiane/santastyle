import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import { Navigate } from "react-router-dom";
import {
  ShoppingBag, Users, MessageCircle, Search, TrendingUp,
  Eye, Zap, Star, Clock, X, RefreshCw, BarChart3,
  Sparkles, ArrowUpRight, Package, Filter
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const WAIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const LABELS = {
  visite_boutique:  "Visite boutique",
  visite_produit:   "Visite produit",
  clic_whatsapp:    "Clic WhatsApp",
  clic_commander:   "Commander",
  filtre_genre:     "Filtre genre",
  filtre_categorie: "Filtre catégorie",
  recherche:        "Recherche",
  visite_contact:   "Visite contact",
  visite_equipe:    "Visite équipe",
  visite_missions:  "Visite missions",
};

const ICONS_MAP = {
  visite_boutique:  <ShoppingBag size={16} />,
  visite_produit:   <Package size={16} />,
  clic_whatsapp:    <WAIcon size={16} />,
  clic_commander:   <Zap size={16} />,
  filtre_genre:     <Users size={16} />,
  filtre_categorie: <Filter size={16} />,
  recherche:        <Search size={16} />,
  visite_contact:   <MessageCircle size={16} />,
  visite_equipe:    <Users size={16} />,
  visite_missions:  <Star size={16} />,
};

const DashboardAdmin = () => {
  const token = localStorage.getItem("access");
  const { tokens: SS } = useTheme();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [jours, setJours]   = useState(30);
  const [refresh, setRefresh] = useState(0);

  if (!token) return <Navigate to="/login" replace />;

  const fetchStats = async () => {
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/track/stats/?jours=${jours}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, [jours, refresh]);

  // Auto-refresh toutes les 30s
  useEffect(() => {
    const iv = setInterval(() => setRefresh(r => r + 1), 30000);
    return () => clearInterval(iv);
  }, []);

  const card = (titre, valeur, icon, couleur, sous = null) => (
    <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", color: SS.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{titre}</span>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: couleur + "20", display: "flex", alignItems: "center", justifyContent: "center", color: couleur }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "36px", fontWeight: "800", color: SS.text, letterSpacing: "-0.02em", lineHeight: 1 }}>{valeur}</div>
      {sous && <div style={{ fontSize: "12px", color: SS.textDim }}>{sous}</div>}
    </div>
  );

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <ShoppingBag size={48} color={SS.gold} style={{ display: "block", margin: "0 auto 16px", opacity: 0.4 }} />
        <div style={{ color: SS.textMuted, fontSize: "15px" }}>Chargement...</div>
      </div>
    </div>
  );

  if (!stats) return null;

  const t = stats.totaux;
  const tauxWA = t.visite_boutique > 0
    ? ((t.clic_whatsapp / t.visite_boutique) * 100).toFixed(1)
    : 0;

  // Hauteur max pour le graphe
  const maxJour = stats.activite_jour.length > 0
    ? Math.max(...stats.activite_jour.map(d => d.total))
    : 1;

  const maxHeure = stats.heures.length > 0
    ? Math.max(...stats.heures.map(h => h.total))
    : 1;

  return (
    <div style={{ color: SS.text, fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${SS.gold}20`, border: `1px solid ${SS.gold}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} color={SS.gold} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: SS.goldLight, margin: 0 }}>Tableau de bord</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "20px", background: `${SS.success}15`, border: `1px solid ${SS.success}40` }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: SS.success, display: "inline-block" }} />
              <span style={{ fontSize: "11px", color: SS.success, fontWeight: "700" }}>Live</span>
            </div>
          </div>
          <div style={{ fontSize: "13px", color: SS.textDim }}>Santa'Style · Statistiques en temps réel</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Période */}
          <div style={{ display: "flex", gap: "4px", background: SS.card, borderRadius: "10px", padding: "4px", border: `1px solid ${SS.border}` }}>
            {[7, 30, 90].map(j => (
              <button key={j} onClick={() => setJours(j)}
                style={{ padding: "6px 14px", borderRadius: "7px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", background: jours === j ? SS.gold : "transparent", color: jours === j ? "#1A1208" : SS.textMuted, transition: "all 0.15s" }}>
                {j}j
              </button>
            ))}
          </div>
          {/* Refresh */}
          <button onClick={() => { setLoading(true); setRefresh(r => r + 1); }}
            style={{ padding: "8px", borderRadius: "10px", background: SS.surface, border: `1px solid ${SS.border}`, cursor: "pointer", display: "flex", alignItems: "center" }}>
            <RefreshCw size={16} color={SS.textMuted} />
          </button>
        </div>
      </div>

      {/* ── Métriques principales ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {card("Visites boutique",  t.visite_boutique,  <ShoppingBag size={18} />, SS.gold,    `${stats.uniques} visiteurs uniques`)}
        {card("Vues produits",     t.visite_produit,   <Eye size={18} />,         "#1d4ed8",  `${stats.top_produits.length} produits vus`)}
        {card("Clics WhatsApp",    t.clic_whatsapp,    <WAIcon size={18} />,      "#25D366",  `${tauxWA}% des visiteurs`)}
        {card("Recherches",        t.recherche,        <Search size={18} />,      SS.warning, `${stats.recherches.length} termes différents`)}
        {card("Visites contact",   t.visite_contact,   <MessageCircle size={18} />, SS.success, "Page contact")}
        {card("Filtres genre",     t.filtre_genre,     <Users size={18} />,       "#be185d",  "Homme / Femme")}
      </div>

      {/* ── Taux de conversion ── */}
      <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "20px" }}>
          Entonnoir de conversion
        </div>
        <div style={{ display: "flex", gap: "0", alignItems: "stretch", flexWrap: "wrap" }}>
          {[
            { label: "Visiteurs",    val: t.visite_boutique, color: SS.gold,    pct: 100 },
            { label: "Vues produit", val: t.visite_produit,  color: "#1d4ed8",  pct: t.visite_boutique > 0 ? Math.round((t.visite_produit / t.visite_boutique) * 100) : 0 },
            { label: "WhatsApp",     val: t.clic_whatsapp,   color: "#25D366",  pct: t.visite_boutique > 0 ? Math.round((t.clic_whatsapp / t.visite_boutique) * 100) : 0 },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: "140px", textAlign: "center", padding: "20px 16px", borderRight: i < 2 ? `1px solid ${SS.border}` : "none" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: s.color, marginBottom: "4px" }}>{s.val.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: SS.textMuted, fontWeight: "600", marginBottom: "10px" }}>{s.label}</div>
              <div style={{ height: "6px", borderRadius: "3px", background: SS.card, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: "3px", transition: "width 0.6s" }} />
              </div>
              <div style={{ fontSize: "11px", color: SS.textDim, marginTop: "6px", fontWeight: "600" }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

        {/* ── Activité par jour ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "20px" }}>
            Activité — {jours} derniers jours
          </div>
          {stats.activite_jour.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: SS.textDim }}>Aucune donnée</div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
              {stats.activite_jour.slice(-30).map((d, i) => (
                <div key={i} title={`${d.jour} : ${d.total} actions`}
                  style={{ flex: 1, minWidth: "4px", borderRadius: "3px 3px 0 0", background: `linear-gradient(180deg, ${SS.gold}, ${SS.goldDark})`, height: `${Math.max((d.total / maxJour) * 100, 4)}%`, transition: "height 0.3s", cursor: "pointer", opacity: 0.85 }}
                  onMouseEnter={e => { e.target.style.opacity = "1"; e.target.style.background = "#25D366"; }}
                  onMouseLeave={e => { e.target.style.opacity = "0.85"; e.target.style.background = `linear-gradient(180deg, ${SS.gold}, ${SS.goldDark})`; }}
                />
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: SS.textDim }}>{stats.activite_jour[0]?.jour || ""}</span>
            <span style={{ fontSize: "11px", color: SS.textDim }}>{stats.activite_jour[stats.activite_jour.length - 1]?.jour || ""}</span>
          </div>
        </div>

        {/* ── Heures de pointe ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "20px" }}>
            Heures de pointe
          </div>
          {stats.heures.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: SS.textDim }}>Aucune donnée</div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "120px" }}>
              {Array.from({ length: 24 }, (_, h) => {
                const data = stats.heures.find(x => x.heure === h);
                const total = data?.total || 0;
                return (
                  <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", height: "100%" }}>
                    <div title={`${h}h : ${total} actions`}
                      style={{ width: "100%", borderRadius: "2px 2px 0 0", background: total > maxHeure * 0.7 ? "#25D366" : total > 0 ? SS.gold : SS.card, height: `${total > 0 ? Math.max((total / maxHeure) * 100, 6) : 4}%`, transition: "height 0.3s", cursor: "pointer", marginTop: "auto" }} />
                    {h % 6 === 0 && <span style={{ fontSize: "9px", color: SS.textDim }}>{h}h</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>

        {/* ── Top produits vus ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px" }}>
            🔥 Produits les plus vus
          </div>
          {stats.top_produits.length === 0 ? (
            <div style={{ color: SS.textDim, fontSize: "13px", textAlign: "center", padding: "1rem" }}>Aucune donnée</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.top_produits.slice(0, 6).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "20px", fontSize: "12px", fontWeight: "800", color: i === 0 ? SS.gold : SS.textDim, flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.produit_nom || "—"}</div>
                    <div style={{ height: "3px", borderRadius: "2px", background: SS.card, marginTop: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.total / stats.top_produits[0].total) * 100}%`, background: SS.gold, borderRadius: "2px" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: SS.goldLight, flexShrink: 0 }}>{p.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WhatsApp par produit ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#25D366" }}><WAIcon size={14} /></span> Commandes WhatsApp
          </div>
          {stats.wa_produits.length === 0 ? (
            <div style={{ color: SS.textDim, fontSize: "13px", textAlign: "center", padding: "1rem" }}>Aucun clic WA</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.wa_produits.slice(0, 6).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#25D36618", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#25D366" }}><WAIcon size={13} /></span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.produit_nom}</div>
                    <div style={{ height: "3px", borderRadius: "2px", background: SS.card, marginTop: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.total / stats.wa_produits[0].total) * 100}%`, background: "#25D366", borderRadius: "2px" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#25D366", flexShrink: 0 }}>{p.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recherches populaires ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px" }}>
            🔍 Recherches populaires
          </div>
          {stats.recherches.length === 0 ? (
            <div style={{ color: SS.textDim, fontSize: "13px", textAlign: "center", padding: "1rem" }}>Aucune recherche</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.recherches.slice(0, 6).map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Search size={13} color={SS.gold} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{r.recherche}"</div>
                    <div style={{ height: "3px", borderRadius: "2px", background: SS.card, marginTop: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(r.total / stats.recherches[0].total) * 100}%`, background: SS.gold, borderRadius: "2px" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: SS.goldLight, flexShrink: 0 }}>{r.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

        {/* ── Répartition genre ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px" }}>
            👔👗 Répartition par genre
          </div>
          {stats.genres.length === 0 ? (
            <div style={{ color: SS.textDim, fontSize: "13px", textAlign: "center", padding: "1rem" }}>Aucun filtre utilisé</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {stats.genres.map((g, i) => {
                const total = stats.genres.reduce((a, x) => a + x.total, 0);
                const pct   = Math.round((g.total / total) * 100);
                const color = g.genre === "hommes" ? "#1d4ed8" : g.genre === "femmes" ? "#be185d" : SS.goldLight;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: SS.text }}>
                        {g.genre === "hommes" ? "👔 Hommes" : g.genre === "femmes" ? "👗 Femmes" : g.genre}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color }}>{g.total} <span style={{ fontSize: "12px", fontWeight: "500", color: SS.textDim }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "4px", background: SS.card, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px", transition: "width 0.6s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Activité récente ── */}
        <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: SS.success, display: "inline-block" }} />
            Activité en direct
          </div>
          {stats.recentes.length === 0 ? (
            <div style={{ color: SS.textDim, fontSize: "13px", textAlign: "center", padding: "1rem" }}>Aucune activité</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
              {stats.recentes.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: SS.card }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${SS.gold}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: SS.gold }}>
                    {ICONS_MAP[r.type_action] || <Zap size={14} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: SS.text }}>{LABELS[r.type_action] || r.type_action}</div>
                    {(r.produit_nom || r.recherche || r.genre) && (
                      <div style={{ fontSize: "11px", color: SS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.produit_nom || r.recherche || r.genre}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: SS.textDim, flexShrink: 0 }}>{r.created_at}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Toutes les actions ── */}
      <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", padding: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "20px" }}>
          Toutes les actions — {jours} derniers jours
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {Object.entries(LABELS).map(([key, label]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", borderRadius: "10px", background: SS.card, border: `1px solid ${SS.border}` }}>
              <div style={{ color: SS.gold, flexShrink: 0 }}>{ICONS_MAP[key]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: SS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: SS.text }}>{(t[key] || 0).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;