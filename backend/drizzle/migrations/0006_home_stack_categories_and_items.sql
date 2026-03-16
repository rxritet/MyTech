CREATE TABLE IF NOT EXISTS home_stack_categories (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS home_stack_items (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES home_stack_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" integer NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS home_stack_items_category_id_name_idx
  ON home_stack_items(category_id, name);

INSERT INTO home_stack_categories (slug, label, "order")
VALUES
  ('langs', 'langs', 0),
  ('backend', 'backend', 1),
  ('frontend', 'frontend', 2),
  ('devops', 'devops', 3),
  ('tools', 'tools', 4)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  "order" = EXCLUDED."order";

WITH seeded_items(slug, name, ord) AS (
  VALUES
    ('langs', 'Go', 0),
    ('langs', 'Java', 1),
    ('langs', 'TypeScript', 2),
    ('langs', 'JavaScript', 3),
    ('langs', 'Python', 4),
    ('langs', 'Dart', 5),

    ('backend', 'Hono', 0),
    ('backend', 'Django', 1),
    ('backend', 'FastAPI', 2),
    ('backend', 'PostgreSQL', 3),
    ('backend', 'SQLite', 4),

    ('frontend', 'React', 0),
    ('frontend', 'TailwindCSS', 1),
    ('frontend', 'Vite', 2),
    ('frontend', 'Flutter', 3),
    ('frontend', 'HTML5', 4),
    ('frontend', 'CSS3', 5),
    ('frontend', 'Figma', 6),

    ('devops', 'Docker', 0),
    ('devops', 'Vercel', 1),
    ('devops', 'AWS', 2),
    ('devops', 'Nginx', 3),
    ('devops', 'Linux', 4),

    ('tools', 'Git', 0),
    ('tools', 'GitHub', 1),
    ('tools', 'VS Code', 2),
    ('tools', 'Burp Suite', 3)
)
INSERT INTO home_stack_items (category_id, name, "order")
SELECT c.id, s.name, s.ord
FROM seeded_items s
JOIN home_stack_categories c ON c.slug = s.slug
ON CONFLICT (category_id, name) DO UPDATE SET
  "order" = EXCLUDED."order";
