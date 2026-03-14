import React, { useState, useEffect } from "react";
import { X, Loader2, Save, User, FileText, Share2, Target, GraduationCap, Plus, Trash2 } from "lucide-react";
import { AboutData, type AboutProject, updateAbout } from "../../api";

interface AboutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AboutData;
  secret: string;
  onSuccess: (updated: AboutData) => void;
}

type Tab = "general" | "bio" | "social" | "expertise" | "stack" | "lists";

function GitHubIcon({ size = 14 }: Readonly<{ size?: number }>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function AboutFormModal({ isOpen, onClose, initialData, secret, onSuccess }: Readonly<AboutFormModalProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [formData, setFormData] = useState<AboutData>(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJSONChange = (name: keyof AboutData, value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData((prev) => ({ ...prev, [name]: parsed }));
    } catch {
      // Ignore invalid JSON while typing
    }
  };

  const handleProjectChange = (index: number, field: keyof AboutProject, value: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, currentIndex) =>
        currentIndex === index ? { ...project, [field]: value } : project,
      ),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          desc: "",
          stack: "",
          github: "",
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const sanitizedProjects = formData.projects
        .map((project) => ({
          ...project,
          github: project.github?.trim() ? project.github.trim() : undefined,
        }))
        .filter((project) => project.name.trim() && project.desc.trim() && project.stack.trim());

      const updated = await updateAbout({
        ...formData,
        projects: sanitizedProjects,
      }, secret);
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка при сохранении");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general",   label: "Основное", icon: <User size={16} /> },
    { id: "bio",       label: "Био",      icon: <FileText size={16} /> },
    { id: "social",    label: "Соцсети",  icon: <Share2 size={16} /> },
    { id: "expertise", label: "Навыки",   icon: <Target size={16} /> },
    { id: "stack",     label: "Стек",     icon: <Save size={16} /> },
    { id: "lists",     label: "Контент",  icon: <GraduationCap size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gray-950/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
                <FileText size={20} />
             </div>
             <h2 className="text-xl font-bold text-white">Редактировать "Обо мне"</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-white/5 bg-gray-950/30 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-900/50">
            {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}

            <form id="about-form" onSubmit={handleSubmit} className="space-y-8">
              {activeTab === "general" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-name" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Имя</label>
                    <input id="about-name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-location" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Локация</label>
                    <input id="about-location" name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="about-tagline" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Заголовок (Tagline)</label>
                    <input id="about-tagline" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-university" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Университет</label>
                    <input id="about-university" name="university" value={formData.university} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-status" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Статус</label>
                    <input id="about-status" name="status" value={formData.status} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="about-avatar" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">URL Фото</label>
                    <input id="about-avatar" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="about-resume" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">URL Резюме</label>
                    <input id="about-resume" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                </div>
              )}

              {activeTab === "bio" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="about-bio1" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Биография 1</label>
                    <textarea id="about-bio1" name="bio1" value={formData.bio1} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                  <div>
                    <label htmlFor="about-bio2" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Биография 2</label>
                    <textarea id="about-bio2" name="bio2" value={formData.bio2} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                  <div>
                    <label htmlFor="about-quote" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Цитата</label>
                    <textarea id="about-quote" name="quote" value={formData.quote} onChange={handleChange} rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-email" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Email</label>
                    <input id="about-email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-github-url" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">GitHub URL</label>
                    <input id="about-github-url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-linkedin-url" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">LinkedIn URL</label>
                    <input id="about-linkedin-url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="about-telegram-url" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Telegram URL</label>
                    <input id="about-telegram-url" name="telegramUrl" value={formData.telegramUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                </div>
              )}

              {activeTab === "expertise" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="about-competencies" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Компетенции (через запятую)</label>
                    <textarea 
                      id="about-competencies"
                       value={formData.competencies.join(", ")} 
                       onChange={(e) => setFormData(prev => ({...prev, competencies: e.target.value.split(",").map(i => i.trim()).filter(Boolean)}))}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 h-32" 
                    />
                  </div>
                  <div>
                    <label htmlFor="about-focus-areas" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Текущий фокус (JSON)</label>
                    <p className="text-[10px] text-gray-500 mb-2 italic">Массив объектов: &#123; title, desc &#125;</p>
                    <textarea 
                      id="about-focus-areas"
                       value={JSON.stringify(formData.focusAreas, null, 2)} 
                       onChange={(e) => handleJSONChange("focusAreas", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-64" 
                    />
                  </div>
                </div>
              )}

              {activeTab === "stack" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="about-tech-groups" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Стек технологий (JSON)</label>
                    <p className="text-[10px] text-gray-500 mb-2 italic">Массив объектов: &#123; title, description?, names: [] &#125;</p>
                    <textarea 
                      id="about-tech-groups"
                       value={JSON.stringify(formData.techGroups, null, 2)} 
                       onChange={(e) => handleJSONChange("techGroups", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-96" 
                    />
                  </div>
                </div>
              )}

              {activeTab === "lists" && (
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Проекты</p>
                        <p className="text-xs text-gray-500">Для каждого проекта можно сразу указать GitHub-репозиторий.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addProject}
                        className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-400 hover:bg-orange-500/15 transition"
                      >
                        <Plus size={16} />
                        Добавить проект
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.projects.map((project, index) => (
                        <div key={`${project.name || "project"}-${index}`} className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">Проект {index + 1}</p>
                            <button
                              type="button"
                              onClick={() => removeProject(index)}
                              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                            >
                              <Trash2 size={14} />
                              Удалить
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor={`about-project-name-${index}`} className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Название</label>
                              <input
                                id={`about-project-name-${index}`}
                                value={project.name}
                                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                              />
                            </div>
                            <div>
                              <label htmlFor={`about-project-stack-${index}`} className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Стек</label>
                              <input
                                id={`about-project-stack-${index}`}
                                value={project.stack}
                                onChange={(e) => handleProjectChange(index, "stack", e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor={`about-project-desc-${index}`} className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Описание</label>
                            <textarea
                              id={`about-project-desc-${index}`}
                              value={project.desc}
                              onChange={(e) => handleProjectChange(index, "desc", e.target.value)}
                              rows={3}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none"
                            />
                          </div>

                          <div>
                            <label htmlFor={`about-project-github-${index}`} className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">
                              <GitHubIcon size={14} />
                              GitHub URL
                            </label>
                            <input
                              id={`about-project-github-${index}`}
                              value={project.github ?? ""}
                              onChange={(e) => handleProjectChange(index, "github", e.target.value)}
                              placeholder="https://github.com/username/repository"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="about-education-json" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Обучение (JSON)</label>
                    <textarea 
                      id="about-education-json"
                       value={JSON.stringify(formData.education, null, 2)} 
                       onChange={(e) => handleJSONChange("education", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-48" 
                    />
                  </div>
                  <div>
                    <label htmlFor="about-hobbies-json" className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Хобби (JSON)</label>
                    <textarea 
                      id="about-hobbies-json"
                       value={JSON.stringify(formData.hobbies, null, 2)} 
                       onChange={(e) => handleJSONChange("hobbies", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-48" 
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-gray-950/50">
          <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            Отмена
          </button>
          <button type="submit" form="about-form" disabled={loading} className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
