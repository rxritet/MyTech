import React from "react";
import type { Project } from "../../api";
import { Star } from "lucide-react";

interface LivePreviewProps {
  readonly formData: Partial<Project>;
}

export default function LivePreview({ formData }: Readonly<LivePreviewProps>) {
  return (
    <div className="w-full">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Main Image */}
        {formData.image && (
          <div className="relative h-56 bg-gray-950 overflow-hidden">
            <img
              src={formData.image}
              alt={formData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23374151' width='400' height='300'/%3E%3C/svg%3E";
              }}
            />
            {formData.accentColor && (
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${formData.accentColor}`}
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {formData.name || "Название проекта"}
            </h2>
            <p className="text-gray-400 text-sm">
              {formData.description ||
                "Краткое описание проекта появится здесь"}
            </p>
          </div>

          {/* Stack */}
          {formData.stack && formData.stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.stack.map((tech) => (
                <span
                  key={`tech-${tech}`}
                  className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Features */}
          {formData.features && formData.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">
                Особенности:
              </h4>
              <ul className="space-y-1">
                {formData.features.slice(0, 3).map((feature) => (
                  <li key={`feature-${feature}`} className="text-sm text-gray-400 flex items-start gap-2">
                    <Star size={14} className="mt-1 text-indigo-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {formData.features.length > 3 && (
                  <li className="text-xs text-gray-500">
                    +{formData.features.length - 3} еще
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Meta */}
          <div className="pt-4 border-t border-gray-800 space-y-2">
            {formData.language && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Язык:</span>
                <span className="text-gray-300">{formData.language}</span>
              </div>
            )}
            {formData.devTime && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Разработка:</span>
                <span className="text-gray-300">{formData.devTime}</span>
              </div>
            )}
            {formData.createdAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Создано:</span>
                <span className="text-gray-300">{formData.createdAt}</span>
              </div>
            )}
          </div>

          {/* Links */}
          {(formData.github || formData.demo) && (
            <div className="flex gap-2 pt-2">
              {formData.github && (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition text-center"
                >
                  GitHub
                </a>
              )}
              {formData.demo && (
                <a
                  href={formData.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition text-center"
                >
                  Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Info Below Main Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Gallery Preview */}
        {formData.gallery && formData.gallery.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Галерея</h4>
            <div className="grid grid-cols-2 gap-2">
              {formData.gallery.slice(0, 4).map((img) => (
                <div
                  key={`gallery-${img}`}
                  className="aspect-video rounded-lg overflow-hidden border border-gray-800"
                >
                  <img
                    src={img}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%23374151' width='200' height='150'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
              {formData.gallery.length > 4 && (
                <div className="aspect-video rounded-lg bg-gray-800 border border-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    +{formData.gallery.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Development Timeline Preview */}
        {formData.developmentProcess &&
          formData.developmentProcess.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Процесс разработки
              </h4>
              <div className="space-y-2 bg-gray-900 border border-gray-800 rounded-lg p-4">
                {formData.developmentProcess.map((stage, idx) => (
                  <div key={`stage-${stage.title}-${stage.description}`} className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      {idx < (formData.developmentProcess?.length ?? 0) - 1 && (
                        <div className="w-0.5 h-8 bg-indigo-600/30" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-white">
                        {stage.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
