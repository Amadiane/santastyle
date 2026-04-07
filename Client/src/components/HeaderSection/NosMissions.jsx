import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, Zap, Users, MapPin, Star, ArrowRight, MessageCircle } from "lucide-react";

const SS = {
  bg: "#F7F3EC", surface: "#EDE5D0", card: "#E4D9C0",
  border: "#D4C08A", gold: "#C9A84C",
  goldLight: "#8A6A20", goldDark: "#5C3D00",
  text: "#2C1A00", textMuted: "#8A6A20", textDim: "#B8A070",
  success: "#1A6B3C", successBg: "#D4EDDF",
};

const WAIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const ouvrirWA = () => {
  const msg = encodeURIComponent("Bonjour Santa'Style ! 👋\nJ'ai une question à vous poser.");
  window.open(`https://wa.me/224620762508?text=${msg}`, "_blank");
};

export default function NosMissions() {
  const navigate = useNavigate();

  const valeurs = [
    {
      icon: <Star size={24} color={SS.gold} />,
      titre: "Sélection Premium",
      texte: "Chaque article est soigneusement sélectionné auprès des meilleurs fournisseurs du Maroc, de Dubaï, du Mali et d'ailleurs pour vous garantir qualité et originalité.",
    },
    {
      icon: <Shield size={24} color={SS.gold} />,
      titre: "Confiance & Transparence",
      texte: "Nous construisons une relation de confiance durable avec chaque client. Nos prix sont honnêtes, nos produits conformes aux photos, et notre service irréprochable.",
    },
    {
      icon: <Zap size={24} color={SS.gold} />,
      titre: "Réactivité",
      texte: "Commandez via WhatsApp et recevez une confirmation en moins de 2h. Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.",
    },
    {
      icon: <Heart size={24} color={SS.gold} />,
      titre: "Passion Mode",
      texte: "La mode est notre passion depuis 2015. Nous suivons les tendances africaines et internationales pour vous proposer toujours ce qui se fait de mieux.",
    },
    {
      icon: <MapPin size={24} color={SS.gold} />,
      titre: "Livraison Conakry",
      texte: "Nous livrons partout à Conakry rapidement et en toute sécurité. Votre commande est emballée avec soin et livrée directement chez vous.",
    },
    {
      icon: <Users size={24} color={SS.gold} />,
      titre: "Satisfaction Client",
      texte: "Notre priorité absolue est votre satisfaction. Échange possible sous 24h, accompagnement personnalisé — vous n'êtes jamais seul dans votre achat.",
    },
  ];

  const timeline = [
    { annee: "2015", titre: "Naissance de Santa'Style", texte: "Tout commence avec une passion pour la mode et l'envie de proposer aux femmes et hommes de Conakry des vêtements de qualité à des prix accessibles." },
    { annee: "2018", titre: "Expansion des collections", texte: "Nos partenariats s'étendent au Maroc, à Dubaï et au Mali. Les collections s'enrichissent avec des pièces exclusives et des tissus d'exception." },
    { annee: "2021", titre: "Lancement digital", texte: "Santa'Style s'ouvre au monde digital. Commandes via WhatsApp, photos HD, livraison à domicile — la boutique vient à vous." },
    { annee: "Aujourd'hui", titre: "Une boutique de référence", texte: "Des centaines de clients satisfaits, une réputation construite sur la qualité et la confiance. Santa'Style continue de grandir avec vous." },
  ];

  const chiffres = [
    { valeur: "2015", label: "Année de création" },
    { valeur: "500+", label: "Clients satisfaits" },
    { valeur: "3", label: "Pays d'approvisionnement" },
    { valeur: "7j/7", label: "Disponibilité" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-sans, sans-serif)", color: SS.text }}>

      {/* ── Hero ── */}
      <div style={{ paddingTop: "100px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 16px", borderRadius: "20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "11px", color: "rgba(255,255,255,0.9)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
            ✦ Depuis 2015
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.15)", lineHeight: 1.1 }}>
            Qui sommes-nous ?
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px", fontWeight: "300" }}>
            Santa'Style est bien plus qu'une boutique. C'est une histoire de passion, d'élégance et de proximité née à Conakry en 2015 — avec l'ambition de vous habiller avec style, sans compromis.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/boutique")}
              style={{ padding: "13px 28px", borderRadius: "12px", background: `linear-gradient(135deg, ${SS.goldDark}, ${SS.gold})`, border: "none", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(201,168,76,0.4)" }}>
              Découvrir la boutique <ArrowRight size={16} />
            </button>
            <button onClick={ouvrirWA}
              style={{ padding: "13px 28px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <WAIcon size={16} /> Nous contacter
            </button>
          </div>
        </div>
      </div>

      {/* ── Zone crème ── */}
      <div style={{ background: SS.bg, borderRadius: "32px 32px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: `linear-gradient(90deg, ${SS.goldDark}, ${SS.gold})`, opacity: 0.6 }} />
        </div>

        {/* ── Chiffres clés ── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "72px" }}>
            {chiffres.map((c, i) => (
              <div key={i} style={{ textAlign: "center", padding: "28px 20px", borderRadius: "16px", background: "#fff", border: `1px solid ${SS.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "36px", fontWeight: "800", color: SS.goldLight, marginBottom: "6px", letterSpacing: "-0.02em" }}>
                  {c.valeur}
                </div>
                <div style={{ fontSize: "13px", color: SS.textMuted, fontWeight: "500" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── Notre histoire ── */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Notre parcours</div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: SS.text, margin: 0, letterSpacing: "-0.02em" }}>Une histoire qui continue</h2>
            </div>

            <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
              {/* Ligne verticale */}
              <div style={{ position: "absolute", left: "28px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(180deg, ${SS.gold}, ${SS.goldDark})`, borderRadius: "2px" }} />

              {timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "24px", marginBottom: i < timeline.length - 1 ? "36px" : "0", position: "relative" }}>
                  {/* Cercle */}
                  <div style={{ width: "58px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: SS.gold, border: `3px solid ${SS.bg}`, boxShadow: `0 0 0 2px ${SS.gold}`, zIndex: 1, marginTop: "4px" }} />
                  </div>
                  {/* Contenu */}
                  <div style={{ flex: 1, paddingBottom: "8px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: SS.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{t.annee}</div>
                    <div style={{ fontSize: "17px", fontWeight: "700", color: SS.text, marginBottom: "8px" }}>{t.titre}</div>
                    <div style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.7 }}>{t.texte}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Nos valeurs ── */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Ce qui nous guide</div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: SS.text, margin: 0, letterSpacing: "-0.02em" }}>Nos valeurs</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {valeurs.map((v, i) => (
                <div key={i} style={{ padding: "28px", borderRadius: "16px", background: "#fff", border: `1px solid ${SS.border}`, transition: "all 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = SS.gold; e.currentTarget.style.boxShadow = `0 8px 24px rgba(201,168,76,0.15)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = SS.border; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${SS.gold}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    {v.icon}
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: "700", color: SS.text, marginBottom: "8px" }}>{v.titre}</div>
                  <div style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.7 }}>{v.texte}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA final ── */}
          <div style={{ marginBottom: "64px", padding: "48px 40px", borderRadius: "24px", background: `linear-gradient(135deg, ${SS.goldDark} 0%, #8A6A20 50%, ${SS.gold} 100%)`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                Une question ? On est là.
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", margin: "0 0 28px", fontWeight: "300" }}>
                Notre équipe répond en moins de 2h, 7 jours sur 7.
              </p>
              <button onClick={ouvrirWA}
                style={{ padding: "14px 32px", borderRadius: "12px", background: "#25D366", border: "none", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <WAIcon size={18} /> Nous écrire sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}