import React, { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import type { DevelopmentStage } from "../../api";

interface DevelopmentTimelineProps {
  stages: DevelopmentStage[];
  onStagesChange: (stages: DevelopmentStage[]) => void;
}

export default function DevelopmentTimeline({
  stages,
  onStagesChange,
}: DevelopmentTimelineProps) {
  const [newStage, setNewStage] = useState<DevelopmentStage>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddStage = () => {
    if (!newStage.title.trim() || !newStage.description.trim()) {
      setError("Заполните название и описание этапа");
      return;
    }

    onStagesChange([...stages, newStage]);
    setNewStage({ title: "", description: "" });
    setError(null);
  };

  const handleRemoveStage = (index: number) => {
    onStagesChange(stages.filter((_, i) => i !== index));
  };

  const handleMoveStage = (index: number, direction: "up" | "down") => {
    const newStages = [...stages];
    if (direction === "up" && index > 0) {
      [newStages[index], newStages[index - 1]] = [
        newStages[index - 1],
        newStages[index],
      ];
    } else if (direction === "down" && index < stages.length - 1) {
      [newStages[index], newStages[index + 1]] = [
        newStages[index + 1],
        newStages[index],
      ];
    }
    onStagesChange(newStages);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div
            key={index}
            className="p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="font-medium text-white text-sm">
                  {index + 1}. {stage.title}
                </div>
                <div className="text-sm text-gray-400">{stage.description}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    handleMoveStage(index, "up")
                  }
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Поднять выше"
                >
                  <GripVertical size={14} className="rotate-180" />
                </button>
                <button
                  onClick={() =>
                    handleMoveStage(index, "down")
                  }
                  disabled={index === stages.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Опустить ниже"
                >
                  <GripVertical size={14} />
                </button>
                <button
                  onClick={() => handleRemoveStage(index)}
                  className="p-1 text-gray-500 hover:text-red-400 transition"
                  title="Удалить"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-950 border border-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Название этапа
          </label>
          <input
            type="text"
            value={newStage.title}
            onChange={(e) =>
              setNewStage({ ...newStage, title: e.target.value })
            }
            placeholder="Например: Придумал идею, Создал дизайн, Разработал MVP..."
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Описание этапа
          </label>
          <textarea
            value={newStage.description}
            onChange={(e) =>
              setNewStage({ ...newStage, description: e.target.value })
            }
            placeholder="Опишите, что было сделано на этом этапе..."
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleAddStage}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <Plus size={16} />
          Добавить этап
        </button>
      </div>
    </div>
  );
}
