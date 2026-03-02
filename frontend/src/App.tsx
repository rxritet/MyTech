import { useRef, useState } from "react";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight">John Doe</h1>
        <p className="text-xl text-gray-400">Full-Stack Developer</p>
        <p className="text-gray-500">📍 Moscow, Russia</p>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-indigo-700/60 border border-indigo-500/40 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
        <button
          onClick={scrollToContact}
          className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          Написать мне
        </button>
      </section>

      {/* About */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Обо мне</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          Я full-stack разработчик с фокусом на производительные и надёжные
          веб-приложения. Использую современный TypeScript-стек: Bun, Hono,
          Drizzle ORM на бэкенде и React + Vite на фронтенде. Люблю чистый код
          и хорошо выстроенные системы.
        </p>
      </section>

      {/* Contact */}
      <section ref={contactRef} className="max-w-xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Обратная связь</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            required
            minLength={1}
            value={form.name}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="message"
            placeholder="Сообщение"
            required
            minLength={5}
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="px-4 py-3 bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            {status === "loading" ? "Отправка..." : "Отправить"}
          </button>

          {status === "success" && (
            <p className="text-green-400 text-center text-sm">
              ✅ Сообщение отправлено
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-center text-sm">
              ❌ Ошибка отправки. Попробуйте ещё раз.
            </p>
          )}
        </form>
      </section>

      <footer className="text-center py-8 text-gray-600 text-sm">
        © {new Date().getFullYear()} MyTech
      </footer>
    </div>
  );
}
