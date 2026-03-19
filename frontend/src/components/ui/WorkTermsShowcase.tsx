import { Link } from "react-router-dom";
import { useInView } from "../../hooks/useInView";

const FORMATS = [
  {
    icon: "🛠️",
    title: "Fixed scope",
    desc: "Четкая спецификация, фиксированный бюджет и предсказуемые этапы.",
    points: ["Оценка и декомпозиция", "План релиза", "Сдача по milestone"],
    popular: false,
  },
  {
    icon: "⚡",
    title: "Sprint model",
    desc: "Итерационная работа с недельными демо и гибким бэклогом.",
    points: ["Приоритеты каждую неделю", "Прозрачные отчеты", "Быстрая обратная связь"],
    popular: true,
  },
  {
    icon: "🤝",
    title: "Long-term support",
    desc: "Техническое сопровождение и развитие продукта после запуска.",
    points: ["Поддержка продакшна", "Доработки и оптимизация", "Технический аудит"],
    popular: false,
  },
] as const;

const TAKE_ON = [
  "Backend API и интеграции",
  "React/TypeScript интерфейсы",
  "Архитектурные улучшения",
  "Оптимизацию производительности",
  "Контейнеризацию и деплой",
  "Системы админки и контента",
];

const DONT_TAKE_ON = [
  "Копирование чужих платных продуктов",
  "Фейковые отзывы и накрутки",
  "Проекты без четкого владельца",
  "Серые схемы монетизации",
];

function InViewSection({
  children,
  delay = 0,
}: Readonly<{ children: React.ReactNode; delay?: number }>) {
  const [ref, inView] = useInView<HTMLDivElement>(0.12);

  return (
    <div
      ref={ref}
      className={inView ? "animate-fade-in-up" : "opacity-0"}
      style={{ animationDelay: `${Math.min(delay, 400)}ms` }}
    >
      {children}
    </div>
  );
}

export default function WorkTermsShowcase() {
  return (
    <main className="section-shell pt-28">
      <div className="space-y-12">
        <InViewSection>
          <header className="relative overflow-hidden rounded-3xl border border-border py-14 text-center">
            <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 20%, var(--bg) 78%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 px-4">
              <span className="eyebrow-chip">collaboration format</span>
              <h1 className="mt-4 text-[clamp(2rem,6vw,3.4rem)] font-bold text-text">Условия работы</h1>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted md:text-lg">
                Прозрачный процесс, ясные договоренности и ответственность за результат на каждом этапе.
              </p>
            </div>
          </header>
        </InViewSection>

        <InViewSection delay={80}>
          <section className="grid gap-4 lg:grid-cols-3">
            {FORMATS.map((format) => (
              <article key={format.title} className="card-glass relative rounded-3xl border-t-2 border-t-primary p-5">
                {format.popular && <span className="eyebrow-chip absolute right-4 top-4 text-[0.7rem]">Most popular</span>}
                <span className="text-3xl" aria-hidden="true">{format.icon}</span>
                <h2 className="mt-3 text-xl font-semibold text-text">{format.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{format.desc}</p>
                <ul className="mt-4 space-y-2">
                  {format.points.map((point) => (
                    <li key={point} className="text-sm text-text/90">• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        </InViewSection>

        <InViewSection delay={160}>
          <section className="grid gap-6 lg:grid-cols-2">
            <article className="surface-panel rounded-3xl p-6">
              <h2 className="mb-4 text-2xl font-semibold text-text">Что беру в работу</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {TAKE_ON.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text/90">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-panel rounded-3xl p-6">
              <h2 className="mb-4 text-2xl font-semibold text-text">Что не беру</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {DONT_TAKE_ON.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text/90">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </InViewSection>

        <InViewSection delay={240}>
          <section
            className="surface-panel mx-auto max-w-3xl rounded-3xl p-8 text-center"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            <h2 className="text-2xl font-bold text-text md:text-3xl">Есть задача? Давай обсудим формат и сроки</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              На первом созвоне фиксируем цель, ограничения и ближайший рабочий шаг.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="button-primary py-2.5 px-6">Написать мне</Link>
              <Link to="/projects" className="button-secondary py-2.5 px-6">Посмотреть кейсы</Link>
            </div>
          </section>
        </InViewSection>
      </div>
    </main>
  );
}
