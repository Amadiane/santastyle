import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  Layers, Search, ChevronDown, Package
} from "lucide-react";
import CONFIG from "../../config/config";
import { useTheme } from "../../context/ThemeContext";

const Stocks = () => {
  const navigate = useNavigate();
  const { tokens: SS } = useTheme();

  const [stocks, setStocks] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterProduit, setFilterProduit] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyForm = { produit: "", taille: "", couleur: "", quantite: 0 };
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [updating, setUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // --- FETCH ---
  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/`, { headers });
      const data = await res.json();
      if (res.ok) setStocks(data);
      else setError("Erreur lors du chargement des stocks");
    } catch { setError("Erreur serveur"); }
    finally { setLoading(false); }
  };

  const fetchProduits = async () => {
    try {
      const res = await fetch(CONFIG.API_PRODUIT, { headers });
      const data = await res.json();
      if (res.ok) setProduits(data);
    } catch {}
  };

  useEffect(() => {
    fetchStocks();
    fetchProduits();
  }, []);

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/`, {
        method: "POST", headers,
        body: JSON.stringify({
          produit: form.produit,
          taille: form.taille.trim(),
          couleur: form.couleur.trim(),
          quantite: parseInt(form.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStocks(prev => [data, ...prev]);
        setForm(emptyForm); setShowForm(false);
        setSuccess("Stock créé avec succès !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(Object.entries(data).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") || "Erreur");
      }
    } catch { setError("Erreur serveur"); }
    finally { setSubmitting(false); }
  };

  // --- UPDATE ---
  const handleUpdate = async (id) => {
    setUpdating(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/${id}/`, {
        method: "PUT", headers,
        body: JSON.stringify({
          produit: editForm.produit,
          taille: editForm.taille.trim(),
          couleur: editForm.couleur.trim(),
          quantite: parseInt(editForm.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStocks(prev => prev.map(s => s.id === id ? data : s));
        setEditingId(null);
        setSuccess("Stock modifié !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(Object.entries(data).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") || "Erreur");
      }
    } catch { setError("Erreur serveur"); }
    finally { setUpdating(false); }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id); setError("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/${id}/`, { method: "DELETE", headers });
      if (res.ok || res.status === 204) {
        setStocks(prev => prev.filter(s => s.id !== id));
        setConfirmDeleteId(null);
        setSuccess("Stock supprimé !");
        setTimeout(() => setSuccess(""), 3000);
      } else { setError("Erreur lors de la suppression"); }
    } catch { setError("Erreur serveur"); }
    finally { setDeletingId(null); }
  };

  // --- FILTER ---
  const filtered = stocks.filter(s => {
    const ms =
      s.produit_nom?.toLowerCase().includes(search.toLowerCase()) ||
      s.taille?.toLowerCase().includes(search.toLowerCase()) ||
      s.couleur?.toLowerCase().includes(search.toLowerCase());
    const mp = filterProduit ? String(s.produit) === filterProduit : true;
    return ms && mp;
  });

  const quantiteBadgeStyle = (q) => ({
    padding: "3px 10px", borderRadius: "20px",
    fontSize: "12px", fontWeight: "600", display: "inline-block",
    background: q === 0 ? SS.dangerBg : q <= 5 ? SS.warningBg : SS.successBg,
    color: q === 0 ? SS.danger : q <= 5 ? SS.warning : SS.success,
    border: `1px solid ${(q === 0 ? SS.danger : q <= 5 ? SS.warning : SS.success)}40`,
  });

  // ── Styles partagés ──────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    background: SS.card, border: `1px solid ${SS.border}`,
    color: SS.text, fontSize: "14px", outline: "none",
  };

  const inputSmStyle = {
    width: "100%", padding: "7px 10px", borderRadius: "7px",
    background: SS.card, border: `1px solid ${SS.border}`,
    color: SS.text, fontSize: "13px", outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: SS.bg, padding: "2rem", color: SS.text, fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Fil d'Ariane */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: SS.textDim }}>Gestion</span>
          <span style={{ fontSize: "12px", color: SS.textDim }}>/</span>
          <span style={{ fontSize: "12px", color: SS.gold }}>Stocks</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => navigate("/dashboardAdmin")}
              style={{ padding: "8px 10px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.card, cursor: "pointer", display: "flex", alignItems: "center", color: SS.textMuted }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${SS.gold}20`, border: `1px solid ${SS.gold}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Layers size={19} color={SS.gold} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: SS.goldLight, lineHeight: 1.2 }}>Stocks</div>
                <div style={{ fontSize: "12px", color: SS.textDim }}>{stocks.length} référence{stocks.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            style={{ background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", borderRadius: "8px", padding: "10px 20px", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 2px 12px ${SS.gold}30` }}
          >
            <Plus size={16} />
            Nouveau stock
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${SS.danger}18`, border: `1px solid ${SS.danger}40`, color: SS.danger, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span>{error}</span>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: SS.danger }}><X size={15} /></button>
          </div>
        )}
        {success && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${SS.success}18`, border: `1px solid ${SS.success}40`, color: SS.success, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span>{success}</span>
            <button onClick={() => setSuccess("")} style={{ background: "none", border: "none", cursor: "pointer", color: SS.success }}><X size={15} /></button>
          </div>
        )}

        {/* Formulaire création */}
        {showForm && (
          <div style={{ background: SS.surface, border: `1px solid ${SS.gold}50`, borderRadius: "14px", padding: "20px", marginBottom: "20px", boxShadow: `0 4px 24px ${SS.gold}10` }}>
            <div style={{ fontSize: "15px", fontWeight: "600", color: SS.goldLight, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={16} color={SS.gold} />
              Nouveau stock
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <select style={inputStyle} value={form.produit}
                  onChange={e => setForm({ ...form, produit: e.target.value })} required>
                  <option value="">— Sélectionner un produit —</option>
                  {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </select>

                <input type="number" placeholder="Quantité" min="0"
                  style={inputStyle} value={form.quantite}
                  onChange={e => setForm({ ...form, quantite: e.target.value })} required />

                <input type="text" placeholder="Taille (ex: S, M, L, XL, 42...)"
                  style={inputStyle} value={form.taille}
                  onChange={e => setForm({ ...form, taille: e.target.value })} required />

                <input type="text" placeholder="Couleur (ex: Rouge, Noir...)"
                  style={inputStyle} value={form.couleur}
                  onChange={e => setForm({ ...form, couleur: e.target.value })} required />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", fontSize: "14px" }}>
                  Annuler
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", opacity: submitting ? 0.5 : 1 }}>
                  {submitting ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "10px", background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "8px", padding: "0 14px" }}>
            <Search size={15} color={SS.textDim} />
            <input
              placeholder="Rechercher (produit, taille, couleur)..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: SS.text, fontSize: "14px", padding: "10px 0" }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "8px", padding: "0 14px" }}>
            <ChevronDown size={14} color={SS.textDim} />
            <select
              style={{ background: "none", border: "none", outline: "none", color: SS.text, fontSize: "14px", padding: "10px 0" }}
              value={filterProduit} onChange={e => setFilterProduit(e.target.value)}>
              <option value="">Tous les produits</option>
              {produits.map(p => <option key={p.id} value={String(p.id)}>{p.nom}</option>)}
            </select>
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Aucun stock trouvé</div>
        ) : (
          <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "14px", overflow: "hidden" }}>

            {/* Header colonnes */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr 1.5fr", padding: "12px 20px", borderBottom: `1px solid ${SS.border}`, background: SS.card }}>
              {["Produit", "Taille", "Couleur", "Quantité", "Actions"].map((h, i) => (
                <div key={i} style={{ fontSize: "11px", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: i === 4 ? "right" : "left" }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Lignes */}
            {filtered.map((stock, i) => {
              const isLast = i === filtered.length - 1;
              return (
                <div
                  key={stock.id}
                  style={{ borderBottom: isLast ? "none" : `1px solid ${SS.border}`, transition: "background 0.15s" }}
                  onMouseEnter={e => { if (editingId !== stock.id) e.currentTarget.style.background = SS.card; }}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {editingId === stock.id ? (
                    /* Mode édition */
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr 1.5fr", gap: "8px", padding: "10px 20px", alignItems: "center" }}>
                      <select style={inputSmStyle} value={editForm.produit}
                        onChange={e => setEditForm({ ...editForm, produit: e.target.value })}>
                        <option value="">— Produit —</option>
                        {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                      </select>
                      <input type="text" placeholder="Taille" style={inputSmStyle}
                        value={editForm.taille} onChange={e => setEditForm({ ...editForm, taille: e.target.value })} />
                      <input type="text" placeholder="Couleur" style={inputSmStyle}
                        value={editForm.couleur} onChange={e => setEditForm({ ...editForm, couleur: e.target.value })} />
                      <input type="number" min="0" style={inputSmStyle}
                        value={editForm.quantite} onChange={e => setEditForm({ ...editForm, quantite: e.target.value })} />
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button onClick={() => handleUpdate(stock.id)} disabled={updating}
                          style={{ padding: "6px 8px", borderRadius: "7px", background: `${SS.success}20`, border: `1px solid ${SS.success}40`, color: SS.success, cursor: "pointer", display: "flex", alignItems: "center", opacity: updating ? 0.5 : 1 }}>
                          <Check size={15} />
                        </button>
                        <button onClick={() => setEditingId(null)}
                          style={{ padding: "6px 8px", borderRadius: "7px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Mode affichage */
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr 1.5fr 1.5fr", gap: "8px", padding: "13px 20px", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Package size={14} color={SS.gold} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: "14px", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {stock.produit_nom}
                        </span>
                      </div>
                      <div>
                        <span style={{ padding: "2px 8px", borderRadius: "5px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, fontSize: "12px", color: SS.gold, fontWeight: "500" }}>
                          {stock.taille}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: SS.textMuted }}>{stock.couleur}</div>
                      <div><span style={quantiteBadgeStyle(stock.quantite)}>{stock.quantite}</span></div>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {confirmDeleteId === stock.id ? (
                          <>
                            <button onClick={() => handleDelete(stock.id)} disabled={deletingId === stock.id}
                              style={{ padding: "4px 10px", borderRadius: "6px", background: `${SS.danger}25`, border: `1px solid ${SS.danger}50`, color: SS.danger, fontSize: "12px", cursor: "pointer", opacity: deletingId === stock.id ? 0.5 : 1 }}>
                              {deletingId === stock.id ? "..." : "Oui"}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)}
                              style={{ padding: "4px 10px", borderRadius: "6px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, fontSize: "12px", cursor: "pointer" }}>
                              Non
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditingId(stock.id); setEditForm({ produit: stock.produit, taille: stock.taille, couleur: stock.couleur, quantite: stock.quantite }); }}
                              style={{ padding: "6px 8px", borderRadius: "7px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, color: SS.gold, cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setConfirmDeleteId(stock.id)}
                              style={{ padding: "6px 8px", borderRadius: "7px", background: `${SS.danger}18`, border: `1px solid ${SS.danger}35`, color: SS.danger, cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Résumé bas */}
        {!loading && stocks.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: `${stocks.filter(s => s.quantite > 5).length} en stock`, color: SS.success, bg: SS.successBg },
              { label: `${stocks.filter(s => s.quantite > 0 && s.quantite <= 5).length} stock faible`, color: SS.warning, bg: SS.warningBg },
              { label: `${stocks.filter(s => s.quantite === 0).length} rupture`, color: SS.danger, bg: SS.dangerBg },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "10px", background: item.bg, border: `1px solid ${item.color}40` }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: item.color }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Stocks;