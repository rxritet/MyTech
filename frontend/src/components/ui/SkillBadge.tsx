import { TECH_STACK } from "../../data/about";

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

interface SkillBadgeProps {
  label: string;
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

export default function SkillBadge({ label }: Readonly<SkillBadgeProps>) {
  const colorClass = TECH_COLORS[normalizeTechLabel(label)] ?? DEFAULT_BADGE;
  return (
    <span
      className={`px-2.5 py-0.5 border rounded-full text-xs font-mono font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
