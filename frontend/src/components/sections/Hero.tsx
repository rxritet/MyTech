import { MapPin, Send } from "lucide-react";

// ── Inline brand SVGs (avoids deprecated lucide brand icons) ──────────────────

function GitHubIcon({ size = 20 }: Readonly<{ size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: Readonly<{ size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SKILLS = [
  "Go", "Bun", "Hono", "PostgreSQL", "Docker", "React", "TypeScript",
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: <GitHubIcon />,
  },
  {
    label: "Telegram",
    href: "https://t.me/",
    icon: <Send size={20} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/",
    icon: <LinkedInIcon />,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Wraps children in a div with the fade-in-up animation and a custom delay. */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>) {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Главный экран"
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5 pt-16"
    >
      {/* Name */}
      <FadeIn delay={0}>
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            John Doe
          </span>
        </h1>
      </FadeIn>

      {/* Subtitle */}
      <FadeIn delay={100}>
        <p className="text-xl text-gray-300 font-medium">
          Full-Stack Developer · Bun / Hono / React
        </p>
      </FadeIn>

      {/* Location */}
      <FadeIn delay={200}>
        <p className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
          <MapPin size={14} className="text-indigo-400" aria-hidden="true" />
          Moscow, Russia
        </p>
      </FadeIn>

      {/* Skill badges */}
      <FadeIn delay={300}>
        <ul
          className="flex flex-wrap gap-2 justify-center list-none p-0 m-0"
          aria-label="Навыки"
        >
          {SKILLS.map((skill) => (
            <li
              key={skill}
              className="px-3 py-1 bg-indigo-700/30 border border-indigo-500/30 rounded-full text-sm font-mono font-medium text-indigo-300"
            >
              {skill}
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* CTA buttons */}
      <FadeIn delay={400} className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => scrollToId("projects")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors cursor-pointer text-white"
        >
          Мои проекты
        </button>
        <button
          onClick={() => scrollToId("contact")}
          className="px-6 py-3 border border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10 rounded-lg font-semibold transition-colors cursor-pointer text-gray-300 hover:text-white"
        >
          Написать мне
        </button>
      </FadeIn>

      {/* Social links */}
      <FadeIn delay={500}>
        <ul className="flex items-center gap-4 list-none p-0 m-0" aria-label="Социальные сети">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-500 hover:text-indigo-400 transition-colors block"
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}
