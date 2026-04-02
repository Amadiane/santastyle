import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Users, Award, FileText, Calendar, Palette, ChevronDown, ArrowRight, ShoppingBag } from "lucide-react";
import Logo from "./Logo";

const Navlinks = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
    { title: "Accueil",    path: "/" },
    {
      title: "À propos",
      path: "/nosMissions",
      hasDropdown: true,
      subItems: [
        { title: "Qui sommes-nous", path: "/nosMissions",  icon: Users },
        { title: "Notre équipe",    path: "/notreEquipe",  icon: Users },
      ],
    },
    { title: "Services",    path: "/services" },
    { title: "Portfolio",   path: "/portfolio" },
    { title: "Partenaires", path: "/partner" },
    { title: "Contact",     path: "/contacternous" },
  ];

  // Styles partagés
  const navBtnBase = (active) => `
    relative group px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl
    transition-all duration-300 overflow-hidden border
    ${active
      ? "text-white bg-gradient-to-r from-[#C9A84C] to-[#8A6A20] border-[#C9A84C]/50 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
      : "text-[#5C3D00] hover:text-[#2C1A00] bg-[#EDE5D0]/60 hover:bg-[#E4D9C0] border-transparent hover:border-[#D4C08A]"
    }
  `;

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
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 z-50">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F7F3EC] rotate-45 border-l border-t border-[#D4C08A]/60" />
                      <div className="relative bg-[#F7F3EC]/98 rounded-2xl border border-[#D4C08A]/60 shadow-xl shadow-[#C9A84C]/10 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#F0D080] to-[#C9A84C]" />
                        <div className="p-2">
                          {item.subItems.map((sub, i) => {
                            const Icon = sub.icon;
                            return (
                              <NavLink key={i} to={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group/item flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-[#EDE5D0]">
                                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 group-hover/item:bg-[#C9A84C]/20 flex items-center justify-center transition-all duration-200">
                                  <Icon size={15} className="text-[#C9A84C]" />
                                </div>
                                <span className="text-sm font-semibold text-[#5C3D00] group-hover/item:text-[#2C1A00] flex-1">{sub.title}</span>
                                <ArrowRight size={13} className="text-[#C9A84C] opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-200" />
                              </NavLink>
                            );
                          })}
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

          {/* ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Bouton Boutique — CTA principal */}
            <NavLink to="/boutique"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border"
              style={({ isActive }) => ({
                background: isActive
                  ? "linear-gradient(135deg, #5C3D00, #C9A84C)"
                  : "linear-gradient(135deg, #C9A84C, #8A6A20)",
                color: "#fff",
                border: "1px solid #C9A84C",
                boxShadow: "0 2px 12px rgba(201,168,76,0.30)",
              })}>
              <ShoppingBag size={14} />
              Boutique
            </NavLink>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex p-2.5 rounded-xl bg-[#EDE5D0] hover:bg-[#E4D9C0] border border-[#D4C08A]/60 hover:border-[#C9A84C]/60 transition-all duration-300 group">
              <Search size={16} className="text-[#8A6A20] group-hover:text-[#5C3D00] transition-colors duration-300" />
            </button>

            {/* Mobile menu toggle */}
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
            <div className="absolute left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

            {/* Boutique en premier sur mobile */}
            <NavLink to="/boutique" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#8A6A20] text-white font-bold text-sm mb-2">
              <ShoppingBag size={16} />
              Boutique Santa'Style
            </NavLink>

            {navItems.map((item, idx) => (
              <div key={idx}>
                <NavLink to={item.path}
                  onClick={() => !item.subItems && setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5C3D00] hover:bg-[#EDE5D0] hover:text-[#2C1A00] transition-all duration-200 font-semibold text-sm">
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
              <h3 className="text-sm font-bold text-[#5C3D00] uppercase tracking-wider">Rechercher</h3>
              <button onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-[#EDE5D0] rounded-lg transition-colors">
                <X size={18} className="text-[#8A6A20]" />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[#D4C08A] rounded-xl focus-within:border-[#C9A84C] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] transition-all">
              <Search size={16} className="text-[#C9A84C] shrink-0" />
              <input
                autoFocus
                placeholder="Rechercher..."
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    navigate(`/boutique?q=${e.target.value}`);
                    setSearchOpen(false);
                  }
                }}
                className="flex-1 bg-transparent outline-none text-[#2C1A00] placeholder-[#B8A070] text-sm font-medium"
              />
            </div>
            <div className="mt-3 text-xs text-[#B8A070] text-center">Appuyez sur Entrée pour chercher dans la boutique</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;