interface MarqueeProps {
  items: string[];
  speed?: number;
}

type MarqueeItem = {
  id: string;
  label: string;
};

export function Marquee({ items, speed = 25 }: Readonly<MarqueeProps>) {
  const seen = new Map<string, number>();
  const doubled: MarqueeItem[] = [];

  for (const cycle of [0, 1]) {
    for (const item of items) {
      const count = (seen.get(item) ?? 0) + 1;
      seen.set(item, count);
      doubled.push({ id: `${item}-${cycle}-${count}`, label: item });
    }
  }

  return (
    <div className="overflow-hidden border-y border-white/10 py-3 my-16 select-none">
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {doubled.map((item) => (
          <span key={item.id} className="font-mono text-white/30 text-xs uppercase tracking-[0.2em]">
            {item.label} <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
