import { Code2, Send, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_LINKS: FooterNavLink[] = [
  { label: "Главная", href: "/" },
  { label: "Проекты", href: "/projects" },
  { label: "Обо мне", href: "/about" },
  { label: "Работа", href: "/terms" },
  { label: "Контакты", href: "/contact" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/rxritet", Icon: Code2 },
  { label: "Telegram", href: "https://t.me/rxritet", Icon: Send },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/radmir-abraev-186b393b0/", Icon: ArrowUpRight },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-3 pb-8 pt-4 md:px-5">
      <div className="surface-panel max-w-[86rem] mx-auto rounded-[2rem] px-5 py-10 md:px-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr_0.9fr] gap-10">
          {/* Col 1 — Brand info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-mono font-bold text-primary">
                rx
              </span>
              <div>
                <p className="text-xl font-bold tracking-tight text-white">MyTech</p>
                <p className="text-xs uppercase tracking-[0.28em] text-gray-500">portfolio system</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Персональный продуктовый сайт с акцентом на аккуратный интерфейс, ясную архитектуру и живой full-stack опыт вместо декоративного портфолио.
            </p>
            <Link to="/contact" className="button-secondary mt-3 w-fit px-4 py-2.5 text-sm">Обсудить задачу</Link>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-[0.2em]">
              Навигация
            </h3>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <span className="h-1 w-1 rounded-full bg-primary/60" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Social links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-[0.2em]">
              Соцсети
            </h3>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    aria-label={label}
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} MyTech</span>
          <span>React, Vite, Hono, Drizzle, Docker</span>
        </div>
      </div>
    </footer>
  );
}
