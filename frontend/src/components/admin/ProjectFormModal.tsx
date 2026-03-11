import React, { useState, useEffect } from "react";
import type { Project } from "../../api";
import { createProject, updateProject } from "../../hooks/useProjects";
import { X, Loader2 } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  secret: string;
  onSuccess: () => void;
}

export default function ProjectFormModal({ isOpen, onClose, project, secret, onSuccess }: Readonly<ProjectFormModalProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    slug: "",
    name: "",
    description: "",
    longDescription: "",
    stack: [],
    features: [],
    github: "",
    demo: "",
    accentColor: "from-indigo-500 to-purple-500",
    image: "",
    devTime: "",
    language: "",
    createdAt: "",
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        slug: "",
        name: "",
        description: "",
        longDescription: "",
        stack: [],
        features: [],
        github: "",
        demo: "",
        accentColor: "from-indigo-500 to-purple-500",
        image: "",
        devTime: "",
        language: "",
        createdAt: "",
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: keyof Project, value: string) => {
    const items = value.split(",").map((i) => i.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [name]: items }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (project?.id) {
        await updateProject(project.id, formData, secret);
      } else {
        await createProject(formData, secret);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {project ? "Редактировать проект" : "Добавить проект"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">{error}</div>}
          
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-1">Название *</label>
                <input id="project-name" required name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="project-slug" className="block text-sm font-medium text-gray-300 mb-1">Slug (URL) *</label>
                <input id="project-slug" required name="slug" value={formData.slug || ""} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="project-description" className="block text-sm font-medium text-gray-300 mb-1">Краткое описание *</label>
                <textarea id="project-description" required name="description" value={formData.description || ""} onChange={handleChange} rows={2} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="project-long-description" className="block text-sm font-medium text-gray-300 mb-1">Подробное описание *</label>
                <textarea id="project-long-description" required name="longDescription" value={formData.longDescription || ""} onChange={handleChange} rows={4} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="project-stack" className="block text-sm font-medium text-gray-300 mb-1">Стек (через запятую) *</label>
                <input id="project-stack" required value={formData.stack?.join(", ") || ""} onChange={(e) => handleArrayChange("stack", e.target.value)} placeholder="React, TS, Tailwind" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              
              <div>
                <label htmlFor="project-features" className="block text-sm font-medium text-gray-300 mb-1">Особенности (через запятую) *</label>
                <input id="project-features" required value={formData.features?.join(", ") || ""} onChange={(e) => handleArrayChange("features", e.target.value)} placeholder="Фича 1, Фича 2" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="project-github" className="block text-sm font-medium text-gray-300 mb-1">URL GitHub</label>
                <input id="project-github" name="github" value={formData.github || ""} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="project-demo" className="block text-sm font-medium text-gray-300 mb-1">URL Demo</label>
                <input id="project-demo" name="demo" value={formData.demo || ""} onChange={handleChange} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="project-image" className="block text-sm font-medium text-gray-300 mb-1">Превью (URL картинки)</label>
                <input id="project-image" name="image" value={formData.image || ""} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="project-accent-color" className="block text-sm font-medium text-gray-300 mb-1">Цвет акцента (Tailwind) *</label>
                <input id="project-accent-color" required name="accentColor" value={formData.accentColor || ""} onChange={handleChange} placeholder="from-cyan-500 to-blue-500" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="project-dev-time" className="block text-sm font-medium text-gray-300 mb-1">Время разработки *</label>
                <input id="project-dev-time" required name="devTime" value={formData.devTime || ""} onChange={handleChange} placeholder="~3 недели" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="project-language" className="block text-sm font-medium text-gray-300 mb-1">Основной язык *</label>
                <input id="project-language" required name="language" value={formData.language || ""} onChange={handleChange} placeholder="TypeScript" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="project-created-at" className="block text-sm font-medium text-gray-300 mb-1">Дата создания *</label>
                <input id="project-created-at" required name="createdAt" value={formData.createdAt || ""} onChange={handleChange} placeholder="март 2026" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition">
            Отмена
          </button>
          <button type="submit" form="project-form" disabled={loading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition shadow-lg shadow-indigo-500/20">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {project ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  );
}
