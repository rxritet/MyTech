import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Проекты", href: "#projects" },
  { label: "Обо мне", href: "#about" },
  { label: "Условия", href: "#services" },
  { label: "Контакт", href: "#contact" },
];

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

interface NavbarProps {
  /** Active section id (without `#`), e.g. "projects" */
  activeSection?: string;
}

export default function Navbar({ activeSection }: Readonly<NavbarProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    scrollTo(href);
    setMenuOpen(false);
  };

  const isActive = (href: string) => activeSection === href.replace("#", "");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "backdrop-blur-md bg-gray-950/80 border-b border-gray-800"
          : "bg-transparent"
      }`}
      aria-label="Основная навигация"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* ── Logo ─────────────────────────────────────── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold tracking-tight cursor-pointer bg-transparent border-0 p-0 text-white"
          aria-label="Наверх"
        >
          {"My"}<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tech</span>
        </button>

        {/* ── Desktop navigation ───────────────────────── */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => handleNavClick(href)}
                className={`text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                  isActive(href)
                    ? "text-indigo-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Right side: CTA + Burger ─────────────────── */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <button
            onClick={() => handleNavClick("#contact")}
            className="hidden md:block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-white"
          >
            Написать мне
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-md"
        >
          <ul className="flex flex-col px-4 py-3 gap-1 list-none m-0 p-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <button
                  onClick={() => handleNavClick(href)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 ${
                    isActive(href)
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
            <li className="mt-2">
              <button
                onClick={() => handleNavClick("#contact")}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-white"
              >
                Написать мне
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
