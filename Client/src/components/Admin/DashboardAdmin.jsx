import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config";
import { Navigate } from "react-router-dom";
import { 
  TrendingUp, TrendingDown, Eye, MousePointerClick, Mail, Users, 
  Sparkles, AlertCircle, Target, Activity, ArrowUpRight, 
  ArrowDownRight, Zap, Brain, BarChart3, X, 
  CheckCircle, LightbulbIcon, TrendingUpIcon, Info, Rocket,
  Flame, Crown, Star, ChevronRight
} from "lucide-react";

/**
 * 🎨 DASHBOARD ADMIN - TEKACOM ULTRA MODERNE
 * Design: Glassmorphism + Animations + Gradients + Data Viz
 * Charte: violet #a34ee5, or #fec603, violet foncé #7828a8, noir #0a0a0a
 */

const DashboardAdmin = () => {
  const token = localStorage.getItem("access");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState(7);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [showPageAnalysis, setShowPageAnalysis] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  if (!token) return <Navigate to="/login" replace />;

  const pageNameMap = {
    "/": "Accueil", "/home": "Accueil", "/services": "Services",
    "/contact": "Contact", "/contactenous": "Contact",
    "/about": "À propos", "/apropos": "À propos",
    "/portfolio": "Portfolio", "/blog": "Blog"
  };

  const getPageName = (url) => pageNameMap[url] || url.replace(/\//g, "") || "Autre";

  const getFilteredTimeseries = () => {
    if (!stats || !stats.timeseries) return [];
    const now = new Date();
    const filtered = stats.timeseries.filter(item => {
      const itemDate = new Date(item.day);
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= timeframe;
    });
    return filtered.slice(-timeframe);
  };

  const analyzePage = (pageUrl, pageActions) => {
    const pageName = getPageName(pageUrl);
    const percentOfTotal = stats.top_pages.length > 0 
      ? ((pageActions / stats.top_pages.reduce((sum, p) => sum + p.total, 0)) * 100).toFixed(1)
      : 0;
    
    return {
      title: `Analyse: ${pageName}`,
      pageName, pageUrl, actions: pageActions, percentOfTotal,
      type: "Page standard",
      role: "Doit informer et guider vers une action.",
      kpis: ["Engagement", "Navigation", "Taux de sortie"],
      performance: pageActions > 50 ? "Excellente" : pageActions > 20 ? "Bonne" : "À améliorer",
      insights: [
        `📊 ${pageActions} actions générées (${percentOfTotal}% du total)`,
        pageActions > 50 ? "⭐ Performance exceptionnelle !" : "⚠️ Potentiel d'amélioration."
      ],
      recommendations: [{
        priority: "Haute",
        action: "Analyser le contenu",
        description: `Identifiez ce qui fonctionne sur "${pageName}".`,
        impact: "Répliquez le succès"
      }]
    };
  };

  const generateInsightAnalysis = (insight) => {
    const conversionRate = stats.totals.visits > 0 
      ? ((stats.totals.clicks / stats.totals.visits) * 100).toFixed(1) : 0;

    const analyses = {
      "Optimiser les CTAs": {
        title: "Plan d'Action: Optimisation des CTAs",
        problem: `Taux de conversion visite→clic: ${conversionRate}%`,
        analysis: [
          "🎯 Les CTAs guident vos visiteurs vers l'action.",
          `📊 ${stats.totals.clicks} clics sur ${stats.totals.visits} visites`
        ],
        recommendations: [{
          priority: "Critique",
          action: "Rendre les CTAs plus visibles",
          description: "Utilisez des couleurs contrastées.",
          examples: ["Bouton orange sur fond blanc", "Taille min: 44x44px"],
          impact: "+40-60% de clics"
        }],
        nextSteps: ["1. Auditez tous vos CTAs", "2. Créez 2-3 versions"]
      },
      "Maintenir l'élan": {
        title: "Plan d'Action: Maintenir la Performance",
        problem: `Félicitations ! Taux d'engagement: ${conversionRate}%`,
        analysis: ["✅ Votre stratégie fonctionne bien"],
        recommendations: [{
          priority: "Haute",
          action: "Documenter le succès",
          description: "Créez un document de votre stratégie.",
          impact: "Cohérence assurée"
        }],
        nextSteps: ["1. Créez un tableau de bord hebdomadaire"]
      }
    };

    return analyses[insight.action] || analyses["Maintenir l'élan"];
  };

  const fetchStats = async () => {
    setError(null);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/track/stats/`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`Erreur: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#a34ee5]/30 border-t-[#fec603] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#fec603] animate-pulse" />
            </div>
          </div>
          <span className="text-gray-400 font-bold text-lg">Chargement du dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-3xl p-8 max-w-md backdrop-blur-xl">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4 mx-auto" />
          <p className="text-red-300 font-bold text-center text-lg">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const conversionRate = stats.totals.visits > 0 
    ? ((stats.totals.clicks / stats.totals.visits) * 100).toFixed(1) : 0;
  const contactRate = stats.totals.clicks > 0 
    ? ((stats.totals.contacts / stats.totals.clicks) * 100).toFixed(1) : 0;
  const mailRate = stats.totals.contacts > 0
    ? ((stats.totals.mails / stats.totals.contacts) * 100).toFixed(1) : 0;

  const getAIInsights = () => {
    const insights = [];
    if (conversionRate < 20) {
      insights.push({
        type: "warning", icon: AlertCircle, color: "orange",
        title: "Taux conversion faible",
        message: `${conversionRate}% des visiteurs cliquent. Optimisez vos CTAs.`,
        action: "Optimiser les CTAs"
      });
    } else {
      insights.push({
        type: "success", icon: TrendingUp, color: "green",
        title: "Bon engagement",
        message: `${conversionRate}% de conversion. Performance solide !`,
        action: "Maintenir l'élan"
      });
    }
    if (stats.top_pages.length > 0) {
      const topPage = stats.top_pages[0];
      insights.push({
        type: "info", icon: Target, color: "purple",
        title: "Page star",
        message: `"${getPageName(topPage.page)}" génère ${topPage.total} actions.`,
        action: "Analyser"
      });
    }
    return insights.slice(0, 3);
  };

  const aiInsights = getAIInsights();

  const mainMetrics = [
    {
      title: "Visites", value: stats.totals.visits, icon: Eye,
      gradient: "from-blue-500 via-blue-600 to-cyan-500", 
      glow: "shadow-blue-500/50", change: "+12%", up: true
    },
    {
      title: "Engagement", value: `${conversionRate}%`, icon: MousePointerClick,
      gradient: "from-[#a34ee5] via-[#7828a8] to-purple-600",
      glow: "shadow-[#a34ee5]/50", change: "+8%", up: conversionRate > 30
    },
    {
      title: "Contacts", value: stats.totals.contacts, icon: Users,
      gradient: "from-green-500 via-emerald-600 to-teal-500",
      glow: "shadow-green-500/50", change: "+24%", up: true
    },
    {
      title: "Emails", value: stats.totals.mails, icon: Mail,
      gradient: "from-[#fec603] via-orange-500 to-amber-500",
      glow: "shadow-[#fec603]/50", change: `${mailRate}%`, up: mailRate > 80
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pb-12">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-[#a34ee5]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-[#fec603]/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7828a8]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(163,78,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(163,78,229,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#a34ee5] to-[#fec603] rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#a34ee5] via-[#7828a8] to-[#fec603] rounded-3xl flex items-center justify-center shadow-2xl">
                  <Rocket className="w-8 h-8 text-white animate-bounce-slow" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fec603] to-[#a34ee5] animate-gradient">
                    Analytics Dashboard
                  </span>
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-sm font-bold text-green-300">Live</span>
                  </div>
                  <span className="text-sm text-gray-500">Mise à jour auto</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-[#a34ee5]/20 to-[#fec603]/20 backdrop-blur-2xl border border-[#a34ee5]/30 rounded-2xl px-8 py-4 shadow-2xl hover:shadow-[#a34ee5]/30 transition-all group">
              <Brain className="w-7 h-7 text-[#fec603] group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-black text-white text-lg">IA Insights</div>
                <div className="text-xs text-gray-400">Powered by Claude</div>
              </div>
              <div className="w-3 h-3 bg-[#fec603] rounded-full animate-ping"></div>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon;
              const colors = {
                orange: { bg: "from-orange-500/20 to-red-500/20", border: "border-orange-500/40", text: "text-orange-300", button: "from-orange-500 to-red-500" },
                green: { bg: "from-green-500/20 to-emerald-500/20", border: "border-green-500/40", text: "text-green-300", button: "from-green-500 to-emerald-500" },
                purple: { bg: "from-[#a34ee5]/20 to-purple-500/20", border: "border-[#a34ee5]/40", text: "text-[#a34ee5]", button: "from-[#a34ee5] to-purple-500" }
              };
              const c = colors[insight.color];
              
              return (
                <div 
                  key={idx} 
                  className={`group relative bg-gradient-to-br ${c.bg} backdrop-blur-2xl border-2 ${c.border} rounded-3xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden`}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:scale-110 transition-transform">
                        <Icon className={`w-6 h-6 ${c.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-white text-base mb-2">{insight.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setAnalysisData(generateInsightAnalysis(insight));
                        setShowAnalysisModal(true);
                      }}
                      className={`w-full bg-gradient-to-r ${c.button} hover:shadow-xl text-white font-black text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {insight.action}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const TrendIcon = metric.up ? ArrowUpRight : ArrowDownRight;
            
            return (
              <div
                key={idx}
                className={`group relative bg-[#41124f]/30 backdrop-blur-2xl border-2 border-[#a34ee5]/30 hover:border-[#a34ee5]/70 rounded-3xl p-7 transition-all duration-700 hover:scale-105 hover:shadow-2xl ${metric.glow} animate-slide-up overflow-hidden`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`}></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`relative p-4 bg-gradient-to-br ${metric.gradient} rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                      <div className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br ${metric.gradient} rounded-full animate-ping`}></div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                      metric.up ? "bg-green-500/20 text-green-300 border border-green-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      {metric.change}
                    </div>
                  </div>
                  
                  <h3 className="text-gray-400 text-xs font-black mb-3 uppercase tracking-widest">{metric.title}</h3>
                  <p className="text-5xl font-black text-white mb-5">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </p>
                  
                  <div className="flex items-end gap-1.5 h-16 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[35, 48, 42, 58, 65, 54, 70, 78, 72, 85, 90].map((h, i) => (
                      <div key={i} className={`flex-1 bg-gradient-to-t ${metric.gradient} rounded-t-lg transition-all duration-500`} style={{ height: `${h}%`, transitionDelay: `${i * 60}ms` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FUNNEL + PAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#41124f]/30 backdrop-blur-2xl border-2 border-[#a34ee5]/30 rounded-3xl p-7 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-70"></div>
                <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Funnel de Conversion</h2>
                <p className="text-sm text-gray-400 font-medium">Parcours utilisateur</p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: "Visites", value: stats.totals.visits, pct: 100, color: "from-blue-500 to-cyan-500" },
                { label: "Clics", value: stats.totals.clicks, pct: conversionRate, color: "from-[#a34ee5] to-purple-600" },
                { label: "Contacts", value: stats.totals.contacts, pct: contactRate, color: "from-green-500 to-teal-500" },
                { label: "Emails", value: stats.totals.mails, pct: mailRate, color: "from-[#fec603] to-amber-500" }
              ].map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-white">{stage.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400 font-bold">{stage.pct}%</span>
                      <span className="text-2xl font-black text-white">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-5 overflow-hidden border border-white/10">
                    <div className={`bg-gradient-to-r ${stage.color} h-full rounded-full transition-all duration-1000 shadow-2xl`} style={{ width: `${stage.pct}%`, transitionDelay: `${idx * 0.2}s` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-7 pt-7 border-t-2 border-[#a34ee5]/20">
              <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30 hover:scale-105 transition-transform">
                <p className="text-xs text-gray-400 mb-2 font-bold">Visite→Clic</p>
                <p className="text-3xl font-black text-blue-400">{conversionRate}%</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-2xl border border-purple-500/30 hover:scale-105 transition-transform">
                <p className="text-xs text-gray-400 mb-2 font-bold">Clic→Contact</p>
                <p className="text-3xl font-black text-[#a34ee5]">{contactRate}%</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/30 hover:scale-105 transition-transform">
                <p className="text-xs text-gray-400 mb-2 font-bold">Contact→Email</p>
                <p className="text-3xl font-black text-green-400">{mailRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-[#41124f]/30 backdrop-blur-2xl border-2 border-[#a34ee5]/30 rounded-3xl p-7 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl blur-xl opacity-70"></div>
                <div className="relative p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-2xl">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Top Pages</h2>
                <p className="text-sm text-gray-400 font-medium">Classement</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
              {stats.top_pages.length > 0 ? stats.top_pages.slice(0, 8).map((page, idx) => {
                const maxActions = stats.top_pages[0].total;
                const pct = (page.total / maxActions) * 100;
                
                return (
                  <div key={idx} className="group bg-white/5 backdrop-blur-sm border-2 border-[#a34ee5]/20 hover:border-[#fec603]/60 rounded-2xl p-5 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
                    onClick={() => { setSelectedPage(analyzePage(page.page, page.total)); setShowPageAnalysis(true); }}>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black text-white shadow-xl ${
                        idx === 0 ? "bg-gradient-to-br from-[#fec603] to-yellow-600" :
                        idx === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" :
                        idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                        "bg-gradient-to-br from-[#a34ee5] to-[#7828a8]"
                      }`}>
                        {idx === 0 ? <Crown className="w-6 h-6" /> : idx + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-black text-white truncate group-hover:text-[#fec603] transition-colors">{getPageName(page.page)}</h3>
                          <span className="ml-3 px-4 py-2 bg-gradient-to-r from-[#fec603] to-orange-500 rounded-xl text-sm font-black text-white shadow-lg">
                            {page.total}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20">
                          <div className="h-full bg-gradient-to-r from-[#a34ee5] to-[#fec603] rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-16">
                  <BarChart3 className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">Aucune donnée</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="bg-[#41124f]/30 backdrop-blur-2xl border-2 border-[#a34ee5]/30 rounded-3xl p-7 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-70"></div>
                <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl">
                  <Activity className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Tendance d'Activité</h2>
                <p className="text-sm text-gray-400 font-medium">
                  {timeframe === 7 ? "7 jours" : timeframe === 30 ? "30 jours" : "90 jours"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#41124f]/50 rounded-2xl p-2 border border-[#a34ee5]/20">
              {[7, 30, 90].map(days => (
                <button key={days} onClick={() => setTimeframe(days)}
                  className={`px-6 py-3 font-black rounded-xl text-sm transition-all ${
                    timeframe === days ? "bg-gradient-to-r from-[#a34ee5] to-[#7828a8] text-white shadow-xl" : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}>
                  {days}j
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-4">
            {(() => {
              const filteredData = getFilteredTimeseries();
              if (filteredData.length === 0) {
                return (
                  <div className="col-span-full text-center py-16">
                    <Activity className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Aucune donnée</p>
                  </div>
                );
              }
              
              const maxCount = Math.max(...filteredData.map(d => d.count));
              
              return filteredData.slice(-14).map((item, idx) => {
                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="relative w-full h-40 bg-white/5 rounded-2xl overflow-hidden group cursor-pointer border-2 border-white/10 hover:border-[#fec603]/60 transition-all">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-emerald-500 to-green-400 rounded-t-2xl transition-all duration-700" style={{ height: `${height}%` }}></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm rounded-2xl">
                        <span className="bg-white text-gray-900 font-black text-sm px-4 py-2 rounded-xl shadow-2xl">{item.count}</span>
                      </div>
                      {item.count > maxCount * 0.8 && <Flame className="absolute top-2 right-2 w-5 h-5 text-orange-400 animate-bounce" />}
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(item.day).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showAnalysisModal && analysisData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={() => setShowAnalysisModal(false)}>
          <div className="bg-[#0a0a0a] border-2 border-[#a34ee5]/40 w-full max-w-4xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-7 border-b-2 border-[#a34ee5]/30 flex items-center justify-between bg-gradient-to-r from-[#a34ee5]/20 to-[#fec603]/20">
              <h2 className="text-3xl font-black text-white">{analysisData.title}</h2>
              <button onClick={() => setShowAnalysisModal(false)} className="p-3 bg-[#41124f]/60 hover:bg-[#41124f] rounded-2xl transition-all">
                <X className="w-7 h-7 text-white" />
              </button>
            </div>
            <div className="p-7 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl">
                <h3 className="font-black text-blue-300 text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Situation
                </h3>
                <p className="text-gray-300 leading-relaxed">{analysisData.problem}</p>
              </div>
              {analysisData.analysis && analysisData.analysis.map((point, idx) => (
                <div key={idx} className="p-5 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-2xl">
                  <p className="text-gray-300">{point}</p>
                </div>
              ))}
              {analysisData.recommendations && analysisData.recommendations.map((rec, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-[#a34ee5]/10 to-[#fec603]/10 border-2 border-[#a34ee5]/30 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-white text-lg">{rec.action}</h4>
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-500/30 text-orange-300 border border-orange-500/50">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{rec.description}</p>
                  {rec.examples && (
                    <div className="p-4 bg-[#41124f]/40 rounded-xl mb-3">
                      <p className="text-sm font-bold text-gray-400 mb-2">Exemples:</p>
                      <ul className="space-y-1">
                        {rec.examples.map((ex, i) => (
                          <li key={i} className="text-sm text-gray-400 flex gap-2">
                            <span className="text-[#fec603]">•</span><span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="font-bold text-green-300 text-sm">Impact: {rec.impact}</span>
                  </div>
                </div>
              ))}
              {analysisData.nextSteps && (
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl">
                  <h3 className="font-black text-purple-300 text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Plan d'action
                  </h3>
                  <ul className="space-y-3">
                    {analysisData.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-xl font-black flex-shrink-0">{idx + 1}</span>
                        <span className="text-gray-300 font-medium">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPageAnalysis && selectedPage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={() => setShowPageAnalysis(false)}>
          <div className="bg-[#0a0a0a] border-2 border-[#a34ee5]/40 w-full max-w-4xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-7 border-b-2 border-[#a34ee5]/30 flex items-center justify-between bg-gradient-to-r from-[#a34ee5]/20 to-[#fec603]/20">
              <h2 className="text-3xl font-black text-white">{selectedPage.title}</h2>
              <button onClick={() => setShowPageAnalysis(false)} className="p-3 bg-[#41124f]/60 hover:bg-[#41124f] rounded-2xl transition-all">
                <X className="w-7 h-7 text-white" />
              </button>
            </div>
            <div className="p-7 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/40 rounded-2xl text-center">
                  <p className="text-sm text-blue-300 mb-2 font-bold">Actions</p>
                  <p className="text-4xl font-black text-white">{selectedPage.actions}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/40 rounded-2xl text-center">
                  <p className="text-sm text-purple-300 mb-2 font-bold">% du total</p>
                  <p className="text-4xl font-black text-white">{selectedPage.percentOfTotal}%</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/40 rounded-2xl text-center">
                  <p className="text-sm text-green-300 mb-2 font-bold">Performance</p>
                  <p className="text-2xl font-black text-white">{selectedPage.performance}</p>
                </div>
              </div>

              <div className="p-6 bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl">
                <h3 className="font-black text-purple-300 text-lg mb-3">🎯 Rôle</h3>
                <p className="text-gray-300 mb-2"><strong>Type:</strong> {selectedPage.type}</p>
                <p className="text-gray-300">{selectedPage.role}</p>
              </div>

              <div>
                <h3 className="font-black text-white text-lg mb-3">📊 KPIs</h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedPage.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-xl text-center">
                      <p className="font-bold text-gray-300">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPage.insights && (
                <div className="space-y-3">
                  <h3 className="font-black text-white text-lg">💡 Insights</h3>
                  {selectedPage.insights.map((insight, idx) => (
                    <div key={idx} className="p-5 bg-[#41124f]/30 border border-[#a34ee5]/20 rounded-2xl">
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(30px, -30px) rotate(5deg); } 66% { transform: translate(-20px, 20px) rotate(-5deg); } }
        @keyframes float-delayed { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(-30px, 30px) rotate(-5deg); } 66% { transform: translate(20px, -20px) rotate(5deg); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-shine { animation: shine 2s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(163, 78, 229, 0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #a34ee5, #fec603); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #fec603, #a34ee5); }
      `}</style>
    </div>
  );
};

export default DashboardAdmin;