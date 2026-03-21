interface MarqueeProps {
  items: string[];
  speed?: number;
}

export function Marquee({ items, speed = 25 }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 py-3 my-16 select-none">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-white/30 text-xs uppercase tracking-[0.2em]">
            {item} <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
