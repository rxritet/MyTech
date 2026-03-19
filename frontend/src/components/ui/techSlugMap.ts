const TECH_ALIASES: Record<string, string> = {
  "Tailwind CSS": "tailwindcss",
  Tailwind: "tailwindcss",
  Vite: "vitejs",
  "Node.js": "nodejs",
  Node: "nodejs",
  "VS Code": "vscode",
  AWS: "amazonwebservices",
  "C++": "cplusplus",
  "C#": "csharp",
};

const DIRECT_SLUGS: Record<string, string> = {
  Go: "go",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Java: "java",
  Python: "python",
  Dart: "dart",
  React: "react",
  Hono: "hono",
  TailwindCSS: "tailwindcss",
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
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
};

export function getTechSlug(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  if (DIRECT_SLUGS[trimmed]) {
    return DIRECT_SLUGS[trimmed];
  }

  if (TECH_ALIASES[trimmed]) {
    return TECH_ALIASES[trimmed];
  }

  const withoutVersion = trimmed.replace(/\s+\d+(?:\.\d+)*$/u, "");
  if (DIRECT_SLUGS[withoutVersion]) {
    return DIRECT_SLUGS[withoutVersion];
  }

  if (TECH_ALIASES[withoutVersion]) {
    return TECH_ALIASES[withoutVersion];
  }

  return trimmed.toLowerCase().split(/\s+/u).join("");
}
