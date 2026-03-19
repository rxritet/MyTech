import { TECH_STACK } from "../../data/about";
import TechIcon from "../TechIcon";

const TECH_COLORS: Record<string, string> = Object.fromEntries(
  TECH_STACK.map((item) => [item.name, item.color]),
);

const TECH_ALIASES: Record<string, string> = {
  TS: "TypeScript",
  "Tailwind CSS": "TailwindCSS",
  Tailwind: "TailwindCSS",
  "React 19": "React",
  "Vue 3": "Vue",
  "Nuxt 4": "Nuxt",
};

const DEFAULT_BADGE = "bg-primary/10 border-primary/30 text-primary/80";

const DEVICON_SLUGS: Record<string, string> = {
  Go: "go",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Java: "java",
  Python: "python",
  Dart: "dart",
  React: "react",
  TailwindCSS: "tailwindcss",
  Vite: "vitejs",
  Flutter: "flutter",
  HTML5: "html5",
  CSS3: "css3",
  Figma: "figma",
  Docker: "docker",
  PostgreSQL: "postgresql",
  SQLite: "sqlite",
  Django: "django",
  FastAPI: "fastapi",
  Nginx: "nginx",
  Linux: "linux",
  AWS: "amazonwebservices",
  Git: "git",
  GitHub: "github",
  "VS Code": "vscode",
};

interface SkillBadgeProps {
  label: string;
  slug?: string | null;
  fallbackSrc?: string | null;
}

function normalizeTechLabel(label: string) {
  const trimmed = label.trim();
  if (TECH_COLORS[trimmed]) {
    return trimmed;
  }

  const alias = TECH_ALIASES[trimmed];
  if (alias) {
    return alias;
  }

  const withoutVersion = trimmed.replace(/\s+\d+(?:\.\d+)*$/u, "");
  if (TECH_COLORS[withoutVersion]) {
    return withoutVersion;
  }

  return trimmed;
}

export default function SkillBadge({ label, slug = null, fallbackSrc = null }: Readonly<SkillBadgeProps>) {
  const normalized = normalizeTechLabel(label);
  const colorClass = TECH_COLORS[normalized] ?? DEFAULT_BADGE;
  const resolvedSlug = slug ?? DEVICON_SLUGS[normalized] ?? null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-xs font-mono font-medium ${colorClass}`}
    >
      <TechIcon slug={resolvedSlug} fallbackSrc={fallbackSrc} name={normalized} size={12} />
      {label}
    </span>
  );
}
