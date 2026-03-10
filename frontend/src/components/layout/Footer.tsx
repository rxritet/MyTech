import { Code2, Send, Linkedin, Mail } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_LINKS: NavLink[] = [
  { label: "Проекты", href: "#projects" },
  { label: "Обо мне", href: "#about" },
  { label: "Условия", href: "#services" },
  { label: "Контакт", href: "#contact" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/rxritet", Icon: Code2 },
  { label: "Telegram", href: "https://t.me/rxritet", Icon: Send },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/radmir-abraev-186b393b0/", Icon: Linkedin },
  { label: "Email", href: "mailto:abraevradmir2@gmail.com", Icon: Mail },
];

function scrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ── Three columns ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1 — Brand info */}
          <div className="flex flex-col gap-3">
            <span className="text-xl font-bold tracking-tight text-white">
              {"My"}<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tech</span>
            </span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Full-stack разработчик, создающий быстрые и надёжные
              веб-приложения на современном TypeScript&#8209;стеке.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Навигация
            </h3>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Social links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
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

        {/* ── Bottom bar ───────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <span>© {year} MyTech · All rights reserved</span>
          <span>Built with Bun + React</span>
        </div>
      </div>
    </footer>
  );
}
