import type { Service } from "../../data/services";

export default function ServiceCard({ service }: Readonly<{ service: Service }>) {
  const { icon, title, description, badge } = service;

  return (
    <article className="surface-panel flex h-full flex-col gap-4 rounded-[1.35rem] p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-primary/50">
      {/* Icon + Badge row */}
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-2xl leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
        {badge && (
          <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {/* Description */}
      <p className="flex-1 text-sm leading-7 text-gray-400">{description}</p>
    </article>
  );
}
