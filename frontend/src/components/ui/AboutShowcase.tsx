import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Edit, Loader2 } from "lucide-react";
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

  return Array.from(grouped.entries()).map(([category, rows]) => ({
    category,
    items: rows.sort((left, right) => left.order - right.order),
  }));
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
    const timer = window.setInterval(() => {
      idx += 1;
      setTyped(data.tagline.slice(0, idx));
      if (idx >= data.tagline.length) {
        window.clearInterval(timer);
      }
    }, 45);

    return () => window.clearInterval(timer);
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

  return (
    <main className="section-shell pt-28">
      <div className="space-y-10 md:space-y-14">
        <AnimatedBlock>
          <header className="text-center">
            <p className="section-kicker">about the developer</p>
            <h1 className="text-[clamp(2.2rem,8vw,5rem)] font-bold tracking-tight text-text">
              Hi, I&apos;m
              <span className="ml-3 text-primary" style={{ textShadow: "0 0 40px var(--primary)" }}>
                Radmir
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
                <p className="mt-3 text-base leading-8 text-text/95 md:text-lg">{data.bio1}</p>
                <p className="mt-3 text-sm leading-7 text-muted md:text-base">{data.bio2}</p>
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
                    <p className="mt-2 line-clamp-1 text-sm text-muted">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </AnimatedBlock>

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
