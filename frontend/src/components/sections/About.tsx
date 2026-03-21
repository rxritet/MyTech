import { useState, useEffect, type ReactNode } from "react";
import {
  Download,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Send,
  Mail,
  Server,
  Layers,
  Smartphone,
  Shield,
  BookOpen,
  Edit,
  Loader2,
  Target,
} from "lucide-react";
import { useInView } from "../../hooks/useInView";
import { useAdmin } from "../../context/AdminContext";
import { AboutData, getAbout, getAboutStack, type PublicStackItem } from "../../api";
import AboutFormModal from "../admin/AboutFormModal";
import TechIcon from "../TechIcon";

// ── Helpers ────────────────────────────────────────────────────

function GitHubIcon({ size = 18 }: Readonly<{ size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: Readonly<{ size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 17.34V9.97H5.9V17.34H8.34ZM7.12 8.96A1.41 1.41 0 1 0 7.12 6.14A1.41 1.41 0 0 0 7.12 8.96ZM18.1 17.34V13.3C18.1 11.13 16.94 10.12 15.39 10.12C14.14 10.12 13.58 10.81 13.27 11.3V10.29H10.83C10.86 10.96 10.83 17.34 10.83 17.34H13.27V13.22C13.27 13 13.29 12.78 13.35 12.62C13.52 12.18 13.91 11.72 14.56 11.72C15.41 11.72 15.75 12.37 15.75 13.31V17.34H18.1Z" />
    </svg>
  );
}

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  server:     <Server size={22} />,
  layers:     <Layers size={22} />,
  smartphone: <Smartphone size={22} />,
  shield:     <Shield size={22} />,
  "Backend-разработка": <Server size={22} />,
  "Full-Stack проекты": <Layers size={22} />,
  "Мобильная разработка": <Smartphone size={22} />,
  "Веб-безопасность": <Shield size={22} />,
};

function getFocusIcon(area: { title: string; iconKey?: string }) {
  return FOCUS_ICONS[area.iconKey || area.title] || <Target size={22} />;
}

// Fade-in-up wrapper that fires useInView individually per section
function Section({
  children,
  className = "",
  delay = 0,
}: Readonly<{
  children: ReactNode;
  className?: string;
  delay?: number;
}>) {
  const [ref, inView] = useInView<HTMLDivElement>(0.08);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="text-xs font-mono text-primary tracking-widest uppercase mb-2">
      {"// "}{children}
    </p>
  );
}

function SectionHeading({ children }: Readonly<{ children: ReactNode }>) {
  return <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">{children}</h2>;
}

function getCompetencySummary(skill: string): string {
  const normalized = skill.toLowerCase();

  if (normalized.includes("rest")) {
    return "Проектирую понятные API-контракты, версии и предсказуемые ответы.";
  }
  if (normalized.includes("архитектур")) {
    return "Разделяю слои, чтобы код оставался поддерживаемым при росте проекта.";
  }
  if (normalized.includes("sql") || normalized.includes("миграц")) {
    return "Строю схемы данных и аккуратно веду миграции без потери целостности.";
  }
  if (normalized.includes("docker") || normalized.includes("ci/cd")) {
    return "Автоматизирую сборку и доставку, чтобы релизы были стабильными.";
  }
  if (normalized.includes("адаптив")) {
    return "Делаю интерфейсы удобными на мобильных, планшетах и десктопе.";
  }
  if (normalized.includes("git")) {
    return "Работаю с ветками и ревью так, чтобы изменения были прозрачными.";
  }
  if (normalized.includes("тестир")) {
    return "Проверяю критичные сценарии и edge-cases до выкладки в прод.";
  }
  if (normalized.includes("систем")) {
    return "Декомпозирую задачу на шаги и держу фокус на конечном результате.";
  }

  return "Практический навык, который применяю в рабочих и учебных задачах.";
}

// ── Component ──────────────────────────────────────────────────

export default function About() {
  const { isAdmin, secret } = useAdmin();
  const [data, setData] = useState<AboutData | null>(null);
  const [aboutStackItems, setAboutStackItems] = useState<PublicStackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [fetched, stackRows] = await Promise.all([getAbout(), getAboutStack()]);
        setData(fetched);
        setAboutStackItems(stackRows);
      } catch {
        setError("Не удалось загрузить данные страницы.");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!data) {
    return (
      <article id="about" className="max-w-[86rem] mx-auto px-3 py-20 sm:px-5 lg:px-6 relative">
        <div className="surface-panel rounded-2xl p-6 text-text/88">
          {error ?? "Данные страницы пока недоступны."}
        </div>
      </article>
    );
  }

  const apiCategories = Array.from(new Set(aboutStackItems.map((item) => item.category)));

  const apiGroups = apiCategories
    .map((category) => {
      const items = aboutStackItems
        .filter((item) => item.category === category)
        .sort((a, b) => a.order - b.order);

      return {
        title: category,
        description: "",
        names: items.map((item) => item.name),
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  const groupsToRender = apiGroups;
  const quickStats = [
    { value: "2+", label: "года в разработке" },
    { value: "10+", label: "pet-проектов" },
    { value: "3", label: "языка в стеке" },
    { value: "KZ", label: "Алматы" },
  ];

  return (
    <article id="about" className="max-w-[86rem] mx-auto px-3 py-20 sm:px-5 lg:px-6 space-y-16 md:space-y-20 relative">
      <div className="grid w-full max-w-5xl mx-auto grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 px-3 sm:px-6 mb-16">
        {quickStats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <span className="text-4xl font-bold text-white">{s.value}</span>
            <span className="text-sm text-white/40 font-mono">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── 1. PAGE HEADER ─────────────────────── */}
      <Section className="text-center space-y-4">
        <p className="text-sm font-mono text-primary tracking-widest uppercase mb-1">{"// about.me"}</p>
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter">
          Привет, я{" "}
          <span className="text-primary underline decoration-[4px] underline-offset-8">
            {data.name.split(" ")[0]}
          </span>
        </h1>
        <p className="text-text/88 text-xl sm:text-2xl font-normal">
          {data.tagline} · {data.university} · {data.location}
        </p>

        {isAdmin && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/5"
            >
              <Edit size={18} />
              Редактировать
            </button>
          </div>
        )}
      </Section>

      {/* ── 2. PROFILE CARD ────────────────────── */}
      <Section delay={50}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start p-8 sm:p-12 rounded-3xl bg-surface/40 backdrop-blur-md border border-border shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
          
          {/* Left col — avatar + actions */}
          <div className="shrink-0 w-full sm:w-72 flex flex-col items-center gap-6 mx-auto lg:mx-0 z-10">
            <div className="relative group/img">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-primary/30 to-transparent opacity-50 group-hover/img:opacity-100 transition duration-500" />
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="relative w-52 h-64 sm:w-64 sm:h-80 rounded-2xl object-cover border border-white/5 shadow-2xl transition duration-500 group-hover/img:scale-[1.02]"
              />
            </div>

            {/* Resume btn */}
            <a
              href={data.resumeUrl}
              download={`${data.name.replace(" ", "_")}_Resume.pdf`}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary hover:bg-orange-600 hover:shadow-lg hover:shadow-primary/20 active:scale-95 text-white font-bold text-base transition-all duration-300"
            >
              <Download size={20} />
              Resume ↓
            </a>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {[
                { href: data.githubUrl,   icon: <GitHubIcon size={15} />,   label: "GitHub" },
                { href: data.linkedinUrl, icon: <LinkedInIcon size={15} />, label: "LinkedIn" },
                { href: data.telegramUrl, icon: <Send size={15}/>,          label: "Telegram" },
                { href: `mailto:${data.email}`, icon: <Mail size={15}/>,    label: data.email },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/50 border border-border text-text/85 text-xs hover:text-white hover:border-primary/50 hover:bg-surface transition-all duration-300"
                  aria-label={label}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right col — bio */}
          <div className="flex-1 space-y-8 z-10 pt-4">
            <div className="space-y-6">
              <p className="text-text text-xl sm:text-2xl leading-relaxed font-medium">{data.bio1}</p>
              <p className="text-text/84 text-lg sm:text-xl leading-relaxed">{data.bio2}</p>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gray-900/50 border border-border text-text/85">
                <GraduationCap size={16} className="text-primary/70" /> {data.university}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gray-900/50 border border-border text-text/85">
                <MapPin size={16} className="text-primary/70" /> {data.location}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-primary/5 border border-primary/15 text-primary">
                <Briefcase size={16} /> Ищу первую коммерческую роль
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Go · Backend", "TypeScript · Frontend", "Java · Enterprise"].map((label) => (
                <span key={label} className="eyebrow-chip text-xs">{label}</span>
              ))}
            </div>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {data.status}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. QUOTE ───────────────────────────── */}
      <Section delay={80}>
        <div className="surface-panel rounded-2xl p-7 md:p-10 relative overflow-hidden">
          <span
            className="absolute top-4 right-7 text-8xl font-serif leading-none select-none pointer-events-none"
            style={{ color: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
            aria-hidden="true"
          >
            "
          </span>
          <p className="italic text-text text-lg sm:text-xl leading-relaxed max-w-3xl relative z-10">
            {data.quote}
          </p>
          <p className="mt-4 text-xs font-mono text-primary/70 tracking-widest uppercase">
            — {data.name}
          </p>
        </div>
      </Section>

      {/* ── 4. TECH STACK ──────────────────────── */}
      <Section>
        <SectionLabel>stack</SectionLabel>
        <SectionHeading>Технологии</SectionHeading>
        {groupsToRender.length === 0 ? (
          <div className="surface-panel rounded-[1.6rem] p-6 text-sm text-text/82">
            Стек будет добавлен в ближайшее время.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {groupsToRender.map((group) => {
              const namesArr = group.names;
              const textDesc = group.description;
              return (
                <div
                  key={group.title}
                  className="surface-panel rounded-[1.6rem] p-5 sm:p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                      {textDesc ? (
                        <p className="mt-2 max-w-xl text-sm leading-6 text-text/82">{textDesc}</p>
                      ) : null}
                    </div>
                    {namesArr.length > 0 && (
                      <span className="eyebrow-chip shrink-0">{namesArr.length} items</span>
                    )}
                  </div>

                  {namesArr.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {namesArr.map((name) => {
                        const apiItem = group.items.find((item) => item.name === name);
                        return (
                          <div
                            key={name}
                            className="group flex flex-col items-center gap-1.5 w-16 cursor-default"
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface border border-border group-hover:border-primary/40 group-hover:shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_15%,transparent)] transition-all duration-300"
                            >
                              <TechIcon
                                slug={apiItem?.deviconSlug ?? null}
                                name={name}
                                size={24}
                                fallbackSrc={apiItem?.badgeUrl ?? null}
                              />
                            </div>
                            <span className="text-[10px] text-text/78 text-center leading-tight group-hover:text-text transition-colors truncate w-full text-center">
                              {name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── 5. FOCUS AREAS ─────────────────────── */}
      <Section>
        <SectionLabel>focus</SectionLabel>
        <SectionHeading>Чем занимаюсь</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.focusAreas.map((f) => (
            <div
              key={`${f.title}-${f.desc}`}
              className="flex gap-4 p-5 rounded-xl bg-surface border border-border border-l-2 hover:border-primary/40 transition-colors duration-300"
              style={{ borderLeftColor: "color-mix(in srgb, var(--primary) 40%, transparent)" }}
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {getFocusIcon(f)}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-sm">{f.title}</h3>
                <p className="text-text/82 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. COMPETENCIES ────────────────────── */}
      <Section>
        <SectionLabel>skills</SectionLabel>
        <SectionHeading>Компетенции</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {data.competencies.map((c) => (
            <article
              key={c}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_10%,transparent)]"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 55%, transparent), transparent)" }}
                aria-hidden="true"
              />
              <div className="mb-2 h-1" />
              <h3 className="text-sm font-semibold leading-6 text-text">{c}</h3>
              <p className="mt-1 text-xs leading-5 text-text/80">{getCompetencySummary(c)}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ── 7. PROJECTS ────────────────────────── */}
      <Section>
        <SectionLabel>projects</SectionLabel>
        <SectionHeading>Проекты</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.projects.map((p) => {
            const cardContent = (
              <>
                <div className="flex items-start justify-between mb-3 gap-3">
                  <h3 className="text-white font-semibold text-base group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  {p.github && (
                    <span className="text-text/70 group-hover:text-primary transition-colors p-1" aria-hidden="true">
                      <GitHubIcon size={16} />
                    </span>
                  )}
                </div>
                <p className="text-text/82 text-sm leading-relaxed flex-1 mb-5">{p.desc}</p>
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.split(" · ").map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/8 border border-primary/20 text-primary/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {p.github ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary/80 group-hover:text-primary transition-colors">
                      GitHub
                      <ExternalLink size={12} aria-hidden="true" />
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (p.github) {
              return (
                <a
                  key={p.name}
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 rounded-xl bg-surface border border-border hover:border-primary/40 hover:shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_10%,transparent)] transition-colors duration-300 cursor-pointer"
                  style={{ borderTop: "2px solid color-mix(in srgb, var(--primary) 35%, transparent)" }}
                  aria-label={`Открыть репозиторий проекта ${p.name}`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div
                key={p.name}
                className="group flex flex-col p-5 rounded-xl bg-surface border border-border hover:shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_10%,transparent)] transition-colors duration-300"
                style={{ borderTop: "2px solid color-mix(in srgb, var(--primary) 35%, transparent)" }}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 8. EDUCATION REPOS ─────────────────── */}
      <Section>
        <SectionLabel>learning</SectionLabel>
        <SectionHeading>Учебные репозитории</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {data.education.map((e) => (
            <a
              key={e.name}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border bg-surface p-3.5 transition-all duration-300 hover:border-primary/35 hover:shadow-[0_0_14px_color-mix(in_srgb,var(--primary)_8%,transparent)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated text-primary">
                  <BookOpen size={13} className="group-hover:scale-110 transition-transform" />
                </span>
                <ExternalLink size={11} className="shrink-0 text-text/55 transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-2 text-sm font-semibold leading-snug text-text transition-colors group-hover:text-primary">{e.name}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-text/80">{e.desc}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* ── 9. HOBBIES ─────────────────────────── */}
      <Section>
        <SectionLabel>off_duty</SectionLabel>
        <SectionHeading>Вне кода</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {data.hobbies.map((h) => (
            <div
              key={h.title}
              className="p-6 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors duration-300"
            >
              <span className="text-3xl block mb-4" role="img" aria-label={h.title}>
                {h.emoji}
              </span>
              <h3 className="text-white font-semibold mb-1 text-sm">{h.title}</h3>
              <p className="text-text/82 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <AboutFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        secret={secret ?? ""}
        onSuccess={(updated) => setData(updated)}
      />

    </article>
  );
}
