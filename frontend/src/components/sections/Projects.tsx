import { PROJECTS } from "../../data/projects";
import { useInView } from "../../hooks/useInView";
import ProjectCard from "../ui/ProjectCard";

export default function Projects() {
  const [ref, inView] = useInView<HTMLElement>(0.1);

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="max-w-6xl mx-auto px-4 py-24"
    >
      {/* Heading */}
      <div className="text-center mb-12">
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0"
        aria-label="Список проектов"
      >
        {PROJECTS.map((project, i) => (
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
