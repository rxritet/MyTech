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
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/rxritet", Icon: Code2 },
  { label: "Telegram", href: "https://t.me/rxritet", Icon: Send },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/radmir-abraev-186b393b0/", Icon: ArrowUpRight },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg px-3 sm:px-5">
      <div className="mx-auto max-w-[86rem]">
        <div className="grid h-[150px] grid-cols-1 items-center gap-4 py-4 md:h-[136px] md:grid-cols-[1.3fr_1fr_auto] md:gap-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-sm font-mono font-bold text-primary">
              rx
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight text-text">Radmir Abraev</p>
              <p className="text-xs text-muted">Full-stack developer • React, Node, PostgreSQL</p>
              <a href="mailto:radmir.abraev.dev@gmail.com" className="text-xs text-primary/90 transition-colors hover:text-primary">
                radmir.abraev.dev@gmail.com
              </a>
            </div>
          </div>

          <nav className="hidden items-center justify-center gap-4 md:flex lg:gap-5" aria-label="Footer navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} to={href} className="whitespace-nowrap text-sm text-muted transition-colors hover:text-primary">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted transition duration-200 hover:-translate-y-0.5 hover:text-primary"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          <div className="hidden md:block md:col-span-3">
            <div className="h-px w-full bg-border" />
            <div className="mt-2 flex items-center justify-between text-[0.75rem] text-muted">
              <span>© {year} MyTech. Built by Radmir Abraev.</span>
              <span>Available for freelance and product teams.</span>
            </div>
          </div>

          <div className="md:hidden">
            <div className="h-px w-full bg-border" />
            <p className="mt-2 text-center text-[0.72rem] text-muted">© {year} MyTech • Available for freelance</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
