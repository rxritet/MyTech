import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getTechnologies, type DevelopmentStage, type Project, type ProjectUpsertPayload, type Technology } from "../api";
import { createProject } from "../hooks/useProjects";
import { useAdmin } from "../context/AdminContext";
import ImageUploadField from "../components/admin/ImageUploadField";
import DevelopmentTimeline from "../components/admin/DevelopmentTimeline";
import LivePreview from "../components/admin/LivePreview";
import TechnologySelector from "../components/admin/TechnologySelector";

type TabType = "basic" | "description" | "media" | "development" | "tech";

export default function AddProjectPage() {
  const navigate = useNavigate();
  const { isAdmin, secret } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>("basic");
  const [featuresInput, setFeaturesInput] = useState("");
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<number[]>([]);

  const [formData, setFormData] = useState<Partial<Project>>({
    slug: "",
    name: "",
    status: "in_progress",
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

  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const catalog = await getTechnologies();
        setTechnologies(catalog);
      } catch {
        setTechnologies([]);
      }
    };

    if (isAdmin) {
      void loadTechnologies();
    }
  }, [isAdmin]);

  useEffect(() => {
    setFeaturesInput((formData.features ?? []).join(", "));
  }, [formData.features]);

  useEffect(() => {
    const selectedNames = technologies
      .filter((technology) => selectedTechnologyIds.includes(technology.id))
      .map((technology) => technology.name);
    setFormData((prev) => ({ ...prev, stack: selectedNames }));
  }, [selectedTechnologyIds, technologies]);

  if (!isAdmin || !secret) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const toggleTechnology = (technologyId: number) => {
    setSelectedTechnologyIds((prev) =>
      prev.includes(technologyId)
        ? prev.filter((id) => id !== technologyId)
        : [...prev, technologyId],
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: ProjectUpsertPayload = {
        ...formData,
        features: parseCommaSeparated(featuresInput),
        technologyIds: selectedTechnologyIds,
      };

      await createProject(payload, secret);
      navigate("/projects");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "basic", label: "Основная информация" },
    { id: "description", label: "Описание" },
    { id: "media", label: "Медиа" },
    { id: "development", label: "Процесс разработки" },
    { id: "tech", label: "Технологии" },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.id === currentTab);

  return (
    <main className="min-h-screen pt-16">
      <div aria-hidden="true" className="pointer-events-none select-none fixed inset-0 z-0">
        <div className="absolute left-[18%] top-[-12rem] h-[22rem] w-[22rem] rounded-full bg-orange-600/10 blur-[150px]" />
        <div className="absolute -bottom-28 right-[2%] h-[18rem] w-[18rem] rounded-full bg-amber-600/14 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <section className="max-w-[86rem] mx-auto px-3 py-12 md:px-5 md:py-16 border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Добавить новый проект</h1>
          <p className="text-gray-400 max-w-2xl">
            Заполните информацию о проекте и посмотрите, как его будут видеть посетители портфолио.
          </p>
        </section>

        <section className="max-w-[86rem] mx-auto px-3 py-12 md:px-5">
          {error && (
            <div className="mb-8 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-8 pb-4 border-b border-gray-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  currentTab === tab.id
                    ? "bg-orange-600/20 text-orange-400 border border-orange-500/30"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            {currentTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-1">Название проекта *</label>
                  <input id="project-name" required name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label htmlFor="project-slug" className="block text-sm font-medium text-gray-300 mb-1">Slug (URL) *</label>
                  <input id="project-slug" required name="slug" value={formData.slug || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label htmlFor="project-status" className="block text-sm text-gray-400 mb-1">Статус проекта</label>
                  <select
                    id="project-status"
                    name="status"
                    value={formData.status ?? "in_progress"}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="in_progress">В прогрессе</option>
                    <option value="completed">Завершен</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-created-at" className="block text-sm font-medium text-gray-300 mb-1">Дата создания *</label>
                  <input id="project-created-at" required name="createdAt" value={formData.createdAt || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label htmlFor="project-dev-time" className="block text-sm font-medium text-gray-300 mb-1">Время разработки *</label>
                  <input id="project-dev-time" required name="devTime" value={formData.devTime || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            )}

            {currentTab === "description" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-description" className="block text-sm font-medium text-gray-300 mb-1">Краткое описание *</label>
                  <textarea id="project-description" required name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label htmlFor="project-long-description" className="block text-sm font-medium text-gray-300 mb-1">Подробное описание *</label>
                  <textarea id="project-long-description" required name="longDescription" value={formData.longDescription || ""} onChange={handleChange} rows={5} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label htmlFor="project-features" className="block text-sm font-medium text-gray-300 mb-1">Особенности (через запятую) *</label>
                  <input id="project-features" required value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} onBlur={() => handleArrayChange("features", featuresInput)} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            )}

            {currentTab === "media" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-image" className="block text-sm font-medium text-gray-300 mb-2">Превью проекта (основное изображение) *</label>
                  <input id="project-image" name="image" value={formData.image || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                </div>
                <ImageUploadField images={formData.gallery || []} onImagesChange={handleGalleryChange} maxImages={10} label="Галерея фотографий (опционально)" />
              </div>
            )}

            {currentTab === "development" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Добавьте этапы разработки проекта (опционально).</p>
                <DevelopmentTimeline stages={formData.developmentProcess || []} onStagesChange={handleDevelopmentChange} />
              </div>
            )}

            {currentTab === "tech" && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-3">Технологии проекта *</div>
                  <TechnologySelector technologies={technologies} selectedIds={selectedTechnologyIds} onToggle={toggleTechnology} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-language" className="block text-sm font-medium text-gray-300 mb-1">Основной язык *</label>
                    <input id="project-language" required name="language" value={formData.language || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label htmlFor="project-github" className="block text-sm font-medium text-gray-300 mb-1">URL GitHub</label>
                    <input id="project-github" name="github" value={formData.github || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label htmlFor="project-demo" className="block text-sm font-medium text-gray-300 mb-1">URL Demo</label>
                    <input id="project-demo" name="demo" value={formData.demo || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="project-accent-color" className="block text-sm font-medium text-gray-300 mb-1">Цвет акцента (Tailwind градиент) *</label>
                    <input id="project-accent-color" required name="accentColor" value={formData.accentColor || ""} onChange={handleChange} className="w-full bg-gray-950/50 border border-gray-800 rounded-lg px-4 py-2 text-white" />
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const prevIndex = Math.max(0, currentTabIndex - 1);
                  setCurrentTab(tabs[prevIndex].id);
                }}
                disabled={currentTabIndex === 0}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-300 font-medium flex items-center gap-2 transition border border-gray-700"
              >
                <ChevronLeft size={16} /> Назад
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextIndex = Math.min(tabs.length - 1, currentTabIndex + 1);
                  setCurrentTab(tabs[nextIndex].id);
                }}
                disabled={currentTabIndex === tabs.length - 1}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-300 font-medium flex items-center gap-2 transition border border-gray-700"
              >
                Далее <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate("/projects")} disabled={loading} className="px-5 py-2 rounded-lg font-medium text-gray-400 hover:text-white transition">
                Отмена
              </button>
              <button type="submit" form="project-form" disabled={loading} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition shadow-lg shadow-orange-500/20">
                {loading && <Loader2 size={16} className="animate-spin" />}
                Добавить проект
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Предпросмотр проекта</h2>
            <LivePreview formData={formData} />
          </div>
        </section>
      </div>
    </main>
  );
}
