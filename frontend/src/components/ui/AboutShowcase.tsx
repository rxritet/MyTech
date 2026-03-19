import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Download, Edit, ExternalLink, GraduationCap, Loader2, Mail, MapPin, Sparkles } from "lucide-react";
import { getAbout, getAboutStack, type AboutData, type PublicStackItem } from "../../api";
import { useAdmin } from "../../context/AdminContext";
import { useInView } from "../../hooks/useInView";
import AboutFormModal from "../admin/AboutFormModal";
import TechIcon from "../TechIcon";
import { getTechSlug } from "./techSlugMap";

function AnimatedBlock({ children, delay = 0 }: Readonly<{ children: ReactNode; delay?: number }>) {
  const [ref, inView] = useInView<HTMLDivElement>(0.13);

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

function groupStackItems(items: PublicStackItem[]) {
  const grouped = new Map<string, PublicStackItem[]>();

  for (const item of items) {
    const current = grouped.get(item.category) ?? [];
    current.push(item);
    grouped.set(item.category, current);
  }

  return Array.from(grouped.entries()).map(([category, rows]) => {
    const sortedRows = [...rows].sort((left: PublicStackItem, right: PublicStackItem) => left.order - right.order);
    return {
      category,
      items: sortedRows,
    };
  });
}

export default function AboutShowcase() {
  const { isAdmin, secret } = useAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AboutData | null>(null);
  const [aboutStack, setAboutStack] = useState<PublicStackItem[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    void Promise.all([getAbout(), getAboutStack()])
      .then(([aboutData, stackData]) => {
        setData(aboutData);
        setAboutStack(stackData);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const grouped = useMemo(() => groupStackItems(aboutStack), [aboutStack]);

  useEffect(() => {
    if (!data?.tagline) {
      return;
    }

    setTyped("");
    let idx = 0;
    const timer = globalThis.setInterval(() => {
      idx += 1;
      setTyped(data.tagline.slice(0, idx));
      if (idx >= data.tagline.length) {
        globalThis.clearInterval(timer);
      }
    }, 45);

    return () => globalThis.clearInterval(timer);
  }, [data?.tagline]);

  if (isLoading) {
    return (
      <main className="section-shell pt-32">
        <div className="flex min-h-[40vh] items-center justify-center text-muted">
          <Loader2 size={36} className="animate-spin" />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="section-shell pt-32">
        <div className="surface-panel rounded-3xl p-8 text-center text-muted">Не удалось загрузить данные страницы.</div>
      </main>
    );
  }

  const marqueeItems =
    grouped.length > 0
      ? grouped.flatMap((entry) => entry.items)
      : data.techGroups.flatMap((group) =>
          group.names.map((name, index) => ({
            id: Number(`${index + 1}`),
            technologyId: index + 1,
            name,
            category: group.title,
            badgeUrl: "",
            deviconSlug: getTechSlug(name),
            order: index,
          })),
        );

  const socialLinks = [
    { label: "GitHub", href: data.githubUrl },
    { label: "LinkedIn", href: data.linkedinUrl },
    { label: "Telegram", href: data.telegramUrl },
  ].filter((item) => item.href?.trim());

  const hasCompetencies = data.competencies.length > 0;
  const hasProjects = data.projects.length > 0;
  const hasHobbies = data.hobbies.length > 0;
  const hasQuote = Boolean(data.quote?.trim());
  const hasTechGroupDetails = data.techGroups.length > 0;

  return (
    <main className="section-shell pt-28">
      <div className="space-y-10 md:space-y-14">
        <AnimatedBlock>
          <header className="text-center">
            <p className="section-kicker">about the developer</p>
            <h1 className="text-[clamp(2.2rem,8vw,5rem)] font-bold tracking-tight text-text">
              Hi, I&apos;m
              {" "}
              <span className="ml-3 text-primary" style={{ textShadow: "0 0 40px var(--primary)" }}>
                {data.name}
              </span>
            </h1>
            <p className="mx-auto mt-3 min-h-[1.75rem] max-w-3xl text-lg text-muted md:text-xl">
              {typed}
              <span className="ml-0.5 inline-block animate-blink font-mono text-primary">|</span>
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button type="button" className="button-secondary py-2 px-5 text-sm" onClick={() => setIsEditModalOpen(true)}>
                  <Edit size={14} />
                  Редактировать
                </button>
              </div>
            )}
          </header>
        </AnimatedBlock>

        <AnimatedBlock delay={80}>
          <section className="surface-panel rounded-3xl p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[180px_1fr] md:items-center">
              <div className="flex justify-center md:justify-start">
                <img
                  src={data.avatarUrl}
                  alt={data.name}
                  className="h-40 w-40 rounded-full border-2 border-primary object-cover"
                  style={{ boxShadow: "0 0 24px color-mix(in srgb, var(--primary) 30%, transparent)" }}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-text md:text-3xl">{data.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {data.location?.trim() ? (
                    <span className="eyebrow-chip">
                      <MapPin size={13} />
                      {data.location}
                    </span>
                  ) : null}
                  {data.university?.trim() ? (
                    <span className="eyebrow-chip">
                      <GraduationCap size={13} />
                      {data.university}
                    </span>
                  ) : null}
                  {data.status?.trim() ? (
                    <span className="eyebrow-chip border-primary text-primary">{data.status}</span>
                  ) : null}
                </div>
                <p className="mt-3 text-base leading-8 text-text/95 md:text-lg">{data.bio1}</p>
                <p className="mt-3 text-sm leading-7 text-muted md:text-base">{data.bio2}</p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {data.resumeUrl?.trim() ? (
                    <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="button-primary py-2 px-4 text-sm">
                      <Download size={14} />
                      Resume
                    </a>
                  ) : null}

                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-secondary py-2 px-4 text-sm"
                    >
                      {item.label}
                      <ExternalLink size={13} />
                    </a>
                  ))}

                  {data.email?.trim() ? (
                    <a href={`mailto:${data.email}`} className="button-secondary py-2 px-4 text-sm">
                      <Mail size={13} />
                      {data.email}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </AnimatedBlock>

        <AnimatedBlock delay={160}>
          <section>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Tech stack</h2>
              <span className="eyebrow-chip font-mono text-[0.72rem] uppercase">Live tooling</span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border bg-bg-elevated py-5">
              <div className="animate-marquee flex min-w-max items-center gap-5 px-5">
                {[...marqueeItems, ...marqueeItems].map((item, index) => (
                  <div key={`${item.name}-${index}`} className="group flex w-20 shrink-0 flex-col items-center gap-2">
                    <span className="rounded-xl border border-border bg-panel px-3 py-2 transition duration-200 group-hover:border-primary"
                      style={{ boxShadow: "0 0 0 transparent" }}
                    >
                      <TechIcon
                        slug={item.deviconSlug ?? getTechSlug(item.name)}
                        fallbackSrc={item.badgeUrl || null}
                        name={item.name}
                        size={24}
                      />
                    </span>
                    <span className="text-center text-[0.72rem] leading-4 text-muted transition-colors group-hover:text-primary">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedBlock>

        <AnimatedBlock delay={240}>
          <section>
            <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Focus areas</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.focusAreas.slice(0, 4).map((item, index) => {
                const emojis = ["⚙️", "🧠", "🚀", "🛡️"];
                return (
                  <article key={`${item.title}-${index}`} className="card-glass rounded-2xl border-t-2 border-t-primary p-4">
                    <span className="mb-3 block text-3xl">{emojis[index] ?? "✨"}</span>
                    <h3 className="text-base font-semibold text-text">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </AnimatedBlock>

        {hasCompetencies ? (
          <AnimatedBlock delay={280}>
            <section>
              <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Competencies</h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {data.competencies.map((item, index) => (
                  <li key={`${item}-${index}`} className="eyebrow-chip rounded-xl px-3 py-2 text-[0.78rem]">
                    <Sparkles size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedBlock>
        ) : null}

        {hasProjects ? (
          <AnimatedBlock delay={300}>
            <section>
              <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Project highlights</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.projects.map((project, index) => (
                  <article key={`${project.name}-${index}`} className="card-glass rounded-2xl p-5">
                    <h3 className="text-base font-semibold text-text">{project.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{project.desc}</p>
                    <p className="mt-3 text-xs uppercase tracking-wider text-primary">{project.stack}</p>
                    {project.github?.trim() ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-text"
                      >
                        GitHub
                        <ExternalLink size={13} />
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </AnimatedBlock>
        ) : null}

        {hasTechGroupDetails ? (
          <AnimatedBlock delay={310}>
            <section>
              <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Technology groups</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {data.techGroups.map((group, index) => (
                  <article key={`${group.title}-${index}`} className="surface-panel rounded-2xl p-5">
                    <h3 className="text-base font-semibold text-text">{group.title}</h3>
                    {(group.description ?? group.desc)?.trim() ? (
                      <p className="mt-2 text-sm leading-7 text-muted">{group.description ?? group.desc}</p>
                    ) : null}
                    {group.names.length > 0 ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {group.names.map((name, idx) => (
                          <li key={`${name}-${idx}`} className="eyebrow-chip text-[0.72rem]">
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </AnimatedBlock>
        ) : null}

        <AnimatedBlock delay={320}>
          <section>
            <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Education and experience</h2>
            <div className="mt-5 space-y-3">
              {data.education.map((item, index) => (
                <a
                  key={`${item.name}-${index}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-border border-l-2 border-l-[var(--border)] bg-bg-elevated/70 p-4 transition-colors hover:border-l-primary"
                >
                  <h3 className="text-base font-semibold text-text">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </AnimatedBlock>

        {hasQuote ? (
          <AnimatedBlock delay={340}>
            <section className="surface-panel rounded-3xl border-l-2 border-l-primary p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-primary/90">Quote</p>
              <blockquote className="mt-3 text-lg leading-9 text-text md:text-xl">{data.quote}</blockquote>
            </section>
          </AnimatedBlock>
        ) : null}

        {hasHobbies ? (
          <AnimatedBlock delay={360}>
            <section>
              <h2 className="section-title text-[clamp(1.5rem,2.8vw,2.2rem)]">Outside of code</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.hobbies.map((item, index) => (
                  <article key={`${item.title}-${index}`} className="card-glass rounded-2xl p-5">
                    <span className="text-2xl" aria-hidden="true">{item.emoji || "✨"}</span>
                    <h3 className="mt-3 text-base font-semibold text-text">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.desc}</p>
                  </article>
                ))}
              </div>
            </section>
          </AnimatedBlock>
        ) : null}
      </div>

      <AboutFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        secret={secret ?? ""}
        onSuccess={(updated) => setData(updated)}
      />
    </main>
  );
}
