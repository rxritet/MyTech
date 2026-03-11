import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useProject, deleteProject } from "../hooks/useProjects";
import { useAdmin } from "../context/AdminContext";
import SkillBadge from "../components/ui/SkillBadge";
import { ArrowLeft, Clock, Code2, ExternalLink, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import ProjectFormModal from "../components/admin/ProjectFormModal";

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
    longDescription,
    stack,
    features,
    github,
    demo,
    accentColor,
    image,
    devTime,
    language,
    createdAt,
  } = project;

  return (
    <main className="min-h-screen pt-16">
      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-gray-800">
        {/* Gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none select-none">
          <div className="absolute left-[18%] top-[-12rem] h-[22rem] w-[22rem] rounded-full bg-orange-600/10 blur-[150px]" />
          <div className="absolute -bottom-28 right-[2%] h-[18rem] w-[18rem] rounded-full bg-amber-600/14 blur-[120px]" />
        </div>

        <div className="relative max-w-[86rem] mx-auto px-3 py-16 md:px-5 md:py-24">
          {/* Back link */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors mb-8 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
            Все проекты
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{name}</h1>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-orange-400 transition" onClick={() => setIsModalOpen(true)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-red-900/50 rounded-lg text-red-400 transition" onClick={handleDelete}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Code2 size={14} className="text-orange-400" aria-hidden="true" />
                  {language}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Clock size={14} className="text-orange-400" aria-hidden="true" />
                  {devTime}
                </span>
                <span className="text-sm text-gray-500">Начат в {createdAt}</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-base mb-8">{longDescription}</p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
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
            </div>

            {/* Right: image */}
            {image && (
              <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accentColor} z-10`} aria-hidden="true" />
                <img
                  src={image}
                  alt={`Превью проекта ${name}`}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-[86rem] mx-auto px-3 py-16 md:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Features — 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${accentColor}`} aria-hidden="true" />
              {" "}
              Ключевые возможности
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-orange-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack — sidebar */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${accentColor}`} aria-hidden="true" />
              {" "}
              Технологии
            </h2>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {stack.map((tech) => (
                <li key={tech}>
                  <SkillBadge label={tech} />
                </li>
              ))}
            </ul>

            {/* Quick stats */}
            <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Время разработки</span>
                <span className="text-sm font-semibold text-white">{devTime}</span>
              </div>
              <div className="h-px bg-gray-800" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Основной язык</span>
                <span className="text-sm font-semibold text-white">{language}</span>
              </div>
              <div className="h-px bg-gray-800" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Начат</span>
                <span className="text-sm font-semibold text-white">{createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation between projects */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex items-center justify-between">
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
        />
      )}
    </main>
  );
}
