import React, { useState, useEffect } from "react";
import { X, Loader2, Save, User, FileText, Share2, Target, GraduationCap } from "lucide-react";
import { AboutData, updateAbout } from "../../api";

interface AboutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AboutData;
  secret: string;
  onSuccess: (updated: AboutData) => void;
}

type Tab = "general" | "bio" | "social" | "expertise" | "lists";

export default function AboutFormModal({ isOpen, onClose, initialData, secret, onSuccess }: AboutFormModalProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAbout(formData, secret);
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
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Имя</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Локация</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Заголовок (Tagline)</label>
                    <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Университет</label>
                    <input name="university" value={formData.university} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Статус</label>
                    <input name="status" value={formData.status} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">URL Фото</label>
                    <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">URL Резюме</label>
                    <input name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                </div>
              )}

              {activeTab === "bio" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Биография 1</label>
                    <textarea name="bio1" value={formData.bio1} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Биография 2</label>
                    <textarea name="bio2" value={formData.bio2} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Цитата</label>
                    <textarea name="quote" value={formData.quote} onChange={handleChange} rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none" />
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">GitHub URL</label>
                    <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">LinkedIn URL</label>
                    <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Telegram URL</label>
                    <input name="telegramUrl" value={formData.telegramUrl} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
                  </div>
                </div>
              )}

              {activeTab === "expertise" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Компетенции (через запятую)</label>
                    <textarea 
                       value={formData.competencies.join(", ")} 
                       onChange={(e) => setFormData(prev => ({...prev, competencies: e.target.value.split(",").map(i => i.trim()).filter(Boolean)}))}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 h-32" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Текущий фокус (JSON)</label>
                    <p className="text-[10px] text-gray-500 mb-2 italic">Массив объектов: &#123; title, desc &#125;</p>
                    <textarea 
                       value={JSON.stringify(formData.focusAreas, null, 2)} 
                       onChange={(e) => handleJSONChange("focusAreas", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-64" 
                    />
                  </div>
                </div>
              )}

              {activeTab === "lists" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Проекты (JSON)</label>
                    <textarea 
                       value={JSON.stringify(formData.projects, null, 2)} 
                       onChange={(e) => handleJSONChange("projects", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-48" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Обучение (JSON)</label>
                    <textarea 
                       value={JSON.stringify(formData.education, null, 2)} 
                       onChange={(e) => handleJSONChange("education", e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 h-48" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-widest">Хобби (JSON)</label>
                    <textarea 
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
