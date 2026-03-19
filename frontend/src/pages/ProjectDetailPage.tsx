import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Code2, Edit2, ExternalLink, ImagePlus, Milestone, Trash2, X } from "lucide-react";
import { useProject, deleteProject } from "../hooks/useProjects";
import { useAdmin } from "../context/AdminContext";
import ProjectFormModal from "../components/admin/ProjectFormModal";
import SkillBadge from "../components/ui/SkillBadge";
import StatusBadge from "../components/ui/StatusBadge";

type ProjectEditTab = "basic" | "description" | "media" | "development" | "tech";

function GitHubIcon({ size = 16 }: Readonly<{ size?: number }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProject(slug || "");
  const { isAdmin, secret } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ProjectEditTab>("basic");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const safeCreatedAt = project?.createdAt ?? "";

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) {
      return;
    }

    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const formattedCreatedAt = useMemo(() => {
    const parsed = new Date(safeCreatedAt);
    if (Number.isNaN(parsed.getTime())) {
      return safeCreatedAt;
    }
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }, [safeCreatedAt]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  if (loading) {
    return <main className="section-shell pt-30 text-center text-muted">Загрузка проекта...</main>;
  }

  if (error || !project) {
    return <Navigate to="/projects" replace />;
  }

  const {
    id,
    name,
    description,
    longDescription,
    features,
    stack,
    github,
    demo,
    image,
    gallery,
    developmentProcess,
    devTime,
    language,
    createdAt,
  } = project;

  const mediaItems = [image, ...(gallery ?? [])].filter((item): item is string => Boolean(item?.trim()));
  const stages = developmentProcess ?? [];
  const projectFeatures = features ?? [];
  const hasStages = stages.length > 0;
  const hasGallery = mediaItems.length > 0;
  const hasFeatureSection = Boolean(description?.trim()) || projectFeatures.length > 0;

  const openEditorOn = (tab: ProjectEditTab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!secret || !id || !globalThis.confirm("Точно удалить?")) {
      return;
    }

    try {
      await deleteProject(id, secret);
      navigate("/projects");
    } catch {
      globalThis.alert("Ошибка удаления");
    }
  };

  return (
    <main className="min-h-screen pb-16 pt-20 lg:pt-24">
      <section className="mx-auto w-full max-w-[86rem] px-3 pb-0 pt-4 sm:px-5 lg:pt-5">
        <div className="relative h-[270px] overflow-hidden rounded-[1.5rem] border border-border md:h-[330px] lg:h-[390px]">
          {image ? (
            <img src={image} alt={`Баннер проекта ${name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="dot-grid relative h-full w-full bg-bg-elevated">
              <div
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--primary) 22%, transparent)",
                  filter: "blur(42px)",
                }}
              />
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 0%, var(--bg) 90%)" }}
            aria-hidden="true"
          />

          <Link
            to="/projects"
            className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-border bg-bg/70 px-3 py-1.5 text-sm text-text/88 transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Все проекты
          </Link>

          {isAdmin && (
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-border bg-bg/75 p-1.5 backdrop-blur-sm">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
                onClick={() => openEditorOn("basic")}
                aria-label="Редактировать проект"
              >
                <Edit2 size={15} />
              </button>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-500/10"
                onClick={handleDelete}
                aria-label="Удалить проект"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 z-20 w-full p-4 md:p-6 lg:p-8">
            <StatusBadge status={project.status} />
            <h1
              className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight text-text"
              style={{ textShadow: "0 0 40px color-mix(in srgb, var(--primary) 40%, transparent)" }}
            >
              {name}
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-text/90 md:text-base md:leading-7">{description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[86rem] px-3 pt-6 sm:px-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="space-y-6">
            <section className="surface-panel rounded-3xl border-t-2 border-t-primary p-7 md:p-10">
              <h2 className="mb-5 flex items-center gap-3 text-[1.55rem] font-bold text-text">
                <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
                {" "}
                О проекте
              </h2>
              <p className="text-[1.05rem] leading-[1.85] text-text/95">{longDescription}</p>
            </section>

            {hasFeatureSection ? (
              <section className="surface-panel rounded-3xl p-6 md:p-8">
                <h2 className="mb-5 flex items-center gap-3 text-[1.2rem] font-bold text-text">
                  <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" />
                  {" "}
                  Кратко и особенности
                </h2>

                {description?.trim() ? (
                  <p className="rounded-xl border border-border bg-bg-elevated/45 px-4 py-3 text-[0.98rem] leading-8 text-text">
                    {description}
                  </p>
                ) : null}

                {projectFeatures.length > 0 ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {projectFeatures.map((feature, index) => (
                      <li key={`${feature}-${index}`} className="card-glass rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <span className="text-sm leading-7 text-text">{feature}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ) : null}

            {hasStages ? (
              <section className="surface-panel rounded-3xl p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-3 text-[1.45rem] font-bold text-text">
                    <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
                    {" "}
                    Этапы разработки
                  </h2>
                  {isAdmin && (
                    <button type="button" onClick={() => openEditorOn("development")} className="button-secondary py-2 px-4 text-sm">
                      <Milestone size={14} />
                      Добавить этап
                    </button>
                  )}
                </div>

                <ol className="relative space-y-4 pl-3 before:absolute before:bottom-0 before:left-[11px] before:top-0 before:border-l-2 before:border-dashed before:border-border">
                  {stages.map((stage, index) => (
                    <li
                      key={`${stage.title}-${index}`}
                      className={prefersReducedMotion ? "opacity-100" : "animate-fade-in-up"}
                      style={prefersReducedMotion ? undefined : { animationDelay: `${Math.min(index * 80, 400)}ms` }}
                    >
                      <div className="relative">
                        <span
                          className="absolute left-[-7px] top-[18px] h-3 w-3 rounded-full border-2"
                          style={{
                            background: "var(--primary)",
                            borderColor: "var(--bg)",
                            boxShadow: "0 0 10px var(--primary)",
                          }}
                          aria-hidden="true"
                        />

                        <article className="surface-panel ml-8 rounded-2xl p-4 md:p-5">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted">Этап {index + 1}</span>
                            {createdAt ? (
                              <span className="text-[0.7rem] text-muted">{formattedCreatedAt}</span>
                            ) : null}
                          </div>
                          <h3 className="text-base font-bold text-text">{stage.title}</h3>
                          <p className="mt-2 text-[0.9rem] leading-[1.7] text-muted">{stage.description}</p>
                        </article>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {hasGallery ? (
              <section className="surface-panel rounded-3xl p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-3 text-[1.45rem] font-bold text-text">
                    <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
                    {" "}
                    Галерея
                  </h2>
                  {isAdmin && (
                    <button type="button" onClick={() => openEditorOn("media")} className="button-secondary py-2 px-4 text-sm">
                      <ImagePlus size={14} />
                      Добавить медиа
                    </button>
                  )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {mediaItems.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="group h-40 w-[240px] shrink-0 overflow-hidden rounded-xl border border-border transition-[transform,box-shadow] duration-200 hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    >
                      <img src={src} alt={`Медиа ${index + 1} проекта ${name}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-panel overflow-hidden rounded-3xl">
              <div className="border-b border-border p-5">
                <p className="section-kicker !mb-2 text-[0.62rem]">СТАТУС</p>
                <StatusBadge status={project.status} />
              </div>

              <div className="border-b border-border p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="eyebrow-chip">
                    <Code2 size={13} />
                    {language}
                  </span>
                  <span className="eyebrow-chip">
                    <Clock size={13} />
                    {devTime}
                  </span>
                </div>
              </div>

              <div className="border-b border-border p-5">
                <p className="section-kicker !mb-3 text-[0.62rem]">СТЕК</p>
                <ul className="flex flex-wrap items-center gap-y-2">
                  {stack.map((item, index) => (
                    <li key={item} className="flex items-center">
                      <span className="rounded-xl transition-shadow hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
                        <SkillBadge label={item} />
                      </span>
                      {index < stack.length - 1 ? (
                        <span className="mx-2 inline-block h-4 w-px bg-border" aria-hidden="true" />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-b border-border p-5">
                <div className="flex flex-col gap-2.5">
                  {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="button-primary w-full rounded-xl py-2.5 text-sm">
                      <GitHubIcon size={15} />
                      GitHub
                    </a>
                  )}
                  {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer" className="button-secondary w-full rounded-xl py-2.5 text-sm">
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                <p className="inline-flex items-center gap-2 text-[0.8rem] text-muted">
                  <CalendarDays size={13} />
                  Создан: {createdAt}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary">
            <ArrowLeft size={14} />
            Все проекты
          </Link>
          <Link to="/contact" className="button-secondary py-2 px-5 text-sm">
            Обсудить проект
            <ExternalLink size={13} />
          </Link>
        </div>
      </section>

      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <dialog open className="fixed inset-0 z-[120] m-0 flex h-screen w-screen items-center justify-center border-none bg-black/88 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Закрыть просмотр изображения"
            onClick={() => setLightboxIndex(null)}
          />
          <button
            type="button"
            className="absolute right-5 top-5 z-10 rounded-full border border-border bg-bg-elevated p-2 text-text"
            aria-label="Закрыть просмотр изображения"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={16} />
          </button>
          <img
            src={mediaItems[lightboxIndex]}
            alt={`Увеличенное изображение ${name}`}
            className="z-10 max-h-[90vh] max-w-[94vw] rounded-2xl border border-border object-contain"
          />
        </dialog>
      )}

      {isAdmin && secret && (
        <ProjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
          secret={secret}
          onSuccess={() => refetch()}
          initialTab={modalTab}
        />
      )}
    </main>
  );
}
