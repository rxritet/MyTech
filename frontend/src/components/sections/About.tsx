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
  CheckCircle2,
  BookOpen,
  Edit,
  Loader2,
  Target,
} from "lucide-react";
import { useInView } from "../../hooks/useInView";
import { useAdmin } from "../../context/AdminContext";
import { AboutData, getAbout } from "../../api";
import AboutFormModal from "../admin/AboutFormModal";
import {
  PROFILE as STATIC_PROFILE,
  HERO_BIO as STATIC_BIO,
  TECH_STACK as STATIC_STACK,
  FOCUS_AREAS as STATIC_FOCUS,
  COMPETENCIES as STATIC_COMPETENCIES,
  PROJECTS as STATIC_PROJECTS,
  EDUCATION_REPOS as STATIC_EDU,
  HOBBIES as STATIC_HOBBIES,
  QUOTE as STATIC_QUOTE,
} from "../../data/about";

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
  return <h2 className="text-2xl sm:text-3xl font-bold text-white mb-7">{children}</h2>;
}

const TECH_GROUPS = [
  {
    title: "Языки",
    description: "Базовые языки, на которых строю повседневную разработку и учебные проекты.",
    names: ["Go", "Java", "TypeScript", "JavaScript", "Python", "Dart"],
  },
  {
    title: "Backend & Data",
    description: "Серверная логика, API, базы данных и инфраструктура данных.",
    names: ["Django", "FastAPI", "Node.js", "PostgreSQL", "SQLite", "Nginx"],
  },
  {
    title: "Frontend & UI",
    description: "Интерфейсы, дизайн-система и клиентская часть приложений.",
    names: ["React", "TailwindCSS", "Vite", "Flutter", "HTML5", "CSS3", "Figma"],
  },
  {
    title: "Dev Workflow",
    description: "Инструменты поставки, командной разработки и инженерного цикла.",
    names: ["Docker", "GitHub Actions", "AWS", "Git", "GitHub", "VS Code", "Burp Suite", "Antigravity"],
  },
] as const;

function getTechGroupItems(names: readonly string[]) {
  return STATIC_STACK.filter((item) => names.includes(item.name));
}

// ── Component ──────────────────────────────────────────────────

const INITIAL_DATA: AboutData = {
  id: 1,
  ...STATIC_PROFILE,
  tagline: "Backend Developer | Software Engineering Student",
  githubUrl: STATIC_PROFILE.github,
  linkedinUrl: STATIC_PROFILE.linkedin,
  telegramUrl: STATIC_PROFILE.telegram,
  bio1: STATIC_BIO.p1,
  bio2: STATIC_BIO.p2,
  quote: STATIC_QUOTE,
  focusAreas: STATIC_FOCUS,
  competencies: STATIC_COMPETENCIES,
  projects: STATIC_PROJECTS,
  education: STATIC_EDU,
  hobbies: STATIC_HOBBIES,
};

export default function About() {
  const { isAdmin, secret } = useAdmin();
  const [data, setData] = useState<AboutData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await getAbout();
        setData(fetched);
      } catch (err) {
        console.error("Failed to fetch about data:", err);
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

  return (
    <article id="about" className="max-w-[86rem] mx-auto px-3 py-20 sm:px-5 lg:px-6 space-y-28 relative">
      {/* ── 1. PAGE HEADER ─────────────────────── */}
      <Section className="text-center space-y-4">
        <p className="text-sm font-mono text-primary tracking-widest uppercase mb-1">{"// about.me"}</p>
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter">
          Привет, я{" "}
          <span className="text-primary underline decoration-[4px] underline-offset-8">
            {data.name.split(" ")[0]}
          </span>
        </h1>
        <p className="text-muted text-xl sm:text-2xl font-light">
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
              Скачать резюме
            </a>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { href: data.githubUrl,   icon: <GitHubIcon size={20} />,      label: "GitHub" },
                { href: data.linkedinUrl, icon: <LinkedInIcon size={20} />, label: "LinkedIn" },
                { href: data.telegramUrl, icon: <Send size={20}/>,    label: "Telegram" },
                { href: `mailto:${data.email}`, icon: <Mail size={20}/>, label: "Email" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-gray-900/50 border border-border text-muted hover:text-white hover:border-primary/50 hover:bg-surface transition-all duration-300"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right col — bio */}
          <div className="flex-1 space-y-8 z-10 pt-4">
            <div className="space-y-6">
              <p className="text-text text-xl sm:text-2xl leading-relaxed font-medium">{data.bio1}</p>
              <p className="text-muted text-lg sm:text-xl leading-relaxed">{data.bio2}</p>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gray-900/50 border border-border text-muted">
                <GraduationCap size={16} className="text-primary/70" /> {data.university}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gray-900/50 border border-border text-muted">
                <MapPin size={16} className="text-primary/70" /> {data.location}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-primary/5 border border-primary/15 text-primary">
                <Briefcase size={16} /> Ищу первую коммерческую роль
              </span>
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

      {/* ── 3. TECH STACK ──────────────────────── */}
      <Section>
        <SectionLabel>stack</SectionLabel>
        <SectionHeading>Технологии</SectionHeading>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {TECH_GROUPS.map((group) => {
            const items = getTechGroupItems(group.names);

            return (
            <div
              key={group.title}
              className="surface-panel rounded-[1.6rem] p-5 sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{group.description}</p>
                </div>
                <span className="eyebrow-chip shrink-0">{items.length} items</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className={`group relative inline-flex min-h-11 items-center rounded-2xl border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 ${item.color.split(" ").slice(0, 2).join(" ")} ${item.color.split(" ")[2]}`}
                  >
                    <span className="absolute inset-x-3 bottom-0 h-px bg-current opacity-0 group-hover:opacity-40 transition-opacity" />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </Section>

      {/* ── 4. FOCUS AREAS ─────────────────────── */}
      <Section>
        <SectionLabel>focus</SectionLabel>
        <SectionHeading>Чем занимаюсь</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.focusAreas.map((f) => (
            <div
              key={`${f.title}-${f.desc}`}
              className="flex gap-4 p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors duration-300"
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {getFocusIcon(f)}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-sm">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. COMPETENCIES ────────────────────── */}
      <Section>
        <SectionLabel>skills</SectionLabel>
        <SectionHeading>Компетенции</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-6 rounded-xl bg-surface border border-border">
          {data.competencies.map((c) => (
            <div key={c} className="flex items-start gap-3 text-sm text-text">
              <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
              {c}
            </div>
          ))}
        </div>
      </Section>

      {/* ── 6. PROJECTS ────────────────────────── */}
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
                    <span className="text-muted group-hover:text-primary transition-colors p-1" aria-hidden="true">
                      <GitHubIcon size={16} />
                    </span>
                  )}
                </div>
                <p className="text-muted text-sm leading-relaxed flex-1 mb-5">{p.desc}</p>
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-auto">
                  <span className="text-[11px] font-mono text-muted/70 truncate">{p.stack}</span>
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
                  className="group flex flex-col p-5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors duration-300 cursor-pointer"
                  aria-label={`Открыть репозиторий проекта ${p.name}`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div
                key={p.name}
                className="group flex flex-col p-5 rounded-xl bg-surface border border-border transition-colors duration-300"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 7. EDUCATION REPOS ─────────────────── */}
      <Section>
        <SectionLabel>learning</SectionLabel>
        <SectionHeading>Учебные репозитории</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.education.map((e) => (
            <a
              key={e.name}
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all duration-300 group"
            >
              <BookOpen
                size={15}
                className="text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
              />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium leading-snug truncate group-hover:text-primary transition-colors">
                  {e.name}
                </p>
                <p className="text-muted text-xs mt-0.5 leading-relaxed">{e.desc}</p>
              </div>
              <ExternalLink size={10} className="ml-auto text-muted/30 group-hover:text-primary/50 transition-colors" />
            </a>
          ))}
        </div>
      </Section>

      {/* ── 8. HOBBIES + QUOTE ─────────────────── */}
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
              <p className="text-muted text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <blockquote className="border-l-2 border-primary/50 pl-6 py-1">
          <p className="italic text-muted text-base sm:text-lg leading-relaxed">{data.quote}</p>
        </blockquote>
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
