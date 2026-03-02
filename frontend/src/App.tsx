import { useRef, useState, type SubmitEvent, type ChangeEvent } from "react";
import { submitContact, type ContactPayload } from "./api";

const SKILLS = ["Go", "Bun", "Hono", "PostgreSQL", "Docker", "React", "TypeScript"];

export default function App() {
  const contactRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<ContactPayload>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <main>
        {/* Hero */}
        <section
          aria-label="Представление"
          className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4"
        >
          <h1 className="text-5xl font-bold tracking-tight">John Doe</h1>
          <p className="text-xl text-gray-400">Full-Stack Developer</p>
          <p className="text-gray-500">📍 Moscow, Russia</p>
          <ul className="flex flex-wrap gap-2 justify-center mt-2 list-none p-0" aria-label="Навыки">
            {SKILLS.map((skill) => (
              <li
                key={skill}
                className="px-3 py-1 bg-indigo-700/60 border border-indigo-500/40 rounded-full text-sm font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
          <button
            onClick={scrollToContact}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Написать мне
          </button>
        </section>

        {/* About */}
        <section aria-label="Обо мне" className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Обо мне</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Я full-stack разработчик с фокусом на производительные и надёжные
            веб-приложения. Использую современный TypeScript-стек: Bun, Hono,
            Drizzle ORM на бэкенде и React + Vite на фронтенде. Люблю чистый код
            и хорошо выстроенные системы.
          </p>
        </section>

        {/* Contact */}
        <section ref={contactRef} aria-label="Обратная связь" className="max-w-xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Обратная связь</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm text-gray-400">
                Имя
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ваше имя"
                required
                minLength={1}
                maxLength={100}
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                aria-required="true"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                maxLength={254}
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-required="true"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-sm text-gray-400">
                Сообщение
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Ваше сообщение..."
                required
                minLength={5}
                maxLength={2000}
                rows={4}
                value={form.message}
                onChange={handleChange}
                aria-required="true"
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </button>

            <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem] text-center text-sm">
              {status === "success" && (
                <p className="text-green-400">✅ Сообщение отправлено</p>
              )}
              {status === "error" && (
                <p className="text-red-400">❌ Ошибка отправки. Попробуйте ещё раз.</p>
              )}
            </div>
          </form>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-600 text-sm">
        © {new Date().getFullYear()} MyTech
      </footer>
    </div>
  );
}
