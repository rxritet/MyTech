import { useEffect, useState, type MouseEvent } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useInView } from "../../hooks/useInView";
import {
  createWorkExperience,
  deleteWorkExperience,
  getWorkExperience,
  updateWorkExperience,
  type WorkExperience,
  type WorkExperiencePayload,
} from "../../api";
import { formatDateRange } from "../../utils/formatDateRange";
import WorkExperienceFormModal from "../admin/WorkExperienceFormModal";

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: "Полная занятость",
  part_time: "Частичная занятость",
  internship: "Стажировка",
  freelance: "Фриланс",
  contract: "Контракт",
};

const FORMAT_LABELS: Record<string, string> = {
  onsite: "Офис",
  remote: "Удаленно",
  hybrid: "Гибрид",
};

function ExperienceCard({
  entry,
  index,
  isLast,
  onEdit,
  onDelete,
  isAdmin,
}: Readonly<{
  entry: WorkExperience;
  index: number;
  isLast: boolean;
  onEdit: (entry: WorkExperience) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}>) {
  const [expanded, setExpanded] = useState(index === 0);
  const { label, duration } = formatDateRange(entry.startDate, entry.endDate, entry.current);

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit(entry);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(entry.id);
  };

  return (
    <div className="relative flex gap-5 md:gap-8">
      <div className="flex flex-col items-center">
        <div
          className="mt-1.5 z-10 h-4 w-4 flex-shrink-0 rounded-full border-2 shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
          style={{
            borderColor: "var(--primary)",
            background: entry.current
              ? "var(--primary)"
              : "color-mix(in srgb, var(--primary) 30%, var(--bg))",
          }}
        />
        {!isLast && (
          <div
            className="mt-2 w-px flex-1"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--primary) 40%, transparent), color-mix(in srgb, var(--primary) 10%, transparent))",
            }}
          />
        )}
      </div>

      <div className="surface-panel mb-10 flex-1 overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/30">
        <button
          type="button"
          className="w-full px-5 py-5 text-left md:px-7 md:py-6"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold leading-tight text-white md:text-lg">{entry.position}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary/90">
                <Building2 size={13} />
                <span className="truncate">{entry.company}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-mono text-muted">
                  <Calendar size={11} />
                  {label}
                </span>
                <span className="eyebrow-chip text-[10px]">{duration}</span>
                {entry.current ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono"
                    style={{
                      color: "#00ff88",
                      background: "rgba(0,255,136,0.08)",
                      borderColor: "rgba(0,255,136,0.25)",
                    }}
                  >
                    <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-[#00ff88]" />
                    <span>Сейчас</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="rounded-lg border border-border bg-surface p-1.5 text-muted transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="rounded-lg border border-border bg-surface p-1.5 text-muted transition-all hover:border-red-500/30 hover:bg-red-900/20 hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : null}
                <div className="text-muted">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                <span className="eyebrow-chip text-[10px]">
                  {EMPLOYMENT_LABELS[entry.employmentType] ?? entry.employmentType}
                </span>
                <span className="eyebrow-chip flex items-center gap-1 text-[10px]">
                  <MapPin size={9} />
                  {FORMAT_LABELS[entry.format] ?? entry.format}
                </span>
              </div>
            </div>
          </div>
        </button>

        {expanded ? (
          <div className="space-y-4 border-t border-border/40 px-5 pb-6 pt-4 md:px-7">
            {entry.industry ? (
              <p className="text-xs font-mono text-muted">
                Отрасль: <span className="text-text">{entry.industry}</span>
              </p>
            ) : null}

            {entry.bullets.length > 0 ? (
              <ul className="space-y-2">
                {entry.bullets.map((bullet, bulletIndex) => (
                  <li key={`${entry.id}-bullet-${bulletIndex}`} className="flex items-start gap-2.5 text-sm text-text">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            {entry.stack.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.stack.map((tech) => (
                  <span
                    key={`${entry.id}-${tech}`}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-mono text-primary/80"
                    style={{
                      background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                      borderColor: "color-mix(in srgb, var(--primary) 22%, transparent)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
  const { isAdmin, secret } = useAdmin();
  const [ref, inView] = useInView<HTMLDivElement>(0.05);
  const [entries, setEntries] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkExperience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setError(null);
    try {
      const rows = await getWorkExperience();
      setEntries(rows);
    } catch (loadError: unknown) {
      if (loadError instanceof Error) {
        setError(loadError.message);
      } else {
        setError("Не удалось загрузить опыт работы");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const handleEdit = (entry: WorkExperience) => {
    setEditTarget(entry);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!secret || !globalThis.confirm("Удалить запись?")) return;

    try {
      await deleteWorkExperience(id, secret);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (deleteError: unknown) {
      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError("Не удалось удалить запись");
      }
    }
  };

  const handleSave = async (payload: WorkExperiencePayload) => {
    if (!secret) return;

    if (editTarget) {
      const updated = await updateWorkExperience(editTarget.id, payload, secret);
      setEntries((prev) => prev.map((entry) => (entry.id === editTarget.id ? updated : entry)));
    } else {
      const created = await createWorkExperience(payload, secret);
      setEntries((prev) => [...prev, created].sort((left, right) => {
        if (left.order !== right.order) return left.order - right.order;
        return right.id - left.id;
      }));
    }

    setModalOpen(false);
    setEditTarget(null);
  };

  return (
    <div ref={ref} className="space-y-2">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-mono uppercase tracking-widest text-primary">{"// experience"}</p>
          <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
            <Briefcase size={20} className="text-primary" />
            Опыт работы
          </h2>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => {
              setEditTarget(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:scale-105 hover:bg-primary/20 active:scale-95"
          >
            <Plus size={15} />
            Добавить
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : null}

      {!isLoading && entries.length === 0 ? (
        <p className="text-sm text-muted">Опыт пока не добавлен.</p>
      ) : null}

      {isLoading ? null : (
        <div className={`transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          {entries.map((entry, index) => (
            <ExperienceCard
              key={entry.id}
              entry={entry}
              index={index}
              isLast={index === entries.length - 1}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={Boolean(isAdmin)}
            />
          ))}
        </div>
      )}

      {modalOpen ? (
        <WorkExperienceFormModal
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
