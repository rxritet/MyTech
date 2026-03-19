import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Edit2, ExternalLink, ImagePlus, Milestone, Trash2, X } from "lucide-react";
import { deleteProject, useProject } from "../../hooks/useProjects";
import { useAdmin } from "../../context/AdminContext";
import ProjectFormModal from "../admin/ProjectFormModal";
import TechIcon from "../TechIcon";
import { getTechSlug } from "./techSlugMap";
import { useInView } from "../../hooks/useInView";

type ProjectEditTab = "basic" | "description" | "media" | "development" | "tech";

function GitHubIcon({ size = 14 }: Readonly<{ size?: number }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function TimelineItem({
  title,
  description,
  index,
  dateLabel,
}: Readonly<{ title: string; description: string; index: number; dateLabel: string }>) {
  const [ref, inView] = useInView<HTMLLIElement>(0.16);

  return (
    <li
      ref={ref}
      className={inView ? "animate-fade-in-up" : "opacity-0"}
      style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <div className="relative grid grid-cols-[20px_1fr] gap-4">
        <div className="relative flex justify-center">
          <span
            className="mt-2 h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--primary)",
              boxShadow: "0 0 8px var(--primary)",
            }}
            aria-hidden="true"
          />
          <span className="absolute top-4 h-[calc(100%+20px)] border-l border-dashed border-border" aria-hidden="true" />
        </div>

        <article className="card-glass rounded-2xl px-4 py-3.5 md:px-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-text">{title}</h3>
            <span className="eyebrow-chip px-2 py-1 text-[0.66rem]">{dateLabel}</span>
          </div>
          <p className="text-sm leading-6 text-muted">{description}</p>
        </article>
      </div>
    </li>
  );
}

export default function ProjectDetailShowcase() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { project, loading, error, refetch } = useProject(slug ?? "");
  const { isAdmin, secret } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ProjectEditTab>("basic");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const mediaItems = project
    ? [project.image, ...(project.gallery ?? [])].filter(
        (item): item is string => Boolean(item?.trim()),
      )
    : [];

  const dateLabel = project
    ? (() => {
        const parsed = new Date(project.createdAt);
        if (Number.isNaN(parsed.getTime())) {
          return project.createdAt;
        }

        return new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(parsed);
      })()
    : "";

  useEffect(() => {
    if (lightboxIndex === null || mediaItems.length === 0) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => {
          if (current === null) {
            return 0;
          }
          return (current + 1) % mediaItems.length;
        });
        return;
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => {
          if (current === null) {
            return 0;
          }
          return (current - 1 + mediaItems.length) % mediaItems.length;
        });
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, mediaItems.length]);

  if (loading) {
    return <main className="section-shell pt-32 text-center text-muted">Загрузка проекта...</main>;
  }

  if (error || !project) {
    return <Navigate to="/projects" replace />;
  }

  const statusLabel = project.demo ? "Completed" : "In progress";
  const statusClass = project.demo ? "text-primary border-primary/50" : "text-amber-300 border-amber-400/30";

  const openEditorOn = (tab: ProjectEditTab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!secret || !globalThis.confirm("Точно удалить проект?")) {
      return;
    }

    try {
      await deleteProject(project.id, secret);
      navigate("/projects");
    } catch {
      globalThis.alert("Ошибка удаления");
    }
  };

  return (
    <main className="pb-20 pt-20 md:pt-24">
      <section className="relative mx-3 overflow-hidden rounded-[2rem] border border-border sm:mx-5">
        {project.image ? (
          <img
            src={project.image}
            alt={`Баннер ${project.name}`}
            className="h-[43vh] min-h-[280px] w-full object-cover md:h-[52vh]"
          />
        ) : (
          <div
            className="h-[43vh] min-h-[280px] w-full md:h-[52vh]"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 40%), linear-gradient(125deg, var(--bg-elevated), var(--surface))",
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 60%)" }}
          aria-hidden="true"
        />

        <div className="absolute bottom-0 left-0 z-20 w-full p-6 md:p-10">
          <Link to="/projects" className="mb-5 inline-flex items-center gap-2 text-sm text-text/70 transition-colors hover:text-primary">
            <ArrowLeft size={14} />
            Все проекты
          </Link>
          <h1
            className="max-w-4xl text-3xl font-bold text-text sm:text-5xl"
            style={{ textShadow: "0 0 18px color-mix(in srgb, var(--primary) 38%, transparent)" }}
          >
            {project.name}
          </h1>
        </div>
      </section>

      <section className="section-shell pt-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] xl:gap-10">
          <div className="space-y-8">
            <article className="surface-panel rounded-3xl p-6 md:p-8">
              <h2 className="section-title text-[clamp(1.55rem,2.5vw,2rem)]">Описание</h2>
              <p className="mt-4 text-[1.1rem] leading-[1.8] text-text">{project.longDescription || project.description}</p>
            </article>

            <article className="surface-panel rounded-3xl p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="section-title text-[clamp(1.5rem,2.2vw,1.9rem)]">Этапы разработки</h2>
                {isAdmin && (
                  <button
                    type="button"
                    className="button-secondary py-2 px-4 text-sm"
                    onClick={() => openEditorOn("development")}
                  >
                    <Milestone size={14} />
                    Добавить этап
                  </button>
                )}
              </div>

              {(project.developmentProcess ?? []).length > 0 ? (
                <ol className="space-y-4">
                  {(project.developmentProcess ?? []).map((stage, index, rows) => (
                    <TimelineItem
                      key={`${stage.title}-${index}`}
                      title={stage.title}
                      description={stage.description}
                      index={index}
                      dateLabel={index === rows.length - 1 ? dateLabel : `Stage ${index + 1}`}
                    />
                  ))}
                </ol>
              ) : (
                <div className="card-glass rounded-2xl p-5 text-sm text-muted">Этапы пока не добавлены.</div>
              )}
            </article>

            <article className="surface-panel rounded-3xl p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="section-title text-[clamp(1.5rem,2.2vw,1.9rem)]">Галерея</h2>
                {isAdmin && (
                  <button
                    type="button"
                    className="button-secondary py-2 px-4 text-sm"
                    onClick={() => openEditorOn("media")}
                  >
                    <ImagePlus size={14} />
                    Добавить медиа
                  </button>
                )}
              </div>

              {mediaItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {mediaItems.map((mediaUrl, index) => {
                    const isTall = index % 5 === 0;
                    return (
                      <button
                        type="button"
                        key={`${mediaUrl}-${index}`}
                        className={`group relative overflow-hidden rounded-2xl border border-border ${isTall ? "sm:row-span-2" : ""}`}
                        onClick={() => setLightboxIndex(index)}
                      >
                        <img
                          src={mediaUrl}
                          alt={`Кадр проекта ${project.name} ${index + 1}`}
                          className={`w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-110 ${isTall ? "h-[25rem]" : "h-52"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="card-glass rounded-2xl p-5 text-sm text-muted">Галерея пока пуста.</div>
              )}
            </article>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-panel rounded-3xl p-5 md:p-6">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">Metadata</h3>

              <div className="mb-4">
                <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="mb-5">
                <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Tech stack</p>
                <ul className="grid grid-cols-3 gap-2">
                  {project.stack.map((item) => (
                    <li key={item} className="card-glass rounded-xl px-2 py-3 text-center text-[0.72rem] text-text/88">
                      <div className="mb-1.5 flex justify-center">
                        <TechIcon slug={getTechSlug(item)} name={item} size={20} />
                      </div>
                      <span className="line-clamp-2 block leading-4">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5 flex flex-col gap-2.5">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="button-secondary py-2.5 text-sm">
                    <GitHubIcon size={14} />
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="button-secondary py-2.5 text-sm">
                    <ExternalLink size={14} />
                    Live demo
                  </a>
                )}
              </div>

              <div className="mb-4 inline-flex items-center gap-2 text-sm text-muted">
                <CalendarDays size={14} />
                Created: {dateLabel}
              </div>

              {isAdmin && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="button-secondary py-2 px-4 text-sm" onClick={() => openEditorOn("basic")}>
                    <Edit2 size={14} />
                    Изменить
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-400"
                    onClick={handleDelete}
                  >
                    <Trash2 size={14} />
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {lightboxIndex !== null && mediaItems[lightboxIndex] && (
        <dialog open className="fixed inset-0 z-[120] m-0 flex h-screen w-screen items-center justify-center border-none bg-black/80 px-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Закрыть просмотр изображения"
            onClick={() => setLightboxIndex(null)}
          />
          <button
            type="button"
            className="absolute right-5 top-5 z-10 rounded-full border border-border bg-bg-elevated p-2 text-text"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex(null);
            }}
            aria-label="Закрыть просмотр изображения"
          >
            <X size={16} />
          </button>
          <img
            src={mediaItems[lightboxIndex]}
            alt={`Увеличенное изображение ${project.name}`}
            className="z-10 max-h-[88vh] max-w-[92vw] rounded-2xl border border-border object-contain"
            style={{ animation: "scale-in 0.25s ease forwards" }}
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
