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
      className="max-w-6xl mx-auto px-4 py-24"
    >
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          id="services-heading"
          className="text-3xl font-bold text-white mb-3"
        >
          Условия работы
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
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
