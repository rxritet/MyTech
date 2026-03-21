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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
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
    `group relative px-1 py-3 font-medium transition-all duration-300 ease-out hover:text-white active:scale-95 after:absolute after:bottom-1 after:left-0 after:right-0 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 before:absolute before:inset-x-[-0.45rem] before:inset-y-[0.32rem] before:rounded-md before:bg-primary/0 before:blur-md before:transition-all before:duration-300
     ${
       isActive
         ? "text-primary after:scale-x-100 before:bg-primary/15 [text-shadow:0_0_14px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
         : "text-muted hover:text-text hover:after:scale-x-100 hover:before:bg-primary/10"
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
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300
          backdrop-blur-md transition-all duration-300 ${
            scrolled ? "border-b border-white/10" : "border-b border-transparent"
          }
          ${
            isScrolled
              ? "surface-panel shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "surface-panel"
          }
        `}
        style={{ borderRadius: 0 }}
      >
        <div className="mx-auto flex w-full max-w-[86rem] items-center gap-4 px-3 py-2.5 sm:px-5">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="group flex shrink-0 items-center gap-2.5 active:scale-[0.985] transition-transform duration-200"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-sm font-mono font-bold text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_30%,transparent)] group-hover:-translate-y-0.5">
              rx
            </span>
            <span className="whitespace-nowrap text-sm font-semibold text-text transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 lg:text-base" style={{ textShadow: "0 0 20px color-mix(in srgb, var(--primary) 45%, transparent)" }}>
              Radmir Abraev
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="ml-auto hidden items-center gap-4 lg:flex xl:gap-6">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} className={`${desktopLinkClass} whitespace-nowrap text-[0.93rem]`}>
                {label}
              </NavLink>
            ))}
          </div>

          <div className="ml-2 hidden items-center gap-2 lg:flex">
            <Link to="/contact" className="button-primary whitespace-nowrap py-2 px-4 text-sm xl:px-5 active:scale-95">Связаться</Link>
          </div>

          {/* Mobile Burger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-[60] ml-auto -mr-1 rounded-xl p-2 text-muted transition-all duration-300 hover:bg-white/5 hover:text-text hover:scale-105 active:scale-90 lg:hidden"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span className={`block transition-transform duration-300 ${menuOpen ? "rotate-90" : "rotate-0"}`}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </span>
          </button>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] flex flex-col items-center justify-center bg-bg/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="surface-panel w-full max-w-sm rounded-[2rem] px-6 py-8">
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
