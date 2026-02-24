// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://tekacom.onrender.com"; // ton URL backend Render

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,

  // PARTENAIRES
  API_PARTNER_LIST: `${BASE_URL}/api/partners/`,
  API_PARTNER_CREATE: `${BASE_URL}/api/partners/`, // ✅ POST ici
  API_PARTNER_UPDATE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ PUT/PATCH
  API_PARTNER_DELETE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ DELETE
  API_PARTNER_HISTORY: (id) => `${BASE_URL}/api/partners/${id}/history/`, // 🔹 nouvel endpoint


    // 📰 NEWS CRUD
  API_NEWS_LIST: `${BASE_URL}/api/news/`,
  API_NEWS_CREATE: `${BASE_URL}/api/news/`,
  API_NEWS_UPDATE: (id) => `${BASE_URL}/api/news/${id}/`,
  API_NEWS_DELETE: (id) => `${BASE_URL}/api/news/${id}/`,


    // Valeurs
  API_VALEUR_LIST: `${BASE_URL}/api/values/`,
  API_VALEUR_CREATE: `${BASE_URL}/api/values/`,
  API_VALEUR_UPDATE: (id) => `${BASE_URL}/api/values/${id}/`,
  API_VALEUR_DELETE: (id) => `${BASE_URL}/api/values/${id}/`,


  // 👥 TEAM
  API_TEAM_LIST: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_CREATE: `${BASE_URL}/api/equipe-members/`,
  API_TEAM_UPDATE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,
  API_TEAM_DELETE: (id) => `${BASE_URL}/api/equipe-members/${id}/`,


    // PROFESSIONAL AREAS
  API_PRO_AREA_LIST: `${BASE_URL}/api/professional-areas/`,
  API_PRO_AREA_CREATE: `${BASE_URL}/api/professional-areas/`,
  API_PRO_AREA_UPDATE: (id) => `${BASE_URL}/api/professional-areas/${id}/`,
  API_PRO_AREA_DELETE: (id) => `${BASE_URL}/api/professional-areas/${id}/`,

  // 🐟 SARDINE RECIPES CRUD
API_SARDINE_LIST: `${BASE_URL}/api/sardine-recipes/`,
API_SARDINE_CREATE: `${BASE_URL}/api/sardine-recipes/`,
API_SARDINE_UPDATE: (id) => `${BASE_URL}/api/sardine-recipes/${id}/`,
API_SARDINE_DELETE: (id) => `${BASE_URL}/api/sardine-recipes/${id}/`,


 // THON RECIPES
  API_THON_LIST: `${BASE_URL}/api/thon-recipes/`,
  API_THON_CREATE: `${BASE_URL}/api/thon-recipes/`,
  API_THON_UPDATE: (id) => `${BASE_URL}/api/thon-recipes/${id}/`,
  API_THON_DELETE: (id) => `${BASE_URL}/api/thon-recipes/${id}/`,

    // 🐟 SARDINE PRODUCTS CRUD (nouveau)
  API_SARDINE_PRODUCT_LIST: `${BASE_URL}/api/sardine-products/`,
  API_SARDINE_PRODUCT_CREATE: `${BASE_URL}/api/sardine-products/`,
  API_SARDINE_PRODUCT_UPDATE: (id) => `${BASE_URL}/api/sardine-products/${id}/`,
  API_SARDINE_PRODUCT_DELETE: (id) => `${BASE_URL}/api/sardine-products/${id}/`,


API_THON_PRODUCT_LIST: `${BASE_URL}/api/thon-products/`,
API_THON_PRODUCT_CREATE: `${BASE_URL}/api/thon-products/`,
API_THON_PRODUCT_UPDATE: (id) => `${BASE_URL}/api/thon-products/${id}/`,
API_THON_PRODUCT_DELETE: (id) => `${BASE_URL}/api/thon-products/${id}/`,

 // CONTACT
  API_CONTACT_LIST: `${BASE_URL}/api/contacts/`,
  API_CONTACT_CREATE: `${BASE_URL}/api/contacts/`,
  API_CONTACT_UPDATE: (id) => `${BASE_URL}/api/contacts/${id}/`,
  API_CONTACT_DELETE: (id) => `${BASE_URL}/api/contacts/${id}/`,

  API_CONTACT_REPLY: (id) => `${BASE_URL}/api/contacts/${id}/reply/`,

  


// Community
API_COMMUNITY_LIST: `${BASE_URL}/api/community/`,
API_COMMUNITY_CREATE: `${BASE_URL}/api/community/`,
API_COMMUNITY_UPDATE: (id) => `${BASE_URL}/api/community/${id}/`,
API_COMMUNITY_DELETE: (id) => `${BASE_URL}/api/community/${id}/`,
API_COMMUNITY_REPLY: (id) => `${BASE_URL}/api/community/${id}/reply/`,


  // 📰 NEWSLETTER (nouveaux ENDPOINTS)
  API_NEWSLETTER_LIST: `${BASE_URL}/api/newsletter/`,
  API_NEWSLETTER_CREATE: `${BASE_URL}/api/newsletter/`,
  API_NEWSLETTER_UPDATE: (id) => `${BASE_URL}/api/newsletter/${id}/`,
  API_NEWSLETTER_DELETE: (id) => `${BASE_URL}/api/newsletter/${id}/`,
  API_NEWSLETTER_REPLY: (id) => `${BASE_URL}/api/newsletter/${id}/reply/`,

 // 🔹 NOUVEAU : MISSIONS
  API_MISSION_LIST: `${BASE_URL}/api/missions/`,
  API_MISSION_CREATE: `${BASE_URL}/api/missions/`,
  API_MISSION_UPDATE: (id) => `${BASE_URL}/api/missions/${id}/`,
  API_MISSION_DELETE: (id) => `${BASE_URL}/api/missions/${id}/`,


// 🛠️ SERVICES
API_SERVICE_LIST: `${BASE_URL}/api/services/`,
API_SERVICE_CREATE: `${BASE_URL}/api/services/`,
API_SERVICE_UPDATE: (id) => `${BASE_URL}/api/services/${id}/`,
API_SERVICE_DELETE: (id) => `${BASE_URL}/api/services/${id}/`,

 // 🎨 PORTFOLIO  ✅ NOUVEAU
  // =======================
  API_PORTFOLIO_LIST: `${BASE_URL}/api/portfolio/`,
  API_PORTFOLIO_CREATE: `${BASE_URL}/api/portfolio/`,
  API_PORTFOLIO_UPDATE: (id) => `${BASE_URL}/api/portfolio/${id}/`,
  API_PORTFOLIO_DELETE: (id) => `${BASE_URL}/api/portfolio/${id}/`,



API_HOME_LIST: `${BASE_URL}/api/home/`,
API_HOME_LATEST: `${BASE_URL}/api/home/latest/`,
API_HOME_CREATE: `${BASE_URL}/api/home/`,
API_HOME_UPDATE: (id) => `${BASE_URL}/api/home/${id}/`,
API_HOME_DELETE: (id) => `${BASE_URL}/api/home/${id}/`,
API_HOME_FULL: `${BASE_URL}/api/home-full/`, // 🏠 Home full


  // Ajoute à ton CONFIG
API_TRACK: `${BASE_URL}/api/track/`, // 🔹 endpoint Django pour tracker les actions

// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dwuyq2eoz",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




