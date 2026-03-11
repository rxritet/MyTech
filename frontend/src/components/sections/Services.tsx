import { SERVICES } from "../../data/services";
import { useInView } from "../../hooks/useInView";
import ServiceCard from "../ui/ServiceCard";

export default function Services() {
  const [ref, inView] = useInView<HTMLElement>(0.1);

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className="section-shell"
    >
      <div className="section-heading">
        <p className="section-kicker">Workflow</p>
        <h2 id="services-heading" className="section-title">
          Условия работы
        </h2>
        <p className="section-copy">
          Что я делаю, как работаю и в какие сроки. Всегда на связи через
          Telegram.
        </p>
      </div>

      {/* Grid */}
      <ul
        className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0"
        aria-label="Список услуг"
      >
        {SERVICES.map((service, i) => (
          <li
            key={service.title}
            className={`${inView ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
