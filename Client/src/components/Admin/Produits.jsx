import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  Package, Search, ChevronDown, Image as ImageIcon,
  Layers, AlertCircle, ArrowRight
} from "lucide-react";
import CONFIG from "../../config/config";
import { useTheme } from "../../context/ThemeContext";

const Produits = () => {
  const navigate = useNavigate();
  const { tokens: SS } = useTheme();

  const [produits, setProduits]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("");
  const [showForm, setShowForm]     = useState(false);

  const emptyForm = {
    nom: "", description: "", prix: "", categorie: "", image: null,
  };
  const emptyStock = { taille: "", couleur: "", quantite: "1" };

  const [form, setForm]                 = useState(emptyForm);
  const [stockForm, setStockForm]       = useState(emptyStock);
  const [ajouterStock, setAjouterStock] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [editForm, setEditForm]         = useState({});
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [updating, setUpdating]         = useState(false);
  const [deletingId, setDeletingId]     = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token   = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rP, rC, rS] = await Promise.all([
        fetch(CONFIG.API_PRODUIT,               { headers }),
        fetch(CONFIG.API_CATEGORIE,             { headers }),
        fetch(`${CONFIG.BASE_URL}/api/stocks/`, { headers }),
      ]);
      const [dP, dC, dS] = await Promise.all([rP.json(), rC.json(), rS.json()]);
      if (rP.ok) setProduits(Array.isArray(dP) ? dP : []);
      if (rC.ok) setCategories(Array.isArray(dC) ? dC : []);
      if (rS.ok) setStocks(Array.isArray(dS) ? dS : []);
    } catch { setError("Erreur serveur"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    fd.append("folder", "produits");
    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  };

  // ── Créer produit → puis stock si renseigné ──────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setSuccess("");
    try {
      // 1. Upload image
      let imageUrl = null;
      if (form.image) imageUrl = await uploadToCloudinary(form.image);

      // 2. Créer produit
      const resProduit = await fetch(CONFIG.API_PRODUIT, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom, description: form.description,
          prix: form.prix, categorie: form.categorie || null,
          ...(imageUrl && { image: imageUrl }),
        }),
      });
      const produit = await resProduit.json();
      if (!resProduit.ok) {
        setError(Object.entries(produit).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | "));
        return;
      }

      // 3. Créer stock initial si coché et renseigné
      let stockCree = false;
      if (ajouterStock && stockForm.taille && stockForm.couleur) {
        const resStock = await fetch(`${CONFIG.BASE_URL}/api/stocks/`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            produit:  produit.id,
            taille:   stockForm.taille.trim(),
            couleur:  stockForm.couleur.trim(),
            quantite: parseInt(stockForm.quantite) || 1,
          }),
        });
        if (resStock.ok) {
          const s = await resStock.json();
          setStocks(prev => [s, ...prev]);
          stockCree = true;
        }
      }

      setProduits(prev => [produit, ...prev]);
      setForm(emptyForm);
      setStockForm(emptyStock);
      setImagePreview(null);
      setShowForm(false);

      setSuccess(
        stockCree
          ? `✅ "${produit.nom}" créé et visible en boutique (${stockForm.taille} · ${stockForm.couleur} · ${stockForm.quantite} pcs)`
          : `⚠️ "${produit.nom}" créé — ajoutez un stock dans Stocks pour le rendre visible en boutique`
      );
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) { setError(err.message || "Erreur serveur"); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async (id) => {
    setUpdating(true); setError(""); setSuccess("");
    try {
      let imageUrl = editForm.imageUrl || null;
      if (editForm.image instanceof File) imageUrl = await uploadToCloudinary(editForm.image);
      const res  = await fetch(`${CONFIG.API_PRODUIT}${id}/`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: editForm.nom, description: editForm.description,
          prix: editForm.prix, categorie: editForm.categorie || null,
          ...(imageUrl && { image: imageUrl }),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProduits(prev => prev.map(p => p.id === id ? data : p));
        setEditingId(null); setEditImagePreview(null);
        setSuccess("Produit modifié !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(Object.entries(data).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") || "Erreur");
      }
    } catch (err) { setError(err.message || "Erreur serveur"); }
    finally { setUpdating(false); }
  };

  const handleDelete = async (id) => {
    setDeletingId(id); setError("");
    try {
      const res = await fetch(`${CONFIG.API_PRODUIT}${id}/`, { method: "DELETE", headers });
      if (res.ok || res.status === 204) {
        setProduits(prev => prev.filter(p => p.id !== id));
        setStocks(prev => prev.filter(s => String(s.produit) !== String(id)));
        setConfirmDeleteId(null);
        setSuccess("Produit supprimé !");
        setTimeout(() => setSuccess(""), 3000);
      } else { setError("Erreur lors de la suppression"); }
    } catch { setError("Erreur serveur"); }
    finally { setDeletingId(null); }
  };

  const filtered = produits.filter(p => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = filterCat ? String(p.categorie) === filterCat : true;
    return ms && mc;
  });

  const getCatNom    = (id) => categories.find(c => c.id === id)?.nom || "—";
  const getStocks    = (id) => stocks.filter(s => String(s.produit) === String(id));
  const getTotalQte  = (id) => getStocks(id).reduce((a, s) => a + s.quantite, 0);

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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Fil d'Ariane */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: SS.textDim }}>Gestion</span>
          <span style={{ fontSize: "12px", color: SS.textDim }}>/</span>
          <span style={{ fontSize: "12px", color: SS.gold }}>Produits</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => navigate("/dashboardAdmin")}
              style={{ padding: "8px 10px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.card, cursor: "pointer", display: "flex", alignItems: "center", color: SS.textMuted }}>
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${SS.gold}20`, border: `1px solid ${SS.gold}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={19} color={SS.gold} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: SS.goldLight }}>Produits</div>
                <div style={{ fontSize: "12px", color: SS.textDim }}>
                  {produits.length} article{produits.length > 1 ? "s" : ""} —{" "}
                  <span style={{ color: SS.success }}>{produits.filter(p => getTotalQte(p.id) > 0).length} en ligne</span>
                  {produits.filter(p => getTotalQte(p.id) === 0).length > 0 && (
                    <span style={{ color: SS.danger }}>
                      {" "}· {produits.filter(p => getTotalQte(p.id) === 0).length} sans stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate("/stocks")}
              style={{ padding: "10px 16px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.card, color: SS.textMuted, fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <Layers size={16} />
              Gérer les stocks
            </button>
            <button onClick={() => { setShowForm(!showForm); setError(""); }}
              style={{ background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", borderRadius: "8px", padding: "10px 20px", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 2px 12px ${SS.gold}30` }}>
              <Plus size={16} />
              Nouveau produit
            </button>
          </div>
        </div>

        {/* Explication du flux */}
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${SS.gold}10`, border: `1px solid ${SS.gold}30`, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: SS.goldLight }}>
            <Package size={15} color={SS.gold} />
            <strong>1. Créez le produit</strong>
          </div>
          <ArrowRight size={14} color={SS.textDim} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: SS.goldLight }}>
            <Layers size={15} color={SS.gold} />
            <strong>2. Ajoutez les stocks</strong> (taille, couleur, quantité)
          </div>
          <ArrowRight size={14} color={SS.textDim} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: SS.success }}>
            <Check size={15} color={SS.success} />
            <strong>3. Visible en boutique</strong>
          </div>
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

        {/* ── Formulaire création ── */}
        {showForm && (
          <div style={{ background: SS.surface, border: `1px solid ${SS.gold}50`, borderRadius: "14px", padding: "24px", marginBottom: "20px", boxShadow: `0 4px 24px ${SS.gold}10` }}>
            <div style={{ height: "3px", background: `linear-gradient(90deg, ${SS.goldDark}, ${SS.gold})`, borderRadius: "2px", marginBottom: "20px" }} />
            <div style={{ fontSize: "16px", fontWeight: "700", color: SS.goldLight, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Package size={18} color={SS.gold} />
              Nouveau produit
            </div>

            <form onSubmit={handleCreate}>
              {/* ── Infos produit ── */}
              <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "10px", background: SS.bg, border: `1px solid ${SS.border}` }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>
                  Informations du produit
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <input type="text" placeholder="Nom du produit *" style={inputStyle}
                    value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                  <input type="number" placeholder="Prix (GNF) *" step="0.01" min="0" style={inputStyle}
                    value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required />
                </div>
                <textarea placeholder="Description (optionnel)" rows={2}
                  style={{ ...inputStyle, resize: "none", marginBottom: "12px" }}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <select style={inputStyle} value={form.categorie}
                    onChange={e => setForm({ ...form, categorie: e.target.value })}>
                    <option value="">— Catégorie —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer" }}>
                    <ImageIcon size={17} color={SS.gold} />
                    <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {form.image ? form.image.name : "Choisir une image"}
                    </span>
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) { setForm({ ...form, image: file }); setImagePreview(URL.createObjectURL(file)); }
                      }} />
                  </label>
                </div>
                {imagePreview && (
                  <div style={{ position: "relative", width: "90px", height: "90px", marginTop: "12px" }}>
                    <img src={imagePreview} alt="preview"
                      style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px" }} />
                    <button type="button"
                      onClick={() => { setImagePreview(null); setForm({ ...form, image: null }); }}
                      style={{ position: "absolute", top: "-6px", right: "-6px", padding: "2px", borderRadius: "50%", background: SS.danger, border: "none", cursor: "pointer", display: "flex", color: "#fff" }}>
                      <X size={11} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Stock initial optionnel ── */}
              <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "10px", background: SS.bg, border: `1px solid ${ajouterStock ? SS.gold + "50" : SS.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ajouterStock ? "14px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Layers size={15} color={SS.gold} />
                    <span style={{ fontSize: "13px", fontWeight: "700", color: SS.goldLight }}>
                      Ajouter un stock initial
                    </span>
                    <span style={{ fontSize: "11px", color: SS.textDim }}>
                      (recommandé — sinon le produit sera "Épuisé")
                    </span>
                  </div>
                  {/* Toggle */}
                  <button type="button" onClick={() => setAjouterStock(!ajouterStock)}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: ajouterStock ? SS.gold : SS.border,
                      position: "relative", transition: "background 0.2s",
                    }}>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "#fff",
                      position: "absolute", top: "3px",
                      left: ajouterStock ? "23px" : "3px",
                      transition: "left 0.2s",
                    }} />
                  </button>
                </div>

                {ajouterStock && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: SS.textMuted, marginBottom: "6px" }}>Taille</div>
                      <input type="text" placeholder="S, M, L, XL, 38..." style={inputStyle}
                        value={stockForm.taille} onChange={e => setStockForm({ ...stockForm, taille: e.target.value })} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: SS.textMuted, marginBottom: "6px" }}>Couleur</div>
                      <input type="text" placeholder="Noir, Rouge, Blanc..." style={inputStyle}
                        value={stockForm.couleur} onChange={e => setStockForm({ ...stockForm, couleur: e.target.value })} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: SS.textMuted, marginBottom: "6px" }}>Quantité</div>
                      <input type="number" min="1" style={inputStyle}
                        value={stockForm.quantite} onChange={e => setStockForm({ ...stockForm, quantite: e.target.value })} />
                    </div>
                  </div>
                )}

                {!ajouterStock && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", padding: "8px 12px", borderRadius: "8px", background: SS.warningBg, border: `1px solid ${SS.warning}40` }}>
                    <AlertCircle size={13} color={SS.warning} />
                    <span style={{ fontSize: "12px", color: SS.warning }}>
                      Vous pourrez ajouter les stocks plus tard depuis la page <strong>Stocks</strong>
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setStockForm(emptyStock); setImagePreview(null); }}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", fontSize: "14px" }}>
                  Annuler
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: "10px 24px", borderRadius: "8px", background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", color: "#1A1208", fontWeight: "700", fontSize: "14px", cursor: "pointer", opacity: submitting ? 0.5 : 1, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Package size={15} />
                  {submitting ? "Création..." : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "10px", background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "8px", padding: "0 14px" }}>
            <Search size={15} color={SS.textDim} />
            <input placeholder="Rechercher..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: SS.text, fontSize: "14px", padding: "10px 0" }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "8px", padding: "0 14px" }}>
            <ChevronDown size={14} color={SS.textDim} />
            <select style={{ background: "none", border: "none", outline: "none", color: SS.text, fontSize: "14px", padding: "10px 0" }}
              value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c.id} value={String(c.id)}>{c.nom}</option>)}
            </select>
          </div>
        </div>

        {/* ── Grille produits ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Aucun produit trouvé</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(produit => {
              const totalQte   = getTotalQte(produit.id);
              const stocksList = getStocks(produit.id);
              const sanStock   = totalQte === 0;

              return (
                <div key={produit.id}
                  style={{
                    background: SS.surface,
                    border: `1px solid ${sanStock ? SS.danger + "60" : SS.border}`,
                    borderRadius: "14px", overflow: "hidden", transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = sanStock ? SS.danger + "80" : SS.borderHover}
                  onMouseLeave={e => e.currentTarget.style.borderColor = sanStock ? SS.danger + "60" : SS.border}>

                  {/* Image */}
                  <div style={{ height: "160px", background: SS.card, position: "relative", overflow: "hidden" }}>
                    {produit.image_url ? (
                      <img src={produit.image_url} alt={produit.nom}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.style.display = "none"; }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={40} color={`${SS.gold}40`} />
                      </div>
                    )}

                    {/* Badge stock */}
                    <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                        background: sanStock ? SS.dangerBg : SS.successBg,
                        color: sanStock ? SS.danger : SS.success,
                      }}>
                        {sanStock ? "Sans stock" : `${totalQte} en stock`}
                      </span>
                    </div>

                    {/* Alerte si sans stock */}
                    {sanStock && (
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 10px", background: "rgba(163,32,32,0.88)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <AlertCircle size={12} color="#fff" />
                        <span style={{ fontSize: "11px", color: "#fff" }}>
                          Invisible en boutique
                        </span>
                        <button
                          onClick={() => navigate("/stocks")}
                          style={{ marginLeft: "auto", padding: "2px 10px", borderRadius: "20px", background: "#fff", border: "none", color: SS.danger, fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                          Ajouter un stock →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div style={{ padding: "14px" }}>
                    {editingId === produit.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <input type="text" style={inputSmStyle} value={editForm.nom}
                          onChange={e => setEditForm({ ...editForm, nom: e.target.value })} />
                        <input type="number" step="0.01" style={inputSmStyle} value={editForm.prix}
                          onChange={e => setEditForm({ ...editForm, prix: e.target.value })} />
                        <textarea rows={2} style={{ ...inputSmStyle, resize: "none" }} value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                        <select style={inputSmStyle} value={editForm.categorie}
                          onChange={e => setEditForm({ ...editForm, categorie: e.target.value })}>
                          <option value="">— Catégorie —</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "7px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", fontSize: "12px" }}>
                          <ImageIcon size={13} color={SS.gold} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {editForm.image instanceof File ? editForm.image.name : "Changer l'image"}
                          </span>
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) { setEditForm({ ...editForm, image: file }); setEditImagePreview(URL.createObjectURL(file)); }
                            }} />
                        </label>
                        {(editImagePreview || editForm.imageUrl) && (
                          <img src={editImagePreview || editForm.imageUrl} alt="preview"
                            style={{ width: "100%", height: "70px", objectFit: "cover", borderRadius: "7px" }} />
                        )}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleUpdate(produit.id)} disabled={updating}
                            style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.success}20`, border: `1px solid ${SS.success}40`, color: SS.success, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px", opacity: updating ? 0.5 : 1 }}>
                            <Check size={13} />{updating ? "..." : "Sauver"}
                          </button>
                          <button onClick={() => { setEditingId(null); setEditImagePreview(null); }}
                            style={{ flex: 1, padding: "8px", borderRadius: "7px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px" }}>
                            <X size={13} />Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ marginBottom: "10px" }}>
                          <div style={{ fontSize: "15px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {produit.nom}
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: SS.goldLight, marginTop: "2px" }}>
                            {Number(produit.prix).toLocaleString("fr-FR")} GNF
                          </div>
                          <span style={{ display: "inline-block", marginTop: "6px", padding: "2px 10px", borderRadius: "20px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, fontSize: "11px", color: SS.gold }}>
                            {getCatNom(produit.categorie)}
                          </span>
                        </div>

                        {/* Aperçu des variantes */}
                        {stocksList.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
                            {stocksList.slice(0, 4).map(s => (
                              <span key={s.id} style={{
                                padding: "2px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "500",
                                background: s.quantite === 0 ? SS.dangerBg : SS.successBg,
                                color: s.quantite === 0 ? SS.danger : SS.success,
                                border: `1px solid ${(s.quantite === 0 ? SS.danger : SS.success)}30`,
                              }}>
                                {s.taille} · {s.couleur} ({s.quantite})
                              </span>
                            ))}
                            {stocksList.length > 4 && (
                              <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "11px", color: SS.textDim, background: SS.card }}>
                                +{stocksList.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        {confirmDeleteId === produit.id ? (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleDelete(produit.id)} disabled={deletingId === produit.id}
                              style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.danger}25`, border: `1px solid ${SS.danger}50`, color: SS.danger, fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: deletingId === produit.id ? 0.5 : 1 }}>
                              {deletingId === produit.id ? "..." : "Confirmer"}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)}
                              style={{ flex: 1, padding: "8px", borderRadius: "7px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, fontSize: "13px", cursor: "pointer" }}>
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => { setEditingId(produit.id); setEditImagePreview(null); setEditForm({ nom: produit.nom, description: produit.description || "", prix: produit.prix, categorie: produit.categorie || "", imageUrl: produit.image_url || null, image: null }); }}
                              style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, color: SS.gold, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <Pencil size={13} />Modifier
                            </button>
                            <button onClick={() => setConfirmDeleteId(produit.id)}
                              style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.danger}18`, border: `1px solid ${SS.danger}35`, color: SS.danger, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                              <Trash2 size={13} />Supprimer
                            </button>
                          </div>
                        )}
                      </>
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

export default Produits;