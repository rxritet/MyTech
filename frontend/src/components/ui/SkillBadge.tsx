// ── Per-technology colour map ──────────────────────────────────────────────────
const TECH_COLORS: Record<string, string> = {
  // Go
  Go: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  // TypeScript family
  TypeScript: "bg-blue-500/10 border-blue-500/30 text-blue-300",
  TS: "bg-blue-500/10 border-blue-500/30 text-blue-300",
  // React
  React: "bg-sky-500/10 border-sky-500/30 text-sky-300",
  // PostgreSQL
  PostgreSQL: "bg-slate-400/10 border-slate-400/30 text-slate-300",
  // Bun
  Bun: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  // Hono
  Hono: "bg-orange-500/10 border-orange-500/30 text-orange-300",
  // Docker
  Docker: "bg-blue-600/10 border-blue-600/30 text-blue-400",
  // Vite
  Vite: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  // Tailwind / Tailwind CSS
  Tailwind: "bg-teal-500/10 border-teal-500/30 text-teal-300",
  "Tailwind CSS": "bg-teal-500/10 border-teal-500/30 text-teal-300",
  // Node.js
  "Node.js": "bg-green-500/10 border-green-500/30 text-green-300",
  // Drizzle ORM
  "Drizzle ORM": "bg-lime-500/10 border-lime-500/30 text-lime-300",
  // JWT
  JWT: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  // GitHub Actions
  "GitHub Actions": "bg-gray-400/10 border-gray-400/30 text-gray-300",
  // Bash
  Bash: "bg-neutral-500/10 border-neutral-500/30 text-neutral-300",
};

const DEFAULT_BADGE = "bg-primary/10 border-primary/30 text-primary/80";

interface SkillBadgeProps {
  label: string;
}

export default function SkillBadge({ label }: Readonly<SkillBadgeProps>) {
  const colorClass = TECH_COLORS[label] ?? DEFAULT_BADGE;
  return (
    <span
      className={`px-2.5 py-0.5 border rounded-full text-xs font-mono font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
