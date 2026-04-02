import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  Package, Search, ChevronDown, Image as ImageIcon
} from "lucide-react";
import CONFIG from "../../config/config";
import { useTheme } from "../../context/ThemeContext";

const Produits = () => {
  const navigate = useNavigate();
  const { tokens: SS } = useTheme();

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emptyForm = { nom: "", description: "", prix: "", categorie: "", image: null };
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem("access");
  const headers = { Authorization: `Bearer ${token}` };

  // --- FETCH ---
  const fetchProduits = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_PRODUIT, { headers });
      const data = await res.json();
      if (res.ok) setProduits(data);
      else setError("Erreur lors du chargement des produits");
    } catch { setError("Erreur serveur"); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(CONFIG.API_CATEGORIE, { headers });
      const data = await res.json();
      if (res.ok) setCategories(data);
    } catch {}
  };

  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, []);

  // --- CLOUDINARY UPLOAD ---
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "produits");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  };

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setSuccess("");
    try {
      let imageUrl = null;
      if (form.image) imageUrl = await uploadToCloudinary(form.image);
      const body = {
        nom: form.nom, description: form.description,
        prix: form.prix, categorie: form.categorie || null,
        ...(imageUrl && { image: imageUrl }),
      };
      const res = await fetch(CONFIG.API_PRODUIT, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setProduits(prev => [data, ...prev]);
        setForm(emptyForm); setImagePreview(null); setShowForm(false);
        setSuccess("Produit créé avec succès !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(Object.entries(data).map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ") || "Erreur");
      }
    } catch (err) { setError(err.message || "Erreur serveur"); }
    finally { setSubmitting(false); }
  };

  // --- UPDATE ---
  const handleUpdate = async (id) => {
    setUpdating(true); setError(""); setSuccess("");
    try {
      let imageUrl = editForm.imageUrl || null;
      if (editForm.image instanceof File) imageUrl = await uploadToCloudinary(editForm.image);
      const body = {
        nom: editForm.nom, description: editForm.description,
        prix: editForm.prix, categorie: editForm.categorie || null,
        ...(imageUrl && { image: imageUrl }),
      };
      const res = await fetch(`${CONFIG.API_PRODUIT}${id}/`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id); setError("");
    try {
      const res = await fetch(`${CONFIG.API_PRODUIT}${id}/`, { method: "DELETE", headers });
      if (res.ok || res.status === 204) {
        setProduits(prev => prev.filter(p => p.id !== id));
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

  const getCatNom = (id) => categories.find(c => c.id === id)?.nom || "—";
  const getImageSrc = (produit) => produit.image_url || null;

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
            <button
              onClick={() => navigate("/dashboardAdmin")}
              style={{ padding: "8px 10px", borderRadius: "8px", border: `1px solid ${SS.border}`, background: SS.card, cursor: "pointer", display: "flex", alignItems: "center", color: SS.textMuted }}
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${SS.gold}20`, border: `1px solid ${SS.gold}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={19} color={SS.gold} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "600", color: SS.goldLight, lineHeight: 1.2 }}>Produits</div>
                <div style={{ fontSize: "12px", color: SS.textDim }}>{produits.length} article{produits.length > 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            style={{ background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", borderRadius: "8px", padding: "10px 20px", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 2px 12px ${SS.gold}30` }}
          >
            <Plus size={16} />
            Nouveau produit
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
              <Package size={16} color={SS.gold} />
              Nouveau produit
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <input type="text" placeholder="Nom du produit" style={inputStyle}
                  value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                <input type="number" placeholder="Prix (GNF)" step="0.01" min="0" style={inputStyle}
                  value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required />
              </div>

              <textarea placeholder="Description (optionnel)" rows={3}
                style={{ ...inputStyle, resize: "none", marginBottom: "12px" }}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
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
                <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "12px" }}>
                  <img src={imagePreview} alt="preview" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }} />
                  <button type="button"
                    onClick={() => { setImagePreview(null); setForm({ ...form, image: null }); }}
                    style={{ position: "absolute", top: "-8px", right: "-8px", padding: "3px", borderRadius: "50%", background: SS.danger, border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#fff" }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setImagePreview(null); }}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", fontSize: "14px" }}>
                  Annuler
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", color: "#1A1208", fontWeight: "600", fontSize: "14px", cursor: "pointer", opacity: submitting ? 0.5 : 1 }}>
                  {submitting ? "Upload en cours..." : "Créer"}
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

        {/* Grille produits */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: SS.textDim }}>Aucun produit trouvé</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(produit => (
              <div
                key={produit.id}
                style={{ background: SS.surface, border: `1px solid ${SS.border}`, borderRadius: "14px", overflow: "hidden", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = SS.borderHover}
                onMouseLeave={e => e.currentTarget.style.borderColor = SS.border}
              >
                {/* Image */}
                <div style={{ height: "180px", background: SS.card, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {getImageSrc(produit) ? (
                    <img src={getImageSrc(produit)} alt={produit.nom}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.style.display = "none"; }} />
                  ) : (
                    <Package size={40} color={`${SS.gold}40`} />
                  )}
                </div>

                {/* Contenu */}
                <div style={{ padding: "14px" }}>
                  {editingId === produit.id ? (
                    /* Mode édition */
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input type="text" style={inputSmStyle}
                        value={editForm.nom} onChange={e => setEditForm({ ...editForm, nom: e.target.value })} />
                      <input type="number" step="0.01" style={inputSmStyle}
                        value={editForm.prix} onChange={e => setEditForm({ ...editForm, prix: e.target.value })} />
                      <textarea rows={2} style={{ ...inputSmStyle, resize: "none" }}
                        value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
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
                          style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
                      )}

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleUpdate(produit.id)} disabled={updating}
                          style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.success}20`, border: `1px solid ${SS.success}40`, color: SS.success, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px", opacity: updating ? 0.5 : 1 }}>
                          <Check size={13} />
                          {updating ? "..." : "Sauver"}
                        </button>
                        <button onClick={() => { setEditingId(null); setEditImagePreview(null); }}
                          style={{ flex: 1, padding: "8px", borderRadius: "7px", background: SS.card, border: `1px solid ${SS.border}`, color: SS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px" }}>
                          <X size={13} />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Mode affichage */
                    <>
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {produit.nom}
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: SS.goldLight, marginTop: "4px" }}>
                          {Number(produit.prix).toLocaleString("fr-FR")} GNF
                        </div>
                        {produit.description && (
                          <div style={{ fontSize: "12px", color: SS.textMuted, marginTop: "4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {produit.description}
                          </div>
                        )}
                        <span style={{ display: "inline-block", marginTop: "8px", padding: "2px 10px", borderRadius: "20px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, fontSize: "11px", color: SS.gold }}>
                          {getCatNom(produit.categorie)}
                        </span>
                      </div>

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
                            onClick={() => {
                              setEditingId(produit.id); setEditImagePreview(null);
                              setEditForm({ nom: produit.nom, description: produit.description || "", prix: produit.prix, categorie: produit.categorie || "", imageUrl: produit.image_url || null, image: null });
                            }}
                            style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.gold}18`, border: `1px solid ${SS.gold}35`, color: SS.gold, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <Pencil size={13} />
                            Modifier
                          </button>
                          <button onClick={() => setConfirmDeleteId(produit.id)}
                            style={{ flex: 1, padding: "8px", borderRadius: "7px", background: `${SS.danger}18`, border: `1px solid ${SS.danger}35`, color: SS.danger, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <Trash2 size={13} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Produits;