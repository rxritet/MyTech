import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Project, DevelopmentStage } from "../api";
import { createProject } from "../hooks/useProjects";
import { useAdmin } from "../context/AdminContext";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ImageUploadField from "../components/admin/ImageUploadField";
import DevelopmentTimeline from "../components/admin/DevelopmentTimeline";
import LivePreview from "../components/admin/LivePreview";

type TabType = "basic" | "description" | "media" | "development" | "tech";

export default function AddProjectPage() {
  const navigate = useNavigate();
  const { isAdmin, secret } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>("basic");

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
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin || !secret) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: keyof Project, value: string) => {
    const items = value
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
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
      await createProject(formData, secret);
      navigate("/projects");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
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
    <main className="min-h-screen pt-16">
      {/* Gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 z-0">
        <div className="absolute left-[18%] top-[-12rem] h-[22rem] w-[22rem] rounded-full bg-orange-600/10 blur-[150px]" />
        <div className="absolute -bottom-28 right-[2%] h-[18rem] w-[18rem] rounded-full bg-amber-600/14 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-[86rem] mx-auto px-3 py-12 md:px-5 md:py-16 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Добавить новый проект
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Заполните информацию о проекте и посмотрите, как его будут видеть посетители портфолио.
          </p>
        </section>

        {/* Main Content */}
        <section className="max-w-[86rem] mx-auto px-3 py-12 md:px-5">
          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 pb-4 border-b border-gray-800 overflow-x-auto">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  currentTab === tab.id
                    ? "bg-orange-600/20 text-orange-400 border border-orange-500/30"
                    : "text-gray-400 hover:text-gray-300"
                } ${idx > 0 ? "ml-0" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Section */}
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: Basic Information */}
              {currentTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Название проекта *
                      </label>
                      <input
                        required
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="Мой потрясающий проект"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Slug (URL) *
                      </label>
                      <input
                        required
                        name="slug"
                        value={formData.slug || ""}
                        onChange={handleChange}
                        placeholder="my-awesome-project"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Дата создания *
                      </label>
                      <input
                        required
                        name="createdAt"
                        value={formData.createdAt || ""}
                        onChange={handleChange}
                        placeholder="март 2026"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Время разработки *
                      </label>
                      <input
                        required
                        name="devTime"
                        value={formData.devTime || ""}
                        onChange={handleChange}
                        placeholder="~3 недели"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Description */}
              {currentTab === "description" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Краткое описание *
                    </label>
                    <textarea
                      required
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      placeholder="Кратко опишите суть проекта (2-3 строки)"
                      rows={3}
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Подробное описание *
                    </label>
                    <textarea
                      required
                      name="longDescription"
                      value={formData.longDescription || ""}
                      onChange={handleChange}
                      placeholder="Полное описание проекта, его цели и задачи"
                      rows={5}
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Особенности (через запятую) *
                    </label>
                    <input
                      required
                      value={formData.features?.join(", ") || ""}
                      onChange={(e) => {
                        const items = e.target.value
                          .split(",")
                          .map((i) => i.trim())
                          .filter(Boolean);
                        setFormData((prev) => ({ ...prev, features: items }));
                      }}
                      placeholder="Фича 1, Фича 2, Фича 3"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Разделяйте особенности запятыми</p>
                  </div>
                </div>
              )}

              {/* TAB 3: Media */}
              {currentTab === "media" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Превью проекта (основное изображение) *
                    </label>
                    <input
                      name="image"
                      value={formData.image || ""}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
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
                    Добавьте этапы разработки проекта (опционально). Они будут
                    показаны как временная шкала.
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Стек технологий (через запятую) *
                    </label>
                    <input
                      required
                      value={formData.stack?.join(", ") || ""}
                      onChange={(e) => {
                        const items = e.target.value
                          .split(",")
                          .map((i) => i.trim())
                          .filter(Boolean);
                        setFormData((prev) => ({ ...prev, stack: items }));
                      }}
                      placeholder="React, TypeScript, Tailwind"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Разделяйте технологии запятыми</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Основной язык *
                      </label>
                      <input
                        required
                        name="language"
                        value={formData.language || ""}
                        onChange={handleChange}
                        placeholder="TypeScript"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        URL GitHub
                      </label>
                      <input
                        name="github"
                        value={formData.github || ""}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        URL Demo
                      </label>
                      <input
                        name="demo"
                        value={formData.demo || ""}
                        onChange={handleChange}
                        placeholder="https://demo.example.com"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Цвет акцента (Tailwind градиент) *
                      </label>
                      <input
                        required
                        name="accentColor"
                        value={formData.accentColor || ""}
                        onChange={handleChange}
                        placeholder="from-cyan-500 to-blue-500"
                        className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Примеры: from-indigo-500 to-purple-500, from-cyan-500
                        to-blue-500
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Form Navigation Buttons - Full Width Below Form */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const prevIndex = Math.max(0, currentTabIndex - 1);
                    setCurrentTab(tabs[prevIndex].id);
                  }}
                  disabled={currentTabIndex === 0}
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-300 font-medium flex items-center gap-2 transition border border-gray-700"
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
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-300 font-medium flex items-center gap-2 transition border border-gray-700"
                >
                  Далее
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/projects")}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  form="project-form"
                  disabled={loading}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition shadow-lg shadow-orange-500/20"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Добавить проект
                </button>
              </div>
            </div>

            {/* Live Preview Section - Below Form */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6">Предпросмотр проекта</h2>
              <LivePreview formData={formData} />
            </div>
          </section>
        </div>
      </main>
    );
  }
