import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search, Menu, X, Users, ChevronDown, ArrowRight,
  ShoppingBag, Sparkles, Phone, Info, Tag
} from "lucide-react";
import Logo from "./Logo";

const Navlinks = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const dropdownRef     = useRef(null);
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onClick  = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const onEnter = (i) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(i);
  };
  const onLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 400);
  };

  const navItems = [
    {
      title: "Boutique",
      path: "/boutique",
      icon: ShoppingBag,
      hasDropdown: true,
      subItems: [
        { title: "Tous les articles",  path: "/boutique",               icon: ShoppingBag },
        { title: "Nouveautés",         path: "/boutique?filtre=nouveau", icon: Sparkles    },
        { title: "Hommes",             path: "/boutique?cat=hommes",     icon: Users       },
        { title: "Femmes",             path: "/boutique?cat=femmes",     icon: Users       },
        { title: "Enfants",            path: "/boutique?cat=enfants",    icon: Users       },
      ],
    },
    {
      title: "À propos",
      path: "/nosMissions",
      icon: Info,
      hasDropdown: true,
      subItems: [
        { title: "Qui sommes-nous", path: "/nosMissions", icon: Info  },
        { title: "Notre équipe",    path: "/notreEquipe", icon: Users },
      ],
    },
    { title: "Contact", path: "/contacternous", icon: Phone },
  ];

  const navBtnBase = (active) => [
    "relative group px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl",
    "transition-all duration-300 overflow-hidden border",
    active
      ? "text-white bg-gradient-to-r from-[#C9A84C] to-[#8A6A20] border-[#C9A84C]/50 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
      : "text-[#5C3D00] hover:text-[#2C1A00] bg-[#EDE5D0]/60 hover:bg-[#E4D9C0] border-transparent hover:border-[#D4C08A]",
  ].join(" ");

  const handleSearch = (q) => {
    navigate(`/boutique?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const ouvrirWA = () => {
    const msg = encodeURIComponent(
      `Bonjour Santa'Style ! 👋\nJe souhaite avoir des informations sur vos articles.`
    );
    window.open(`https://wa.me/224620762508?text=${msg}`, "_blank");
  };

  return (
    <>
      <div className={`max-w-[1600px] mx-auto px-6 lg:px-12 transition-all duration-500 ${scrolled ? "py-2" : "py-3"}`}>
        <div className={`
          relative flex items-center justify-between px-6 rounded-2xl transition-all duration-500
          ${scrolled
            ? "h-14 bg-[#F7F3EC]/95 backdrop-blur-xl border border-[#D4C08A]/60 shadow-[0_4px_24px_rgba(201,168,76,0.15)]"
            : "h-16 bg-[#F7F3EC]/90 backdrop-blur-lg border border-[#D4C08A]/40 shadow-[0_2px_16px_rgba(201,168,76,0.10)]"
          }
        `}>
          {/* Ligne dorée top */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent rounded-full" />

          {/* LOGO */}
          <Logo scrolled={scrolled} />

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item, idx) => {
              if (item.hasDropdown) return (
                <div key={idx} className="relative"
                  onMouseEnter={() => onEnter(idx)}
                  onMouseLeave={onLeave}>
                  <button className={navBtnBase(activeDropdown === idx) + " flex items-center gap-1.5"}>
                    <span className="relative">{item.title}</span>
                    <ChevronDown size={13} className={`transition-transform duration-300 ${activeDropdown === idx ? "rotate-180 text-[#C9A84C]" : "text-[#8A6A20]"}`} />
                  </button>

                  {activeDropdown === idx && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 z-50">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F7F3EC] rotate-45 border-l border-t border-[#D4C08A]/60" />
                      <div className="relative bg-[#F7F3EC]/98 rounded-2xl border border-[#D4C08A]/60 shadow-xl shadow-[#C9A84C]/10 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#F0D080] to-[#C9A84C]" />
                        <div className="p-2">
                          {item.subItems.map((sub, i) => {
                            const Icon = sub.icon;
                            return (
                              <NavLink key={i} to={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group/item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#EDE5D0]">
                                <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/10 group-hover/item:bg-[#C9A84C]/20 flex items-center justify-center transition-all duration-200 shrink-0">
                                  <Icon size={14} className="text-[#C9A84C]" />
                                </div>
                                <span className="text-sm font-semibold text-[#5C3D00] group-hover/item:text-[#2C1A00] flex-1">{sub.title}</span>
                                <ArrowRight size={12} className="text-[#C9A84C] opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-200" />
                              </NavLink>
                            );
                          })}
                        </div>
                        {/* Footer dropdown — lien WhatsApp */}
                        <div className="px-3 py-2 border-t border-[#D4C08A]/40 bg-[#EDE5D0]/50">
                          <button onClick={ouvrirWA}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#1A6B3C] hover:bg-[#D4EDDF] transition-all duration-200">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A6B3C">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            Commander sur WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );

              return (
                <NavLink key={idx} to={item.path}
                  className={({ isActive }) => navBtnBase(isActive)}>
                  <span className="relative">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* ACTIONS droite */}
          <div className="flex items-center gap-2">

            {/* Bouton WhatsApp — CTA secondaire */}
            <button
              onClick={ouvrirWA}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#1A6B3C] text-xs font-bold uppercase tracking-wider hover:bg-[#25D366]/20 transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A6B3C">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </button>

            {/* Bouton Boutique — CTA principal */}
            <NavLink to="/boutique"
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px",
                fontSize: "12px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.05em",
                textDecoration: "none", transition: "all 0.3s",
                background: isActive
                  ? "linear-gradient(135deg, #5C3D00, #C9A84C)"
                  : "linear-gradient(135deg, #C9A84C, #8A6A20)",
                color: "#fff",
                border: "1px solid #C9A84C",
                boxShadow: "0 2px 12px rgba(201,168,76,0.35)",
              })}
              className="hidden sm:flex">
              <ShoppingBag size={14} />
              Boutique
            </NavLink>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex p-2.5 rounded-xl bg-[#EDE5D0] hover:bg-[#E4D9C0] border border-[#D4C08A]/60 hover:border-[#C9A84C]/60 transition-all duration-300 group">
              <Search size={16} className="text-[#8A6A20] group-hover:text-[#5C3D00] transition-colors duration-300" />
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#EDE5D0] hover:bg-[#E4D9C0] border border-[#D4C08A]/60 transition-all duration-300">
              {mobileMenuOpen
                ? <X    size={18} className="text-[#5C3D00]" />
                : <Menu size={18} className="text-[#5C3D00]" />
              }
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pb-4 pt-3 space-y-1 px-3 rounded-2xl bg-[#F7F3EC]/98 border border-[#D4C08A]/60 shadow-xl">

            {/* Boutique — premier et doré */}
            <NavLink to="/boutique" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm mb-1"
              style={{ background: "linear-gradient(135deg, #C9A84C, #8A6A20)", color: "#fff" }}>
              <ShoppingBag size={16} />
              Boutique Santa'Style
            </NavLink>

            {/* WhatsApp mobile */}
            <button onClick={() => { ouvrirWA(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#1A6B3C] bg-[#D4EDDF] mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1A6B3C">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L.057 23.643a.5.5 0 0 0 .61.61l5.788-1.471A11.941 11.941 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.791-.57-5.33-1.548l-.383-.232-3.968 1.01 1.01-3.968-.232-.383A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Commander sur WhatsApp
            </button>

            {/* Séparateur */}
            <div className="h-px bg-[#D4C08A]/40 my-2" />

            {navItems.map((item, idx) => (
              <div key={idx}>
                <NavLink to={item.path}
                  onClick={() => !item.subItems && setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5C3D00] hover:bg-[#EDE5D0] hover:text-[#2C1A00] transition-all duration-200 font-semibold text-sm">
                  {item.icon && <item.icon size={15} className="text-[#C9A84C]" />}
                  {item.title}
                </NavLink>
                {item.subItems && (
                  <div className="ml-8 pl-3 border-l-2 border-[#D4C08A]/50 space-y-0.5 mt-0.5 mb-1">
                    {item.subItems.map((sub, i) => (
                      <NavLink key={i} to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#8A6A20] hover:text-[#5C3D00] hover:bg-[#EDE5D0] transition-all duration-200 text-sm">
                        <ArrowRight size={11} className="text-[#C9A84C]" />
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#2C1A00]/80 backdrop-blur-xl flex items-start justify-center pt-28 px-4 z-[101]"
          onClick={() => setSearchOpen(false)}>
          <div className="relative w-full max-w-xl bg-[#F7F3EC] rounded-2xl p-6 border border-[#D4C08A] shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#F0D080] to-[#C9A84C] rounded-t-2xl" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#5C3D00] uppercase tracking-wider">
                Rechercher un article
              </h3>
              <button onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-[#EDE5D0] rounded-lg transition-colors">
                <X size={18} className="text-[#8A6A20]" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#D4C08A] rounded-xl focus-within:border-[#C9A84C] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] transition-all">
              <Search size={16} className="text-[#C9A84C] shrink-0" />
              <input
                autoFocus
                placeholder="Ex: robe, t-shirt, veste..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) handleSearch(searchQuery.trim()); }}
                className="flex-1 bg-transparent outline-none text-[#2C1A00] placeholder-[#B8A070] text-sm font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-[#B8A070] hover:text-[#5C3D00]">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Suggestions rapides */}
            <div className="mt-4">
              <div className="text-xs text-[#B8A070] mb-2 font-medium">Recherches populaires</div>
              <div className="flex gap-2 flex-wrap">
                {["Robe", "T-shirt", "Veste", "Pantalon", "Accessoires"].map(s => (
                  <button key={s} onClick={() => handleSearch(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EDE5D0] text-[#5C3D00] hover:bg-[#C9A84C] hover:text-white transition-all duration-200 border border-[#D4C08A]">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 text-xs text-[#B8A070] text-center">
              Appuyez sur Entrée ou cliquez une suggestion
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;