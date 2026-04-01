import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, X, ShoppingBag,
  Search, ChevronDown, User, Calendar, TrendingUp
} from "lucide-react";
import CONFIG from "../../config/config";

const Ventes = () => {
  const navigate = useNavigate();

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

  // --- Tailles dispo selon produit ---
  useEffect(() => {
    if (!form.produit) {
      setTaillesDisponibles([]);
      setCouleursDisponibles([]);
      setStockDisponible(null);
      return;
    }
    const stocksProduit = stocks.filter(
      (s) => String(s.produit) === String(form.produit)
    );
    const tailles = [...new Set(stocksProduit.map((s) => s.taille))];
    setTaillesDisponibles(tailles);
    setForm((prev) => ({ ...prev, taille: "", couleur: "" }));
    setCouleursDisponibles([]);
    setStockDisponible(null);
  }, [form.produit]);

  // --- Couleurs dispo selon taille ---
  useEffect(() => {
    if (!form.produit || !form.taille) {
      setCouleursDisponibles([]);
      setStockDisponible(null);
      return;
    }
    const stocksFiltres = stocks.filter(
      (s) =>
        String(s.produit) === String(form.produit) &&
        s.taille === form.taille
    );
    setCouleursDisponibles(stocksFiltres.map((s) => s.couleur));
    setForm((prev) => ({ ...prev, couleur: "" }));
    setStockDisponible(null);
  }, [form.taille]);

  // --- Stock dispo selon couleur ---
  useEffect(() => {
    if (!form.produit || !form.taille || !form.couleur) {
      setStockDisponible(null);
      return;
    }
    const s = stocks.find(
      (s) =>
        String(s.produit) === String(form.produit) &&
        s.taille === form.taille &&
        s.couleur === form.couleur
    );
    setStockDisponible(s ? s.quantite : 0);
  }, [form.couleur]);

  // --- Prix estimé ---
  const getProduitPrix = () =>
    produits.find((p) => String(p.id) === String(form.produit))?.prix || null;

  const prixEstime = getProduitPrix()
    ? (parseFloat(getProduitPrix()) * parseInt(form.quantite || 0)).toLocaleString("fr-FR")
    : null;

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (stockDisponible !== null && parseInt(form.quantite) > stockDisponible) {
      setError(`Stock insuffisant. Disponible : ${stockDisponible}`);
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/ventes/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          produit: parseInt(form.produit),
          taille: form.taille,
          couleur: form.couleur,
          quantite: parseInt(form.quantite),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVentes((prev) => [data, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
        setSuccess("Vente enregistrée avec succès !");
        await fetchStocks(); // ✅ Refresh stock après vente
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

  // --- DELETE ---
  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/ventes/${id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.ok || res.status === 204) {
        setVentes((prev) => prev.filter((v) => v.id !== id));
        setConfirmDeleteId(null);
        setSuccess("Vente supprimée !");
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
  const filtered = ventes.filter((v) => {
    const produitNom = (v.produit_nom || "").toLowerCase();
    const matchSearch =
      produitNom.includes(search.toLowerCase()) ||
      v.taille?.toLowerCase().includes(search.toLowerCase()) ||
      v.couleur?.toLowerCase().includes(search.toLowerCase()) ||
      (v.vendeur_nom || "").toLowerCase().includes(search.toLowerCase());
    const matchProduit = filterProduit
      ? String(v.produit) === filterProduit
      : true;
    return matchSearch && matchProduit;
  });

  // --- STATS ---
  const totalCA = ventes.reduce((acc, v) => acc + parseFloat(v.prix_total || 0), 0);
  const totalUnites = ventes.reduce((acc, v) => acc + (v.quantite || 0), 0);

  // --- Stock restant après une vente ---
  const getStockRestant = (vente) => {
    const s = stocks.find(
      (s) =>
        String(s.produit) === String(vente.produit) &&
        s.taille === vente.taille &&
        s.couleur === vente.couleur
    );
    return s ? s.quantite : null;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

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
              <ShoppingBag className="w-7 h-7 text-[#a34ee5]" />
              <h1 className="text-2xl font-bold text-white">Ventes</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#a34ee5]/20 text-[#a34ee5] text-sm">
                {ventes.length}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nouvelle vente
          </button>
        </div>

        {/* Stats */}
        {!loading && ventes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0a0a0a]/90 rounded-2xl p-4 border border-[#a34ee5]/20 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#a34ee5]/20">
                <TrendingUp size={20} className="text-[#a34ee5]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Chiffre d'affaires</p>
                <p className="text-white font-bold text-lg">
                  {totalCA.toLocaleString("fr-FR")} GNF
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a]/90 rounded-2xl p-4 border border-[#a34ee5]/20 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#fec603]/20">
                <ShoppingBag size={20} className="text-[#fec603]" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total ventes</p>
                <p className="text-white font-bold text-lg">{ventes.length}</p>
              </div>
            </div>
            <div className="bg-[#0a0a0a]/90 rounded-2xl p-4 border border-[#a34ee5]/20 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/20">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Unités vendues</p>
                <p className="text-white font-bold text-lg">{totalUnites}</p>
              </div>
            </div>
          </div>
        )}

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

        {/* Formulaire nouvelle vente */}
        {showForm && (
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-[#a34ee5]/30 mb-6">
            <h2 className="text-white font-semibold mb-4">Nouvelle vente</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Produit</label>
                  <select
                    className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5]"
                    value={form.produit}
                    onChange={(e) => setForm({ ...form, produit: e.target.value })}
                    required
                  >
                    <option value="">— Sélectionner —</option>
                    {produits.map((p) => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-500 text-xs mb-1 block">
                    Quantité
                    {stockDisponible !== null && (
                      <span className={`ml-2 font-semibold ${stockDisponible === 0 ? "text-red-400" : "text-green-400"}`}>
                        (stock disponible : {stockDisponible})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={stockDisponible ?? undefined}
                    placeholder="Quantité"
                    className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
                    value={form.quantite}
                    onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Taille</label>
                  <select
                    className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] disabled:opacity-40"
                    value={form.taille}
                    onChange={(e) => setForm({ ...form, taille: e.target.value })}
                    disabled={!form.produit}
                    required
                  >
                    <option value="">— Taille —</option>
                    {taillesDisponibles.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Couleur</label>
                  <select
                    className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5] disabled:opacity-40"
                    value={form.couleur}
                    onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                    disabled={!form.taille}
                    required
                  >
                    <option value="">— Couleur —</option>
                    {couleursDisponibles.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prix estimé */}
              {prixEstime && (
                <div className="p-3 rounded-xl bg-[#fec603]/10 border border-[#fec603]/20 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Prix total estimé</span>
                  <span className="text-[#fec603] font-bold text-lg">{prixEstime} GNF</span>
                </div>
              )}

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
                  disabled={submitting || stockDisponible === 0}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Enregistrement..." : "Enregistrer la vente"}
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
              placeholder="Rechercher (produit, taille, couleur, vendeur)..."
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

        {/* Liste ventes */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Aucune vente trouvée</div>
        ) : (
          <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl border border-[#a34ee5]/30 overflow-hidden">

            {/* Header tableau */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#a34ee5]/10 text-gray-500 text-xs uppercase tracking-wider">
              <div className="col-span-2">Produit</div>
              <div className="col-span-2">Taille / Couleur</div>
              <div className="col-span-1">Qté</div>
              <div className="col-span-2">Prix total</div>
              <div className="col-span-2">Stock restant</div>
              <div className="col-span-2">Vendeur</div>
              <div className="col-span-1">Date</div>
            </div>

            <ul className="divide-y divide-[#a34ee5]/10">
              {filtered.map((vente) => {
                const stockRestant = getStockRestant(vente);
                return (
                  <li key={vente.id} className="px-4 py-4 hover:bg-[#41124f]/10 transition-colors">
                    <div className="grid grid-cols-12 gap-2 items-center">

                      {/* Produit */}
                      <div className="col-span-2">
                        <p className="text-white text-sm font-medium truncate">
                          {vente.produit_nom || `#${vente.produit}`}
                        </p>
                      </div>

                      {/* Taille / Couleur */}
                      <div className="col-span-2 flex flex-wrap gap-1 items-center">
                        <span className="px-2 py-0.5 rounded-md bg-[#41124f]/40 text-gray-300 text-xs">
                          {vente.taille}
                        </span>
                        <span className="text-gray-400 text-xs">{vente.couleur}</span>
                      </div>

                      {/* Quantité vendue */}
                      <div className="col-span-1">
                        <span className="text-white text-sm font-semibold">{vente.quantite}</span>
                      </div>

                      {/* Prix total */}
                      <div className="col-span-2">
                        <span className="text-[#fec603] font-bold text-sm">
                          {Number(vente.prix_total).toLocaleString("fr-FR")} GNF
                        </span>
                      </div>

                      {/* ✅ Stock restant */}
                      <div className="col-span-2">
                        {stockRestant === null ? (
                          <span className="text-gray-600 text-xs">—</span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            stockRestant === 0
                              ? "bg-red-500/20 text-red-400"
                              : stockRestant <= 5
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-green-500/20 text-green-400"
                          }`}>
                            {stockRestant} restant{stockRestant > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* ✅ Vendeur nom */}
                      <div className="col-span-2 flex items-center gap-1">
                        <User size={12} className="text-gray-600 shrink-0" />
                        <span className="text-gray-300 text-xs truncate">
                          {vente.vendeur_nom || "—"}
                        </span>
                      </div>

                      {/* ✅ Date complète */}
                      <div className="col-span-1">
                        <div className="flex flex-col">
                          <span className="text-gray-400 text-xs">
                            {new Date(vente.date_vente).toLocaleDateString("fr-FR", {
                              day: "2-digit", month: "short", year: "numeric"
                            })}
                          </span>
                          <span className="text-gray-600 text-xs">
                            {new Date(vente.date_vente).toLocaleTimeString("fr-FR", {
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Supprimer */}
                      <div className="col-span-12 md:col-span-1 flex justify-end mt-2 md:mt-0">
                        {confirmDeleteId === vente.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(vente.id)}
                              disabled={deletingId === vente.id}
                              className="px-2 py-1 rounded-lg bg-red-500/30 text-red-400 text-xs font-semibold disabled:opacity-50"
                            >
                              {deletingId === vente.id ? "..." : "Oui"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-400 text-xs"
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(vente.id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ventes;