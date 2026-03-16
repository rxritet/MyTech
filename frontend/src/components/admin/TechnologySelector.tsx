import type { Technology } from "../../api";

interface TechnologySelectorProps {
  readonly technologies: Technology[];
  readonly selectedIds: number[];
  readonly onToggle: (technologyId: number) => void;
}

export default function TechnologySelector({
  technologies,
  selectedIds,
  onToggle,
}: Readonly<TechnologySelectorProps>) {
  if (technologies.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4 text-sm text-gray-400">
        Каталог технологий пока пуст.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {technologies.map((technology) => {
        const isSelected = selectedIds.includes(technology.id);
        return (
          <button
            key={technology.id}
            type="button"
            onClick={() => onToggle(technology.id)}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              isSelected
                ? "border-orange-500/50 bg-orange-500/15 text-orange-200"
                : "border-gray-800 bg-gray-950/50 text-gray-300 hover:border-gray-700"
            }`}
          >
            <img
              src={technology.badgeUrl}
              alt={technology.name}
              className="h-7 w-7 rounded object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23374151' width='32' height='32'/%3E%3C/svg%3E";
              }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{technology.name}</p>
              <p className="truncate text-xs text-gray-500">{technology.category}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
