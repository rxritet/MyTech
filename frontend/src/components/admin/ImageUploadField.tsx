import React, { useState } from "react";
import { Upload, X, Link2 } from "lucide-react";

interface ImageUploadFieldProps {
  readonly images: ReadonlyArray<string>;
  readonly onImagesChange: (images: string[]) => void;
  readonly maxImages?: number;
  readonly label?: string;
}

export default function ImageUploadField({
  images,
  onImagesChange,
  maxImages = 10,
  label = "Галерея фотографий",
}: Readonly<ImageUploadFieldProps>) {
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (images.length >= maxImages) {
        setError(`Максимально ${maxImages} изображений`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onImagesChange([...images, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      setError("Введите URL");
      return;
    }

    if (images.length >= maxImages) {
      setError(`Максимально ${maxImages} изображений`);
      return;
    }

    try {
      new URL(newUrl);
      onImagesChange([...images, newUrl]);
      setNewUrl("");
      setError(null);
    } catch {
      setError("Некорректный URL");
    }
  };

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div key={`image-${img}`} className="relative group rounded-lg overflow-hidden bg-gray-950 border border-gray-800 aspect-video">
            <img
              src={img}
              alt={`Preview ${idx}`}
              className="w-full h-full object-cover"
              onError={() => handleRemove(idx)}
            />
            <button
              onClick={() => handleRemove(idx)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition aspect-video">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-400 text-center">Загрузить фото</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {images.length < maxImages && (
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            placeholder="Или добавить по URL..."
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddUrl}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm flex items-center gap-2 transition"
          >
            <Link2 size={16} />
            Добавить
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-gray-500">
        {images.length} / {maxImages}
      </p>
    </div>
  );
}
