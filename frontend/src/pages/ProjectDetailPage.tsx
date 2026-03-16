import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useProject, deleteProject } from "../hooks/useProjects";
import { useAdmin } from "../context/AdminContext";
import SkillBadge from "../components/ui/SkillBadge";
import { ArrowLeft, Clock, Code2, ExternalLink, CheckCircle2, Edit2, Trash2, ImagePlus, Milestone } from "lucide-react";
import ProjectFormModal from "../components/admin/ProjectFormModal";

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

  if (loading) return <main className="min-h-screen pt-32 text-center text-gray-500">Загрузка проекта...</main>;
  if (error || !project) return <Navigate to="/projects" replace />;

  const handleDelete = async () => {
    if (!secret || !project.id || !confirm("Точно удалить?")) return;
    try {
      await deleteProject(project.id, secret);
      navigate("/projects");
    } catch {
      alert("Ошибка удаления");
    }
  };

  const {
    name,
    description,
    longDescription,
    stack,
    features,
    github,
    demo,
    accentColor,
    image,
    gallery,
    developmentProcess,
    devTime,
    language,
    createdAt,
  } = project;

  const mediaItems = [image, ...(gallery ?? [])].filter((item): item is string => Boolean(item?.trim()));

  const openEditorOn = (tab: ProjectEditTab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen pt-16 pb-16">
      <div className="relative overflow-hidden border-b border-gray-800">
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute left-[20%] top-[-10rem] h-[20rem] w-[20rem] rounded-full bg-orange-500/10 blur-[140px]" />
          <div className="absolute right-[8%] top-[6rem] h-[16rem] w-[16rem] rounded-full bg-red-500/8 blur-[120px]" />
          <div className="absolute -bottom-20 left-[52%] h-[14rem] w-[14rem] rounded-full bg-amber-500/10 blur-[110px]" />
        </div>

        <div className="relative max-w-[86rem] mx-auto px-3 py-14 md:px-5 md:py-20">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            Все проекты
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 xl:gap-10 items-stretch">
            <section className="rounded-2xl border border-gray-800/90 bg-gray-950/70 backdrop-blur-sm p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{name}</h1>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-orange-400 transition"
                      onClick={() => openEditorOn("basic")}
                      title="Редактировать проект"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg text-red-400 transition"
                      onClick={handleDelete}
                      title="Удалить проект"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-lg text-gray-300 leading-relaxed mb-5">{description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/80 border border-gray-800 px-3 py-1.5 text-sm text-gray-300">
                  <Code2 size={14} className="text-orange-400" aria-hidden="true" />
                  {language}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900/80 border border-gray-800 px-3 py-1.5 text-sm text-gray-300">
                  <Clock size={14} className="text-orange-400" aria-hidden="true" />
                  {devTime}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-900/80 border border-gray-800 px-3 py-1.5 text-sm text-gray-400">
                  Запуск: {createdAt}
                </span>
              </div>

              <p className="text-gray-300/90 leading-relaxed text-sm md:text-base">{longDescription}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 active:translate-y-0 rounded-lg font-semibold transition-[color,transform,box-shadow] duration-200 text-white text-sm"
                  >
                    <GitHubIcon size={16} />
                    Открыть на GitHub
                  </a>
                )}
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-orange-500/50 hover:border-orange-400 hover:bg-orange-500/10 hover:-translate-y-0.5 active:translate-y-0 rounded-lg font-semibold transition-all duration-200 text-gray-300 hover:text-white text-sm"
                  >
                    Live Demo
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-800/90 bg-gray-950/70 backdrop-blur-sm p-4 md:p-5">
              {image ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/40">
                  <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accentColor} z-10`} aria-hidden="true" />
                  <img src={image} alt={`Превью проекта ${name}`} className="w-full aspect-video object-cover" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 aspect-video flex items-center justify-center text-sm text-gray-500">
                  У проекта пока нет главного изображения
                </div>
              )}

              <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                <h2 className="text-sm font-semibold text-gray-200 mb-3">Технологический стек</h2>
                <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                  {stack.map((tech) => (
                    <li key={tech}>
                      <SkillBadge label={tech} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="max-w-[86rem] mx-auto px-3 py-12 md:px-5 space-y-10">
        <section className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${accentColor}`} aria-hidden="true" />
            <span>Ключевые возможности</span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
            {features.map((feature) => (
              <li key={feature} className="rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${accentColor}`} aria-hidden="true" />
              <span>Этапы разработки</span>
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={() => openEditorOn("development")}
                className="inline-flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-sm text-orange-300 hover:bg-orange-500/20 transition"
              >
                <Milestone size={14} />
                Добавить этап
              </button>
            )}
          </div>

          {(developmentProcess ?? []).length > 0 ? (
            <ol className="space-y-4 list-none p-0 m-0">
              {(developmentProcess ?? []).map((stage, index) => (
                <li key={`${stage.title}-${index}`} className="relative rounded-xl border border-gray-800 bg-gray-900/60 p-4 md:p-5">
                  <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-orange-500 to-red-500" aria-hidden="true" />
                  <div className="pl-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Этап {index + 1}</p>
                    <h3 className="text-white font-semibold mb-1.5">{stage.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-5 text-sm text-gray-400">
              Этапы разработки еще не добавлены.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${accentColor}`} aria-hidden="true" />
              <span>Медиа</span>
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={() => openEditorOn("media")}
                className="inline-flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-sm text-orange-300 hover:bg-orange-500/20 transition"
              >
                <ImagePlus size={14} />
                Добавить медиа
              </button>
            )}
          </div>

          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {mediaItems.map((mediaUrl, index) => (
                <figure key={`${mediaUrl}-${index}`} className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900/60">
                  <img
                    src={mediaUrl}
                    alt={`Медиа проекта ${name} ${index + 1}`}
                    className="w-full h-56 object-cover"
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-5 text-sm text-gray-400">
              В галерее пока пусто. Добавьте изображения в режиме редактирования.
            </div>
          )}
        </section>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
            Все проекты
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-800 hover:border-orange-500/50 hover:bg-orange-500/10 rounded-lg font-semibold transition-all duration-200 text-gray-300 hover:text-white text-sm"
          >
            Обсудить проект
          </Link>
        </div>
      </div>

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
