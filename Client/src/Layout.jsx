import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { useTheme } from "./context/ThemeContext";

const SIDEBAR_EXPANDED  = 240;
const SIDEBAR_COLLAPSED = 64;

const LIGHT_TOKENS = {
  bg:          "#F7F3EC",
  surface:     "#EDE5D0",
  card:        "#E4D9C0",
  border:      "#D4C08A",
  gold:        "#C9A84C",
  goldLight:   "#8A6A20",
  goldDark:    "#5C3D00",
  text:        "#2C1A00",
  textMuted:   "#8A6A20",
  textDim:     "#B8A070",
  scrollTrack: "#EDE5D0",
  scrollThumb: "#C9A84C",
};

const App = () => {
  const location = useLocation();
  const token    = localStorage.getItem("access");
  const { tokens } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) rootElement.scrollTop = 0;
    window.scrollTo(0, 0);
    const timer = setTimeout(() => { window.scrollTo(0, 0); }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const adminPaths = [
    "/ventes", "/listeContacts", "/listeRejoindre",
    "/listePostulantsCommunity", "/listPartners",
    "/listeAbonnement", "/platformPost", "/valeurPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost",
    "/register-employee", "/homePost", "/stocks",
    "/servicePost", "/categories", "/produits",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  const sidebarW     = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const adminTokens  = tokens;

  const baseStyles = `
    html { overflow: hidden; width: 100%; height: 100%; }
    body { overflow: hidden; width: 100%; height: 100%; margin: 0; padding: 0; }
    #root { overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%; -webkit-overflow-scrolling: touch; }
    * { box-sizing: border-box; }
  `;

  const adminStyles = `
    ${baseStyles}
    body { background: ${adminTokens.bg}; }
    #root { scrollbar-width: thin; scrollbar-color: ${adminTokens.scrollThumb} ${adminTokens.scrollTrack}; }
    #root::-webkit-scrollbar { width: 8px; }
    #root::-webkit-scrollbar-track { background: ${adminTokens.scrollTrack}; border-radius: 10px; }
    #root::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${adminTokens.gold} 0%, ${adminTokens.goldDark} 100%); border-radius: 10px; border: 2px solid ${adminTokens.scrollTrack}; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
    input::placeholder { color: ${adminTokens.textDim}; }
    select option { background: ${adminTokens.surface}; color: ${adminTokens.text}; }
  `;

  // ✅ Public : body = fond doré foncé pour que le header transparent
  //    soit cohérent même avant que React monte
  const publicStyles = `
    ${baseStyles}
    body { background: #5C3D00; }
    #root { scrollbar-width: thin; scrollbar-color: #C9A84C #EDE5D0; }
    #root::-webkit-scrollbar { width: 8px; }
    #root::-webkit-scrollbar-track { background: #EDE5D0; border-radius: 10px; }
    #root::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #C9A84C 0%, #5C3D00 100%); border-radius: 10px; border: 2px solid #EDE5D0; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
    input::placeholder { color: #B8A070; }
    select option { background: #EDE5D0; color: #2C1A00; }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{isAdminPage ? adminStyles : publicStyles}</style>

      {isAdminPage ? (

        // ── LAYOUT ADMIN ────────────────────────────────────────────
        <div style={{ background: adminTokens.bg, minHeight: "100vh", width: "100%", display: "flex" }}>
          <NavAdmin onToggle={setSidebarCollapsed} />
          <main style={{ marginLeft: `${sidebarW}px`, flex: 1, minHeight: "100vh", transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${adminTokens.gold}08 0%, transparent 70%)` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${adminTokens.gold}06 0%, transparent 70%)` }} />
            </div>
            <div style={{ position: "relative", maxWidth: "1600px", margin: "0 auto", padding: "36px 28px 40px" }}>
              <Outlet />
            </div>
          </main>
        </div>

      ) : (

        // ── LAYOUT PUBLIC ────────────────────────────────────────────
        // ✅ Un seul fond continu — dégradé doré en haut, crème en bas
        // Pas de bords arrondis, pas de rupture
        <div style={{
          minHeight: "100vh",
          width: "100%",
          // Dégradé vertical : brun doré → or → crème
          // Le header transparent flotte dessus parfaitement
          background: `linear-gradient(180deg,
            #4A3000 0%,
            #6B4A10 12%,
            #C9A84C 28%,
            #E8D99A 38%,
            #F7F3EC 48%,
            #F7F3EC 100%
          )`,
        }}>

          {/* Header fixe transparent — PAS de fond propre, il hérite du dégradé */}
          {!isLoginPage && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
              <Header logoColor="#C9A84C" />
            </div>
          )}

          {/* Contenu — paddingTop 0, le hero gère son propre espace */}
          <main style={{ position: "relative", paddingBottom: "4rem" }}>
            <Outlet />
          </main>

          {!isLoginPage && <Footer />}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;