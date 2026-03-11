import { Code2, MonitorPlay, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkTermsPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen flex flex-col mt-10">
      <div className="max-w-7xl mx-auto w-full flex-1">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Условия работы</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Прозрачный процесс, измеримые результаты и современный стек технологий для решения ваших бизнес-задач.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          {/* Column 1: Что делаю */}
          <div className="card-glass p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Что делаю</h2>
            <ul className="space-y-4">
              {[
                "Backend API (Go, Python/Django)",
                "Full-stack проекты (React, Vite)",
                "Настройка CI/CD (GitHub Actions, Docker)",
                "Мобильные приложения на Flutter",
                "Ревью кода и аудит архитектуры"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Как работаю */}
          <div className="card-glass p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Как работаю</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
              {[
                { title: "Бриф", desc: "Сбор требований и обсуждение." },
                { title: "Предложение", desc: "Оценка сроков, стека и стоимости." },
                { title: "Разработка", desc: "Итеративный процесс с прозрачностью." },
                { title: "Деплой", desc: "Запуск на сервере (Docker/Nginx)." },
                { title: "Поддержка", desc: "Доработки по необходимости." }
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-surface bg-primary text-surface font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_2px_rgba(0,255,136,0.2)]"></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                    <h3 className="font-bold text-white text-sm mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Стоимость */}
          <div className="card-glass p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 animate-fade-in-up flex flex-col" style={{ animationDelay: '300ms' }}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Стоимость</h2>
            <p className="text-gray-300 mb-6 leading-relaxed flex-1">
              Каждый проект уникален. Окончательная стоимость формируется после оценки объёма работ, сложности предметной области и выбранного стека технологий. 
              <br/><br/>
              Ориентировочная ставка рассчитывается исходя из затраченного времени или фиксированной оплаты за проект (Fixed Price).
            </p>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <span className="text-primary font-bold text-lg">Обсуждается индивидуально</span>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-2xl font-bold text-white mb-6">Готовы обсудить задачу?</h2>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-violet-700 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 rounded-xl font-bold transition-all duration-300"
          >
            Написать мне
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
