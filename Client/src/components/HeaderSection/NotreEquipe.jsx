import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, CheckCircle, ArrowRight } from "lucide-react";

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
  const msg = encodeURIComponent("Bonjour Santa'Style ! 👋\nJe souhaite en savoir plus sur votre équipe.");
  window.open(`https://wa.me/224620762508?text=${msg}`, "_blank");
};

// ── Avatar initiales ──────────────────────────────────────────────
const Avatar = ({ initiales, couleur }) => (
  <div style={{
    width: "90px", height: "90px", borderRadius: "50%",
    background: couleur, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "28px", fontWeight: "800", color: "#fff",
    border: `3px solid ${SS.bg}`, boxShadow: `0 4px 16px ${couleur}50`,
    flexShrink: 0,
  }}>
    {initiales}
  </div>
);

export default function NotreEquipe() {
  const navigate = useNavigate();

  // ✅ Membres — noms génériques, rôles convaincants, sans révéler le nombre exact
  const membres = [
    {
      initiales: "SS",
      couleur: "#C9A84C",
      nom: "Direction & Fondation",
      role: "Fondatrice & Directrice",
      phrase: "\"Ma vision depuis 2015 : rendre la mode de qualité accessible à toutes et tous à Conakry.\"",
      tags: ["Vision", "Sélection", "Stratégie"],
    },
    {
      initiales: "SC",
      couleur: "#8A6A20",
      nom: "Style & Collections",
      role: "Responsable Collections",
      phrase: "\"Je parcours les marchés du Maroc, de Dubaï et du Mali pour vous dénicher les plus belles pièces.\"",
      tags: ["Mode", "Sourcing", "Tendances"],
    },
    {
      initiales: "SR",
      couleur: "#5C3D00",
      nom: "Service Client",
      role: "Relation Client & Livraison",
      phrase: "\"Votre satisfaction est ma priorité. De la commande à la livraison, je m'assure que tout se passe parfaitement.\"",
      tags: ["WhatsApp", "Livraison", "Suivi"],
    },
  ];

  const engagements = [
    {
      icon: <Star size={22} color={SS.gold} />,
      titre: "Sélection rigoureuse",
      texte: "Chaque article passe par un contrôle qualité strict avant d'intégrer notre boutique. Nous refusons ce qui ne nous satisfait pas nous-mêmes.",
    },
    {
      icon: <Heart size={22} color="#be185d" />,
      titre: "Service personnalisé",
      texte: "Nous prenons le temps de comprendre votre style, votre morphologie et vos préférences pour vous conseiller au mieux.",
    },
    {
      icon: <CheckCircle size={22} color={SS.success} />,
      titre: "Satisfaction garantie",
      texte: "Échange possible sous 24h. Nous assumons nos responsabilités et faisons tout pour que vous repartiez satisfait(e).",
    },
    {
      icon: <ShoppingBag size={22} color="#1d4ed8" />,
      titre: "Toujours à l'écoute",
      texte: "Disponibles 7j/7 sur WhatsApp, nous répondons rapidement à chaque question, même les plus petites.",
    },
  ];

  return (
    <div style={{ fontFamily: "var(--font-sans, sans-serif)", color: SS.text }}>

      {/* ── Hero ── */}
      <div style={{ paddingTop: "100px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 16px", borderRadius: "20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "11px", color: "rgba(255,255,255,0.9)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
            ✦ Les visages derrière Santa'Style
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.15)", lineHeight: 1.1 }}>
            Notre Équipe
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px", fontWeight: "300" }}>
            Derrière chaque article et chaque commande, une équipe passionnée entièrement dédiée à vous offrir la meilleure expérience shopping de Conakry.
          </p>
        </div>
      </div>

      {/* ── Zone crème ── */}
      <div style={{ background: SS.bg, borderRadius: "32px 32px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: `linear-gradient(90deg, ${SS.goldDark}, ${SS.gold})`, opacity: 0.6 }} />
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 0" }}>

          {/* ── Membres ── */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Qui nous sommes</div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: SS.text, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Une équipe à votre service</h2>
              <p style={{ fontSize: "15px", color: SS.textMuted, maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
                Chaque membre apporte son expertise unique pour garantir que votre expérience Santa'Style soit exceptionnelle, du choix de l'article jusqu'à la livraison.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {membres.map((m, i) => (
                <div key={i}
                  style={{ background: "#fff", borderRadius: "20px", padding: "32px 28px", border: `1px solid ${SS.border}`, transition: "all 0.25s", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = SS.gold; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(201,168,76,0.15)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = SS.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}>

                  {/* Header carte */}
                  <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
                    <Avatar initiales={m.initiales} couleur={m.couleur} />
                    <div>
                      <div style={{ fontSize: "17px", fontWeight: "800", color: SS.text, marginBottom: "4px" }}>{m.nom}</div>
                      <div style={{ fontSize: "13px", color: SS.gold, fontWeight: "600" }}>{m.role}</div>
                    </div>
                  </div>

                  {/* Phrase signature */}
                  <div style={{ padding: "14px 16px", borderRadius: "10px", background: `${SS.gold}10`, border: `1px solid ${SS.gold}25`, marginBottom: "18px" }}>
                    <p style={{ fontSize: "13px", color: SS.goldLight, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>{m.phrase}</p>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {m.tags.map((tag, j) => (
                      <span key={j} style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: SS.surface, border: `1px solid ${SS.border}`, color: SS.textMuted }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Nos engagements ── */}
          <div style={{ marginBottom: "72px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Ce que nous promettons</div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: SS.text, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Nos engagements</h2>
              <p style={{ fontSize: "15px", color: SS.textMuted, maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
                Depuis 2015, ces engagements guident chacune de nos actions au quotidien.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              {engagements.map((e, i) => (
                <div key={i} style={{ padding: "28px", borderRadius: "16px", background: "#fff", border: `1px solid ${SS.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${SS.gold}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                    {e.icon}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: SS.text, marginBottom: "8px" }}>{e.titre}</div>
                  <div style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.7 }}>{e.texte}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bannière rejoindre ── */}
          <div style={{ marginBottom: "64px", borderRadius: "24px", overflow: "hidden", position: "relative" }}>
            <div style={{ background: `linear-gradient(135deg, ${SS.goldDark} 0%, #8A6A20 50%, ${SS.gold} 100%)`, padding: "52px 40px", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>
                  Rejoignez notre communauté
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                  Ils nous font confiance depuis 2015
                </h2>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", margin: "0 0 32px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7, fontWeight: "300" }}>
                  Des centaines de clients satisfaits font confiance à Santa'Style pour leur garde-robe. Rejoignez une communauté qui aime la mode autant que vous.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/boutique")}
                    style={{ padding: "13px 28px", borderRadius: "12px", background: "#fff", border: "none", color: SS.goldDark, fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.92"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <ShoppingBag size={16} /> Visiter la boutique
                  </button>
                  <button onClick={ouvrirWA}
                    style={{ padding: "13px 28px", borderRadius: "12px", background: "#25D366", border: "none", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <WAIcon size={16} /> Nous écrire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}