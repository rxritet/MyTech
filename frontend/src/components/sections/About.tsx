import { useInView } from "../../hooks/useInView";
import { Send, Linkedin, Mail } from "lucide-react";

// ── DATA ───────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  { name: "Go", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  { name: "TypeScript", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { name: "Java", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  { name: "Python", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  { name: "React", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  { name: "Flutter", color: "text-blue-300 bg-blue-300/10 border-blue-300/20" },
  { name: "PostgreSQL", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { name: "Docker", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { name: "Django", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { name: "FastAPI", color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
  { name: "Tailwind CSS", color: "text-cyan-300 bg-cyan-300/10 border-cyan-300/20" },
  { name: "Nginx", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  { name: "Git", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  { name: "Linux", color: "text-yellow-300 bg-yellow-300/10 border-yellow-300/20" },
];

const FOCUS_AREAS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>
    ),
    title: "Backend-разработка",
    desc: "Go как основной язык, проектирование API, чистая архитектура и работа с базами данных.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    title: "Full-Stack проекты",
    desc: "Понимание всего цикла разработки — от фронтенда на React до деплоя через Docker и Nginx.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    ),
    title: "Мобильная разработка",
    desc: "Flutter/Dart для кросс-платформенных приложений с выразительным UI.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    title: "Веб-безопасность",
    desc: "Изучение основ: XSS, CSRF, SQL-инъекции, OSINT в рамках университетского курса.",
  },
];

const COMPETENCIES = [
  "RESTful API дизайн",
  "Чистая архитектура",
  "SQL и миграции БД",
  "Docker & CI/CD",
  "Адаптивная вёрстка",
  "Git-workflow",
  "Тестирование API",
  "Системный подход",
];

const PROJECTS = [
  { name: "SpoitHub", desc: "MVP маркетплейса спортивных мероприятий и товаров с CRM-панелью организатора", stack: "Django · React 19 · Vite" },
  { name: "HelpDesk", desc: "Система обратной связи через виджет: админ-панель, фильтрация, JWT-авторизация", stack: "Django · Nuxt 4 · Vue 3" },
  { name: "MyTech", desc: "Личный сайт-визитка с современным дизайном", stack: "React · TypeScript" },
];

const EDUCATION = [
  { name: "GoLang-Education", desc: "Углублённое изучение Go" },
  { name: "Frontend-Education", desc: "React, TypeScript, Tailwind" },
  { name: "Advanced-JS-Education", desc: "Продвинутый JavaScript" },
  { name: "Django-Education", desc: "Python / Django" },
  { name: "FastAPI-Education", desc: "FastAPI" },
  { name: "Velora", desc: "Первое знакомство с Rust" },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function About() {
  const [ref, inView] = useInView<HTMLElement>(0.05);

  const anim = (delay = 0) =>
    `transition-all duration-700 ${delay ? `delay-[${delay}ms]` : ""} ${
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="max-w-5xl mx-auto px-4 sm:px-6 py-24 space-y-20"
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim()}>
        {/* Big centered greeting */}
        <div className="text-center mb-12">
          <h2 id="about-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Привет, я <span className="text-primary">Радмир Абраев</span>
          </h2>
          <p className="text-gray-400 mt-3 text-base sm:text-lg">Backend Developer | Software Engineering Student</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Avatar & Resume Button */}
          <div className="relative shrink-0 mx-auto lg:mx-0 flex flex-col gap-5 items-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl" />
              <img
                src="https://res.cloudinary.com/dm6maaylh/image/upload/v1773151857/WhatsApp_Image_2026-02-13_at_20.47.57_hcpmqg.jpg"
                alt="Радмир Абраев"
                className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl object-cover border-2 border-primary/30 shadow-2xl"
              />
            </div>

            <a
              href="/resume.pdf"
              download="Radmir_Abraev_Resume.pdf"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-violet-700 text-white rounded-xl font-medium transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Скачать резюме
            </a>
          </div>

          {/* Bio */}
          <div className="space-y-5 flex-1">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">О себе</h3>
            </div>

            <p className="text-gray-300 text-base leading-relaxed">
              Студент 2-го курса Software Engineering в AlmaU, Алматы. Строю портфолио под первую коммерческую роль с основным фокусом на бэкенде: Go как главный язык, TypeScript на фронтенде, Java как третий стек в работе.
            </p>

            <p className="text-gray-300 text-base leading-relaxed">
              За последний год прошёл путь от Django и чистого JavaScript до Go, Flutter и полноценных full-stack проектов. Предпочитаю полный цикл разработки: проектирование архитектуры, работу с данными и создание удобных интерфейсов. Сейчас открыт к первым коммерческим ролям и интересным командам.
            </p>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-base text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                AlmaU
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Алматы
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Open to work
              </span>
            </div>

            {/* Social links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/rxritet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/radmir-abraev-186b393b0/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/rxritet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="mailto:abraevradmir2@gmail.com"
                className="p-2 rounded-lg bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. TECH STACK
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(100)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Технологический стек</h3>
        <p className="text-gray-400 text-base mb-6">Технологии и инструменты, с которыми я работаю</p>

        <div className="flex flex-wrap gap-3">
          {TECH_STACK.map((t) => (
            <span
              key={t.name}
              className={`px-4 py-2.5 rounded-full text-base font-medium border ${t.color} hover:scale-105 transition-transform duration-200 cursor-default`}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. CURRENT FOCUS — Cards
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(200)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Текущий фокус</h3>
        <p className="text-gray-500 text-sm mb-6">Направления, в которых я развиваюсь прямо сейчас</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FOCUS_AREAS.map((f) => (
            <div
              key={f.title}
              className="group p-5 rounded-xl bg-surface border border-white/10 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                {f.icon}
              </div>
              <h4 className="text-white font-semibold mb-1">{f.title}</h4>
              <p className="text-gray-400 text-base leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. COMPETENCIES
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(300)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Компетенции</h3>
        <p className="text-gray-500 text-sm mb-6">Навыки и практики, которые я активно применяю</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-6 rounded-xl bg-surface border border-white/10">
          {COMPETENCIES.map((c) => (
            <div key={c} className="flex items-center gap-3 text-base text-gray-300">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. PROJECTS
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(350)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Проекты</h3>
        <p className="text-gray-400 text-base mb-6">Реальные проекты, которые я разрабатываю</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="group p-5 rounded-xl bg-surface border border-white/10 hover:border-primary/50 transition-colors duration-300 flex flex-col"
            >
              <h4 className="text-white font-semibold mb-2">{p.name}</h4>
              <p className="text-gray-400 text-base leading-relaxed grow">{p.desc}</p>
              <span className="text-sm font-mono text-primary/70 mt-3 pt-3 border-t border-white/5">{p.stack}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. EDUCATION
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(400)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Обучение</h3>
        <p className="text-gray-400 text-base mb-6">Учебные репозитории, охватывающие пройденный путь</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {EDUCATION.map((e) => (
            <div key={e.name} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div>
                <span className="text-gray-200 font-medium text-base block">{e.name}</span>
                <span className="text-gray-500 text-sm">{e.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. OUTSIDE CODE
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className={anim(450)}>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Вне кода</h3>
        <p className="text-gray-400 text-base mb-6">Чем живу помимо разработки</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { emoji: "⚽", title: "Футбол", desc: "Играть, не смотреть. Командная игра — лучшая разгрузка." },
            { emoji: "🎵", title: "Музыка", desc: "От lo-fi для фокуса до тяжёлых треков, зависит от задачи." },
            { emoji: "🎮", title: "Игры", desc: "CoD, Ghost of Tsushima, MK, FNAF — атмосфера и геймплей." },
          ].map((h) => (
            <div
              key={h.title}
              className="p-5 rounded-xl bg-surface border border-white/10 hover:border-primary/50 transition-colors duration-300"
            >
              <span className="text-3xl mb-3 block">{h.emoji}</span>
              <h4 className="text-white font-semibold text-base mb-1">{h.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <blockquote className="border-l-2 border-primary/50 pl-5 py-2 italic text-gray-400 text-base leading-relaxed">
          «Прямой и конкретный. Не люблю воду ни в коде, ни в разговоре. Если берусь за задачу — довожу до результата.»
        </blockquote>
      </div>
    </section>
  );
}
