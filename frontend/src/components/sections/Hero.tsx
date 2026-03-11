import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CodeBlock, { type Line, type Token } from "../ui/CodeBlock";

// ── Pre-tokenised code snippet for CodeBlock ────────────────────────────────
const kw = (text: string): Token => ({ kind: "keyword", text });
const v = (text: string): Token => ({ kind: "var", text });
const k = (text: string): Token => ({ kind: "key", text });
const s = (text: string): Token => ({ kind: "string", text });
const p = (text: string): Token => ({ kind: "punct", text });
const pl = (text: string): Token => ({ kind: "plain", text });

const STACK_LINES: Line[] = [
  { id: "l0", tokens: [kw("const"), pl(" "), v("stack"), pl(" "), p("="), pl(" "), p("{")] },
  { id: "l1", tokens: [pl("  "), k("langs"), p(":"), pl("    "), p("["), s('"Go"'), p(","), pl(" "), s('"Java"'), p(","), pl(" "), s('"TypeScript"'), p(","), pl(" "), s('"JavaScript"'), p(","), pl(" "), s('"Python"'), p(","), pl(" "), s('"Dart"'), p("]"), p(",")] },
  { id: "l2", tokens: [pl("  "), k("backend"), p(":"), pl("  "), p("["), s('"Django"'), p(","), pl(" "), s('"FastAPI"'), p(","), pl(" "), s('"Node.js"'), p(","), pl(" "), s('"PostgreSQL"'), p(","), pl(" "), s('"SQLite"'), p("]"), p(",")] },
  { id: "l3", tokens: [pl("  "), k("frontend"), p(":"), pl(" "), p("["), s('"React"'), p(","), pl(" "), s('"TailwindCSS"'), p(","), pl(" "), s('"Vite"'), p(","), pl(" "), s('"Flutter"'), p(","), pl(" "), s('"HTML5"'), p(","), pl(" "), s('"CSS3"'), p(","), pl(" "), s('"Figma"'), p("]"), p(",")] },
  { id: "l4", tokens: [pl("  "), k("devops"), p(":"), pl("   "), p("["), s('"Docker"'), p(","), pl(" "), s('"GitHub Actions"'), p(","), pl(" "), s('"AWS"'), p(","), pl(" "), s('"Nginx"'), p(","), pl(" "), s('"Linux"'), p("]"), p(",")] },
  { id: "l5", tokens: [pl("  "), k("tools"), p(":"), pl("    "), p("["), s('"Git"'), p(","), pl(" "), s('"GitHub"'), p(","), pl(" "), s('"VS Code"'), p(","), pl(" "), s('"Burp Suite"'), p(","), pl(" "), s('"Antigravity"'), p("]")] },
  { id: "l6", tokens: [p("}")] },
];

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center gap-8 overflow-hidden dot-grid">
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

      <div className="animate-fade-in-up z-10 w-full flex justify-center px-4" style={{ animationDelay: '200ms' }}>
         <CodeBlock title="stack.ts" lines={STACK_LINES} />
      </div>

      <div className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-4 mt-2 z-10" style={{ animationDelay: '300ms' }}>
        <Link
          to="/projects"
          className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 rounded-xl font-semibold transition-all duration-300 text-bg flex items-center justify-center gap-2"
        >
          Мои проекты
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
           to="/about"
           className="w-full sm:w-auto px-8 py-3.5 border border-primary/50 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/15 active:translate-y-0 rounded-xl font-semibold transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-center"
        >
           Обо мне
        </Link>
      </div>
    </section>
  );
}
