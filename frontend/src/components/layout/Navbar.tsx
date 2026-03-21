import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Главная", to: "/" },
  { label: "Проекты", to: "/projects" },
  { label: "Обо мне", to: "/about" },
  { label: "Работа", to: "/terms" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setIsScrolled(window.scrollY > 80);
    };

    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "text-primary bg-primary/10"
         : "text-white/50 hover:text-white hover:bg-white/5"
     }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group block text-3xl sm:text-4xl font-bold transition-all duration-300 py-4 px-2 border-l-4 animate-fade-in-up active:scale-[0.985]
     ${
       isActive
         ? "text-primary border-primary [text-shadow:0_0_16px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
         : "text-muted border-transparent hover:text-text hover:border-primary/50 hover:translate-x-1"
     }`;

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2
          px-2 py-1.5
          rounded-2xl
          border transition-all duration-300
          backdrop-blur-xl
          ${scrolled
            ? "bg-white/5 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-white/[0.03] border-white/8 shadow-none"
          }
          ${isScrolled ? "ring-1 ring-white/5" : ""}
        `}
        style={{ borderRadius: "1rem" }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 pl-1 pr-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-sm font-mono font-bold text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_30%,transparent)] group-hover:-translate-y-0.5">
            rx
          </span>
          <span className="whitespace-nowrap text-sm font-semibold text-text transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 lg:text-base" style={{ textShadow: "0 0 20px color-mix(in srgb, var(--primary) 45%, transparent)" }}>
            Radmir Abraev
          </span>
        </Link>

        {/* Divider */}
        <span className="h-5 w-px bg-white/10" aria-hidden="true" />

        {/* Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to} className={desktopLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <span className="hidden h-5 w-px bg-white/10 lg:block" aria-hidden="true" />

        {/* CTA */}
        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="ml-1 rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            Связаться
          </Link>
        </div>

        {/* Mobile Burger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-1 rounded-xl p-1.5 text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-90 lg:hidden"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          <span className={`block transition-transform duration-300 ${menuOpen ? "rotate-90" : "rotate-0"}`}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </span>
        </button>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] flex flex-col items-center justify-center bg-bg/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-sm rounded-2xl px-6 py-8">
          <div className="mb-6 flex items-center justify-end">
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="button-primary py-2 px-5 text-sm">Связаться</Link>
          </div>

          <div className="flex flex-col items-start gap-1">
            {NAV_LINKS.map(({ label, to }, index) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass}
                style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
              >
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
