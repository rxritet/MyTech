import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CodeBlock, { type Line, type Token } from "../ui/CodeBlock";
import { useAdmin } from "../../context/AdminContext";
import { getHomeStack, type HomeStackCategory } from "../../api";

// ── Pre-tokenised code snippet for CodeBlock ────────────────────────────────
const kw = (text: string): Token => ({ kind: "keyword", text });
const v = (text: string): Token => ({ kind: "var", text });
const k = (text: string): Token => ({ kind: "key", text });
const s = (text: string): Token => ({ kind: "string", text });
const p = (text: string): Token => ({ kind: "punct", text });
const pl = (text: string): Token => ({ kind: "plain", text });

const FALLBACK_HOME_STACK: HomeStackCategory[] = [
  { id: 1, slug: "langs", label: "langs", order: 0, items: [
    { id: 1, name: "Go", order: 0 },
    { id: 2, name: "Java", order: 1 },
    { id: 3, name: "TypeScript", order: 2 },
    { id: 4, name: "JavaScript", order: 3 },
    { id: 5, name: "Python", order: 4 },
    { id: 6, name: "Dart", order: 5 },
  ] },
  { id: 2, slug: "backend", label: "backend", order: 1, items: [
    { id: 7, name: "Hono", order: 0 },
    { id: 8, name: "Django", order: 1 },
    { id: 9, name: "FastAPI", order: 2 },
    { id: 10, name: "PostgreSQL", order: 3 },
    { id: 11, name: "SQLite", order: 4 },
  ] },
  { id: 3, slug: "frontend", label: "frontend", order: 2, items: [
    { id: 12, name: "React", order: 0 },
    { id: 13, name: "TailwindCSS", order: 1 },
    { id: 14, name: "Vite", order: 2 },
    { id: 15, name: "Flutter", order: 3 },
    { id: 16, name: "HTML5", order: 4 },
    { id: 17, name: "CSS3", order: 5 },
    { id: 18, name: "Figma", order: 6 },
  ] },
  { id: 4, slug: "devops", label: "devops", order: 3, items: [
    { id: 19, name: "Docker", order: 0 },
    { id: 20, name: "Vercel", order: 1 },
    { id: 21, name: "AWS", order: 2 },
    { id: 22, name: "Nginx", order: 3 },
    { id: 23, name: "Linux", order: 4 },
  ] },
  { id: 5, slug: "tools", label: "tools", order: 4, items: [
    { id: 24, name: "Git", order: 0 },
    { id: 25, name: "GitHub", order: 1 },
    { id: 26, name: "VS Code", order: 2 },
    { id: 27, name: "Burp Suite", order: 3 },
  ] },
];

function buildStackLines(categories: HomeStackCategory[]): Line[] {
  const orderedCategories = [...categories]
    .sort((a, b) => a.order - b.order)
    .filter((category) => category.slug.trim().length > 0);

  const lines: Line[] = [
    { id: "l0", tokens: [kw("const"), pl(" "), v("stack"), pl(" "), p("="), pl(" "), p("{")] },
  ];

  for (let index = 0; index < orderedCategories.length; index += 1) {
    const category = orderedCategories[index];
    const isLastCategory = index === orderedCategories.length - 1;
    const items = [...category.items].sort((a, b) => a.order - b.order);

    const tokens: Token[] = [pl("  "), k(category.slug), p(":"), pl(" "), p("[")];
    items.forEach((item, itemIndex) => {
      tokens.push(s(`"${item.name}"`));
      if (itemIndex < items.length - 1) {
        tokens.push(p(","), pl(" "));
      }
    });
    tokens.push(p("]"));
    if (!isLastCategory) {
      tokens.push(p(","));
    }

    lines.push({ id: `l${index + 1}`, tokens });
  }

  lines.push({ id: `l${orderedCategories.length + 1}`, tokens: [p("}")] });
  return lines;
}

export default function Hero() {
  const { isAdmin } = useAdmin();
  const [homeStack, setHomeStack] = useState<HomeStackCategory[]>(FALLBACK_HOME_STACK);

  useEffect(() => {
    const loadHomeStack = async () => {
      try {
        const data = await getHomeStack();
        if (Array.isArray(data) && data.length > 0) {
          setHomeStack(data);
        }
      } catch {
        setHomeStack(FALLBACK_HOME_STACK);
      }
    };

    void loadHomeStack();
  }, []);

  const stackLines = useMemo(() => buildStackLines(homeStack), [homeStack]);

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center gap-8 overflow-hidden">
      <div className="animate-float-slow absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="animate-float absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />
      <div className="animate-float-reverse absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-orange-500/10 blur-[110px] pointer-events-none" />

      <div className="animate-fade-in-up flex flex-col items-center gap-5 z-10 max-w-3xl">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white">
          Радмир <span className="text-primary underline decoration-primary decoration-[3px] underline-offset-[6px]">Абраев</span>
        </h1>
        <p className="font-mono text-primary text-lg">
          &gt; FullStack Developer<span className="animate-blink">_</span>
        </p>
      </div>

      <div className="animate-fade-in-up z-10 w-full flex justify-center px-4" style={{ animationDelay: "200ms" }}>
        <CodeBlock title="stack.ts" lines={stackLines} />
      </div>

      <div className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-4 mt-2 z-10" style={{ animationDelay: "300ms" }}>
        <Link
          to="/projects"
          className="button-primary w-full sm:w-auto px-8 py-3.5"
        >
          Мои проекты
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/about"
          className="button-secondary w-full sm:w-auto px-8 py-3.5"
        >
          Обо мне
        </Link>
        {isAdmin && (
          <Link
            to="/admin/stack"
            className="button-secondary w-full sm:w-auto px-8 py-3.5"
          >
            Изменить стек
          </Link>
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-28 bg-gradient-to-b from-transparent to-[var(--bg)]"
      />
    </section>
  );
}
