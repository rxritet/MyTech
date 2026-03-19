import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Edit2, Plus, Trash2 } from "lucide-react";
import type { Project, Technology } from "../../api";
import { getTechnologies } from "../../api";
import { useAdmin } from "../../context/AdminContext";
import { deleteProject, useProjects } from "../../hooks/useProjects";
import { useInView } from "../../hooks/useInView";
import ProjectFormModal from "../admin/ProjectFormModal";
import TechIcon from "../TechIcon";
import { getTechSlug } from "./techSlugMap";
import StatusBadge from "./StatusBadge";

function useTechnologyMap() {
  const [techs, setTechs] = useState<Technology[]>([]);

  useEffect(() => {
    void getTechnologies()
      .then((rows) => setTechs(rows))
      .catch(() => setTechs([]));
  }, []);

  return useMemo(() => {
    return new Map(techs.map((item) => [item.name.toLowerCase(), item]));
  }, [techs]);
}

function ProjectGridCard({
  project,
  index,
  isAdmin,
  onEdit,
  onDelete,
  technologyMap,
}: Readonly<{
  project: Project;
  index: number;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  technologyMap: Map<string, Technology>;
}>) {
  const [ref, inView] = useInView<HTMLLIElement>(0.14);

  return (
    <li
      ref={ref}
      className={inView ? "animate-fade-in-up" : "opacity-0"}
      style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group card-glass relative flex h-full flex-col overflow-hidden rounded-3xl p-4 md:p-5"
        style={{ boxShadow: "0 0 0 transparent" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: "0 0 32px color-mix(in srgb, var(--primary) 18%, transparent)" }}
          aria-hidden="true"
        />

        {isAdmin && (
          <div className="absolute right-6 top-12 z-20 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              className="rounded-xl border border-border bg-bg-elevated/90 p-2 text-primary"
              onClick={(event) => {
                event.preventDefault();
                onEdit(project);
              }}
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              className="rounded-xl border border-border bg-bg-elevated/90 p-2 text-red-400"
              onClick={(event) => {
                event.preventDefault();
                onDelete(project.id);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        <div className="relative mb-4 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
          {project.image ? (
            <div className="relative flex min-h-[220px] items-center justify-center">
              <img
                src={project.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl"
                loading="lazy"
                decoding="async"
              />
              <img
                src={project.image}
                alt={`Превью ${project.name}`}
                className="relative z-10 block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--primary) 28%, transparent), color-mix(in srgb, var(--primary) 2%, var(--bg)))",
              }}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-[clamp(1.1rem,2vw,1.3rem)] font-bold leading-tight text-text transition-colors group-hover:text-primary">
              {project.name}
            </h2>
            <StatusBadge status={project.status} />
          </div>
          <p
            className="mb-4 text-[0.92rem] leading-6 text-muted"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>

          <ul className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {project.stack.map((tech) => {
              const fromCatalog = technologyMap.get(tech.toLowerCase());
              const iconSlug = fromCatalog?.deviconSlug ?? getTechSlug(tech);
              return (
                <li key={`${project.id}-${tech}`} className="shrink-0">
                  <span className="eyebrow-chip text-[0.73rem]">
                    <TechIcon
                      slug={iconSlug}
                      fallbackSrc={fromCatalog?.badgeUrl ?? null}
                      name={tech}
                      size={14}
                    />
                    {tech}
                  </span>
                </li>
              );
            })}
          </ul>

          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View project
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function ProjectsCatalogView() {
  const { projects, loading, error, refetch } = useProjects();
  const { isAdmin, secret } = useAdmin();
  const navigate = useNavigate();
  const technologyMap = useTechnologyMap();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleDelete = async (id: number) => {
    if (!secret || !globalThis.confirm("Точно удалить проект?")) {
      return;
    }

    try {
      await deleteProject(id, secret);
      await refetch();
    } catch {
      globalThis.alert("Не удалось удалить проект");
    }
  };

  return (
    <section className="section-shell pt-30 min-[375px]:pt-32" aria-labelledby="projects-page-title">
      <div className="section-heading animate-fade-in-up">
        <p className="section-kicker">portfolio showcase</p>
        <h1 id="projects-page-title" className="section-title">
          Проекты
        </h1>
        <p className="section-copy">
          Действующие продукты, эксперименты и инженерные кейсы. Внутри каждой карточки: стек,
          процесс и итоговая реализация.
        </p>
        {isAdmin && (
          <button
            type="button"
            className="button-primary mt-6 inline-flex py-2 px-5 text-sm"
            onClick={() => navigate("/projects/add")}
          >
            <Plus size={15} />
            Добавить проект
          </button>
        )}
      </div>

      <ul
        className="grid grid-cols-1 gap-5 min-[768px]:grid-cols-2 min-[768px]:gap-6 min-[1280px]:grid-cols-3 min-[1280px]:gap-7 min-[1440px]:gap-8"
        aria-label="Список проектов"
      >
        {loading && <li className="text-center text-muted md:col-span-2 xl:col-span-3">Загрузка проектов...</li>}
        {error && <li className="text-center text-red-400 md:col-span-2 xl:col-span-3">{error}</li>}
        {!loading && !error && projects.length === 0 && (
          <li className="text-center text-muted md:col-span-2 xl:col-span-3">Пока нет опубликованных проектов</li>
        )}
        {!loading && !error &&
          projects.map((project, index) => (
            <ProjectGridCard
              key={project.id}
              project={project}
              index={index}
              isAdmin={isAdmin}
              onEdit={(item) => {
                setEditingProject(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              technologyMap={technologyMap}
            />
          ))}
      </ul>

      {isAdmin && secret && (
        <ProjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={editingProject}
          secret={secret}
          onSuccess={refetch}
        />
      )}
    </section>
  );
}
