import { useState, type ChangeEvent, type FocusEvent, type SyntheticEvent } from "react";
import { Send, Mail } from "lucide-react";
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

// ── Contact info list ─────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
  {
    icon: <Send size={18} />,
    label: "Telegram",
    value: "@rxritet",
    href: "https://t.me/rxritet",
  },
  {
    icon: <GitHubIcon />,
    label: "GitHub",
    value: "github.com/rxritet",
    href: "https://github.com/rxritet",
  },
  {
    icon: <LinkedInIcon size={18} />,
    label: "LinkedIn",
    value: "linkedin.com/in/radmir-abraev",
    href: "https://www.linkedin.com/in/radmir-abraev-186b393b0/",
  },
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "abraevradmir2@gmail.com",
    href: "mailto:abraevradmir2@gmail.com",
  },
];

// ── Validation ───────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof ContactPayload, string>>;
type TouchedFields = Partial<Record<keyof ContactPayload, boolean>>;

function validate(form: ContactPayload): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Имя обязательно";
  } else if (form.name.trim().length > 100) {
    errors.name = "Не более 100 символов";
  }

  if (!form.email.trim()) {
    errors.email = "Email обязателен";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Введите корректный email";
  }

  if (!form.message.trim()) {
    errors.message = "Сообщение обязательно";
  } else if (form.message.trim().length < 5) {
    errors.message = "Минимум 5 символов";
  } else if (form.message.length > 2000) {
    errors.message = "Не более 2000 символов";
  }

  return errors;
}

// ── Input style helpers ───────────────────────────────────────────────────────

function fieldInputClass(hasError: boolean) {
  return `w-full px-4 py-3 bg-surface border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
    hasError
      ? "border-red-500 focus:ring-red-500/60"
      : "border-white/10 focus:ring-primary"
  }`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const [ref, inView] = useInView<HTMLElement>(0.1);
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState<TouchedFields>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Compute errors live from current form values
  const errors = validate(form);
  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reveal all errors on submit attempt
    setTouched({ name: true, email: true, message: true });
    if (!isFormValid) return;

    setStatus("loading");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="max-w-[86rem] mx-auto px-3 py-24 md:px-5"
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
            noValidate
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5 rounded-lg transition-colors focus-within:bg-white/[0.02]">
              <label htmlFor="name" className="text-sm text-gray-400">
                Имя
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ваше имя"
                autoComplete="name"
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={fieldInputClass(!!touched.name && !!errors.name)}
              />
              {touched.name && errors.name && (
                <p id="name-error" role="alert" className="text-xs text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 rounded-lg transition-colors focus-within:bg-white/[0.02]">
              <label htmlFor="contact-email" className="text-sm text-gray-400">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldInputClass(!!touched.email && !!errors.email)}
              />
              {touched.email && errors.email && (
                <p id="email-error" role="alert" className="text-xs text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5 rounded-lg transition-colors focus-within:bg-white/[0.02]">
              <label htmlFor="message" className="text-sm text-gray-400">
                Сообщение
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Ваше сообщение..."
                minLength={5}
                maxLength={2000}
                rows={5}
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={
                  errors.message ? "message-error" : "message-hint"
                }
                className={`${fieldInputClass(!!touched.message && !!errors.message)} resize-none`}
              />
              <div className="flex items-center justify-between">
                {touched.message && errors.message ? (
                  <p id="message-error" role="alert" className="text-xs text-red-400">
                    {errors.message}
                  </p>
                ) : (
                  <span id="message-hint" />
                )}
                <span
                  className={`text-xs ml-auto tabular-nums ${
                    form.message.length > 1800 ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  {form.message.length}/2000
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-primary hover:bg-violet-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-lg font-semibold transition-[color,transform,box-shadow] duration-200 ease-out cursor-pointer text-white"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Отправка...
                </span>
              ) : (
                "Отправить"
              )}
            </button>

            {/* Feedback */}
            <div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem] text-sm">
              {status === "success" && (
                <p className="flex items-center gap-2 text-green-400 font-medium">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Отправлено! Отвечу в ближайшее время.
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-red-400">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ошибка отправки. Попробуйте ещё раз.
                </p>
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
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-white/10 text-primary group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors shrink-0">
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
