import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createHomeStackCategory,
  createHomeStackItem,
  createTechnology,
  deleteHomeStackCategory,
  deleteHomeStackItem,
  deleteTechnology,
  getAboutStack,
  getHomeStack,
  getTechnologies,
  type HomeStackCategory,
  type Technology,
  type TechnologyCategory,
  updateAboutStack,
  updateHomeStackOrder,
  updateTechnology,
} from "../api";
import { useAdmin } from "../context/AdminContext";
import TechIcon from "../components/TechIcon";
import { GripVertical, ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";

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
  category: string;
}

interface SortableRowProps {
  id: UniqueIdentifier;
  label: string;
  isActive?: boolean;
  onSelect?: () => void;
  onDelete: (event: MouseEvent<HTMLButtonElement>) => void;
}

function normalizeHomeCategories(categories: HomeStackCategory[]): HomeStackCategory[] {
  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category, categoryIndex) => ({
      ...category,
      order: categoryIndex,
      items: [...category.items]
        .sort((a, b) => a.order - b.order)
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex,
          name: item.name.trim(),
        }))
        .filter((item) => item.name.length > 0),
    }));
}

function SortableRow({ id, label, isActive = false, onSelect, onDelete }: Readonly<SortableRowProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const isSelectable = typeof onSelect === "function";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
        isActive
          ? "border-gray-700 border-l-2 border-l-orange-500 bg-white/10"
          : "border-gray-800 bg-gray-950"
      } ${isDragging ? "opacity-50 outline outline-1 outline-dashed outline-orange-400" : ""}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          {...attributes}
          {...listeners}
          className="inline-flex cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
          aria-label="Перетащить"
        >
          <GripVertical size={15} />
        </span>
        {isSelectable ? (
          <button
            type="button"
            onClick={onSelect}
            className="text-left text-sm text-white truncate"
          >
            {label}
          </button>
        ) : (
          <span className="text-left text-sm text-white truncate">{label}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="p-1 text-red-400 hover:text-red-300"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function categoryLabel(category: string): string {
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

function normalizeCustomIconInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/<svg[\s\S]*<\/svg>/i.test(trimmed)) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`;
  }

  const deviconClassMatch = /devicon-[a-z0-9-]+/i.exec(trimmed);
  if (deviconClassMatch?.[0]) {
    return deviconClassMatch[0].toLowerCase();
  }

  const srcMatch = /src\s*=\s*["']([^"']+)["']/i.exec(trimmed);
  const candidate = srcMatch?.[1]?.trim() ?? trimmed;

  try {
    const parsed = new URL(candidate);
    if (parsed.hostname.includes("shields.io")) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function extractInlineSvgMarkup(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const directMatch = /<svg[\s\S]*<\/svg>/i.exec(trimmed);
  if (directMatch?.[0]) {
    return directMatch[0];
  }

  const dataSvgPrefix = "data:image/svg+xml;utf8,";
  if (!trimmed.toLowerCase().startsWith(dataSvgPrefix)) {
    return null;
  }

  const encoded = trimmed.slice(dataSvgPrefix.length);
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}

function regexReplaceAll(
  input: string,
  pattern: RegExp,
  replacement: string | ((...args: any[]) => string),
): string {
  return (pattern as { [Symbol.replace](value: string, replaceValue: unknown): string })[
    Symbol.replace
  ](input, replacement);
}

function minifyInlineSvgMarkup(svg: string): string {
  let result = svg;
  result = regexReplaceAll(result, /<!--[\s\S]*?-->/g, "");
  result = regexReplaceAll(result, /<desc[\s\S]*?<\/desc>/gi, "");
  result = regexReplaceAll(result, /[\r\n\t]+/g, " ");
  result = regexReplaceAll(result, />\s+</g, "><");
  result = regexReplaceAll(result, /\s{2,}/g, " ");
  return result.trim();
}

function shrinkSvgInputValue(value: string): string {
  const svgMarkup = extractInlineSvgMarkup(value);
  if (!svgMarkup) return value;
  return minifyInlineSvgMarkup(svgMarkup);
}

function recolorInlineSvgToWhite(svg: string): string {
  const isSpecialColor = (value: string): boolean => {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "none" ||
      normalized === "transparent" ||
      normalized === "currentcolor" ||
      normalized.startsWith("url(")
    );
  };

  const normalizeColorValue = (value: string): string => {
    if (isSpecialColor(value)) {
      return value;
    }
    return "#ffffff";
  };

  let result = svg;
  result = regexReplaceAll(
    result,
    /(\bfill\s*=\s*["'])([^"']+)(["'])/gi,
    (_match: string, prefix: string, value: string, suffix: string) => {
      return `${prefix}${normalizeColorValue(value)}${suffix}`;
    },
  );
  result = regexReplaceAll(
    result,
    /(\bstroke\s*=\s*["'])([^"']+)(["'])/gi,
    (_match: string, prefix: string, value: string, suffix: string) => {
      return `${prefix}${normalizeColorValue(value)}${suffix}`;
    },
  );
  result = regexReplaceAll(result, /(fill\s*:\s*)([^;"']+)/gi, (_match: string, prefix: string, value: string) => {
    return `${prefix}${normalizeColorValue(value)}`;
  });
  result = regexReplaceAll(result, /(stroke\s*:\s*)([^;"']+)/gi, (_match: string, prefix: string, value: string) => {
    return `${prefix}${normalizeColorValue(value)}`;
  });
  return result;
}

function recolorSvgInputValueToWhite(value: string): string {
  const svgMarkup = extractInlineSvgMarkup(value);
  if (!svgMarkup) return value;
  return recolorInlineSvgToWhite(svgMarkup);
}

function normalizeDeviconSlugInput(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";

  const deviconMatch = /devicon-([a-z0-9-]+)/i.exec(trimmed);
  const cdnMatch = /\/icons\/([a-z0-9-]+)\/[a-z0-9-]+-(?:plain|original|line)(?:-wordmark)?\.svg/i.exec(trimmed);
  const rawSlugMatch = /^[a-z0-9-]+$/i.test(trimmed) ? trimmed : "";

  const candidate = (deviconMatch?.[1] ?? cdnMatch?.[1] ?? rawSlugMatch)
    .replace(/-(?:plain|original|line)(?:-wordmark)?$/i, "")
    .replace(/-wordmark$/i, "")
    .replace(/-colored$/i, "");

  return candidate.trim();
}

function extractDeviconSlugFromIconInput(value: string): string {
  return normalizeDeviconSlugInput(value);
}

function extractDeviconClassTokenFromInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const match = /devicon-[a-z0-9-]+/i.exec(trimmed);
  return match?.[0]?.toLowerCase() ?? "";
}

function sanitizeBadgeUrlForInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const deviconClassMatch = /devicon-[a-z0-9-]+/i.exec(trimmed);
  if (deviconClassMatch?.[0]) {
    return deviconClassMatch[0].toLowerCase();
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("shields.io")) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
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
  const [homeCategories, setHomeCategories] = useState<HomeStackCategory[]>([]);
  const [selectedHomeCategoryId, setSelectedHomeCategoryId] = useState<number | null>(null);
  const [activeCategoryDragId, setActiveCategoryDragId] = useState<number | null>(null);
  const [activeItemDragId, setActiveItemDragId] = useState<number | null>(null);
  const [newHomeCategorySlug, setNewHomeCategorySlug] = useState("");
  const [newHomeCategoryLabel, setNewHomeCategoryLabel] = useState("");
  const [newHomeItemName, setNewHomeItemName] = useState("");
  const [aboutItems, setAboutItems] = useState<AboutEditorItem[]>([]);
  const [aboutCategories, setAboutCategories] = useState<string[]>([]);
  const [aboutNewCategory, setAboutNewCategory] = useState("");

  const [newTechnologyName, setNewTechnologyName] = useState("");
  const [newTechnologyCategory, setNewTechnologyCategory] = useState<TechnologyCategory>("tool");
  const [newTechnologyBadgeUrl, setNewTechnologyBadgeUrl] = useState("");
  const [newTechnologyDeviconSlug, setNewTechnologyDeviconSlug] = useState("");

  const [editingMap, setEditingMap] = useState<Record<number, Partial<Technology>>>({});
  const [aboutDraftTechnologyId, setAboutDraftTechnologyId] = useState<number | null>(null);
  const [aboutDraftCategory, setAboutDraftCategory] = useState<string>("");
  const [aboutSearchQuery, setAboutSearchQuery] = useState("");
  const [aboutComboboxOpen, setAboutComboboxOpen] = useState(false);
  const [addingAboutTechnology, setAddingAboutTechnology] = useState(false);
  const aboutComboboxRef = useRef<HTMLDivElement | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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
      const sortedHome = normalizeHomeCategories(homeStack);
      setHomeCategories(sortedHome);
      setSelectedHomeCategoryId((prev) => {
        if (prev && sortedHome.some((category) => category.id === prev)) {
          return prev;
        }
        return sortedHome[0]?.id ?? null;
      });

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

      const usedCategories = Array.from(new Set(sortedAbout.map((item) => item.category)));
      setAboutCategories(usedCategories);
      setAboutDraftCategory(usedCategories[0] ?? "");
      setAboutNewCategory("");
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

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (!aboutComboboxRef.current) return;
      if (aboutComboboxRef.current.contains(event.target as Node)) return;
      setAboutComboboxOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const technologyMap = useMemo(
    () => new Map(technologies.map((technology) => [technology.id, technology])),
    [technologies],
  );

  const selectedHomeCategory =
    homeCategories.find((category) => category.id === selectedHomeCategoryId) ?? null;

  const activeCategoryLabel =
    homeCategories.find((category) => category.id === activeCategoryDragId)?.slug ?? "";

  const activeItemLabel =
    selectedHomeCategory?.items.find((item) => item.id === activeItemDragId)?.name ?? "";

  const aboutByCategory = aboutCategories.map((category) => ({
    category,
    items: aboutItems.filter((item) => item.category === category),
  }));

  const aboutAssignedIds = new Set(aboutItems.map((item) => item.technologyId));
  const filteredAboutTechnologies = technologies.filter((technology) => {
    if (aboutAssignedIds.has(technology.id)) {
      return false;
    }
    return technology.name.toLowerCase().includes(aboutSearchQuery.trim().toLowerCase());
  });

  const selectedAboutTechnology =
    technologies.find((technology) => technology.id === aboutDraftTechnologyId) ?? null;

  const previewDeviconSlug =
    normalizeDeviconSlugInput(newTechnologyDeviconSlug) ||
    (extractDeviconClassTokenFromInput(newTechnologyBadgeUrl)
      ? ""
      : extractDeviconSlugFromIconInput(newTechnologyBadgeUrl));
  const previewFallbackSrc = normalizeCustomIconInput(newTechnologyBadgeUrl) || null;
  const canShrinkNewTechnologySvg = Boolean(extractInlineSvgMarkup(newTechnologyBadgeUrl));
  const canRecolorNewTechnologySvg = canShrinkNewTechnologySvg;

  if (!isAdmin || !secret) {
    return null;
  }

  const persistHomeOrder = async (
    nextCategories: HomeStackCategory[],
    rollbackCategories: HomeStackCategory[],
  ) => {
    try {
      const saved = await updateHomeStackOrder(
        {
          categories: nextCategories.map((category, index) => ({
            id: category.id,
            order: index,
          })),
          items: nextCategories.flatMap((category) =>
            category.items.map((item, index) => ({
              id: item.id,
              order: index,
            })),
          ),
        },
        secret,
      );

      setHomeCategories(normalizeHomeCategories(saved));
      setError(null);
    } catch {
      setHomeCategories(rollbackCategories);
      setError("Не удалось сохранить новый порядок");
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCategoryDragId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = homeCategories.findIndex((category) => category.id === Number(active.id));
    const newIndex = homeCategories.findIndex((category) => category.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const rollback = homeCategories;
    const moved = arrayMove(homeCategories, oldIndex, newIndex).map((category, index) => ({
      ...category,
      order: index,
    }));

    setHomeCategories(moved);
    void persistHomeOrder(moved, rollback);
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    if (!selectedHomeCategory) {
      setActiveItemDragId(null);
      return;
    }

    const { active, over } = event;
    setActiveItemDragId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = selectedHomeCategory.items.findIndex((item) => item.id === Number(active.id));
    const newIndex = selectedHomeCategory.items.findIndex((item) => item.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const rollback = homeCategories;
    const reorderedItems = arrayMove(selectedHomeCategory.items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      order: index,
    }));

    const nextCategories = homeCategories.map((category) =>
      category.id === selectedHomeCategory.id
        ? { ...category, items: reorderedItems }
        : category,
    );

    setHomeCategories(nextCategories);
    void persistHomeOrder(nextCategories, rollback);
  };

  const moveAboutItem = (category: string, index: number, direction: -1 | 1) => {
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

  const handleCreateHomeCategory = async () => {
    const slug = newHomeCategorySlug.trim();
    const label = newHomeCategoryLabel.trim() || slug;
    if (!slug) {
      setError("Введите slug категории");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createHomeStackCategory({ slug, label }, secret);
      setNewHomeCategorySlug("");
      setNewHomeCategoryLabel("");
      await reload();
      setSelectedHomeCategoryId(Number(created.id));
    } catch {
      setError("Не удалось создать категорию");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHomeCategory = async (id: number) => {
    setSaving(true);
    setError(null);
    try {
      await deleteHomeStackCategory(id, secret);
      await reload();
    } catch {
      setError("Не удалось удалить категорию");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateHomeItem = async () => {
    if (!selectedHomeCategoryId) {
      setError("Выберите категорию");
      return;
    }

    const name = newHomeItemName.trim();
    if (!name) {
      setError("Введите название технологии");
      return;
    }

    const hasDuplicate = selectedHomeCategory?.items.some(
      (item) => item.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (hasDuplicate) {
      setError("Такая технология уже есть в выбранной категории");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createHomeStackItem({ category_id: selectedHomeCategoryId, name }, secret);
      setNewHomeItemName("");
      await reload();
    } catch {
      setError("Не удалось добавить технологию");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHomeItem = async (id: number) => {
    setSaving(true);
    setError(null);
    try {
      await deleteHomeStackItem(id, secret);
      await reload();
    } catch {
      setError("Не удалось удалить технологию");
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    setError(null);
    try {
      const payloadItems = aboutCategories.flatMap((category) =>
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
    const normalizedBadgeUrl = normalizeCustomIconInput(newTechnologyBadgeUrl);
    const hasDeviconClassToken = Boolean(extractDeviconClassTokenFromInput(newTechnologyBadgeUrl));
    const normalizedDeviconSlug =
      normalizeDeviconSlugInput(newTechnologyDeviconSlug) ||
      (hasDeviconClassToken ? "" : extractDeviconSlugFromIconInput(newTechnologyBadgeUrl));

    if (!newTechnologyName.trim()) {
      setError("Заполните название технологии");
      return;
    }

    if (!normalizedDeviconSlug && !normalizedBadgeUrl) {
      setError("Укажите Devicon slug, devicon HTML-тег или кастомный URL иконки");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createTechnology(
        {
          name: newTechnologyName.trim(),
          category: newTechnologyCategory,
          badgeUrl: normalizedBadgeUrl,
          deviconSlug: normalizedDeviconSlug || null,
        },
        secret,
      );
      setNewTechnologyName("");
      setNewTechnologyBadgeUrl("");
      setNewTechnologyDeviconSlug("");
      await reload();
    } catch (createError: unknown) {
      if (createError instanceof Error && createError.message.trim()) {
        setError(createError.message);
      } else {
        setError("Не удалось создать технологию");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTechnology = async (technologyId: number) => {
    const patch = editingMap[technologyId];
    if (!patch) return;

    const payload: Partial<Technology> = { ...patch };
    const hasDeviconClassToken = typeof patch.badgeUrl === "string"
      ? Boolean(extractDeviconClassTokenFromInput(patch.badgeUrl))
      : false;
    let extractedSlugFromIconInput = "";
    if (typeof patch.badgeUrl === "string" && !hasDeviconClassToken) {
      extractedSlugFromIconInput = extractDeviconSlugFromIconInput(patch.badgeUrl);
    }

    if (typeof payload.badgeUrl === "string") {
      payload.badgeUrl = normalizeCustomIconInput(payload.badgeUrl);
    }
    if (typeof payload.deviconSlug === "string") {
      payload.deviconSlug = normalizeDeviconSlugInput(payload.deviconSlug) || null;
    }
    if (payload.deviconSlug === undefined && extractedSlugFromIconInput) {
      payload.deviconSlug = extractedSlugFromIconInput;
    }

    setSaving(true);
    setError(null);
    try {
      await updateTechnology(technologyId, payload, secret);
      setEditingMap((prev) => {
        const next = { ...prev };
        delete next[technologyId];
        return next;
      });
      await reload();
    } catch (saveError: unknown) {
      if (saveError instanceof Error && saveError.message.trim()) {
        setError(saveError.message);
      } else {
        setError("Не удалось обновить технологию");
      }
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

  const removeAboutTechnology = (technologyId: number) => {
    setAboutItems((prev) => prev.filter((value) => value.technologyId !== technologyId));
  };

  const handleAddAboutCategory = () => {
    const normalized = aboutNewCategory.trim();

    if (!normalized) {
      setError("Выберите категорию для добавления");
      return;
    }

    const duplicate = aboutCategories.some(
      (category) => category.toLowerCase() === normalized.toLowerCase(),
    );
    if (duplicate) {
      setError("Категория уже добавлена");
      return;
    }

    setAboutCategories((prev) => [...prev, normalized]);
    setAboutDraftCategory(normalized);
    setAboutNewCategory("");
    setError(null);
  };

  const handleDeleteAboutCategory = (category: string) => {
    setAboutCategories((prev) => prev.filter((value) => value !== category));
    setAboutItems((prev) => prev.filter((item) => item.category !== category));

    setAboutDraftCategory((prev) => {
      if (prev !== category) return prev;
      const remaining = aboutCategories.find((value) => value !== category);
      return remaining ?? "";
    });
  };

  const handleAddAboutTechnology = async () => {
    if (aboutCategories.length === 0) {
      setError("Сначала добавьте хотя бы одну категорию");
      return;
    }

    if (!aboutDraftTechnologyId) {
      setError("Сначала выберите технологию");
      return;
    }

    if (!aboutDraftCategory) {
      setError("Выберите категорию");
      return;
    }

    const alreadyAdded = aboutItems.some((item) => item.technologyId === aboutDraftTechnologyId);
    if (alreadyAdded) {
      setError("Эта технология уже добавлена");
      return;
    }

    setAddingAboutTechnology(true);
    setError(null);
    try {
      setAboutItems((prev) => [
        ...prev,
        { technologyId: aboutDraftTechnologyId, category: aboutDraftCategory },
      ]);
      setAboutDraftTechnologyId(null);
      setAboutSearchQuery("");
      setAboutComboboxOpen(false);
    } finally {
      setAddingAboutTechnology(false);
    }
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
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
                  <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-200">Категории</p>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={(event) => setActiveCategoryDragId(Number(event.active.id))}
                      onDragEnd={handleCategoryDragEnd}
                      onDragCancel={() => setActiveCategoryDragId(null)}
                    >
                      <SortableContext
                        items={homeCategories.map((category) => category.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {homeCategories.map((category) => (
                            <SortableRow
                              key={category.id}
                              id={category.id}
                              label={category.slug}
                              isActive={selectedHomeCategoryId === category.id}
                              onSelect={() => setSelectedHomeCategoryId(Number(category.id))}
                              onDelete={(event) => {
                                event.stopPropagation();
                                void handleDeleteHomeCategory(category.id);
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                      <DragOverlay>
                        {activeCategoryLabel ? (
                          <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white shadow-xl">
                            {activeCategoryLabel}
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>

                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <input
                        value={newHomeCategorySlug}
                        onChange={(e) => setNewHomeCategorySlug(e.target.value)}
                        placeholder="Slug (например: langs)"
                        className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
                      />
                      <input
                        value={newHomeCategoryLabel}
                        onChange={(e) => setNewHomeCategoryLabel(e.target.value)}
                        placeholder="Label (опц.)"
                        className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => void handleCreateHomeCategory()}
                        disabled={saving || newHomeCategorySlug.trim().length === 0}
                        className="w-full rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
                      >
                        + Категория
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-200">
                      Технологии{selectedHomeCategory ? `: ${selectedHomeCategory.slug}` : ""}
                    </p>

                    {!selectedHomeCategory && (
                      <p className="text-sm text-gray-500">Выберите категорию слева.</p>
                    )}

                    {selectedHomeCategory && (
                      <>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragStart={(event) => setActiveItemDragId(Number(event.active.id))}
                          onDragEnd={handleItemDragEnd}
                          onDragCancel={() => setActiveItemDragId(null)}
                        >
                          <SortableContext
                            items={selectedHomeCategory.items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {selectedHomeCategory.items.map((item) => (
                                <SortableRow
                                  key={item.id}
                                  id={item.id}
                                  label={item.name}
                                  onDelete={(event) => {
                                    event.stopPropagation();
                                    void handleDeleteHomeItem(item.id);
                                  }}
                                />
                              ))}
                            </div>
                          </SortableContext>
                          <DragOverlay>
                            {activeItemLabel ? (
                              <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white shadow-xl">
                                {activeItemLabel}
                              </div>
                            ) : null}
                          </DragOverlay>
                        </DndContext>

                        <div className="flex flex-col md:flex-row gap-2 pt-2 border-t border-gray-800">
                          <input
                            value={newHomeItemName}
                            onChange={(e) => setNewHomeItemName(e.target.value)}
                            placeholder="Добавить технологию"
                            className="flex-1 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
                          />
                          <button
                            type="button"
                            onClick={() => void handleCreateHomeItem()}
                            disabled={saving || newHomeItemName.trim().length === 0}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
                          >
                            Добавить
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "about" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-gray-200">Категории "Обо мне"</p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                        value={aboutNewCategory}
                          onChange={(e) => setAboutNewCategory(e.target.value)}
                          placeholder="Новая категория (например: Data & ML)"
                        className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                        />
                      <button
                        type="button"
                        onClick={handleAddAboutCategory}
                          disabled={saving || !aboutNewCategory.trim()}
                        className="rounded-lg border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
                      >
                        + Добавить категорию
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {aboutCategories.length === 0 && (
                      <span className="text-sm text-gray-500">Пока нет категорий</span>
                    )}
                    {aboutCategories.map((category) => (
                      <span
                        key={`about-chip-${category}`}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-200"
                      >
                        {categoryLabel(category)}
                        <button
                          type="button"
                          onClick={() => handleDeleteAboutCategory(category)}
                          className="text-red-400 hover:text-red-300"
                          aria-label={`Удалить категорию ${categoryLabel(category)}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div ref={aboutComboboxRef} className="relative">
                    <input
                      value={aboutSearchQuery}
                      onFocus={() => setAboutComboboxOpen(true)}
                      onChange={(event) => {
                        setAboutSearchQuery(event.target.value);
                        setAboutDraftTechnologyId(null);
                        setAboutComboboxOpen(true);
                      }}
                      placeholder="Поиск технологии..."
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 pr-9 text-white"
                    />

                    {aboutSearchQuery.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setAboutSearchQuery("");
                          setAboutDraftTechnologyId(null);
                          setAboutComboboxOpen(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    )}

                    {aboutComboboxOpen && (
                      <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 shadow-xl">
                        {filteredAboutTechnologies.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">Ничего не найдено</div>
                        )}

                        {filteredAboutTechnologies.map((technology) => (
                          <button
                            key={`about-combobox-${technology.id}`}
                            type="button"
                            onClick={() => {
                              setAboutDraftTechnologyId(technology.id);
                              setAboutSearchQuery(technology.name);
                              setAboutComboboxOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-200 hover:bg-white/5"
                          >
                            <TechIcon
                              slug={technology.deviconSlug}
                              name={technology.name}
                              size={24}
                              fallbackSrc={technology.badgeUrl}
                            />
                            <span className="truncate">{technology.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <select
                    value={aboutDraftCategory}
                    onChange={(e) => setAboutDraftCategory(e.target.value)}
                    disabled={aboutCategories.length === 0}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  >
                    {aboutCategories.map((category) => (
                      <option key={`about-category-${category}`} value={category}>
                        {categoryLabel(category)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => void handleAddAboutTechnology()}
                    disabled={addingAboutTechnology || !selectedAboutTechnology || aboutCategories.length === 0}
                    className="rounded-lg border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
                  >
                    {addingAboutTechnology ? "Добавляю..." : "Добавить в категорию"}
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
                            <TechIcon
                              slug={technology.deviconSlug}
                              name={technology.name}
                              size={24}
                              fallbackSrc={technology.badgeUrl}
                            />
                            <span className="text-sm font-medium text-white">{technology.name}</span>
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
                <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    placeholder={'URL, <img ...> или <i class="devicon-..."></i>'}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2">
                    <TechIcon
                      slug={previewDeviconSlug || null}
                      name={newTechnologyName || "preview"}
                      size={28}
                      fallbackSrc={previewFallbackSrc}
                    />
                    <input
                      value={newTechnologyDeviconSlug}
                      onChange={(e) => setNewTechnologyDeviconSlug(e.target.value)}
                      placeholder="Devicon slug (опционально)"
                      className="w-full bg-transparent text-white outline-none"
                    />
                  </div>
                  <p className="md:col-span-4 text-xs text-gray-500">
                    Вставьте из devicon.dev: &lt;i class=&quot;devicon-supabase-plain&quot;&gt;&lt;/i&gt; или URL SVG из &lt;img src=&quot;...&quot;&gt;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNewTechnologyBadgeUrl((prev) => shrinkSvgInputValue(prev))}
                    disabled={!canShrinkNewTechnologySvg}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Сжать SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTechnologyBadgeUrl((prev) => recolorSvgInputValueToWhite(prev))}
                    disabled={!canRecolorNewTechnologySvg}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Сделать белой
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCreateTechnology()}
                    disabled={saving}
                    className="md:col-span-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
                  >
                    Добавить технологию
                  </button>
                </div>

                <div className="space-y-2">
                  {technologies.map((technology) => {
                    const draft = editingMap[technology.id] ?? {};
                    const draftBadge = draft.badgeUrl;
                    const hasDraftDeviconClassToken = typeof draftBadge === "string"
                      ? Boolean(extractDeviconClassTokenFromInput(draftBadge))
                      : Boolean(extractDeviconClassTokenFromInput(technology.badgeUrl));
                    let extractedDraftSlugFromBadge = "";
                    if (typeof draftBadge === "string" && !hasDraftDeviconClassToken) {
                      extractedDraftSlugFromBadge = extractDeviconSlugFromIconInput(draftBadge);
                    }
                    const effectiveBadgeUrl = typeof draftBadge === "string"
                      ? normalizeCustomIconInput(draftBadge)
                      : sanitizeBadgeUrlForInput(technology.badgeUrl);
                    const badgeInputValue = typeof draftBadge === "string"
                      ? draftBadge
                      : sanitizeBadgeUrlForInput(technology.badgeUrl);
                    const canShrinkRowSvg = Boolean(extractInlineSvgMarkup(badgeInputValue));
                    const canRecolorRowSvg = canShrinkRowSvg;
                    const draftDeviconSlug = typeof draft.deviconSlug === "string"
                      ? normalizeDeviconSlugInput(draft.deviconSlug) || null
                      : draft.deviconSlug;
                    const effectiveDeviconSlug =
                      hasDraftDeviconClassToken
                        ? null
                        : (draftDeviconSlug ?? extractedDraftSlugFromBadge) || technology.deviconSlug;
                    return (
                      <div key={technology.id} className="rounded-xl border border-gray-800 bg-gray-950/40 p-4 grid grid-cols-1 md:grid-cols-14 gap-3 items-center">
                        <TechIcon
                          slug={effectiveDeviconSlug}
                          name={draft.name ?? technology.name}
                          size={24}
                          fallbackSrc={effectiveBadgeUrl}
                        />
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
                          value={badgeInputValue}
                          onChange={(e) => updateDraftField(technology.id, "badgeUrl", e.target.value)}
                          placeholder={'URL, <img ...> или <i class="devicon-..."></i>'}
                          className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
                        />
                        <button
                          type="button"
                          onClick={() => updateDraftField(technology.id, "badgeUrl", shrinkSvgInputValue(badgeInputValue))}
                          disabled={!canShrinkRowSvg}
                          className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-200 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Сжать SVG
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDraftField(technology.id, "badgeUrl", recolorSvgInputValueToWhite(badgeInputValue))}
                          disabled={!canRecolorRowSvg}
                          className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-200 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Сделать белой
                        </button>
                        <input
                          value={draft.deviconSlug ?? technology.deviconSlug ?? ""}
                          onChange={(e) => updateDraftField(technology.id, "deviconSlug", e.target.value || null)}
                          placeholder="Devicon slug"
                          className="md:col-span-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-white"
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
