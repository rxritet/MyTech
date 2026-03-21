import { useEffect, useState } from "react";
import { Code2, Send, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAbout } from "../../api";

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
  const [contactEmail, setContactEmail] = useState("abraevradmir2@gmail.com");
  const [aboutSummary, setAboutSummary] = useState(
    "Разрабатываю надежные full-stack решения на React, Hono и PostgreSQL с фокусом на чистую архитектуру и удобный UX.",
  );

  useEffect(() => {
    void getAbout()
      .then((about) => {
        if (about.email?.trim()) {
          setContactEmail(about.email.trim());
        }

        const bio = about.bio1?.trim();
        if (bio) {
          const firstSentence = bio.split(/(?<=[.!?])\s+/u)[0]?.trim();
          if (firstSentence) {
            setAboutSummary(firstSentence);
          }
        }
      })
      .catch(() => {
        // Keep fallback email when backend request fails.
      });
  }, []);

  return (
    <footer className="border-t border-border bg-bg px-3 pb-6 pt-8 sm:px-5 sm:pt-10">
      <div className="mx-auto max-w-[86rem]">
        <div className="surface-panel rounded-3xl border border-border/80 bg-bg-elevated/20 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.5fr_1fr_auto] md:gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-sm font-mono font-bold text-primary">
                  rx
                </span>
                <div>
                  <p className="text-base font-semibold tracking-tight text-text">Radmir Abraev</p>
                  <p className="text-xs text-muted">Full-stack developer • React, Hono, PostgreSQL</p>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-muted">{aboutSummary}</p>

              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center rounded-lg border border-primary/25 bg-primary/8 px-3 py-1.5 text-xs text-primary/90 transition-colors hover:text-primary"
              >
                {contactEmail}
              </a>
            </div>

            <nav className="flex flex-wrap items-center gap-3 md:justify-center" aria-label="Footer navigation">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/35 hover:text-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:justify-end">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg border border-border p-2 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="h-px w-full bg-border" />
            <div className="mt-3 flex flex-col gap-1 text-[0.75rem] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>© {year} MyTech. Built by Radmir Abraev.</span>
              <span>Available for freelance and product teams.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
