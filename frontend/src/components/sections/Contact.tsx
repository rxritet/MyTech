import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Mail, Send } from "lucide-react";
import { submitContact, type ContactPayload } from "../../api";
import { useInView } from "../../hooks/useInView";

// ── Inline GitHub SVG (avoids deprecated lucide brand icon) ───────────────────

function GitHubIcon({ size = 18 }: Readonly<{ size?: number }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// ── Contact info list ─────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: <Send size={18} />,
    label: "Telegram",
    value: "@username",
    href: "https://t.me/username",
  },
  {
    icon: <GitHubIcon />,
    label: "GitHub",
    value: "github.com/rxritet",
    href: "https://github.com/rxritet",
  },
];

// ── Input shared style ────────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const [ref, inView] = useInView<HTMLElement>(0.1);
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="max-w-6xl mx-auto px-4 py-24"
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 id="contact-heading" className="text-3xl font-bold text-white mb-3">
          Контакт
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Напишите мне — отвечу в течение суток.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* ── Left: form ──────────────────────────────────────────── */}
        <div
          className={`transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate={false}
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
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

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="text-sm text-gray-400">
                Email
              </label>
              <input
                id="contact-email"
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

            {/* Message */}
            <div className="flex flex-col gap-1.5">
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
                rows={5}
                value={form.message}
                onChange={handleChange}
                aria-required="true"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors cursor-pointer text-white"
            >
              {status === "loading" ? "Отправка..." : "Отправить"}
            </button>

            {/* Feedback */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="min-h-[1.5rem] text-sm"
            >
              {status === "success" && (
                <p className="text-green-400">✅ Сообщение отправлено — отвечу в ближайшее время.</p>
              )}
              {status === "error" && (
                <p className="text-red-400">❌ Ошибка отправки. Попробуйте ещё раз.</p>
              )}
            </div>
          </form>
        </div>

        {/* ── Right: contact info ──────────────────────────────────── */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-gray-400 leading-relaxed">
            Обсудим проект, ответы на вопросы или просто скажем привет — любой
            повод подходит.
          </p>

          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {CONTACT_ITEMS.map(({ icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                  aria-label={`${label}: ${value}`}
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 text-indigo-400 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors shrink-0">
                    {icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {value}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
