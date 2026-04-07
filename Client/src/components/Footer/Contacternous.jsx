import React, { useState } from "react";
import { MapPin, Clock, MessageCircle, Send, Phone, Mail, CheckCircle } from "lucide-react";

const SS = {
  bg: "#F7F3EC", surface: "#EDE5D0", card: "#E4D9C0",
  border: "#D4C08A", borderHover: "#B89A50",
  gold: "#C9A84C", goldLight: "#8A6A20", goldDark: "#5C3D00",
  text: "#2C1A00", textMuted: "#8A6A20", textDim: "#B8A070",
  success: "#1A6B3C", successBg: "#D4EDDF",
  danger: "#A32020", dangerBg: "#FDEAEA",
};

const NUMERO_WA = "00224620762508";

const WAIcon = ({ size = 20, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

// ── Sujets prédéfinis pour le message WA ──────────────────────────
const SUJETS = [
  { label: "Commander un article",    emoji: "🛍️", msg: "Bonjour Santa'Style ! 👋\nJe souhaite commander un article." },
  { label: "Disponibilité d'un article", emoji: "🔍", msg: "Bonjour Santa'Style ! 👋\nJe voudrais savoir si un article est disponible." },
  { label: "Suivi de commande",       emoji: "📦", msg: "Bonjour Santa'Style ! 👋\nJe souhaite suivre ma commande." },
  { label: "Demander un devis",       emoji: "💰", msg: "Bonjour Santa'Style ! 👋\nJe souhaite obtenir un devis." },
  { label: "Échange / Retour",        emoji: "🔄", msg: "Bonjour Santa'Style ! 👋\nJe souhaite effectuer un échange ou un retour." },
  { label: "Autre question",          emoji: "💬", msg: "Bonjour Santa'Style ! 👋\nJ'ai une question à vous poser." },
];

const ouvrirWA = (msg) => {
  window.open(`https://wa.me/${NUMERO_WA}?text=${encodeURIComponent(msg)}`, "_blank");
};

export default function Contact() {
  const [sujetChoisi, setSujetChoisi] = useState(null);
  const [messagePersonnalise, setMessagePersonnalise] = useState("");
  const [nom, setNom] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const handleEnvoyer = () => {
    if (!sujetChoisi) return;
    const sujet = SUJETS[sujetChoisi];
    const msgFinal = [
      sujet.msg,
      nom ? `\n\nMon nom : ${nom}` : "",
      messagePersonnalise ? `\n\n${messagePersonnalise}` : "",
    ].join("");
    ouvrirWA(msgFinal);
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 4000);
  };

  const infos = [
    {
      icon: <WAIcon size={20} color={SS.gold} />,
      titre: "WhatsApp",
      valeur: "+224 620 762 508",
      sous: "Réponse en moins de 2h",
      action: () => ouvrirWA("Bonjour Santa'Style ! 👋"),
      actionLabel: "Écrire maintenant",
      bg: "#D4EDDF", color: SS.success,
    },
    {
      icon: <MapPin size={20} color={SS.gold} />,
      titre: "Localisation",
      valeur: "Conakry, Guinée",
      sous: "Livraison dans toute la ville",
      action: null,
      bg: `${SS.gold}15`, color: SS.goldLight,
    },
    {
      icon: <Clock size={20} color={SS.gold} />,
      titre: "Disponibilité",
      valeur: "7 jours sur 7",
      sous: "De 8h à 22h",
      action: null,
      bg: "rgba(59,130,246,0.1)", color: "#1d4ed8",
    },
  ];

  const faq = [
    { q: "Comment passer une commande ?", r: "Choisissez votre article dans la boutique, cliquez sur \"Commander\" et vous serez redirigé vers notre WhatsApp. Nous confirmons votre commande en moins de 2h." },
    { q: "Livrez-vous à domicile ?", r: "Oui, nous livrons partout à Conakry. Les frais et délais de livraison vous sont communiqués lors de la confirmation de commande." },
    { q: "Est-ce qu'on peut échanger un article ?", r: "Oui, l'échange est possible sous 24h après réception, si l'article est dans son état d'origine. Contactez-nous via WhatsApp." },
    { q: "Les prix incluent-ils la livraison ?", r: "Les prix affichés en boutique n'incluent pas la livraison. Le coût de livraison vous sera communiqué selon votre zone." },
    { q: "D'où viennent vos articles ?", r: "Nos collections viennent du Maroc, de Dubaï et du Mali. Chaque article est sélectionné avec soin pour garantir qualité et originalité." },
  ];

  const [faqOuverte, setFaqOuverte] = useState(null);

  return (
    <div style={{ fontFamily: "var(--font-sans, sans-serif)", color: SS.text }}>

      {/* ── Hero ── */}
      <div style={{ paddingTop: "100px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 16px", borderRadius: "20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "11px", color: "rgba(255,255,255,0.9)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
            ✦ Nous sommes là pour vous
          </div>
          <h1 style={{ fontSize: "46px", fontWeight: "800", color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.15)", lineHeight: 1.1 }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: "0 0 32px", fontWeight: "300" }}>
            Une question sur un article, une commande ou une livraison ? Notre équipe répond sur WhatsApp en moins de 2h, 7 jours sur 7.
          </p>

          {/* Bouton WA principal */}
          <button
            onClick={() => ouvrirWA("Bonjour Santa'Style ! 👋\nJe souhaite vous contacter.")}
            style={{ padding: "16px 36px", borderRadius: "14px", background: "#25D366", border: "none", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 6px 24px rgba(37,211,102,0.45)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(37,211,102,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,211,102,0.45)"; }}>
            <WAIcon size={20} /> Ouvrir WhatsApp
          </button>
        </div>
      </div>

      {/* ── Zone crème ── */}
      <div style={{ background: SS.bg, borderRadius: "32px 32px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: `linear-gradient(90deg, ${SS.goldDark}, ${SS.gold})`, opacity: 0.6 }} />
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 64px" }}>

          {/* ── Infos de contact ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "64px" }}>
            {infos.map((info, i) => (
              <div key={i} style={{ padding: "28px", borderRadius: "18px", background: "#fff", border: `1px solid ${SS.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${SS.gold}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: SS.textDim, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>{info.titre}</div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: SS.text, marginBottom: "3px" }}>{info.valeur}</div>
                  <div style={{ fontSize: "13px", color: SS.textMuted }}>{info.sous}</div>
                </div>
                {info.action && (
                  <button onClick={info.action}
                    style={{ marginTop: "4px", padding: "9px 16px", borderRadius: "10px", background: "#25D366", border: "none", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", width: "fit-content", transition: "opacity 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <WAIcon size={14} /> {info.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ── Formulaire de message WA ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "64px", alignItems: "start" }}>

            {/* Formulaire gauche */}
            <div>
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Envoyer un message</div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: SS.text, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Comment pouvons-nous vous aider ?</h2>
                <p style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.6, margin: 0 }}>
                  Sélectionnez le sujet de votre message et nous vous répondrons directement sur WhatsApp.
                </p>
              </div>

              {/* Nom (optionnel) */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                  Votre prénom (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Mamadou, Fatoumata..."
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "#fff", border: `1px solid ${SS.border}`, color: SS.text, fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = SS.gold}
                  onBlur={e => e.target.style.borderColor = SS.border}
                />
              </div>

              {/* Sujet */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "8px" }}>
                  Sujet de votre message *
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {SUJETS.map((s, i) => (
                    <button key={i} type="button"
                      onClick={() => setSujetChoisi(i)}
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", border: `1.5px solid ${sujetChoisi === i ? SS.gold : SS.border}`, background: sujetChoisi === i ? `${SS.gold}12` : "#fff", cursor: "pointer", transition: "all 0.15s", textAlign: "left" }}>
                      <span style={{ fontSize: "18px", flexShrink: 0 }}>{s.emoji}</span>
                      <span style={{ fontSize: "14px", fontWeight: sujetChoisi === i ? "700" : "500", color: sujetChoisi === i ? SS.goldDark : SS.text }}>{s.label}</span>
                      {sujetChoisi === i && <CheckCircle size={16} color={SS.gold} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message additionnel */}
              {sujetChoisi !== null && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: SS.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                    Détails supplémentaires (optionnel)
                  </label>
                  <textarea
                    placeholder="Précisez votre demande, l'article concerné, votre taille..."
                    value={messagePersonnalise}
                    onChange={e => setMessagePersonnalise(e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "#fff", border: `1px solid ${SS.border}`, color: SS.text, fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" }}
                    onFocus={e => e.target.style.borderColor = SS.gold}
                    onBlur={e => e.target.style.borderColor = SS.border}
                  />
                </div>
              )}

              {/* Bouton envoyer */}
              <button
                onClick={handleEnvoyer}
                disabled={sujetChoisi === null}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: sujetChoisi !== null ? "#25D366" : SS.border, border: "none", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: sujetChoisi !== null ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.2s", opacity: sujetChoisi !== null ? 1 : 0.6, boxShadow: sujetChoisi !== null ? "0 4px 16px rgba(37,211,102,0.35)" : "none" }}
                onMouseEnter={e => { if (sujetChoisi !== null) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => { if (sujetChoisi !== null) e.currentTarget.style.opacity = "1"; }}>
                {envoye ? (
                  <><CheckCircle size={18} /> Message ouvert dans WhatsApp !</>
                ) : (
                  <><WAIcon size={18} /> Envoyer via WhatsApp</>
                )}
              </button>

              {sujetChoisi === null && (
                <p style={{ fontSize: "12px", color: SS.textDim, textAlign: "center", marginTop: "8px" }}>
                  Sélectionnez un sujet pour activer l'envoi
                </p>
              )}
            </div>

            {/* Infos droite */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Card WA principale */}
              <div style={{ padding: "32px", borderRadius: "20px", background: "linear-gradient(135deg, #075E54, #128C7E)", color: "#fff", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <WAIcon size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "800" }}>Santa'Style</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#25D366", display: "inline-block" }} />
                        En ligne · Répond rapidement
                      </div>
                    </div>
                  </div>

                  {/* Bulle message simulée */}
                  <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: "12px 12px 12px 0", padding: "12px 16px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "14px", margin: 0, lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>
                      Bonjour ! 👋 Bienvenue chez Santa'Style. Comment puis-je vous aider aujourd'hui ?
                    </p>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "6px", textAlign: "right" }}>Santa'Style · maintenant</div>
                  </div>

                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", marginBottom: "20px" }}>
                    +{NUMERO_WA.replace("00", "")}
                  </div>

                  <button
                    onClick={() => ouvrirWA("Bonjour Santa'Style ! 👋")}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#25D366", border: "none", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <WAIcon size={16} /> Démarrer la conversation
                  </button>
                </div>
              </div>

              {/* Horaires */}
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: `1px solid ${SS.border}` }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: SS.text, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={16} color={SS.gold} /> Horaires de disponibilité
                </div>
                {[
                  { jour: "Lundi — Vendredi", heure: "8h — 22h", dispo: true },
                  { jour: "Samedi",           heure: "9h — 22h", dispo: true },
                  { jour: "Dimanche",         heure: "10h — 20h", dispo: true },
                ].map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${SS.border}` : "none" }}>
                    <span style={{ fontSize: "13px", color: SS.text, fontWeight: "500" }}>{h.jour}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", color: SS.textMuted }}>{h.heure}</span>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: h.dispo ? "#25D366" : SS.danger, flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "14px", padding: "10px 12px", borderRadius: "8px", background: SS.successBg, border: `1px solid ${SS.success}30`, fontSize: "12px", color: SS.success, fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle size={13} /> Réponse garantie en moins de 2h
                </div>
              </div>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginBottom: "64px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ fontSize: "12px", color: SS.gold, fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Questions fréquentes</div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", color: SS.text, margin: 0, letterSpacing: "-0.02em" }}>FAQ</h2>
            </div>

            <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {faq.map((item, i) => (
                <div key={i}
                  style={{ background: "#fff", border: `1px solid ${faqOuverte === i ? SS.gold : SS.border}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}>
                  <button
                    onClick={() => setFaqOuverte(faqOuverte === i ? null : i)}
                    style={{ width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: SS.text, flex: 1 }}>{item.q}</span>
                    <span style={{ fontSize: "18px", color: SS.gold, fontWeight: "300", flexShrink: 0, transform: faqOuverte === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                  </button>
                  {faqOuverte === i && (
                    <div style={{ padding: "0 20px 18px" }}>
                      <div style={{ height: "1px", background: SS.border, marginBottom: "14px" }} />
                      <p style={{ fontSize: "14px", color: SS.textMuted, lineHeight: 1.7, margin: 0 }}>{item.r}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA final ── */}
          <div style={{ padding: "48px 40px", borderRadius: "24px", background: `linear-gradient(135deg, ${SS.goldDark} 0%, #8A6A20 50%, ${SS.gold} 100%)`, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                Encore des questions ?
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", margin: "0 0 28px", fontWeight: "300" }}>
                Notre équipe est disponible maintenant sur WhatsApp.
              </p>
              <button
                onClick={() => ouvrirWA("Bonjour Santa'Style ! 👋\nJ'ai une question.")}
                style={{ padding: "14px 32px", borderRadius: "12px", background: "#25D366", border: "none", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", transition: "opacity 0.15s" }}
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