import { Link } from "react-router-dom";
import { PROJECTS } from "../data/projects";
import { useInView } from "../hooks/useInView";
import SkillBadge from "../components/ui/SkillBadge";
import { ArrowRight, Clock, Code2 } from "lucide-react";

function GitHubIcon({ size = 14 }: Readonly<{ size?: number }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ProjectCard({ project, index }: Readonly<{ project: typeof PROJECTS[0]; index: number }>) {
  const [ref, inView] = useInView<HTMLLIElement>(0.1);
  const { slug, name, description, stack, github, accentColor, image, devTime, language } = project;

  return (
    <li
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        to={`/projects/${slug}`}
        className="group flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/40 h-full"
        aria-label={`Открыть детали проекта ${name}`}
      >
        {/* Preview */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
          <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accentColor} z-10`} aria-hidden="true" />
          {image && (
            <img
              src={image}
              alt={`Превью ${name}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" aria-hidden="true" />

          {/* Meta badges over image */}
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-gray-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Code2 size={10} aria-hidden="true" />
              {language}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-300 bg-gray-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Clock size={10} aria-hidden="true" />
              {devTime}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {name}
            </h3>
            <ArrowRight
              size={16}
              className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
              aria-hidden="true"
            />
          </div>

          <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">{description}</p>

          <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0" aria-label="Технологии">
            {stack.slice(0, 5).map((tech) => (
              <li key={tech}>
                <SkillBadge label={tech} />
              </li>
            ))}
            {stack.length > 5 && (
              <li>
                <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-800 rounded-full">
                  +{stack.length - 5}
                </span>
              </li>
            )}
          </ul>

          {github && (
            <div className="flex items-center gap-3 pt-1 border-t border-gray-800">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <GitHubIcon size={12} />
                {github.replace("https://github.com/", "")}
              </span>
              <span className="ml-auto text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors font-medium">
                Подробнее →
              </span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="max-w-6xl mx-auto px-4 py-24" aria-labelledby="projects-page-heading">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-mono mb-3 tracking-widest uppercase">Портфолио</p>
          <h1 id="projects-page-heading" className="text-4xl font-bold text-white mb-4">
            Мои проекты
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Реальные вещи, которые я построил — от Go-бэкендов до Flutter-приложений.
            Нажми на проект, чтобы узнать подробности.
          </p>
        </div>

        {/* Grid */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0"
          aria-label="Список проектов"
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}
