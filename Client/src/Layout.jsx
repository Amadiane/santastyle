import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { trackAction } from "./utils/tracker";

/**
 * 🎨 APP TEKACOM - COMPLET ET OPTIMISÉ
 * ✅ Scroll unique et stylé
 * ✅ Pas de débordement
 * ✅ Mobile-friendly
 * ✅ Scroll to top automatique à chaque navigation
 */

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  /* =============================
     🎯 SCROLL TO TOP ON ROUTE CHANGE
     CRUCIAL: Scroll #root car c'est lui qui a overflow-y: auto
  ============================== */
  React.useEffect(() => {
    // Trouve l'élément #root qui a le scroll
    const rootElement = document.getElementById('root');
    
    if (rootElement) {
      // Scroll #root (pas window !)
      rootElement.scrollTop = 0;
    }
    
    // Fallback pour window (au cas où)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Double vérification après render
    const timer = setTimeout(() => {
      if (rootElement) {
        rootElement.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]); // ← CRUCIAL: écoute les changements d'URL

  /* =============================
     TRACKING
  ============================== */
  React.useEffect(() => {
    trackAction({
      action_type: "visit",
      page: location.pathname,
    });
  }, [location.pathname]);

  React.useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const label = target.id || target.innerText || target.alt || "unknown";

      trackAction({
        action_type: "click",
        page: location.pathname,
        label,
        tag: target.tagName,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  /* =============================
     ROUTES
  ============================== */
  const adminPaths = [
    "/newsPost", "/listeContacts", "/listeRejoindre",
    "/listePostulantsCommunity", "/listPartners",
    "/listeAbonnement", "/platformPost", "/valeurPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost",
    "/activitiesPost", "/homePost", "/partnerPost",
    "/servicePost", "/portfolioPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) {
    return <Navigate to="/login" replace />;
  }

  /* =============================
     🎨 GLOBAL STYLES - SCROLL UNIQUE
  ============================== */
  const globalStyles = `
    /* === STRUCTURE DE BASE === */
    html {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    body {
      overflow: hidden;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    #root {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      -webkit-overflow-scrolling: touch;
    }

    /* === EMPÊCHE DÉBORDEMENT === */
    * {
      box-sizing: border-box;
    }

    body, #root, #root > div {
      max-width: 100%;
    }

    /* Force toutes les classes Tailwind */
    .w-full {
      width: 100% !important;
      max-width: 100% !important;
    }

    .min-h-screen {
      width: 100% !important;
    }

    /* === SCROLLBAR TEKACOM === */
    
    /* Firefox */
    #root {
      scrollbar-width: thin;
      scrollbar-color: #a34ee5 #0a0a0a;
    }

    /* Chrome, Edge, Safari */
    #root::-webkit-scrollbar {
      width: 10px;
    }

    #root::-webkit-scrollbar-track {
      background: #0a0a0a;
      border-radius: 10px;
    }

    #root::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #a34ee5 0%, #7828a8 100%);
      border-radius: 10px;
      border: 2px solid #0a0a0a;
    }

    #root::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #fec603 0%, #a34ee5 100%);
      box-shadow: 0 0 10px rgba(163, 78, 229, 0.5);
    }

    /* === CACHE LES AUTRES SCROLLBARS === */
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    *:not(#root)::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    html,
    body,
    *:not(#root) {
      scrollbar-width: none;
    }

    /* === MOBILE === */
    @media (max-width: 768px) {
      #root::-webkit-scrollbar {
        width: 6px;
      }
    }
  `;

  return (
    <I18nextProvider i18n={i18n}>
      <style>{globalStyles}</style>

      {isAdminPage ? (
        /* ==================================================
           ADMIN LAYOUT
        ================================================== */
        <div className="w-full min-h-screen bg-[#0a0a0a] relative">
          {/* Background admin */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a34ee5]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fec603]/5 rounded-full blur-3xl" />
          </div>

          <NavAdmin />

          <main className="relative w-full">
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-12 pt-24 pb-10">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        /* ==================================================
           PUBLIC LAYOUT
        ================================================== */
        <div className="w-full min-h-screen bg-[#0a0a0a] text-gray-100 relative">
          {/* Background décoratif */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a34ee5]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7828a8]/20 rounded-full blur-3xl" />
          </div>

          {/* Header FIXED */}
          {!isLoginPage && (
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header logoColor="#a34ee5" />
            </div>
          )}

          {/* MAIN */}
          <main className="relative pt-32 pb-16">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          {!isLoginPage && (
            <div className="relative z-10">
              <Footer />
            </div>
          )}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;