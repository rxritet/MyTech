import { useInView } from "../../hooks/useInView";

// ── Skill categories data ──────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    category: "Backend",
    skills: ["Go", "Python", "TypeScript", "Django RF", "FastAPI", "net/http", "Cobra CLI"],
  },
  {
    category: "База данных",
    skills: ["PostgreSQL", "BoltDB", "Drizzle ORM", "SQL"],
  },
  {
    category: "Frontend / Mobile",
    skills: ["React 19", "Flutter", "Dart", "TypeScript", "Tailwind CSS", "TanStack Query", "Zustand"],
  },
  {
    category: "DevOps",
    skills: ["Docker", "Nginx", "systemd", "rsync", "GitHub Actions", "Mage"],
  },
  {
    category: "Безопасность",
    skills: ["XSS", "CSRF", "SQL-инъекции", "OSINT", "TryHackMe"],
  },
];

const FACTS = [
  { value: "4+", label: "проекта" },
  { value: "2й", label: "курс SE" },
  { value: "🦀", label: "учу Rust" },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function About() {
  const [ref, inView] = useInView<HTMLElement>(0.1);

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="max-w-6xl mx-auto px-4 py-24"
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2
          id="about-heading"
          className="text-3xl font-bold text-white mb-3"
        >
          Обо мне
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          Кто я и как работаю
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* ── Left column: bio + stats ────────────────────────────── */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-gray-300 leading-body text-base prose-text">
            Студент 2-го курса Software Engineering из Алматы. Моя цель —
            стать сильным Backend-разработчиком с основным фокусом на Go и
            пониманием всего цикла разработки (Full-Stack).
          </p>
          <p className="text-gray-300 leading-body text-base prose-text">
            Пишу чистый код, ценю конкретику и системный подход. Сейчас активно
            работаю над собственными проектами, расширяю стек — в том числе
            начинаю Rust — и открыт к первым коммерческим ролям.
          </p>

          {/* Facts row */}
          <ul
            className="flex gap-6 list-none p-0 m-0 mt-2"
            aria-label="Факты"
          >
            {FACTS.map(({ value, label }) => (
              <li key={label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {value}
                </span>
                <span className="text-xs text-gray-500">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right column: skill categories ──────────────────────── */}
        <div
          className={`flex flex-col gap-5 transition-all duration-700 delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {SKILL_CATEGORIES.map(({ category, skills }) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-sm font-mono text-gray-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
