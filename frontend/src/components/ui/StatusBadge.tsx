import type { ProjectStatus } from "../../api";

const STATUS_CONFIG: Record<
  ProjectStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    dot: string;
  }
> = {
  in_progress: {
    label: "В прогрессе",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    dot: "#f59e0b",
  },
  completed: {
    label: "Завершен",
    color: "#00ff88",
    bg: "rgba(0,255,136,0.10)",
    border: "rgba(0,255,136,0.30)",
    dot: "#00ff88",
  },
  archived: {
    label: "Архив",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    border: "rgba(107,114,128,0.30)",
    dot: "#6b7280",
  },
};

export default function StatusBadge({ status }: { readonly status: ProjectStatus }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold font-mono uppercase tracking-widest"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}
