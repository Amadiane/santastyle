import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  Package, Search, ChevronDown, Image as ImageIcon
} from "lucide-react";
import CONFIG from "../../config/config";

const Produits = () => {
  const navigate = useNavigate();

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
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
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
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      let imageUrl = null;
      if (form.image) imageUrl = await uploadToCloudinary(form.image);

      const body = {
        nom: form.nom,
        description: form.description,
        prix: form.prix,
        categorie: form.categorie || null,
        ...(imageUrl && { image: imageUrl }),
      };

      const res = await fetch(CONFIG.API_PRODUIT, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setProduits((prev) => [data, ...prev]);
        setForm(emptyForm);
        setImagePreview(null);
        setShowForm(false);
        setSuccess("Produit créé avec succès !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msg || "Erreur lors de la création");
      }
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setSubmitting(false);
    }
  };

  // --- UPDATE ---
  const handleUpdate = async (id) => {
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      let imageUrl = editForm.imageUrl || null;
      if (editForm.image instanceof File) {
        imageUrl = await uploadToCloudinary(editForm.image);
      }

      const body = {
        nom: editForm.nom,
        description: editForm.description,
        prix: editForm.prix,
        categorie: editForm.categorie || null,
        ...(imageUrl && { image: imageUrl }),
      };

      const res = await fetch(`${CONFIG.API_PRODUIT}${id}/`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setProduits((prev) => prev.map((p) => (p.id === id ? data : p)));
        setEditingId(null);
        setEditImagePreview(null);
        setSuccess("Produit modifié !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msg || "Erreur lors de la modification");
      }
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setUpdating(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`${CONFIG.API_PRODUIT}${id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.ok || res.status === 204) {
        setProduits((prev) => prev.filter((p) => p.id !== id));
        setConfirmDeleteId(null);
        setSuccess("Produit supprimé !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setDeletingId(null);
    }
  };

  // --- FILTER ---
  const filtered = produits.filter((p) => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? String(p.categorie) === filterCat : true;
    return matchSearch && matchCat;
  });

  const getCatNom = (id) => categories.find((c) => c.id === id)?.nom || "—";

  // ✅ Utilise image_url du nouveau serializer
  const getImageSrc = (produit) => produit.image_url || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboardAdmin")}
              className="p-2 rounded-xl bg-[#41124f]/30 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-[#a34ee5]" />
              <h1 className="text-2xl font-bold text-white">Produits</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#a34ee5]/20 text-[#a34ee5] text-sm">
                {produits.length}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nouveau produit
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-xl flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess("")}><X size={16} /></button>
          </div>
        )}

        {/* Formulaire création */}
        {showForm && (
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-[#a34ee5]/30 mb-6">
            <h2 className="text-white font-semibold mb-4">Nouveau produit</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom du produit"
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Prix (GNF)"
                  step="0.01"
                  min="0"
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                  required
                />
              </div>

              <textarea
                placeholder="Description (optionnel)"
                rows={3}
                className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5] resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.categorie}
                  onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                >
                  <option value="">— Catégorie —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#41124f]/30 text-gray-400 cursor-pointer hover:bg-[#41124f]/50 transition-colors">
                  <ImageIcon size={18} className="text-[#a34ee5]" />
                  <span className="truncate text-sm">
                    {form.image ? form.image.name : "Choisir une image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({ ...form, image: file });
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img src={imagePreview} alt="preview" className="w-32 h-32 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setForm({ ...form, image: null }); }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setImagePreview(null); }}
                  className="px-4 py-2 rounded-xl bg-gray-700/40 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Upload en cours..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-48 flex items-center gap-2 px-3 rounded-xl bg-[#41124f]/20 border border-[#a34ee5]/10">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="flex-1 py-3 bg-transparent text-white placeholder-gray-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-3 rounded-xl bg-[#41124f]/20 border border-[#a34ee5]/10">
            <ChevronDown size={16} className="text-gray-500" />
            <select
              className="py-3 bg-transparent text-white outline-none"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste produits */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Aucun produit trouvé</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((produit) => (
              <div
                key={produit.id}
                className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-2xl border border-[#a34ee5]/20 hover:border-[#a34ee5]/40 transition-colors overflow-hidden"
              >
                {/* ✅ Image via image_url */}
                <div className="h-48 bg-[#41124f]/20 flex items-center justify-center overflow-hidden">
                  {getImageSrc(produit) ? (
                    <img
                      src={getImageSrc(produit)}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <Package size={40} className="text-[#a34ee5]/30" />
                  )}
                </div>

                <div className="p-4">
                  {editingId === produit.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                        value={editForm.nom}
                        onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                      />
                      <input
                        type="number"
                        step="0.01"
                        className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                        value={editForm.prix}
                        onChange={(e) => setEditForm({ ...editForm, prix: e.target.value })}
                      />
                      <textarea
                        rows={2}
                        className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm resize-none"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                      <select
                        className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                        value={editForm.categorie}
                        onChange={(e) => setEditForm({ ...editForm, categorie: e.target.value })}
                      >
                        <option value="">— Catégorie —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.nom}</option>
                        ))}
                      </select>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-[#41124f]/30 text-gray-400 cursor-pointer text-sm">
                        <ImageIcon size={14} className="text-[#a34ee5]" />
                        <span className="truncate">
                          {editForm.image instanceof File ? editForm.image.name : "Changer l'image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setEditForm({ ...editForm, image: file });
                              setEditImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>

                      {/* ✅ Preview : nouvelle image ou image_url existante */}
                      {(editImagePreview || editForm.imageUrl) && (
                        <img
                          src={editImagePreview || editForm.imageUrl}
                          alt="preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(produit.id)}
                          disabled={updating}
                          className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                        >
                          <Check size={14} />
                          {updating ? "..." : "Sauver"}
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditImagePreview(null); }}
                          className="flex-1 py-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors flex items-center justify-center gap-1 text-sm"
                        >
                          <X size={14} />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <h3 className="text-white font-semibold truncate">{produit.nom}</h3>
                        <p className="text-[#fec603] font-bold mt-1">
                          {Number(produit.prix).toLocaleString("fr-FR")} GNF
                        </p>
                        {produit.description && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{produit.description}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-[#a34ee5]/20 text-[#a34ee5] text-xs">
                          {getCatNom(produit.categorie)}
                        </span>
                      </div>

                      {confirmDeleteId === produit.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(produit.id)}
                            disabled={deletingId === produit.id}
                            className="flex-1 py-2 rounded-lg bg-red-500/30 text-red-400 hover:bg-red-500/40 text-sm font-semibold disabled:opacity-50"
                          >
                            {deletingId === produit.id ? "..." : "Confirmer"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="flex-1 py-2 rounded-lg bg-gray-500/20 text-gray-400 text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(produit.id);
                              setEditImagePreview(null);
                              setEditForm({
                                nom: produit.nom,
                                description: produit.description || "",
                                prix: produit.prix,
                                categorie: produit.categorie || "",
                                // ✅ image_url pour preview existante
                                imageUrl: produit.image_url || null,
                                image: null,
                              });
                            }}
                            className="flex-1 py-2 rounded-lg bg-[#a34ee5]/20 text-[#a34ee5] hover:bg-[#a34ee5]/30 transition-colors flex items-center justify-center gap-1 text-sm"
                          >
                            <Pencil size={14} />
                            Modifier
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(produit.id)}
                            className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1 text-sm"
                          >
                            <Trash2 size={14} />
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