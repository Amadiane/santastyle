import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X, ShoppingBag, Package } from "lucide-react";
import CONFIG from "../../config/config.js";

const SS = {
  bg:          "#F7F3EC",
  surface:     "#EDE5D0",
  card:        "#E4D9C0",
  border:      "#D4C08A",
  borderHover: "#B89A50",
  gold:        "#C9A84C",
  goldLight:   "#8A6A20",
  goldDark:    "#5C3D00",
  text:        "#2C1A00",
  textMuted:   "#8A6A20",
  textDim:     "#B8A070",
  success:     "#1A6B3C",
  successBg:   "#D4EDDF",
  warning:     "#92600A",
  warningBg:   "#FEF3CC",
  danger:      "#A32020",
  dangerBg:    "#FDEAEA",
  orange:      "#C2450A",
  orangeBg:    "#FEF0E6",
};

const WAIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const BadgeStock = ({ stocks }) => {
  const total = stocks?.reduce((acc, s) => acc + s.quantite, 0) ?? 0;
  if (total === 0)  return <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: SS.dangerBg,  color: SS.danger,  border: `1px solid ${SS.danger}40`  }}>Épuisé</span>;
  if (total <= 3)   return <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: SS.orangeBg,  color: SS.orange,  border: `1px solid ${SS.orange}40`  }}>Plus que {total} en stock !</span>;
  if (total <= 10)  return <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: SS.warningBg, color: SS.warning, border: `1px solid ${SS.warning}40` }}>Stock limité</span>;
  return              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: SS.successBg, color: SS.success, border: `1px solid ${SS.success}40` }}>Disponible</span>;
};

const BoutonWA = ({ produit }) => {
  const total = produit.stocks?.reduce((acc, s) => acc + s.quantite, 0) ?? 0;
  if (total === 0) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/boutique/${produit.id}`;
    const msg = encodeURIComponent(
      `Bonjour Santa'Style ! 👋\nJe souhaite commander :\n\n🛍️ *${produit.nom}*\n💰 Prix : ${Number(produit.prix).toLocaleString("fr-FR")} GNF\n🔗 Lien : ${url}\n\nEst-ce disponible ?`
    );
    window.open(
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER || "224620762508"}?text=${msg}`,
      "_blank"
    );
  };

  return (
    <button onClick={handleClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "8px", width: "100%", padding: "11px", borderRadius: "8px",
      border: "none", background: "#25D366", color: "#fff",
      fontSize: "13px", fontWeight: "700", cursor: "pointer", marginTop: "8px",
    }}>
      <WAIcon size={16} />
      Commander sur WhatsApp
    </button>
  );
};

const CarteProduit = ({ produit, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const total  = produit.stocks?.reduce((acc, s) => acc + s.quantite, 0) ?? 0;
  const epuise = total === 0;

  const isNew = () => {
    if (!produit.date_creation) return false;
    return (Date.now() - new Date(produit.date_creation)) / 86400000 <= 14;
  };

  return (
    <div
      onClick={() => onClick(produit)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${hovered && !epuise ? SS.borderHover : SS.border}`,
        borderRadius: "14px", overflow: "hidden",
        transition: "all 0.2s",
        cursor: "pointer",
        opacity: epuise ? 0.7 : 1,
        transform: hovered && !epuise ? "translateY(-3px)" : "none",
        boxShadow: hovered && !epuise ? `0 10px 28px ${SS.gold}25` : "none",
      }}
    >
      <div style={{ position: "relative", height: "240px", background: SS.surface, overflow: "hidden" }}>
        {produit.image_url ? (
          <img src={produit.image_url} alt={produit.nom}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s", transform: hovered && !epuise ? "scale(1.05)" : "scale(1)" }}
            onError={e => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Package size={48} color={`${SS.gold}50`} />
          </div>
        )}

        {epuise && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "#111", color: "#fff", padding: "7px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>Épuisé</span>
          </div>
        )}

        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {isNew() && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: SS.gold, color: "#1A1208" }}>Nouveau</span>}
          {!epuise && total <= 3 && <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: SS.danger, color: "#fff" }}>Dernières pièces !</span>}
        </div>
      </div>

      <div style={{ padding: "14px" }}>
        <div style={{ fontSize: "15px", fontWeight: "600", color: SS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>
          {produit.nom}
        </div>

        {produit.description && (
          <div style={{ fontSize: "12px", color: SS.textMuted, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>
            {produit.description}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "17px", fontWeight: "700", color: SS.goldLight }}>
            {Number(produit.prix).toLocaleString("fr-FR")} GNF
          </span>
          <BadgeStock stocks={produit.stocks} />
        </div>

        {total > 0 && total <= 10 && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{ height: "4px", borderRadius: "2px", background: SS.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "2px", width: `${Math.min((total / 20) * 100, 100)}%`, background: total <= 3 ? SS.danger : SS.warning, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: "10px", color: SS.textDim, marginTop: "3px", textAlign: "right" }}>
              {total} restant{total > 1 ? "s" : ""}
            </div>
          </div>
        )}

        <BoutonWA produit={produit} />

        <button
          onClick={e => { e.stopPropagation(); onClick(produit); }}
          style={{ width: "100%", padding: "9px", borderRadius: "8px", marginTop: "6px", background: "transparent", border: `1px solid ${SS.border}`, color: SS.goldLight, fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = SS.surface; e.currentTarget.style.borderColor = SS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = SS.border; }}
        >
          Voir le détail
        </button>
      </div>
    </div>
  );
};

const BoutiquePage = () => {
  const navigate = useNavigate();

  const [produits, setProduits]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [search, setSearch]           = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [filtreDispo, setFiltreDispo] = useState(false);
  const [loading, setLoading]         = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rP, rC, rS] = await Promise.all([
        fetch(CONFIG.API_PRODUIT),
        fetch(CONFIG.API_CATEGORIE),
        fetch(`${CONFIG.BASE_URL}/api/stocks/`),
      ]);
      const [dP, dC, dS] = await Promise.all([rP.json(), rC.json(), rS.json()]);

      const produitsData = Array.isArray(dP) ? dP : [];
      const stocksData   = Array.isArray(dS) ? dS : [];

      setProduits(produitsData.map(p => ({
        ...p,
        stocks: stocksData.filter(s => String(s.produit) === String(p.id)),
      })));
      setCategories(Array.isArray(dC) ? dC : []);
    } catch (err) {
      console.error("Erreur boutique", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = produits.filter(p => {
    const ms = p.nom.toLowerCase().includes(search.toLowerCase());
    const mc = selectedCat ? p.categorie === selectedCat : true;
    const md = filtreDispo ? (p.stocks?.reduce((a, s) => a + s.quantite, 0) ?? 0) > 0 : true;
    return ms && mc && md;
  });

  const totalDispo   = produits.filter(p => (p.stocks?.reduce((a, s) => a + s.quantite, 0) ?? 0) > 0).length;
  const totalEpuises = produits.filter(p => (p.stocks?.reduce((a, s) => a + s.quantite, 0) ?? 0) === 0).length;
  const getCatNom    = (id) => categories.find(c => c.id === id)?.nom || "";

  const ouvrirWAContact = () => {
    const msg = encodeURIComponent(
      `Bonjour Santa'Style ! 👋\nJe cherche un article spécifique, pouvez-vous m'aider ?`
    );
    window.open(
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER || "224620762508"}?text=${msg}`,
      "_blank"
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: SS.bg, fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${SS.goldDark} 0%, #8A6A20 50%, ${SS.gold} 100%)`, padding: "52px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "10px" }}>
            Vêtements & Accessoires
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Santa'Style Boutique
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.72)", margin: "0 0 24px" }}>
            Hommes · Femmes · Enfants
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "20px", padding: "10px 24px", borderRadius: "30px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", fontSize: "13px", color: "rgba(255,255,255,0.85)", flexWrap: "wrap", justifyContent: "center" }}>
            <span>✓ {totalDispo} articles disponibles</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>✓ Commande via WhatsApp</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span>✓ Livraison Conakry</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 16px" }}>

        {/* Recherche + filtre */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px", display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: `1px solid ${SS.border}`, borderRadius: "10px", padding: "0 14px" }}>
            <Search size={16} color={SS.textDim} />
            <input
              placeholder="Rechercher un produit..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: SS.text, fontSize: "14px", padding: "12px 0" }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: SS.textDim, display: "flex" }}>
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltreDispo(!filtreDispo)}
            style={{ padding: "0 18px", borderRadius: "10px", cursor: "pointer", border: `1px solid ${filtreDispo ? SS.gold : SS.border}`, background: filtreDispo ? `${SS.gold}18` : "#fff", color: filtreDispo ? SS.goldLight : SS.textMuted, fontSize: "13px", fontWeight: "500", display: "flex", alignItems: "center", gap: "7px", transition: "all 0.15s" }}
          >
            <SlidersHorizontal size={15} />
            Disponibles seulement
          </button>
        </div>

        {/* Catégories */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button onClick={() => setSelectedCat(null)}
            style={{ padding: "7px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", border: `1px solid ${!selectedCat ? SS.gold : SS.border}`, background: !selectedCat ? SS.gold : "#fff", color: !selectedCat ? "#1A1208" : SS.textMuted, cursor: "pointer", transition: "all 0.15s" }}>
            Tous ({produits.length})
          </button>
          {categories.map(cat => {
            const count  = produits.filter(p => p.categorie === cat.id).length;
            const active = selectedCat === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCat(active ? null : cat.id)}
                style={{ padding: "7px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", border: `1px solid ${active ? SS.gold : SS.border}`, background: active ? SS.gold : "#fff", color: active ? "#1A1208" : SS.textMuted, cursor: "pointer", transition: "all 0.15s" }}>
                {cat.nom} ({count})
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: SS.textMuted, padding: "4px 12px", borderRadius: "20px", background: "#fff", border: `1px solid ${SS.border}` }}>
            {filtered.length} produit{filtered.length > 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: "12px", color: SS.success, padding: "4px 12px", borderRadius: "20px", background: SS.successBg, border: `1px solid ${SS.success}40` }}>
            {totalDispo} disponible{totalDispo > 1 ? "s" : ""}
          </span>
          {totalEpuises > 0 && (
            <span style={{ fontSize: "12px", color: SS.danger, padding: "4px 12px", borderRadius: "20px", background: SS.dangerBg, border: `1px solid ${SS.danger}40` }}>
              {totalEpuises} épuisé{totalEpuises > 1 ? "s" : ""}
            </span>
          )}
          {selectedCat && (
            <span style={{ fontSize: "12px", color: SS.gold, padding: "4px 12px", borderRadius: "20px", background: `${SS.gold}12`, border: `1px solid ${SS.gold}40`, display: "flex", alignItems: "center", gap: "6px" }}>
              {getCatNom(selectedCat)}
              <button onClick={() => setSelectedCat(null)} style={{ background: "none", border: "none", cursor: "pointer", color: SS.gold, display: "flex", padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {/* Grille */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: SS.textMuted }}>
            <ShoppingBag size={44} color={`${SS.gold}40`} style={{ marginBottom: "14px" }} />
            <div style={{ fontSize: "15px" }}>Chargement de la boutique...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: SS.textMuted }}>
            <Package size={44} color={`${SS.gold}40`} style={{ marginBottom: "14px" }} />
            <div style={{ fontSize: "17px", fontWeight: "600", color: SS.text, marginBottom: "8px" }}>Aucun produit trouvé</div>
            <div style={{ fontSize: "13px", marginBottom: "20px" }}>Essayez de modifier vos filtres</div>
            <button onClick={() => { setSearch(""); setSelectedCat(null); setFiltreDispo(false); }}
              style={{ padding: "10px 22px", borderRadius: "8px", background: SS.gold, border: "none", color: "#1A1208", fontWeight: "600", cursor: "pointer" }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map(produit => (
              <CarteProduit
                key={produit.id}
                produit={produit}
                onClick={() => navigate(`/boutique/${produit.id}`)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: "56px", padding: "28px 24px", borderRadius: "16px", background: "#fff", border: `1px solid ${SS.border}`, textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "600", color: SS.text, marginBottom: "6px" }}>
              Vous ne trouvez pas ce que vous cherchez ?
            </div>
            <div style={{ fontSize: "13px", color: SS.textMuted, marginBottom: "16px" }}>
              Contactez-nous directement sur WhatsApp.
            </div>
            <button
              onClick={ouvrirWAContact}
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "13px 28px", borderRadius: "10px", border: "none", background: "#25D366", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
            >
              <WAIcon size={20} />
              Nous contacter sur WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoutiquePage;