import { Link } from "react-router-dom";
import { MapPin, Send } from "lucide-react";
import CodeBlock, { type Line, type Token } from "../ui/CodeBlock";

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


// ── Pre-tokenised code snippet for CodeBlock ────────────────────────────────
//    Avoids a runtime tokeniser — the snippet never changes at runtime.

const kw = (text: string): Token => ({ kind: "keyword", text });
const v = (text: string): Token => ({ kind: "var", text });
const k = (text: string): Token => ({ kind: "key", text });
const s = (text: string): Token => ({ kind: "string", text });
const p = (text: string): Token => ({ kind: "punct", text });
const pl = (text: string): Token => ({ kind: "plain", text });
const cmt = (text: string): Token => ({ kind: "comment", text });

const STACK_LINES: Line[] = [
  {
    id: "l0",
    tokens: [
      kw("const"),
      pl(" "),
      v("stack"),
      pl(" "),
      p("="),
      pl(" "),
      p("{"),
    ],
  },
  {
    id: "l1",
    tokens: [
      pl("  "),
      k("backend"),
      p(":"),
      pl("  "),
      p("["),
      s('"Go"'),
      p(","),
      pl(" "),
      s('"Python"'),
      p(","),
      pl(" "),
      s('"TypeScript"'),
      p("]"),
      p(","),
    ],
  },
  {
    id: "l2",
    tokens: [
      pl("  "),
      k("database"),
      p(":"),
      pl(" "),
      p("["),
      s('"PostgreSQL"'),
      p(","),
      pl(" "),
      s('"BoltDB"'),
      p("]"),
      p(","),
    ],
  },
  {
    id: "l3",
    tokens: [
      pl("  "),
      k("mobile"),
      p(":"),
      pl("   "),
      p("["),
      s('"Flutter"'),
      p(","),
      pl(" "),
      s('"Dart"'),
      p("]"),
      p(","),
    ],
  },
  {
    id: "l4",
    tokens: [
      pl("  "),
      k("devops"),
      p(":"),
      pl("   "),
      p("["),
      s('"Docker"'),
      p(","),
      pl(" "),
      s('"nginx"'),
      p(","),
      pl(" "),
      s('"systemd"'),
      p("]"),
      p(","),
    ],
  },
  { id: "l5", tokens: [p("}"), p(";")] },
  { id: "l6", tokens: [] },
  { id: "l7", tokens: [cmt("// Открыт к первым коммерческим ролям 🚀")] },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/rxritet",
    icon: <GitHubIcon />,
  },
  {
    label: "Telegram",
    href: "https://t.me/rxritet",
    icon: <Send size={20} />,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────


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
      className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5 pt-16 overflow-hidden"
    >
      {/* ── Background blobs ──────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Top-left — indigo */}
        <div className="animate-float absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/30 blur-[120px]" />
        {/* Bottom-right — purple */}
        <div className="animate-float-reverse absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-600/25 blur-[100px]" />
        {/* Center-top — cyan accent */}
        <div className="animate-float-slow absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-500/15 blur-[90px]" />
      </div>

      {/* Name */}
      <FadeIn delay={0}>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-heading">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Радмир Абраев
          </span>
        </h1>
      </FadeIn>

      {/* Subtitle */}
      <FadeIn delay={100}>
        <p className="text-xl text-gray-300 font-medium">
          Backend Developer · Go / TypeScript / Python
        </p>
      </FadeIn>

      {/* Location */}
      <FadeIn delay={200}>
        <p className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
          <MapPin size={14} className="text-indigo-400" aria-hidden="true" />
          Almaty, Kazakhstan
        </p>
      </FadeIn>

      {/* Code block — tech stack */}
      <FadeIn delay={300}>
        <CodeBlock title="stack.ts" lines={STACK_LINES} />
      </FadeIn>

      {/* CTA buttons */}
      <FadeIn delay={400} className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/projects"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 active:translate-y-0 rounded-lg font-semibold transition-[color,transform,box-shadow] duration-200 ease-out text-white"
        >
          Мои проекты
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 border border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-500/10 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/15 active:translate-y-0 rounded-lg font-semibold transition-[color,border-color,background-color,transform,box-shadow] duration-200 ease-out text-gray-300 hover:text-white"
        >
          Написать мне
        </Link>
      </FadeIn>

      {/* Social links */}
      <FadeIn delay={500}>
        <ul
          className="flex items-center gap-4 list-none p-0 m-0"
          aria-label="Социальные сети"
        >
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
