import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Package, CheckCircle, AlertCircle, XCircle } from "lucide-react";
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

const ProduitDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [produit, setProduit]                 = useState(null);
  const [stocks, setStocks]                   = useState([]);
  const [categories, setCategories]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedTaille, setSelectedTaille]   = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState("");
  const [couleursDispos, setCouleursDispos]   = useState([]);
  const [stockDispo, setStockDispo]           = useState(null);
  const [copied, setCopied]                   = useState(false);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rProduit, rStocks, rCats] = await Promise.all([
        fetch(`${CONFIG.API_PRODUIT}${id}/`),
        fetch(`${CONFIG.BASE_URL}/api/stocks/`),
        fetch(CONFIG.API_CATEGORIE),
      ]);
      const [dProduit, dStocks, dCats] = await Promise.all([
        rProduit.json(), rStocks.json(), rCats.json(),
      ]);

      setProduit(dProduit);
      setStocks(Array.isArray(dStocks)
        ? dStocks.filter(s => String(s.produit) === String(id))
        : []);
      setCategories(Array.isArray(dCats) ? dCats : []);
    } catch (err) {
      console.error("Erreur produit detail", err);
    } finally {
      setLoading(false);
    }
  };

  const taillesDispos = [...new Set(
    stocks.filter(s => s.quantite > 0).map(s => s.taille)
  )];

  useEffect(() => {
    if (!selectedTaille) {
      setCouleursDispos([]); setSelectedCouleur(""); setStockDispo(null); return;
    }
    const couleurs = stocks
      .filter(s => s.taille === selectedTaille && s.quantite > 0)
      .map(s => s.couleur);
    setCouleursDispos(couleurs);
    setSelectedCouleur(""); setStockDispo(null);
  }, [selectedTaille]);

  useEffect(() => {
    if (!selectedTaille || !selectedCouleur) { setStockDispo(null); return; }
    const s = stocks.find(s => s.taille === selectedTaille && s.couleur === selectedCouleur);
    setStockDispo(s ? s.quantite : 0);
  }, [selectedCouleur]);

  const totalStock = stocks.reduce((a, s) => a + s.quantite, 0);
  const getCatNom  = (catId) => categories.find(c => c.id === catId)?.nom || "";

  const genererMessageWA = () => {
  const url = window.location.href;
  const parties = [
    `Bonjour Santa'Style ! 👋`,
    ``,
    `Je suis intéressé(e) par cet article :`,
    ``,
    `🛍️ *${produit?.nom}*`,
    selectedTaille  ? `📏 Taille : ${selectedTaille}`   : null,
    selectedCouleur ? `🎨 Couleur : ${selectedCouleur}` : null,
    `💰 Prix : ${Number(produit?.prix).toLocaleString("fr-FR")} GNF`,
    ``,
    `🔗 Lien : ${url}`,
    ``,
    `Est-ce disponible ? Merci !`,
  ].filter(l => l !== null).join("\n");

  return encodeURIComponent(parties);
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER || "224620762508"}?text=${genererMessageWA()}`,
      "_blank"
    );
  };

  const handlePartager = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: produit?.nom, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getBadge = () => {
    if (totalStock === 0)  return { label: "Épuisé",                    bg: SS.dangerBg,  color: SS.danger,  icon: <XCircle    size={15} /> };
    if (totalStock <= 3)   return { label: `Plus que ${totalStock} !`,  bg: SS.orangeBg,  color: SS.orange,  icon: <AlertCircle size={15} /> };
    if (totalStock <= 10)  return { label: "Stock limité",              bg: SS.warningBg, color: SS.warning, icon: <AlertCircle size={15} /> };
    return                        { label: "Disponible",                bg: SS.successBg, color: SS.success, icon: <CheckCircle size={15} /> };
  };

  const btnStyle = (selected, disabled = false) => ({
    padding: "8px 18px", borderRadius: "8px",
    border: `1px solid ${selected ? SS.gold : SS.border}`,
    background: selected ? SS.gold : "#fff",
    color: selected ? "#1A1208" : disabled ? SS.textDim : SS.text,
    fontSize: "13px", fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: SS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: SS.textMuted }}>
        <Package size={48} color={`${SS.gold}50`} style={{ marginBottom: "12px" }} />
        <div style={{ fontSize: "15px" }}>Chargement...</div>
      </div>
    </div>
  );

  if (!produit || produit.detail) return (
    <div style={{ minHeight: "100vh", background: SS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px", color: SS.text, marginBottom: "16px" }}>Produit introuvable</div>
        <button onClick={() => navigate("/boutique")}
          style={{ padding: "10px 20px", borderRadius: "8px", background: SS.gold, border: "none", color: "#1A1208", fontWeight: "600", cursor: "pointer" }}>
          Retour boutique
        </button>
      </div>
    </div>
  );

  const b = getBadge();

  return (
    <div style={{ minHeight: "100vh", background: SS.bg, fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* Breadcrumb */}
      <div style={{ background: SS.surface, borderBottom: `1px solid ${SS.border}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => navigate("/boutique")}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: SS.textMuted, cursor: "pointer", fontSize: "13px" }}>
            <ArrowLeft size={15} /> Boutique
          </button>
          <span style={{ color: SS.textDim }}>/</span>
          {getCatNom(produit.categorie) && <>
            <span style={{ color: SS.textDim, fontSize: "13px" }}>{getCatNom(produit.categorie)}</span>
            <span style={{ color: SS.textDim }}>/</span>
          </>}
          <span style={{ color: SS.gold, fontSize: "13px", fontWeight: "500" }}>{produit.nom}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

          {/* IMAGE */}
          <div>
            <div style={{ borderRadius: "16px", overflow: "hidden", background: SS.surface, border: `1px solid ${SS.border}`, aspectRatio: "3/4", position: "relative" }}>
              {produit.image_url ? (
                <img src={produit.image_url} alt={produit.nom}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={80} color={`${SS.gold}30`} />
                </div>
              )}
              {totalStock > 0 && totalStock <= 3 && (
                <div style={{ position: "absolute", top: "14px", left: "14px", padding: "4px 14px", borderRadius: "20px", background: SS.danger, color: "#fff", fontSize: "12px", fontWeight: "700" }}>
                  Dernières pièces !
                </div>
              )}
              {totalStock === 0 && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ background: "#111", color: "#fff", padding: "10px 24px", borderRadius: "20px", fontSize: "15px", fontWeight: "700" }}>Épuisé</span>
                </div>
              )}
            </div>

            <button onClick={handlePartager}
              style={{ marginTop: "12px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px", borderRadius: "10px", background: "#fff", border: `1px solid ${SS.border}`, color: SS.textMuted, fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
              <Share2 size={15} />
              {copied ? "✓ Lien copié !" : "Partager ce produit"}
            </button>
          </div>

          {/* INFOS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div>
              {getCatNom(produit.categorie) && (
                <div style={{ fontSize: "11px", color: SS.gold, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                  {getCatNom(produit.categorie)}
                </div>
              )}
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: SS.text, margin: "0 0 10px", lineHeight: 1.2 }}>
                {produit.nom}
              </h1>
              <div style={{ fontSize: "28px", fontWeight: "700", color: SS.goldLight }}>
                {Number(produit.prix).toLocaleString("fr-FR")} GNF
              </div>
            </div>

            {/* Badge stock */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: b.bg, border: `1px solid ${b.color}40` }}>
              <span style={{ color: b.color }}>{b.icon}</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: b.color }}>{b.label}</span>
              {totalStock > 0 && (
                <div style={{ marginLeft: "auto", height: "5px", width: "80px", borderRadius: "3px", background: "rgba(0,0,0,0.1)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "3px", width: `${Math.min((totalStock / 20) * 100, 100)}%`, background: b.color }} />
                </div>
              )}
            </div>

            {produit.description && (
              <div style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.7, padding: "14px 16px", borderRadius: "10px", background: "#fff", border: `1px solid ${SS.border}` }}>
                {produit.description}
              </div>
            )}

            {/* Tailles */}
            {taillesDispos.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                  Taille {selectedTaille && <span style={{ color: SS.gold }}>· {selectedTaille}</span>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {taillesDispos.map(t => (
                    <button key={t} onClick={() => setSelectedTaille(t === selectedTaille ? "" : t)} style={btnStyle(selectedTaille === t)}>
                      {t}
                    </button>
                  ))}
                  {[...new Set(stocks.filter(s => s.quantite === 0).map(s => s.taille))]
                    .filter(t => !taillesDispos.includes(t))
                    .map(t => (
                      <button key={t + "_epuise"} disabled style={btnStyle(false, true)}>
                        <span style={{ textDecoration: "line-through" }}>{t}</span>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Couleurs */}
            {selectedTaille && couleursDispos.length > 0 && (
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
                  Couleur {selectedCouleur && <span style={{ color: SS.gold }}>· {selectedCouleur}</span>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {couleursDispos.map(c => (
                    <button key={c} onClick={() => setSelectedCouleur(c === selectedCouleur ? "" : c)} style={btnStyle(selectedCouleur === c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock sélection */}
            {stockDispo !== null && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", background: stockDispo === 0 ? SS.dangerBg : SS.successBg, border: `1px solid ${stockDispo === 0 ? SS.danger : SS.success}40`, color: stockDispo === 0 ? SS.danger : SS.success }}>
                {stockDispo === 0
                  ? "Cette combinaison est épuisée"
                  : `${stockDispo} pièce${stockDispo > 1 ? "s" : ""} disponible${stockDispo > 1 ? "s" : ""}`
                }
              </div>
            )}

            {/* Bouton WhatsApp */}
            {totalStock > 0 && (
              <button onClick={handleWhatsApp} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: "#25D366", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(37,211,102,0.3)" }}>
                <WAIcon size={22} />
                {selectedTaille && selectedCouleur
                  ? `Commander \u2014 ${selectedTaille} / ${selectedCouleur}`
                  : "Demander la disponibilit\u00E9"
                }
              </button>
            )}

            <div style={{ textAlign: "center", fontSize: "12px", color: SS.textDim }}>
              {selectedTaille && selectedCouleur
                ? "Le lien de ce produit sera inclus dans votre message"
                : "S\u00E9lectionnez taille et couleur, ou contactez-nous directement"
              }
            </div>

            {/* Infos livraison */}
            <div style={{ borderRadius: "10px", background: "#fff", border: `1px solid ${SS.border}`, overflow: "hidden" }}>
              {[
                { icon: "\uD83D\uDE9A", text: "Livraison disponible \u00E0 Conakry" },
                { icon: "\u2705",       text: "Commande confirm\u00E9e via WhatsApp" },
                { icon: "\uD83D\uDD04", text: "\u00C9change possible sous 24h" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: i < 2 ? `1px solid ${SS.border}` : "none" }}>
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", color: SS.textMuted }}>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetail;
