import type { Service } from "../../data/services";

export default function ServiceCard({ service }: Readonly<{ service: Service }>) {
  const { icon, title, description, badge } = service;

  return (
    <article className="flex flex-col gap-4 bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Icon + Badge row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
        {badge && (
          <span className="shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed flex-1">{description}</p>
    </article>
  );
}
