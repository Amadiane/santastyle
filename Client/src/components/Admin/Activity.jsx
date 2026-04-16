import React, { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import {
  RefreshCw, Search, Filter, X, Clock,
  ShoppingBag, Package, Tag, Layers, DollarSign,
  Trash2, Edit, Plus, LogIn
} from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTheme } from "../../context/ThemeContext.jsx";

// ── Icônes et couleurs par action ──────────────────────────
const ACTION_CONFIG = {
  create:  { label: "Création",      icon: <Plus    size={14} />, color: "#1A6B3C", bg: "rgba(26,107,60,0.12)"  },
  update:  { label: "Modification",  icon: <Edit    size={14} />, color: "#1d4ed8", bg: "rgba(59,130,246,0.12)" },
  delete:  { label: "Suppression",   icon: <Trash2  size={14} />, color: "#A32020", bg: "rgba(163,32,32,0.12)"  },
  vente:   { label: "Vente",         icon: <DollarSign size={14} />, color: "#C9A84C", bg: "rgba(201,168,76,0.12)" },
  login:   { label: "Connexion",     icon: <LogIn   size={14} />, color: "#7c3aed", bg: "rgba(168,85,247,0.12)" },
};

// ── Icônes par modèle ──────────────────────────────────────
const MODEL_ICON = {
  Produit:    <Package   size={14} />,
  Categorie:  <Tag       size={14} />,
  Stock:      <Layers    size={14} />,
  Vente:      <DollarSign size={14} />,
  default:    <ShoppingBag size={14} />,
};

const getModelIcon = (name = "") =>
  MODEL_ICON[name] || MODEL_ICON.default;

// ── Formatage date ─────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ── Badge action ───────────────────────────────────────────
const BadgeAction = ({ action }) => {
  const cfg = ACTION_CONFIG[action] || { label: action, color: "#888", bg: "#eee" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px",
      background: cfg.bg, color: cfg.color,
      fontSize: "11px", fontWeight: "700",
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── Composant principal ────────────────────────────────────
const Activity = () => {
  const token = localStorage.getItem("access");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  const { tokens: SS } = useTheme();

  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterModel, setFilterModel]   = useState("");
  const [filterUser, setFilterUser]     = useState("");
  const [users, setUsers]       = useState([]);
  const [page, setPage]         = useState(1);
  const PER_PAGE = 20;

  if (!token) return <Navigate to="/login" replace />;

  // ── Charger les logs ──────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterAction) params.set("action", filterAction);
      if (filterModel)  params.set("model",  filterModel);
      if (filterUser && isAdmin) params.set("user", filterUser);
      if (search)       params.set("search", search);

      const res = await fetch(
        `${CONFIG.API_ACTIVITY}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Erreur chargement logs", err);
    } finally {
      setLoading(false);
    }
  }, [filterAction, filterModel, filterUser, search, token, isAdmin]);

  // ── Charger liste users (admin seulement) ─────────────────
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch(CONFIG.API_REGISTER, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.results || []);
      }
    } catch {}
  }, [isAdmin, token]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, filterAction, filterModel, filterUser]);

  // ── Pagination locale ──────────────────────────────────────
  const total    = logs.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paginated  = logs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Statistiques rapides ───────────────────────────────────
  const stats = {
    total:    logs.length,
    creates:  logs.filter(l => l.action === "create").length,
    updates:  logs.filter(l => l.action === "update").length,
    deletes:  logs.filter(l => l.action === "delete").length,
    ventes:   logs.filter(l => l.action === "vente").length,
  };

  const cardStat = (label, value, color) => (
    <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "12px", padding: "16px 20px" }}>
      <div style={{ fontSize: "11px", color: SS.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: "900", color, lineHeight: 1 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ color: SS.text, fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${SS.gold}20`, border: `1px solid ${SS.gold}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={18} color={SS.gold} />
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: SS.goldLight, margin: 0 }}>
              {isAdmin ? "Historique global" : "Mon historique"}
            </h1>
          </div>
          <div style={{ fontSize: "13px", color: SS.textDim }}>
            {isAdmin
              ? "Toutes les actions effectuées dans le système"
              : `Actions effectuées par ${user?.username || "vous"}`}
          </div>
        </div>
        <button onClick={fetchLogs}
          style={{ padding: "8px 16px", borderRadius: "10px", background: SS.surface, border: `1px solid ${SS.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: SS.textMuted, fontWeight: "600" }}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* ── Stats rapides ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {cardStat("Total",        stats.total,   SS.gold)}
        {cardStat("Créations",    stats.creates, "#1A6B3C")}
        {cardStat("Modifications",stats.updates, "#1d4ed8")}
        {cardStat("Suppressions", stats.deletes, "#A32020")}
        {cardStat("Ventes",       stats.ventes,  SS.gold)}
      </div>

      {/* ── Filtres ── */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", background: SS.surface, padding: "16px", borderRadius: "14px", border: `1px solid ${SS.border}` }}>

        {/* Recherche */}
        <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "8px", background: SS.bg, border: `1px solid ${SS.border}`, borderRadius: "10px", padding: "0 12px" }}>
          <Search size={14} color={SS.textDim} />
          <input placeholder="Rechercher dans les logs..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: SS.text, fontSize: "13px", padding: "10px 0" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={13} color={SS.textDim} /></button>}
        </div>

        {/* Filtre action */}
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: "10px", border: `1px solid ${SS.border}`, background: SS.bg, color: SS.textMuted, fontSize: "13px", cursor: "pointer", outline: "none" }}>
          <option value="">Toutes les actions</option>
          <option value="create">Création</option>
          <option value="update">Modification</option>
          <option value="delete">Suppression</option>
          <option value="vente">Vente</option>
          <option value="login">Connexion</option>
        </select>

        {/* Filtre modèle */}
        <select value={filterModel} onChange={e => setFilterModel(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: "10px", border: `1px solid ${SS.border}`, background: SS.bg, color: SS.textMuted, fontSize: "13px", cursor: "pointer", outline: "none" }}>
          <option value="">Tous les modèles</option>
          <option value="Produit">Produit</option>
          <option value="Categorie">Catégorie</option>
          <option value="Stock">Stock</option>
          <option value="Vente">Vente</option>
        </select>

        {/* Filtre user — admin seulement */}
        {isAdmin && users.length > 0 && (
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            style={{ padding: "9px 12px", borderRadius: "10px", border: `1px solid ${SS.border}`, background: SS.bg, color: SS.textMuted, fontSize: "13px", cursor: "pointer", outline: "none" }}>
            <option value="">Tous les utilisateurs</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
            ))}
          </select>
        )}

        {/* Reset filtres */}
        {(filterAction || filterModel || filterUser || search) && (
          <button onClick={() => { setFilterAction(""); setFilterModel(""); setFilterUser(""); setSearch(""); }}
            style={{ padding: "9px 14px", borderRadius: "10px", border: `1px solid ${SS.border}`, background: SS.bg, color: SS.textMuted, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <X size={13} /> Réinitialiser
          </button>
        )}
      </div>

      {/* ── Tableau des logs ── */}
      <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "16px", overflow: "hidden" }}>

        {/* En-tête tableau */}
        <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 120px 120px 120px 180px" : "1.5fr 120px 120px 200px", gap: "0", background: SS.card, borderBottom: `1px solid ${SS.border}` }}>
          {["Description", "Action", "Modèle", ...(isAdmin ? ["Utilisateur"] : []), "Date"].map((h, i) => (
            <div key={i} style={{ padding: "12px 16px", fontSize: "11px", fontWeight: "800", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {h}
            </div>
          ))}
        </div>

        {/* Lignes */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textMuted }}>
            <Clock size={40} color={`${SS.gold}40`} style={{ display: "block", margin: "0 auto 12px" }} />
            Chargement...
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textMuted }}>
            <Filter size={40} color={`${SS.gold}30`} style={{ display: "block", margin: "0 auto 12px" }} />
            Aucun log trouvé
          </div>
        ) : (
          paginated.map((log, i) => (
            <div key={log.id}
              style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 120px 120px 120px 180px" : "1.5fr 120px 120px 200px", gap: "0", borderBottom: i < paginated.length - 1 ? `1px solid ${SS.border}` : "none", transition: "background 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.background = `${SS.gold}06`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

              {/* Description */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${SS.gold}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: SS.gold }}>
                  {getModelIcon(log.model_name)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", color: SS.text, fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {log.description || "—"}
                  </div>
                  {log.object_id && (
                    <div style={{ fontSize: "11px", color: SS.textDim }}>ID #{log.object_id}</div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                <BadgeAction action={log.action} />
              </div>

              {/* Modèle */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: SS.textMuted, fontWeight: "600", background: SS.card, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${SS.border}` }}>
                  {log.model_name || "—"}
                </span>
              </div>

              {/* Utilisateur (admin seulement) */}
              {isAdmin && (
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: `${SS.gold}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: SS.goldLight }}>
                      {(log.user_username || "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: SS.text }}>{log.user_username}</div>
                    <div style={{ fontSize: "10px", color: SS.textDim }}>{log.user_role}</div>
                  </div>
                </div>
              )}

              {/* Date */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: SS.textDim }}>{formatDate(log.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", flexWrap: "wrap", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: SS.textMuted }}>
            {total} log{total > 1 ? "s" : ""} — page {page} sur {totalPages}
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              style={{ padding: "7px 16px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.surface, color: SS.textMuted, fontSize: "13px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.5 : 1 }}>
              ← Précédent
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: "7px 12px", borderRadius: "8px", border: `1px solid ${page === p ? SS.gold : SS.border}`, background: page === p ? SS.gold : SS.surface, color: page === p ? "#1A1208" : SS.textMuted, fontSize: "13px", cursor: "pointer", fontWeight: page === p ? "700" : "500" }}>
                  {p}
                </button>
              );
            })}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              style={{ padding: "7px 16px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.surface, color: SS.textMuted, fontSize: "13px", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.5 : 1 }}>
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;