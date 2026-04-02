import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, X, ShoppingBag,
  Search, ChevronDown, User, TrendingUp, Package
} from "lucide-react";
import CONFIG from "../../config/config";
import { useTheme } from "../../context/ThemeContext";

const Ventes = () => {
  const navigate = useNavigate();
  const { tokens: SS } = useTheme();

  const [ventes, setVentes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterProduit, setFilterProduit] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyForm = { produit: "", taille: "", couleur: "", quantite: 1 };
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [taillesDisponibles, setTaillesDisponibles] = useState([]);
  const [couleursDisponibles, setCouleursDisponibles] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(null);

  const token = localStorage.getItem("access");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // --- FETCH ---
  const fetchVentes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/ventes/`, { headers });
      const data = await res.json();
      if (res.ok) setVentes(data);
      else setError("Erreur lors du chargement des ventes");
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

  const fetchStocks = async () => {
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/`, { headers });
      const data = await res.json();
      if (res.ok) setStocks(data);
    } catch {}
  };

  useEffect(() => {
    fetchVentes();
    fetchProduits();
    fetchStocks();
  }, []);

  // --- Tailles dispo ---
  useEffect(() => {
    if (!form.produit) {
      setTaillesDisponibles([]); setCouleursDisponibles([]); setStockDisponible(null); return;
    }
    const sp = stocks.filter(s => String(s.produit) === String(form.produit));
    setTaillesDisponibles([...new Set(sp.map(s => s.taille))]);
    setForm(prev => ({ ...prev, taille: "", couleur: "" }));
    setCouleursDisponibles([]); setStockDisponible(null);
  }, [form.produit]);

  // --- Couleurs dispo ---
  useEffect(() => {
    if (!form.produit || !form.taille) {
      setCouleursDisponibles([]); setStockDisponible(null); return;
    }
    const sf = stocks.filter(s =>
      String(s.produit) === String(form.produit) && s.taille === form.taille
    );
    setCouleursDisponibles(sf.map(s => s.couleur));
    setForm(prev => ({ ...prev, couleur: "" })); setStockDisponible(null);
  }, [form.taille]);

  // --- Stock dispo ---
  useEffect(() => {
    if (!form.produit || !form.taille || !form.couleur) { setStockDisponible(null); return; }
    const s = stocks.find(s =>
      String(s.produit) === String(form.produit) &&
      s.taille === form.taille && s.couleur === form.couleur
    );
    setStockDisponible(s ? s.quantite : 0);
  }, [form.couleur]);

  const getProduitPrix = () =>
    produits.find(p => String(p.id) === String(form.produit))?.prix || null;

  const prixEstime = getProduitPrix()
    ? (parseFloat(getProduitPrix()) * parseInt(form.quantite || 0)).toLocaleString("fr-FR")
    : null;

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (stockDisponible !== null && parseInt(form.quantite) > stockDisponible) {
      setError(`Stock insuffisant. Disponible : ${stockDisponible}`); return;
    }
    setSubmitting(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/ventes/`, {
        method: "POST", headers,
        body: JSON.stringify({
          produit: parseInt(form.produit),
          taille: form.taille,
          couleur: form.couleur,
          quantite: parseInt(form.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVentes(prev => [data, ...prev]);
        setForm(emptyForm); setShowForm(false);
        setSuccess("Vente enregistrée avec succès !");
        await fetchStocks();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(Object.entries(data).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") || "Erreur");
      }
    } catch { setError("Erreur serveur"); }
    finally { setSubmitting(false); }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id); setError("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/ventes/${id}/`, { method: "DELETE", headers });
      if (res.ok || res.status === 204) {
        setVentes(prev => prev.filter(v => v.id !== id));
        setConfirmDeleteId(null);
        setSuccess("Vente supprimée !");
        setTimeout(() => setSuccess(""), 3000);
      } else { setError("Erreur lors de la suppression"); }
    } catch { setError("Erreur serveur"); }
    finally { setDeletingId(null); }
  };

  // --- FILTER ---
  const filtered = ventes.filter(v => {
    const nom = (v.produit_nom || "").toLowerCase();
    const ms = nom.includes(search.toLowerCase()) ||
      v.taille?.toLowerCase().includes(search.toLowerCase()) ||
      v.couleur?.toLowerCase().includes(search.toLowerCase()) ||
      (v.vendeur_nom || "").toLowerCase().includes(search.toLowerCase());
    const mp = filterProduit ? String(v.produit) === filterProduit : true;
    return ms && mp;
  });

  const totalCA = ventes.reduce((a, v) => a + parseFloat(v.prix_total || 0), 0);
  const totalUnites = ventes.reduce((a, v) => a + (v.quantite || 0), 0);

  const getStockRestant = (vente) => {
    const s = stocks.find(s =>
      String(s.produit) === String(vente.produit) &&
      s.taille === vente.taille && s.couleur === vente.couleur
    );
    return s ? s.quantite : null;
  };

  // ── Styles partagés ──────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    background: SS.card, border: `1px solid ${SS.border}`,
    color: SS.text, fontSize: "14px", outline: "none",
  };

  const labelStyle = {
    fontSize: "11px", color: SS.textMuted,
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: "6px", display: "block",
  };

  const stockBadgeStyle = (q) => ({
    padding: "3px 10px", borderRadius: "20px",
    fontSize: "11px", fontWeight: "500", display: "inline-block",
    background: q === 0 ? SS.dangerBg : q <= 5 ? SS.warningBg : SS.successBg,
    color: q === 0 ? SS.danger : q <= 5 ? SS.warning : SS.success,
    border: `1px solid ${(q === 0 ? SS.danger : q <= 5 ? SS.warning : SS.success)}40`,
  });

  return (
    <div style={{ minHeight: "100vh", background: SS.bg, padding: "2rem", color: SS.text, fontFamily: "var(--font-sans, sans-serif)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Fil d'Ariane */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: SS.textDim }}>Gestion</span>
          <span style={{ fontSize: "12px", color: SS.textDim }}>/</span>
          <span style={{ fontSize: "12px", color: SS.gold }}>Ventes</span>
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
                <ShoppingBag size={19} color={SS.gold} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: SS.goldLight, lineHeight: 1.2 }}>Ventes</div>
                <div style={{ fontSize: "12px", color: SS.textDim }}>{ventes.length} transaction{ventes.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            style={{ background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", borderRadius: "8px", padding: "10px 20px", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 2px 12px ${SS.gold}30` }}
          >
            <Plus size={16} />
            Nouvelle vente
          </button>
        </div>

        {/* Stats */}
        {!loading && ventes.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "Chiffre d'affaires", value: `${totalCA.toLocaleString("fr-FR")} GNF`, icon: <TrendingUp size={20} />, color: SS.gold },
              { label: "Transactions", value: ventes.length, icon: <ShoppingBag size={20} />, color: SS.goldLight },
              { label: "Unités vendues", value: totalUnites, icon: <Package size={20} />, color: SS.success },
            ].map((s, i) => (
              <div key={i} style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${s.color}20`, border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "18px", fontWeight: "600", color: SS.goldLight }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {/* Formulaire nouvelle vente */}
        {showForm && (
          <div style={{ background: SS.surface, border: `1px solid ${SS.gold}50`, borderRadius: "14px", padding: "20px", marginBottom: "20px", boxShadow: `0 4px 24px ${SS.gold}10` }}>
            <div style={{ fontSize: "15px", fontWeight: "600", color: SS.goldLight, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShoppingBag size={16} color={SS.gold} />
              Nouvelle vente
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>

                <div>
                  <label style={labelStyle}>Produit</label>
                  <select style={inputStyle} value={form.produit}
                    onChange={e => setForm({ ...form, produit: e.target.value })} required>
                    <option value="">— Sélectionner —</option>
                    {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    Quantité
                    {stockDisponible !== null && (
                      <span style={{ marginLeft: "8px", fontWeight: "600", color: stockDisponible === 0 ? SS.danger : SS.success }}>
                        (stock : {stockDisponible})
                      </span>
                    )}
                  </label>
                  <input
                    type="number" min="1" max={stockDisponible ?? undefined}
                    placeholder="Quantité" style={inputStyle}
                    value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Taille</label>
                  <select style={{ ...inputStyle, opacity: !form.produit ? 0.45 : 1 }}
                    value={form.taille} onChange={e => setForm({ ...form, taille: e.target.value })}
                    disabled={!form.produit} required>
                    <option value="">— Taille —</option>
                    {taillesDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Couleur</label>
                  <select style={{ ...inputStyle, opacity: !form.taille ? 0.45 : 1 }}
                    value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })}
                    disabled={!form.taille} required>
                    <option value="">— Couleur —</option>
                    {couleursDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Prix estimé */}
              {prixEstime && (
                <div style={{ padding: "12px 16px", borderRadius: "8px", background: `${SS.gold}12`, border: `1px solid ${SS.gold}35`, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", color: SS.textMuted }}>Prix total estimé</span>
                  <span style={{ fontSize: "18px", fontWeight: "700", color: SS.goldLight }}>{prixEstime} GNF</span>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", fontSize: "14px" }}>
                  Annuler
                </button>
                <button type="submit"
                  disabled={submitting || stockDisponible === 0}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", opacity: submitting || stockDisponible === 0 ? 0.5 : 1 }}>
                  {submitting ? "Enregistrement..." : "Enregistrer la vente"}
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
              placeholder="Rechercher (produit, taille, couleur, vendeur)..."
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
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Aucune vente trouvée</div>
        ) : (
          <div style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "14px", overflow: "hidden" }}>

            {/* Header colonnes */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.6fr 0.7fr 1.6fr 1.4fr 1.6fr 1.2fr", padding: "12px 20px", borderBottom: `1px solid ${SS.border}`, background: SS.card }}>
              {["Produit", "Taille / Couleur", "Qté", "Prix total", "Stock restant", "Vendeur", "Date"].map((h, i) => (
                <div key={i} style={{ fontSize: "11px", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: i === 6 ? "right" : "left" }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Lignes */}
            {filtered.map((vente, i) => {
              const stockRestant = getStockRestant(vente);
              const isLast = i === filtered.length - 1;
              return (
                <div
                  key={vente.id}
                  style={{ display: "grid", gridTemplateColumns: "2fr 1.6fr 0.7fr 1.6fr 1.4fr 1.6fr 1.2fr", padding: "14px 20px", borderBottom: isLast ? "none" : `1px solid ${SS.border}`, alignItems: "center", transition: "background 0.15s", cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = SS.card}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Produit */}
                  <div style={{ fontSize: "14px", color: SS.text, fontWeight: "500", paddingRight: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {vente.produit_nom || `#${vente.produit}`}
                  </div>

                  {/* Taille / Couleur */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "5px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, fontSize: "12px", color: SS.gold, fontWeight: "500" }}>
                      {vente.taille}
                    </span>
                    <span style={{ fontSize: "12px", color: SS.textMuted }}>{vente.couleur}</span>
                  </div>

                  {/* Quantité */}
                  <div style={{ fontSize: "15px", fontWeight: "600", color: SS.text }}>
                    {vente.quantite}
                  </div>

                  {/* Prix total */}
                  <div style={{ fontSize: "14px", fontWeight: "700", color: SS.goldLight }}>
                    {Number(vente.prix_total).toLocaleString("fr-FR")} GNF
                  </div>

                  {/* Stock restant */}
                  <div>
                    {stockRestant === null
                      ? <span style={{ color: SS.textDim, fontSize: "12px" }}>—</span>
                      : <span style={stockBadgeStyle(stockRestant)}>{stockRestant} restant{stockRestant > 1 ? "s" : ""}</span>
                    }
                  </div>

                  {/* Vendeur */}
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={13} color={SS.gold} />
                    </div>
                    <span style={{ fontSize: "13px", color: SS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {vente.vendeur_nom || "—"}
                    </span>
                  </div>

                  {/* Date + Actions */}
                  <div style={{ textAlign: "right" }}>
                    {confirmDeleteId === vente.id ? (
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleDelete(vente.id)}
                          disabled={deletingId === vente.id}
                          style={{ padding: "4px 10px", borderRadius: "6px", background: `${SS.danger}25`, border: `1px solid ${SS.danger}50`, color: SS.danger, fontSize: "12px", cursor: "pointer" }}
                        >
                          {deletingId === vente.id ? "..." : "Confirmer"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ padding: "4px 10px", borderRadius: "6px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, fontSize: "12px", cursor: "pointer" }}
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "12px", color: SS.textMuted, fontWeight: "500" }}>
                          {new Date(vente.date_vente).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <div style={{ fontSize: "11px", color: SS.textDim, marginBottom: "5px" }}>
                          {new Date(vente.date_vente).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <button
                          onClick={() => setConfirmDeleteId(vente.id)}
                          style={{ padding: "4px 8px", borderRadius: "6px", background: `${SS.danger}18`, border: `1px solid ${SS.danger}35`, color: SS.danger, cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ventes;