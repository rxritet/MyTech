-- Ensure projects table exists with all columns
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]',
  development_process JSONB DEFAULT '[]',
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  language TEXT NOT NULL,
  dev_time TEXT NOT NULL,
  created_at TEXT NOT NULL,
  github TEXT,
  demo TEXT,
  accent_color TEXT DEFAULT 'from-indigo-500 to-purple-500',
  created_at_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert projects
INSERT INTO projects (slug, name, description, long_description, image, features, stack, language, dev_time, created_at, github, demo, accent_color) VALUES
('helpdesk', 'IT Helpdesk Platform', 'Cloud-based helpdesk для управления тикетами', 'Полнофункциональная система управления техподдержкой с возможностью отслеживания тикетов, назначением приоритетов и отчетностью', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', ARRAY['Управление тикетами', 'Система приоритетов', 'Аналитика'], ARRAY['React', 'Node.js', 'PostgreSQL'], 'TypeScript', '~2 месяца', 'апрель 2025', 'https://github.com/mytech/helpdesk', 'https://helpdesk.mytech.dev', 'from-blue-500 to-cyan-500')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (slug, name, description, long_description, image, features, stack, language, dev_time, created_at, github, demo, accent_color) VALUES
('spoithub', 'Spotify Clone', 'Платформа для прослушивания музыки', 'Веб-приложение подобное Spotify с возможностью поиска, создания плейлистов и рекомендациями', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500', ARRAY['Поиск музыки', 'Плейлисты', 'Рекомендации'], ARRAY['React', 'Python', 'Flask'], 'Python', '~3 недели', 'февраль 2025', 'https://github.com/mytech/spoithub', 'https://spotihub.mytech.dev', 'from-green-500 to-emerald-500')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (slug, name, description, long_description, image, features, stack, language, dev_time, created_at, github, demo, accent_color) VALUES
('mytech', 'Portfolio Website', 'Личный портфолио с примерами работ', 'Современный портфолио сайт с темной темой, примерами проектов, навыками и контактной информацией', 'https://images.unsplash.com/photo-1460925895917-aaf4803c3c17?w=500', ARRAY['Темная тема', 'Адаптивный дизайн', 'Анимации'], ARRAY['React', 'TypeScript', 'Tailwind', 'Vite'], 'TypeScript', '~4 недели', 'март 2025', 'https://github.com/mytech/portfolio', 'https://mytech.dev', 'from-orange-500 to-red-500')
ON CONFLICT (slug) DO NOTHING;
