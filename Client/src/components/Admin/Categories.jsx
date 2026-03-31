import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Tag, X, Check } from "lucide-react";
import CONFIG from "../../config/config";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Création
  const [newNom, setNewNom] = useState("");
  const [creating, setCreating] = useState(false);

  // Édition
  const [editingId, setEditingId] = useState(null);
  const [editNom, setEditNom] = useState("");
  const [updating, setUpdating] = useState(false);

  // Suppression
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // --- FETCH ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CATEGORIE, { headers });
      const data = await res.json();
      if (res.ok) setCategories(data);
      else setError("Erreur lors du chargement");
    } catch {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(CONFIG.API_CATEGORIE, {
        method: "POST",
        headers,
        body: JSON.stringify({ nom: newNom.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => [...prev, data]);
        setNewNom("");
        setSuccess("Catégorie créée !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.nom?.[0] || "Erreur lors de la création");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setCreating(false);
    }
  };

  // --- UPDATE ---
  const handleUpdate = async (id) => {
    if (!editNom.trim()) return;
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${CONFIG.API_CATEGORIE}${id}/`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ nom: editNom.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? data : cat))
        );
        setEditingId(null);
        setSuccess("Catégorie modifiée !");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.nom?.[0] || "Erreur lors de la modification");
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
    setSuccess("");
    try {
      const res = await fetch(`${CONFIG.API_CATEGORIE}${id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.ok || res.status === 204) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        setSuccess("Catégorie supprimée !");
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboardAdmin")}
            className="p-2 rounded-xl bg-[#41124f]/30 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Tag className="w-7 h-7 text-[#a34ee5]" />
            <h1 className="text-2xl font-bold text-white">Catégories</h1>
          </div>
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
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-[#a34ee5]/30 mb-6">
          <h2 className="text-white font-semibold mb-4">Nouvelle catégorie</h2>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              className="flex-1 p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={18} />
              {creating ? "..." : "Ajouter"}
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-[#a34ee5]/30">
          <h2 className="text-white font-semibold mb-4">
            Liste ({categories.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune catégorie pour le moment
            </div>
          ) : (
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#41124f]/20 border border-[#a34ee5]/10 hover:border-[#a34ee5]/30 transition-colors"
                >
                  {editingId === cat.id ? (
                    // Mode édition
                    <>
                      <input
                        type="text"
                        className="flex-1 p-2 rounded-lg bg-[#41124f]/40 text-white outline-none focus:ring-2 focus:ring-[#a34ee5]"
                        value={editNom}
                        onChange={(e) => setEditNom(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={updating}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    // Mode affichage
                    <>
                      <Tag size={16} className="text-[#a34ee5] shrink-0" />
                      <span className="flex-1 text-white">{cat.nom}</span>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditNom(cat.nom);
                        }}
                        className="p-2 rounded-lg bg-[#a34ee5]/20 text-[#a34ee5] hover:bg-[#a34ee5]/30 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Categories;