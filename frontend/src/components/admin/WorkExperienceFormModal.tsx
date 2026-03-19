import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { EmploymentType, WorkExperience, WorkExperiencePayload, WorkFormat } from "../../api";

interface WorkExperienceFormModalProps {
  readonly initial: WorkExperience | null;
  readonly onClose: () => void;
  readonly onSave: (payload: WorkExperiencePayload) => Promise<void>;
}

const EMPLOYMENT_OPTIONS: Array<{ value: EmploymentType; label: string }> = [
  { value: "full_time", label: "Полная занятость" },
  { value: "part_time", label: "Частичная занятость" },
  { value: "internship", label: "Стажировка" },
  { value: "freelance", label: "Фриланс" },
  { value: "contract", label: "Контракт" },
];

const FORMAT_OPTIONS: Array<{ value: WorkFormat; label: string }> = [
  { value: "onsite", label: "Офис" },
  { value: "remote", label: "Удаленно" },
  { value: "hybrid", label: "Гибрид" },
];

const MONTH_RE = /^\d{4}-\d{2}$/;

function defaultPayload(): WorkExperiencePayload {
  return {
    company: "",
    position: "",
    location: "Алматы",
    industry: "",
    employmentType: "internship",
    format: "onsite",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [""],
    stack: [],
    order: 0,
  };
}

export default function WorkExperienceFormModal({ initial, onClose, onSave }: Readonly<WorkExperienceFormModalProps>) {
  const [form, setForm] = useState<WorkExperiencePayload>(defaultPayload());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stackDraft, setStackDraft] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company,
        position: initial.position,
        location: initial.location || "Алматы",
        industry: initial.industry ?? "",
        employmentType: initial.employmentType,
        format: initial.format,
        startDate: initial.startDate,
        endDate: initial.endDate ?? "",
        current: initial.current,
        bullets: initial.bullets.length > 0 ? initial.bullets : [""],
        stack: initial.stack,
        order: initial.order,
      });
      return;
    }

    setForm(defaultPayload());
  }, [initial]);

  const canAddBullet = form.bullets.length < 10;

  const normalizedBullets = useMemo(
    () => form.bullets.map((item) => item.trim()).filter((item) => item.length > 0),
    [form.bullets],
  );

  const handleAddStack = () => {
    const value = stackDraft.trim();
    if (!value) return;
    if (form.stack.includes(value)) {
      setStackDraft("");
      return;
    }

    setForm((prev) => ({ ...prev, stack: [...prev.stack, value] }));
    setStackDraft("");
  };

  const validate = (): string | null => {
    if (!form.company.trim()) return "Укажите компанию";
    if (!form.position.trim()) return "Укажите должность";
    if (!MONTH_RE.test(form.startDate)) return "startDate должен быть в формате YYYY-MM";
    if (!form.current && form.endDate && !MONTH_RE.test(form.endDate)) {
      return "endDate должен быть в формате YYYY-MM";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: WorkExperiencePayload = {
      ...form,
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location.trim() || "Алматы",
      industry: form.industry?.trim() ? form.industry.trim() : undefined,
      endDate: form.current ? null : (form.endDate?.trim() ? form.endDate.trim() : null),
      bullets: normalizedBullets,
      stack: form.stack,
    };

    setIsSaving(true);
    try {
      await onSave(payload);
    } catch (saveError: unknown) {
      if (saveError instanceof Error) {
        setError(saveError.message);
      } else {
        setError("Не удалось сохранить запись");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="surface-panel max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-text">
            {initial ? "Редактировать опыт" : "Добавить опыт"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-text"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(90vh-72px)] space-y-5 overflow-y-auto px-6 py-5">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted">Компания *</span>
              <input
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Должность *</span>
              <input
                value={form.position}
                onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Локация</span>
              <input
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Отрасль</span>
              <input
                value={form.industry ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Тип занятости</span>
              <select
                value={form.employmentType}
                onChange={(e) => setForm((prev) => ({ ...prev, employmentType: e.target.value as EmploymentType }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              >
                {EMPLOYMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Формат работы</span>
              <select
                value={form.format}
                onChange={(e) => setForm((prev) => ({ ...prev, format: e.target.value as WorkFormat }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              >
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Начало (YYYY-MM) *</span>
              <input
                value={form.startDate}
                placeholder="2025-09"
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-muted">Окончание (YYYY-MM)</span>
              <input
                value={form.endDate ?? ""}
                placeholder="2025-12"
                disabled={form.current}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45 disabled:opacity-50"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm((prev) => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? null : prev.endDate }))}
              className="h-4 w-4 accent-orange-500"
            />
            Работаю здесь сейчас
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted">Порядок</span>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
              className="w-32 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text outline-none focus:border-primary/45"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text">Буллеты</p>
              <button
                type="button"
                disabled={!canAddBullet}
                onClick={() => setForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }))}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-text transition-colors hover:border-primary/40 disabled:opacity-50"
              >
                <Plus size={12} /> Добавить
              </button>
            </div>

            <div className="space-y-2">
              {form.bullets.map((bullet, index) => (
                <div key={`bullet-${index}`} className="flex items-center gap-2">
                  <input
                    value={bullet}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      bullets: prev.bullets.map((item, current) => (current === index ? e.target.value : item)),
                    }))}
                    className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm text-text outline-none focus:border-primary/45"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({
                      ...prev,
                      bullets: prev.bullets.length === 1
                        ? [""]
                        : prev.bullets.filter((_, current) => current !== index),
                    }))}
                    className="rounded-lg border border-border p-2 text-muted transition-colors hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-text">Стек</p>
            <div className="flex flex-wrap gap-2">
              {form.stack.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, stack: prev.stack.filter((item) => item !== tag) }))}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-primary/90 transition-colors hover:border-primary/45"
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              value={stackDraft}
              placeholder="Введите технологию и нажмите Enter"
              onChange={(e) => setStackDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddStack();
                }
              }}
              className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm text-text outline-none focus:border-primary/45"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-text"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="button-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
