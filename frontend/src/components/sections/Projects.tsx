import { useProjects } from "../../hooks/useProjects";
import { useInView } from "../../hooks/useInView";
import ProjectCard from "../ui/ProjectCard";

export default function Projects() {
  const [ref, inView] = useInView<HTMLElement>(0.1);
  const { projects, loading, error } = useProjects();

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="max-w-6xl mx-auto px-4 py-24 relative"
    >
      {/* ── Background blobs ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center"
      >
        <div className="w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-12">
        <h2
          id="projects-heading"
          className="text-3xl font-bold text-white mb-3"
        >
          Проекты
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Реальные вещи, которые я сделал. Открытый исходный код там, где это
          возможно.
        </p>
      </div>

      {/* Grid */}
      <ul
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
        aria-label="Список проектов"
      >
        {loading && (
          <li className="text-center text-gray-500 w-full col-span-full">
            Загрузка проектов...
          </li>
        )}
        {error && (
          <li className="text-center text-red-500 w-full col-span-full">
            {error}
          </li>
        )}
        {!loading && projects.length === 0 && (
          <li className="text-center text-gray-500 w-full col-span-full">
            Проекты не найдены
          </li>
        )}
        {projects.slice(0, 3).map((project, i) => (
          <li
            key={project.id}
            className={`${inView ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
