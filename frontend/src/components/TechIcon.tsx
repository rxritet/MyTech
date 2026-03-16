interface TechIconProps {
  slug: string | null;
  name: string;
  size?: number;
  colored?: boolean;
}

function TechFallback({ name, size }: Readonly<{ name: string; size: number }>) {
  const colors: Record<string, string> = {
    Hono: "#E36002",
    Vercel: "#000000",
    "Burp Suite": "#FF6633",
  };

  const bg = colors[name] ?? "#555555";

  return (
    <div
      title={name}
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.5 }}
      className="rounded flex items-center justify-center text-white font-bold flex-shrink-0"
      aria-label={name}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function TechIcon({ slug, name, size = 24, colored = true }: Readonly<TechIconProps>) {
  if (!slug) {
    return <TechFallback name={name} size={size} />;
  }

  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) {
    return <TechFallback name={name} size={size} />;
  }

  const classes = colored
    ? `devicon-${normalizedSlug}-original colored`
    : `devicon-${normalizedSlug}-plain`;

  return (
    <i
      className={`${classes} inline-flex items-center justify-center flex-shrink-0`}
      style={{ fontSize: size, lineHeight: `${size}px` }}
      title={name}
      aria-label={name}
    />
  );
}
