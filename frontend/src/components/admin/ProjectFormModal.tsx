import React, { useState, useEffect } from "react";
import type { Project, DevelopmentStage } from "../../api";
import { createProject, updateProject } from "../../hooks/useProjects";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import DevelopmentTimeline from "./DevelopmentTimeline";

interface ProjectFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly project?: Project | null;
  readonly secret: string;
  readonly onSuccess: () => void;
}

type TabType = "basic" | "description" | "media" | "development" | "tech";

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  secret,
  onSuccess,
}: Readonly<ProjectFormModalProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>("basic");
  const [featuresInput, setFeaturesInput] = useState("");
  const [stackInput, setStackInput] = useState("");

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
    gallery: [],
    devTime: "",
    language: "",
    createdAt: "",
    developmentProcess: [],
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
        gallery: [],
        devTime: "",
        language: "",
        createdAt: "",
        developmentProcess: [],
      });
    }
    setCurrentTab("basic");
  }, [project, isOpen]);

  useEffect(() => {
    setFeaturesInput((formData.features ?? []).join(", "));
  }, [formData.features]);

  useEffect(() => {
    setStackInput((formData.stack ?? []).join(", "));
  }, [formData.stack]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseCommaSeparated = (value: string): string[] =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleArrayChange = (name: keyof Project, value: string) => {
    const items = parseCommaSeparated(value);
    setFormData((prev) => ({ ...prev, [name]: items }));
  };

  const handleGalleryChange = (gallery: string[]) => {
    setFormData((prev) => ({ ...prev, gallery }));
  };

  const handleDevelopmentChange = (stages: DevelopmentStage[]) => {
    setFormData((prev) => ({ ...prev, developmentProcess: stages }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: Partial<Project> = {
        ...formData,
        features: parseCommaSeparated(featuresInput),
        stack: parseCommaSeparated(stackInput),
      };
      if (project?.id) {
        await updateProject(project.id, payload, secret);
      } else {
        await createProject(payload, secret);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "basic", label: "Основная информация" },
    { id: "description", label: "Описание" },
    { id: "media", label: "Медиа" },
    { id: "development", label: "Процесс разработки" },
    { id: "tech", label: "Технологии" },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === currentTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {project ? "Редактировать проект" : "Добавить проект"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-4 border-b border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                currentTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: Basic Information */}
            {currentTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-project-name" className="block text-sm font-medium text-gray-300 mb-1">
                      Название проекта *
                    </label>
                    <input
                      id="modal-project-name"
                      required
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Мой потрясающий проект"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-slug" className="block text-sm font-medium text-gray-300 mb-1">
                      Slug (URL) *
                    </label>
                    <input
                      id="modal-project-slug"
                      required
                      name="slug"
                      value={formData.slug || ""}
                      onChange={handleChange}
                      placeholder="my-awesome-project"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-created-at" className="block text-sm font-medium text-gray-300 mb-1">
                      Дата создания *
                    </label>
                    <input
                      id="modal-project-created-at"
                      required
                      name="createdAt"
                      value={formData.createdAt || ""}
                      onChange={handleChange}
                      placeholder="март 2026"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-dev-time" className="block text-sm font-medium text-gray-300 mb-1">
                      Время разработки *
                    </label>
                    <input
                      id="modal-project-dev-time"
                      required
                      name="devTime"
                      value={formData.devTime || ""}
                      onChange={handleChange}
                      placeholder="~3 недели"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Description */}
            {currentTab === "description" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="modal-project-description" className="block text-sm font-medium text-gray-300 mb-1">
                    Краткое описание *
                  </label>
                  <textarea
                    id="modal-project-description"
                    required
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Кратко опишите суть проекта (2-3 строки)"
                    rows={3}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="modal-project-long-description" className="block text-sm font-medium text-gray-300 mb-1">
                    Подробное описание *
                  </label>
                  <textarea
                    id="modal-project-long-description"
                    required
                    name="longDescription"
                    value={formData.longDescription || ""}
                    onChange={handleChange}
                    placeholder="Полное описание проекта, его цели и задачи"
                    rows={5}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="modal-project-features" className="block text-sm font-medium text-gray-300 mb-1">
                    Особенности (через запятую) *
                  </label>
                  <input
                    id="modal-project-features"
                    required
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    onBlur={() => handleArrayChange("features", featuresInput)}
                    placeholder="Фича 1, Фича 2, Фича 3"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Media */}
            {currentTab === "media" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="modal-project-image" className="block text-sm font-medium text-gray-300 mb-2">
                    Превью проекта (основное изображение) *
                  </label>
                  <input
                    id="modal-project-image"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                  {formData.image && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-800">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full max-h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}
                </div>

                <ImageUploadField
                  images={formData.gallery || []}
                  onImagesChange={handleGalleryChange}
                  maxImages={10}
                  label="Галерея фотографий (опционально)"
                />
              </div>
            )}

            {/* TAB 4: Development Process */}
            {currentTab === "development" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Добавьте этапы разработки проекта (опционально).
                  Они будут показаны как временная шкала.
                </p>
                <DevelopmentTimeline
                  stages={formData.developmentProcess || []}
                  onStagesChange={handleDevelopmentChange}
                />
              </div>
            )}

            {/* TAB 5: Technologies & Links */}
            {currentTab === "tech" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-project-stack" className="block text-sm font-medium text-gray-300 mb-1">
                      Стек технологий (через запятую) *
                    </label>
                    <input
                      id="modal-project-stack"
                      required
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onBlur={() => handleArrayChange("stack", stackInput)}
                      placeholder="React, TypeScript, Tailwind"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-language" className="block text-sm font-medium text-gray-300 mb-1">
                      Основной язык *
                    </label>
                    <input
                      id="modal-project-language"
                      required
                      name="language"
                      value={formData.language || ""}
                      onChange={handleChange}
                      placeholder="TypeScript"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-github" className="block text-sm font-medium text-gray-300 mb-1">
                      URL GitHub
                    </label>
                    <input
                      id="modal-project-github"
                      name="github"
                      value={formData.github || ""}
                      onChange={handleChange}
                      placeholder="https://github.com/username/repo"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-project-demo" className="block text-sm font-medium text-gray-300 mb-1">
                      URL Demo
                    </label>
                    <input
                      id="modal-project-demo"
                      name="demo"
                      value={formData.demo || ""}
                      onChange={handleChange}
                      placeholder="https://demo.example.com"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="modal-project-accent-color" className="block text-sm font-medium text-gray-300 mb-1">
                      Цвет акцента (Tailwind градиент) *
                    </label>
                    <input
                      id="modal-project-accent-color"
                      required
                      name="accentColor"
                      value={formData.accentColor || ""}
                      onChange={handleChange}
                      placeholder="from-cyan-500 to-blue-500"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Примеры: from-indigo-500 to-purple-500, from-cyan-500 to-blue-500
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-800 flex justify-between gap-3 bg-gray-900/50">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const prevIndex = Math.max(0, currentTabIndex - 1);
                setCurrentTab(tabs[prevIndex].id);
              }}
              disabled={currentTabIndex === 0}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition"
            >
              <ChevronLeft size={16} />
              Назад
            </button>

            <button
              onClick={() => {
                const nextIndex = Math.min(tabs.length - 1, currentTabIndex + 1);
                setCurrentTab(tabs[nextIndex].id);
              }}
              disabled={currentTabIndex === tabs.length - 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition"
            >
              Далее
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition shadow-lg shadow-indigo-500/20"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {project ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
