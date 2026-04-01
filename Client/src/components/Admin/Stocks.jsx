import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  Layers, Search, ChevronDown, Package
} from "lucide-react";
import CONFIG from "../../config/config";

const Stocks = () => {
  const navigate = useNavigate();

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
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
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
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          produit: form.produit,
          taille: form.taille.trim(),
          couleur: form.couleur.trim(),
          quantite: parseInt(form.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStocks((prev) => [data, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
        setSuccess("Stock créé avec succès !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msg || "Erreur lors de la création");
      }
    } catch {
      setError("Erreur serveur");
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
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/${id}/`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          produit: editForm.produit,
          taille: editForm.taille.trim(),
          couleur: editForm.couleur.trim(),
          quantite: parseInt(editForm.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStocks((prev) => prev.map((s) => (s.id === id ? data : s)));
        setEditingId(null);
        setSuccess("Stock modifié !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msg || "Erreur lors de la modification");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setUpdating(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/stocks/${id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.ok || res.status === 204) {
        setStocks((prev) => prev.filter((s) => s.id !== id));
        setConfirmDeleteId(null);
        setSuccess("Stock supprimé !");
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
  const filtered = stocks.filter((s) => {
    const matchSearch =
      s.produit_nom?.toLowerCase().includes(search.toLowerCase()) ||
      s.taille?.toLowerCase().includes(search.toLowerCase()) ||
      s.couleur?.toLowerCase().includes(search.toLowerCase());
    const matchProduit = filterProduit
      ? String(s.produit) === filterProduit
      : true;
    return matchSearch && matchProduit;
  });

  // Badge couleur quantité
  const getQuantiteBadge = (q) => {
    if (q === 0) return "bg-red-500/20 text-red-400";
    if (q <= 5) return "bg-orange-500/20 text-orange-400";
    return "bg-green-500/20 text-green-400";
  };

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
              <Layers className="w-7 h-7 text-[#a34ee5]" />
              <h1 className="text-2xl font-bold text-white">Stocks</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#a34ee5]/20 text-[#a34ee5] text-sm">
                {stocks.length}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nouveau stock
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
            <h2 className="text-white font-semibold mb-4">Nouveau stock</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <select
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.produit}
                  onChange={(e) => setForm({ ...form, produit: e.target.value })}
                  required
                >
                  <option value="">— Sélectionner un produit —</option>
                  {produits.map((p) => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Quantité"
                  min="0"
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.quantite}
                  onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Taille (ex: S, M, L, XL, 42...)"
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.taille}
                  onChange={(e) => setForm({ ...form, taille: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Couleur (ex: Rouge, Noir...)"
                  className="p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                  value={form.couleur}
                  onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="px-4 py-2 rounded-xl bg-gray-700/40 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Création..." : "Créer"}
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
              placeholder="Rechercher (produit, taille, couleur)..."
              className="flex-1 py-3 bg-transparent text-white placeholder-gray-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-3 rounded-xl bg-[#41124f]/20 border border-[#a34ee5]/10">
            <ChevronDown size={16} className="text-gray-500" />
            <select
              className="py-3 bg-transparent text-white outline-none"
              value={filterProduit}
              onChange={(e) => setFilterProduit(e.target.value)}
            >
              <option value="">Tous les produits</option>
              {produits.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Aucun stock trouvé</div>
        ) : (
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl border border-[#a34ee5]/30 overflow-hidden">
            {/* Header tableau */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#a34ee5]/10 text-gray-500 text-xs uppercase tracking-wider">
              <div className="col-span-4">Produit</div>
              <div className="col-span-2">Taille</div>
              <div className="col-span-2">Couleur</div>
              <div className="col-span-2">Quantité</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-[#a34ee5]/10">
              {filtered.map((stock) => (
                <li key={stock.id} className="px-4 py-3 hover:bg-[#41124f]/10 transition-colors">
                  {editingId === stock.id ? (
                    /* Mode édition */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-3">
                        <select
                          className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                          value={editForm.produit}
                          onChange={(e) => setEditForm({ ...editForm, produit: e.target.value })}
                        >
                          <option value="">— Produit —</option>
                          {produits.map((p) => (
                            <option key={p.id} value={p.id}>{p.nom}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Taille"
                          className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                          value={editForm.taille}
                          onChange={(e) => setEditForm({ ...editForm, taille: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Couleur"
                          className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                          value={editForm.couleur}
                          onChange={(e) => setEditForm({ ...editForm, couleur: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          className="w-full p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] text-sm"
                          value={editForm.quantite}
                          onChange={(e) => setEditForm({ ...editForm, quantite: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-3 flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdate(stock.id)}
                          disabled={updating}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Mode affichage */
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4 flex items-center gap-2">
                        <Package size={14} className="text-[#a34ee5] shrink-0" />
                        <span className="text-white text-sm truncate">{stock.produit_nom}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#41124f]/40 text-gray-300 text-sm">
                          {stock.taille}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-300 text-sm">{stock.couleur}</span>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-0.5 rounded-full text-sm font-semibold ${getQuantiteBadge(stock.quantite)}`}>
                          {stock.quantite}
                        </span>
                      </div>
                      <div className="col-span-2 flex gap-2 justify-end">
                        {confirmDeleteId === stock.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(stock.id)}
                              disabled={deletingId === stock.id}
                              className="px-2 py-1 rounded-lg bg-red-500/30 text-red-400 text-xs font-semibold disabled:opacity-50"
                            >
                              {deletingId === stock.id ? "..." : "Oui"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-400 text-xs"
                            >
                              Non
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(stock.id);
                                setEditForm({
                                  produit: stock.produit,
                                  taille: stock.taille,
                                  couleur: stock.couleur,
                                  quantite: stock.quantite,
                                });
                              }}
                              className="p-2 rounded-lg bg-[#a34ee5]/20 text-[#a34ee5] hover:bg-[#a34ee5]/30 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(stock.id)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Résumé stock bas */}
        {!loading && stocks.length > 0 && (
          <div className="mt-4 flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 text-sm">
                {stocks.filter((s) => s.quantite > 5).length} en stock
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-orange-400 text-sm">
                {stocks.filter((s) => s.quantite > 0 && s.quantite <= 5).length} stock faible
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-400 text-sm">
                {stocks.filter((s) => s.quantite === 0).length} rupture
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Stocks;