// ── Token types ───────────────────────────────────────────────────────────────

export type TokenKind =
  | "keyword"   // const, let, var
  | "var"       // variable name after keyword
  | "key"       // object key
  | "string"    // "value"
  | "comment"   // // ...
  | "punct"     // = { } [ ] , : ;
  | "plain";    // everything else

export interface Token {
  kind: TokenKind;
  text: string;
}

// ── Colour map ────────────────────────────────────────────────────────────────

const TOKEN_CLASS: Record<TokenKind, string> = {
  keyword: "text-purple-400",
  var:     "text-sky-300",
  key:     "text-teal-300",
  string:  "text-emerald-300",
  comment: "text-gray-500 italic",
  punct:   "text-gray-400",
  plain:   "text-gray-300",
};

// ── Pre-defined line structure (avoids a complex runtime tokeniser) ───────────
//    Each line carries a stable `id` so React keys are never derived from index.

export interface Line {
  id: string;
  tokens: Token[];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  /** Title shown in the macOS-style header bar */
  title?: string;
  /** Pre-tokenised lines to render */
  lines: Line[];
}

function CodeLine({ tokens }: Readonly<{ tokens: Token[] }>) {
  return (
    <div className="whitespace-pre">
      {tokens.map((tok) => (
        <span key={tok.text + tok.kind} className={TOKEN_CLASS[tok.kind]}>
          {tok.text}
        </span>
      ))}
    </div>
  );
}

export default function CodeBlock({ title = "stack.ts", lines }: Readonly<CodeBlockProps>) {
  return (
    <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 bg-surface/80 backdrop-blur-sm shadow-2xl shadow-black/40 text-left">

      {/* ── Title bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-bg/50 border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-red-500/70" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" aria-hidden="true" />
        {title && (
          <span className="ml-2 text-xs text-gray-500 font-mono select-none">{title}</span>
        )}
      </div>

      {/* ── Code body ─────────────────────────────────────────── */}
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
        <code>
          {lines.map((line) => (
            <CodeLine key={line.id} tokens={line.tokens} />
          ))}
        </code>
      </pre>
    </div>
  );
}

