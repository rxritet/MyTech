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
    `font-medium transition-colors hover:text-white px-1 py-4 border-b-2
     ${
       isActive
         ? "text-primary border-primary"
         : "text-gray-400 border-transparent hover:border-primary/50"
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
              ? "backdrop-blur-[16px] bg-bg/80 border-b border-[rgba(249,115,22,0.1)] py-0"
              : "bg-transparent border-transparent py-1"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 group py-3"
          >
            <span className="font-mono text-xl font-bold text-white group-hover:text-primary transition-colors">
              rxritet
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={to} to={to} className={desktopLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors z-[60] relative"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] bg-bg/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start gap-2 w-full max-w-sm px-6">
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
          <div className="mt-8 w-full">
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-center py-4 bg-primary hover:bg-orange-600 rounded-xl text-lg font-bold text-bg transition-colors"
            >
              Связаться со мной
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
