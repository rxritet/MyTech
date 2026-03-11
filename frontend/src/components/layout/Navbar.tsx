import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Главная", to: "/" },
  { label: "Проекты", to: "/projects" },
  { label: "Обо мне", to: "/about" },
  { label: "Работа", to: "/terms" },
  { label: "Контакты", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    `relative font-medium transition-colors hover:text-white px-1 py-4 after:absolute after:left-0 after:right-0 after:bottom-2 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform
     ${
       isActive
         ? "text-primary after:scale-x-100"
         : "text-gray-400 hover:text-white hover:after:scale-x-100"
     }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-3xl sm:text-4xl font-bold transition-colors py-4 px-2 border-l-4
     ${
       isActive
         ? "text-primary border-primary"
         : "text-gray-400 border-transparent hover:text-white hover:border-primary/50"
     }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            isScrolled
              ? "backdrop-blur-[18px] bg-bg/72 border-b border-[rgba(249,115,22,0.12)] py-0 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
              : "bg-transparent border-transparent py-2"
          }
        `}
      >
        <div className="max-w-[86rem] mx-auto px-3 md:px-5 flex items-center gap-6">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 group py-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-mono font-bold text-primary transition-colors group-hover:bg-primary/15">
              rx
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-mono text-lg font-bold text-white group-hover:text-primary transition-colors">rxritet</span>
              <span className="text-[11px] uppercase tracking-[0.26em] text-gray-500">mytech portfolio</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 ml-auto justify-end">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} className={desktopLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Burger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden ml-auto p-2 -mr-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors z-[60] relative"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] bg-bg/90 backdrop-blur-xl md:hidden flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="surface-panel flex flex-col items-start gap-2 w-full max-w-sm rounded-[2rem] px-6 py-8">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
