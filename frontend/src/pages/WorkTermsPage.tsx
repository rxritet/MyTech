import { Code2, MonitorPlay, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkTermsPage() {
  const offerings = [
    "Backend API и интеграции",
    "Full-stack проекты на React",
    "CI/CD и Docker-поставку",
    "Архитектурный аудит и code review",
    "Поддержку и развитие после релиза",
  ];

  const workflow = [
    { title: "Бриф", desc: "Фиксируем контекст, ограничения и желаемый результат." },
    { title: "Предложение", desc: "Собираю стек, этапы, сроки и безопасный объём первой версии." },
    { title: "Разработка", desc: "Работаю итерациями с прозрачным прогрессом и промежуточными демо." },
    { title: "Деплой", desc: "Готовлю финальную сборку, окружение и инструкцию по поддержке." },
    { title: "Поддержка", desc: "После релиза помогаю с фикcами, доработками и развитием." },
  ];

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16">
        
        <div className="section-heading animate-fade-in-up pt-4">
          <p className="section-kicker">Collaboration</p>
          <h1 className="section-title text-4xl md:text-5xl">Условия работы</h1>
          <p className="section-copy text-lg">
            Прозрачный процесс, измеримые результаты и современный стек технологий для решения ваших бизнес-задач.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.1fr_0.85fr]">
          
          <div className="surface-panel rounded-[1.8rem] p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Что делаю</h2>
            <ul className="space-y-4">
              {offerings.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-panel rounded-[1.8rem] p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Как работаю</h2>
            <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10 md:before:left-1/2 md:before:-translate-x-1/2">
              {workflow.map((step) => (
                <div key={step.title} className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-surface bg-primary text-surface font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_rgba(0,255,136,0.2)]"></div>
                  <div className="w-[calc(100%-2.5rem)] rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm md:w-[calc(50%-1.5rem)]">
                    <h3 className="font-bold text-white text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel flex flex-col rounded-[1.8rem] p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Стоимость</h2>
            <p className="text-gray-300 mb-6 leading-relaxed flex-1">
              Каждый проект уникален. Окончательная стоимость формируется после оценки объёма работ, сложности предметной области и выбранного стека технологий. 
              <br/><br/>
              Ориентировочная ставка рассчитывается исходя из затраченного времени или фиксированной оплаты за проект (Fixed Price).
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-center">
              <span className="text-primary font-bold text-lg">Обсуждается индивидуально</span>
            </div>
          </div>

        </div>

        <div className="surface-panel animate-fade-in-up rounded-[1.8rem] px-6 py-8 text-center md:px-10" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold text-white mb-6">Готовы обсудить задачу?</h2>
          <Link
            to="/contact"
            className="button-primary"
          >
            Написать мне
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
