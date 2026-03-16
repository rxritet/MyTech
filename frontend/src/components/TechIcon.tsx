import { useEffect, useMemo, useState } from "react";

interface TechIconProps {
  slug: string | null;
  name: string;
  size?: number;
  fallbackSrc?: string | null;
}

const DEVICON_SUFFIXES = ["original", "plain", "original-wordmark"] as const;
const DEVICON_CDN_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

function normalizeSlug(rawSlug: string | null): string | null {
  if (!rawSlug) return null;

  const normalized = rawSlug.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized === "vite") return "vitejs";
  if (normalized === "tailwind") return "tailwindcss";
  if (normalized === "node.js") return "nodejs";
  if (normalized === "aws") return "amazonwebservices";
  if (normalized === "vs code") return "vscode";
  if (normalized === "burp suite") return "burpsuite";

  return normalized;
}

function TechFallback({ name, size }: Readonly<{ name: string; size: number }>) {
  const char = name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        backgroundColor: "#1f2937",
        fontSize: size * 0.5,
        border: "1px solid #374151",
      }}
      className="rounded flex items-center justify-center text-white font-bold flex-shrink-0"
      aria-label={name}
    >
      {char}
    </div>
  );
}

export default function TechIcon({ slug, name, size = 24, fallbackSrc = null }: Readonly<TechIconProps>) {
  const normalizedSlug = normalizeSlug(slug);
  const [deviconAttempt, setDeviconAttempt] = useState(0);
  const [fallbackImageFailed, setFallbackImageFailed] = useState(false);

  const deviconSources = useMemo(() => {
    if (!normalizedSlug) {
      return [] as string[];
    }

    return DEVICON_SUFFIXES.map(
      (suffix) => `${DEVICON_CDN_BASE}/${normalizedSlug}/${normalizedSlug}-${suffix}.svg`,
    );
  }, [normalizedSlug]);

  useEffect(() => {
    setDeviconAttempt(0);
    setFallbackImageFailed(false);
  }, [normalizedSlug, fallbackSrc, name]);

  const currentDeviconSrc = deviconSources[deviconAttempt] ?? null;

  if (currentDeviconSrc) {
    return (
      <img
        src={currentDeviconSrc}
        alt={name}
        width={size}
        height={size}
        className="inline-flex items-center justify-center flex-shrink-0 object-contain"
        style={{ width: size, height: size }}
        onError={() => setDeviconAttempt((prev) => prev + 1)}
      />
    );
  }

  if (fallbackSrc && !fallbackImageFailed) {
    return (
      <img
        src={fallbackSrc}
        alt={name}
        width={size}
        height={size}
        className="inline-flex items-center justify-center flex-shrink-0 object-contain"
        style={{ width: size, height: size }}
        onError={() => setFallbackImageFailed(true)}
      />
    );
  }

  return <TechFallback name={name} size={size} />;
}
