import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useTheme } from "./context/ThemeContext";

const SIDEBAR_EXPANDED  = 240;
const SIDEBAR_COLLAPSED = 64;

const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
};

const App = () => {
  const location = useLocation();
  const token    = localStorage.getItem("access");
  const { tokens } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useScrollToTop();

  // ✅ vendeurDashboard et activity ajoutés
  const adminPaths = [
    "/ventes", "/listeContacts", "/listeRejoindre",
    "/listePostulantsCommunity", "/listPartners",
    "/listeAbonnement", "/platformPost", "/valeurPost",
    "/dashboardAdmin", "/vendeurDashboard",
    "/teamMessage", "/missionPost",
    "/register-employee", "/homePost", "/stocks",
    "/servicePost", "/categories", "/produits",
    "/activity",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const baseStyles = `
    html { overflow: hidden; width: 100%; height: 100%; }
    body { overflow: hidden; width: 100%; height: 100%; margin: 0; padding: 0; }
    #root { overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%; -webkit-overflow-scrolling: touch; }
    * { box-sizing: border-box; }
  `;

  const adminStyles = `
    ${baseStyles}
    body { background: ${tokens.bg}; }
    #root { scrollbar-width: thin; scrollbar-color: ${tokens.scrollThumb} ${tokens.scrollTrack}; }
    #root::-webkit-scrollbar { width: 8px; }
    #root::-webkit-scrollbar-track { background: ${tokens.scrollTrack}; border-radius: 10px; }
    #root::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldDark} 100%); border-radius: 10px; border: 2px solid ${tokens.scrollTrack}; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
    input::placeholder { color: ${tokens.textDim}; }
    select option { background: ${tokens.surface}; color: ${tokens.text}; }
  `;

  const publicStyles = `
    ${baseStyles}
    body { background: #FFFFFF; }
    #root { scrollbar-width: thin; scrollbar-color: #C9A84C #EDE5CC; }
    #root::-webkit-scrollbar { width: 8px; }
    #root::-webkit-scrollbar-track { background: #EDE5CC; border-radius: 10px; }
    #root::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #C9A84C 0%, #8A6A20 100%); border-radius: 10px; border: 2px solid #EDE5CC; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
    input::placeholder { color: #C8A85A; }
    select option { background: #FDFAF4; color: #1A1208; }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{isAdminPage ? adminStyles : publicStyles}</style>

      {isAdminPage ? (
        <div style={{ background: tokens.bg, minHeight: "100vh", width: "100%", display: "flex" }}>
          <NavAdmin onToggle={setSidebarCollapsed} />
          <main style={{
            marginLeft: `${sidebarW}px`, flex: 1, minHeight: "100vh",
            transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${tokens.gold}08 0%, transparent 70%)` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${tokens.gold}06 0%, transparent 70%)` }} />
            </div>
            <div style={{ position: "relative", maxWidth: "1600px", margin: "0 auto", padding: "36px 28px 40px" }}>
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div style={{ minHeight: "100vh", width: "100%", background: "#FFFFFF" }}>
          {!isLoginPage && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
              <Header logoColor="#C9A84C" />
            </div>
          )}
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