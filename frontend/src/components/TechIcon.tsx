import { useState } from "react";

interface TechIconProps {
  slug: string | null;
  name: string;
  size?: number;
  colored?: boolean;
}

const DEVICON_VARIANT: Record<string, string> = {
  go: "original",
  typescript: "original",
  javascript: "original",
  java: "original",
  python: "original",
  dart: "original",
  react: "original colored",
  tailwindcss: "original",
  vitejs: "original",
  flutter: "original",
  html5: "original",
  css3: "original",
  figma: "original",
  docker: "original",
  postgresql: "original",
  sqlite: "original",
  django: "plain",
  fastapi: "original",
  nginx: "original",
  linux: "original",
  amazonwebservices: "plain colored",
  git: "original",
  github: "original",
  vscode: "original",
  nodejs: "original colored",
  flask: "original",
};

const OVERRIDES: Record<string, { color?: string }> = {
  github: { color: "#ffffff" },
  linux: { color: "#FCC624" },
};

const SVG_ICON_BY_SLUG: Record<string, string> = {
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  fastapi: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  sqlite: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  vitejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
  html5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
};

function normalizeSlug(rawSlug: string | null): string | null {
  if (!rawSlug) return null;

  const normalized = rawSlug.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized === "vite") return "vitejs";
  if (normalized === "tailwind") return "tailwindcss";
  if (normalized === "node.js") return "nodejs";
  if (normalized === "aws") return "amazonwebservices";
  if (normalized === "vs code") return "vscode";

  if (normalized === "vercel" || normalized === "hono" || normalized === "burpsuite" || normalized === "burp suite") {
    return null;
  }

  if (normalized === "antigravity") {
    return null;
  }

  if (normalized === "tailwindcss" || normalized === "vitejs" || normalized === "nodejs") {
    return normalized;
  }

  if (normalized === "flask") {
    return "flask";
  }

  if (normalized === "linux") {
    return "linux";
  }

  if (normalized === "github") {
    return "github";
  }

  // Keep behavior predictable for known slugs and fallback for unknown variants.
  return normalized;
}

function getDeviconClass(slug: string, colored: boolean): string {
  const variant = DEVICON_VARIANT[slug] ?? (colored ? "original" : "plain");
  return `devicon-${slug}-${variant}`;
}

function TechFallback({ name, size }: Readonly<{ name: string; size: number }>) {
  const colors: Record<string, string> = {
    Hono: "#E36002",
    Vercel: "#1a1a1a",
    "Burp Suite": "#FF6633",
    Antigravity: "#3776AB",
  };

  const bg = colors[name] ?? "#555555";
  const needsBorder = name === "Vercel";

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.5,
        border: needsBorder ? "1px solid #333" : "none",
      }}
      className="rounded flex items-center justify-center text-white font-bold flex-shrink-0"
      aria-label={name}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function TechIcon({ slug, name, size = 24, colored = true }: Readonly<TechIconProps>) {
  const [svgLoadFailed, setSvgLoadFailed] = useState(false);
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return <TechFallback name={name} size={size} />;
  }

  const svgUrl = SVG_ICON_BY_SLUG[normalizedSlug] ?? null;

  if (svgUrl && !svgLoadFailed) {
    return (
      <img
        src={svgUrl}
        alt={name}
        width={size}
        height={size}
        className="inline-flex items-center justify-center flex-shrink-0 object-contain"
        style={{ width: size, height: size }}
        onError={() => setSvgLoadFailed(true)}
      />
    );
  }

  const classes = getDeviconClass(normalizedSlug, colored);
  const override = OVERRIDES[normalizedSlug];

  return (
    <i
      className={`${classes} inline-flex items-center justify-center flex-shrink-0`}
      style={{
        fontSize: size,
        lineHeight: 1,
        color: override?.color,
      }}
      title={name}
      aria-label={name}
    />
  );
}
