import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import ScrollProgressBar from "../ui/ScrollProgressBar";

const NAV_LINKS = [
  { label: "Проекты", to: "/projects" },
  { label: "Обо мне", to: "/about" },
  { label: "Контакт", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { direction, scrolled } = useScrollDirection(10);

  const hidden = direction === "down" && scrolled && !menuOpen;

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 pb-0.5
     after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full
     after:transition-transform after:duration-200
     ${isActive
      ? "text-indigo-500 dark:text-indigo-400 after:bg-indigo-500 dark:after:bg-indigo-400 after:scale-x-100"
      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:bg-indigo-400 after:scale-x-0 hover:after:scale-x-100"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer block ${
      isActive
        ? "text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50
        backdrop-blur-lg
        bg-white/80 dark:bg-slate-900/80
        border-b border-gray-200 dark:border-gray-800
        transition-transform duration-300 ease-in-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
      aria-label="Основная навигация"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          aria-label="На главную"
        >
          {"My"}<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tech</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/contact"
            className="hidden md:inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/30 active:translate-y-0 rounded-lg text-sm font-semibold transition-[color,transform,box-shadow] duration-200 text-white"
          >
            Написать мне
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg"
        >
          <ul className="flex flex-col px-4 py-3 gap-1 list-none m-0">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={mobileLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="w-full block text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                Написать мне
              </Link>
            </li>
          </ul>
        </div>
      )}

      <ScrollProgressBar />
    </nav>
  );
}
