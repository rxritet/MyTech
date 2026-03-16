import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTechnology,
  deleteTechnology,
  getAboutStack,
  getHomeStack,
  getTechnologies,
  type Technology,
  type TechnologyCategory,
  updateAboutStack,
  updateHomeStack,
  updateTechnology,
} from "../api";
import { useAdmin } from "../context/AdminContext";
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";

const CATEGORIES: TechnologyCategory[] = [
  "language",
  "backend",
  "frontend",
  "devops",
  "tool",
  "mobile",
];

type TabType = "home" | "about" | "catalog";

interface AboutEditorItem {
  technologyId: number;
  category: TechnologyCategory;
}

function categoryLabel(category: TechnologyCategory): string {
  switch (category) {
    case "language":
      return "Языки";
    case "backend":
      return "Backend";
    case "frontend":
      return "Frontend";
    case "devops":
      return "DevOps";
    case "tool":
      return "Инструменты";
    case "mobile":
      return "Mobile";
    default:
      return category;
  }
}

export default function AdminStackPage() {
  const navigate = useNavigate();
  const { isAdmin, secret } = useAdmin();

  const [tab, setTab] = useState<TabType>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [homeTechnologyIds, setHomeTechnologyIds] = useState<number[]>([]);
  const [aboutItems, setAboutItems] = useState<AboutEditorItem[]>([]);

  const [newTechnologyName, setNewTechnologyName] = useState("");
  const [newTechnologyCategory, setNewTechnologyCategory] = useState<TechnologyCategory>("tool");
  const [newTechnologyBadgeUrl, setNewTechnologyBadgeUrl] = useState("");

  const [editingMap, setEditingMap] = useState<Record<number, Partial<Technology>>>({});
  const [aboutDraftTechnologyId, setAboutDraftTechnologyId] = useState<number | null>(null);
  const [aboutDraftCategory, setAboutDraftCategory] = useState<TechnologyCategory>("language");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catalog, homeStack, aboutStack] = await Promise.all([
        getTechnologies(),
        getHomeStack(),
        getAboutStack(),
      ]);

      setTechnologies(catalog);
      const sortedHome = [...homeStack];
      sortedHome.sort((a, b) => a.order - b.order);
      setHomeTechnologyIds(sortedHome.map((item) => item.technologyId));

      const sortedAbout = [...aboutStack];
      sortedAbout.sort((a, b) => {
        if (a.category === b.category) {
          return a.order - b.order;
        }
        return a.category.localeCompare(b.category);
      });
      setAboutItems(
        sortedAbout
          .map((item) => ({
            technologyId: item.technologyId,
            category: item.category,
          })),
      );
    } catch {
      setError("Не удалось загрузить технологический стек");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void reload();
    }
  }, [isAdmin]);

  const technologyMap = useMemo(
    () => new Map(technologies.map((technology) => [technology.id, technology])),
    [technologies],
  );

  const homeAvailable = technologies.filter((technology) => !homeTechnologyIds.includes(technology.id));

  const aboutByCategory = CATEGORIES.map((category) => ({
    category,
    items: aboutItems.filter((item) => item.category === category),
  }));

  const aboutAssignedIds = new Set(aboutItems.map((item) => item.technologyId));
  const aboutAvailable = technologies.filter((technology) => !aboutAssignedIds.has(technology.id));

  if (!isAdmin || !secret) {
    return null;
  }

  const moveHomeItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= homeTechnologyIds.length) return;

    setHomeTechnologyIds((prev) => {
      const next = [...prev];
      const current = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = current;
      return next;
    });
  };

  const moveAboutItem = (category: TechnologyCategory, index: number, direction: -1 | 1) => {
    const categoryItems = aboutItems.filter((item) => item.category === category);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;

    const currentId = categoryItems[index].technologyId;
    const targetId = categoryItems[targetIndex].technologyId;

    const next = [...aboutItems];
    const currentGlobalIndex = next.findIndex((item) => item.technologyId === currentId && item.category === category);
    const targetGlobalIndex = next.findIndex((item) => item.technologyId === targetId && item.category === category);
    const current = next[currentGlobalIndex];
    next[currentGlobalIndex] = next[targetGlobalIndex];
    next[targetGlobalIndex] = current;
    setAboutItems(next);
  };

  const saveHome = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateHomeStack(
        {
          ids: homeTechnologyIds,
          order: homeTechnologyIds.map((_, index) => index),
        },
        secret,
      );
    } catch {
      setError("Не удалось сохранить стек главной страницы");
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    setError(null);
    try {
      const payloadItems = CATEGORIES.flatMap((category) =>
        aboutItems
          .filter((item) => item.category === category)
          .map((item, index) => ({
            technologyId: item.technologyId,
            category: item.category,
            order: index,
          })),
      );

      await updateAboutStack({ items: payloadItems }, secret);
    } catch {
      setError("Не удалось сохранить стек страницы Обо мне");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTechnology = async () => {
    if (!newTechnologyName.trim() || !newTechnologyBadgeUrl.trim()) {
      setError("Заполните название и ссылку на бейдж");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createTechnology(
        {
          name: newTechnologyName.trim(),
          category: newTechnologyCategory,
          badgeUrl: newTechnologyBadgeUrl.trim(),
        },
        secret,
      );
      setNewTechnologyName("");
      setNewTechnologyBadgeUrl("");
      await reload();
    } catch {
      setError("Не удалось создать технологию");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTechnology = async (technologyId: number) => {
    const patch = editingMap[technologyId];
    if (!patch) return;

    setSaving(true);
    setError(null);
    try {
      await updateTechnology(technologyId, patch, secret);
      setEditingMap((prev) => {
        const next = { ...prev };
        delete next[technologyId];
        return next;
      });
      await reload();
    } catch {
      setError("Не удалось обновить технологию");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTechnology = async (technologyId: number) => {
    setSaving(true);
    setError(null);
    try {
      await deleteTechnology(technologyId, secret);
      await reload();
    } catch {
      setError("Технология используется и не может быть удалена");
    } finally {
      setSaving(false);
    }
  };

  const removeHomeTechnology = (technologyId: number) => {
    setHomeTechnologyIds((prev) => prev.filter((id) => id !== technologyId));
  };

  const removeAboutTechnology = (technologyId: number) => {
    setAboutItems((prev) => prev.filter((value) => value.technologyId !== technologyId));
  };

  const updateDraftField = <K extends keyof Technology>(
    technologyId: number,
    field: K,
    value: Technology[K],
  ) => {
    setEditingMap((prev) => ({
      ...prev,
      [technologyId]: {
        ...prev[technologyId],
        [field]: value,
      },
    }));
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "home", label: "Главная" },
    { id: "about", label: "Обо мне" },
    { id: "catalog", label: "Каталог" },
  ];

  return (
    <main className="pt-16">
      <section className="max-w-[86rem] mx-auto px-3 py-12 md:px-5">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Управление стеком</h1>
        <p className="text-gray-400 mb-8">Настройка технологий для Home, About и общего каталога.</p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === item.id
                  ? "bg-orange-600/20 text-orange-300 border border-orange-500/40"
                  : "text-gray-400 border border-gray-800 hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={18} /> Загрузка...
          </div>
        ) : (
          <div className="space-y-6">
            {tab === "home" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                  <label htmlFor="home-tech-select" className="block text-sm text-gray-300 mb-2">Добавить технологию на главную</label>
                  <select
                    id="home-tech-select"
                    defaultValue=""
                    onChange={(e) => {
                      const technologyId = Number(e.target.value);
                      if (!technologyId) return;
                      setHomeTechnologyIds((prev) => [...prev, technologyId]);
                      e.target.value = "";
                    }}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  >
                    <option value="">Выберите технологию</option>
                    {homeAvailable.map((technology) => (
                      <option key={technology.id} value={technology.id}>
                        {technology.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {homeTechnologyIds.map((technologyId, index) => {
                    const technology = technologyMap.get(technologyId);
                    if (!technology) return null;

                    return (
                      <div key={`home-${technologyId}`} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950/40 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={technology.badgeUrl} alt={technology.name} className="h-7 w-7 rounded" />
                          <span className="text-white">{technology.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => moveHomeItem(index, -1)} className="p-1.5 text-gray-400 hover:text-white">
                            <ArrowUp size={16} />
                          </button>
                          <button type="button" onClick={() => moveHomeItem(index, 1)} className="p-1.5 text-gray-400 hover:text-white">
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeHomeTechnology(technologyId)}
                            className="p-1.5 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => void saveHome()}
                  disabled={saving}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  Сохранить стек главной
                </button>
              </div>
            )}

            {tab === "about" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={aboutDraftTechnologyId ?? ""}
                    onChange={(e) => setAboutDraftTechnologyId(Number(e.target.value) || null)}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  >
                    <option value="">Выберите технологию</option>
                    {aboutAvailable.map((technology) => (
                      <option key={`about-available-${technology.id}`} value={technology.id}>
                        {technology.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={aboutDraftCategory}
                    onChange={(e) => setAboutDraftCategory(e.target.value as TechnologyCategory)}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={`about-category-${category}`} value={category}>
                        {categoryLabel(category)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      if (!aboutDraftTechnologyId) return;
                      setAboutItems((prev) => [
                        ...prev,
                        { technologyId: aboutDraftTechnologyId, category: aboutDraftCategory },
                      ]);
                      setAboutDraftTechnologyId(null);
                    }}
                    className="rounded-lg border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                  >
                    Добавить в категорию
                  </button>
                </div>

                {aboutByCategory.map(({ category, items }) => (
                  <div key={`about-${category}`} className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 space-y-3">
                    <h3 className="text-white font-semibold">{categoryLabel(category)}</h3>
                    {items.length === 0 && <p className="text-sm text-gray-500">Пока пусто</p>}
                    {items.map((item, index) => {
                      const technology = technologyMap.get(item.technologyId);
                      if (!technology) return null;

                      return (
                        <div key={`about-item-${item.technologyId}`} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-4 py-2">
                          <div className="flex items-center gap-3">
                            <img src={technology.badgeUrl} alt={technology.name} className="h-7 w-7 rounded" />
                            <span className="text-white">{technology.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => moveAboutItem(category, index, -1)} className="p-1.5 text-gray-400 hover:text-white">
                              <ArrowUp size={16} />
                            </button>
                            <button type="button" onClick={() => moveAboutItem(category, index, 1)} className="p-1.5 text-gray-400 hover:text-white">
                              <ArrowDown size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAboutTechnology(item.technologyId)}
                              className="p-1.5 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => void saveAbout()}
                  disabled={saving}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  Сохранить стек Обо мне
                </button>
              </div>
            )}

            {tab === "catalog" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={newTechnologyName}
                    onChange={(e) => setNewTechnologyName(e.target.value)}
                    placeholder="Название"
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  />
                  <select
                    value={newTechnologyCategory}
                    onChange={(e) => setNewTechnologyCategory(e.target.value as TechnologyCategory)}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={`new-category-${category}`} value={category}>
                        {categoryLabel(category)}
                      </option>
                    ))}
                  </select>
                  <input
                    value={newTechnologyBadgeUrl}
                    onChange={(e) => setNewTechnologyBadgeUrl(e.target.value)}
                    placeholder="Badge URL"
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => void handleCreateTechnology()}
                    disabled={saving}
                    className="md:col-span-3 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
                  >
                    Добавить технологию
                  </button>
                </div>

                <div className="space-y-2">
                  {technologies.map((technology) => {
                    const draft = editingMap[technology.id] ?? {};
                    return (
                      <div key={technology.id} className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <img src={technology.badgeUrl} alt={technology.name} className="h-8 w-8 rounded" />
                        <input
                          value={draft.name ?? technology.name}
                          onChange={(e) => updateDraftField(technology.id, "name", e.target.value)}
                          className="md:col-span-3 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                        />
                        <select
                          value={draft.category ?? technology.category}
                          onChange={(e) => updateDraftField(technology.id, "category", e.target.value as TechnologyCategory)}
                          className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                        >
                          {CATEGORIES.map((category) => (
                            <option key={`edit-${technology.id}-${category}`} value={category}>
                              {categoryLabel(category)}
                            </option>
                          ))}
                        </select>
                        <input
                          value={draft.badgeUrl ?? technology.badgeUrl}
                          onChange={(e) => updateDraftField(technology.id, "badgeUrl", e.target.value)}
                          className="md:col-span-4 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                        />
                        <div className="md:col-span-2 flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => void handleSaveTechnology(technology.id)}
                            disabled={saving}
                            className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
                          >
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteTechnology(technology.id)}
                            disabled={saving}
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
