import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");
  const { tokens, theme } = useTheme();

  React.useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      if (rootElement) rootElement.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
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

  if (isAdminPage && !token) {
    return <Navigate to="/login" replace />;
  }

  const globalStyles = `
    html { overflow: hidden; width: 100%; height: 100%; }
    body { overflow: hidden; width: 100%; height: 100%; margin: 0; padding: 0; }
    #root { overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%; -webkit-overflow-scrolling: touch; }
    * { box-sizing: border-box; }
    body, #root, #root > div { max-width: 100%; }
    .w-full { width: 100% !important; max-width: 100% !important; }
    .min-h-screen { width: 100% !important; }

    #root { scrollbar-width: thin; scrollbar-color: ${tokens.scrollThumb} ${tokens.scrollTrack}; }
    #root::-webkit-scrollbar { width: 8px; }
    #root::-webkit-scrollbar-track { background: ${tokens.scrollTrack}; border-radius: 10px; }
    #root::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldDark} 100%);
      border-radius: 10px;
      border: 2px solid ${tokens.scrollTrack};
    }
    #root::-webkit-scrollbar-thumb:hover { background: ${tokens.goldLight}; }
    html::-webkit-scrollbar, body::-webkit-scrollbar, *:not(#root)::-webkit-scrollbar { display: none; width: 0; }
    html, body, *:not(#root) { scrollbar-width: none; }
    @media (max-width: 768px) { #root::-webkit-scrollbar { width: 5px; } }

    input::placeholder { color: ${tokens.textDim}; }
    select option { background: ${tokens.surface}; color: ${tokens.text}; }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{globalStyles}</style>

      {isAdminPage ? (
        <div style={{ background: tokens.bg, minHeight: "100vh", width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "600px", height: "600px", borderRadius: "50%",
              background: `radial-gradient(circle, ${tokens.gold}08 0%, transparent 70%)`,
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "500px", height: "500px", borderRadius: "50%",
              background: `radial-gradient(circle, ${tokens.gold}06 0%, transparent 70%)`,
            }} />
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: `linear-gradient(90deg, transparent, ${tokens.gold}30, transparent)`,
            }} />
          </div>

          <NavAdmin />

          <main style={{ position: "relative", width: "100%" }}>
            <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "6rem 3rem 2.5rem" }}>
              <Outlet />
            </div>
          </main>
        </div>

      ) : (
        <div style={{ background: tokens.bg, color: tokens.text, minHeight: "100vh", width: "100%", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: "800px", height: "800px", borderRadius: "50%",
              background: `radial-gradient(circle, ${tokens.gold}08 0%, transparent 65%)`,
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "600px", height: "600px", borderRadius: "50%",
              background: `radial-gradient(circle, ${tokens.gold}05 0%, transparent 65%)`,
            }} />
          </div>

          {!isLoginPage && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
              <Header logoColor={tokens.gold} />
            </div>
          )}

          <main style={{ position: "relative", paddingTop: "8rem", paddingBottom: "4rem" }}>
            <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 3rem" }}>
              <Outlet />
            </div>
          </main>

          {!isLoginPage && <Footer />}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;