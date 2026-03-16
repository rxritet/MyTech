DO $$ BEGIN
  CREATE TYPE technology_category AS ENUM ('language', 'backend', 'frontend', 'devops', 'tool', 'mobile');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS technologies (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category technology_category NOT NULL,
  badge_url text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_technologies (
  id serial PRIMARY KEY,
  project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id integer NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS home_stack (
  id serial PRIMARY KEY,
  technology_id integer NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS about_stack (
  id serial PRIMARY KEY,
  technology_id integer NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  category technology_category NOT NULL,
  "order" integer NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS project_technologies_project_id_technology_id_idx ON project_technologies(project_id, technology_id);
CREATE UNIQUE INDEX IF NOT EXISTS home_stack_technology_id_idx ON home_stack(technology_id);
CREATE UNIQUE INDEX IF NOT EXISTS about_stack_technology_id_idx ON about_stack(technology_id);

INSERT INTO technologies (name, category, badge_url)
VALUES
  ('Go', 'language', 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white'),
  ('TypeScript', 'language', 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white'),
  ('Java', 'language', 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white'),
  ('JavaScript', 'language', 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827'),
  ('Python', 'language', 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white'),
  ('Dart', 'language', 'https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white'),

  ('Hono', 'backend', 'https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=firefox&logoColor=white'),
  ('Django', 'backend', 'https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white'),
  ('FastAPI', 'backend', 'https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white'),
  ('PostgreSQL', 'backend', 'https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white'),
  ('SQLite', 'backend', 'https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white'),

  ('React', 'frontend', 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB'),
  ('TailwindCSS', 'frontend', 'https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white'),
  ('Vite', 'frontend', 'https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white'),
  ('Flutter', 'mobile', 'https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white'),
  ('HTML5', 'frontend', 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white'),
  ('CSS3', 'frontend', 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white'),
  ('Figma', 'frontend', 'https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white'),

  ('Docker', 'devops', 'https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white'),
  ('Vercel', 'devops', 'https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white'),
  ('AWS', 'devops', 'https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900'),
  ('Nginx', 'devops', 'https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white'),
  ('Linux', 'devops', 'https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=111827'),

  ('Git', 'tool', 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white'),
  ('GitHub', 'tool', 'https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white'),
  ('VS Code', 'tool', 'https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white'),
  ('Burp Suite', 'tool', 'https://img.shields.io/badge/Burp_Suite-FF6633?style=for-the-badge&logo=burpsuite&logoColor=white'),
  ('Antigravity', 'tool', 'https://img.shields.io/badge/Antigravity-111827?style=for-the-badge')
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  badge_url = EXCLUDED.badge_url;

-- Backfill unknown technologies from existing projects.stack if needed
WITH extracted AS (
  SELECT DISTINCT trim(tech_name) AS tech_name
  FROM projects p,
  unnest(p.stack) AS tech_name
  WHERE trim(tech_name) <> ''
)
INSERT INTO technologies (name, category, badge_url)
SELECT
  e.tech_name,
  'tool'::technology_category,
  'https://img.shields.io/badge/' || replace(e.tech_name, ' ', '%20') || '-111827?style=for-the-badge'
FROM extracted e
LEFT JOIN technologies t ON lower(t.name) = lower(e.tech_name)
WHERE t.id IS NULL;

-- Backfill unknown technologies from about.tech_groups JSON names
WITH about_groups AS (
  SELECT jsonb_array_elements(COALESCE(a.tech_groups, '[]'::jsonb)) AS grp
  FROM about a
),
about_names AS (
  SELECT DISTINCT trim(jsonb_array_elements_text(COALESCE(grp->'names', '[]'::jsonb))) AS tech_name
  FROM about_groups
),
missing_about_names AS (
  SELECT tech_name
  FROM about_names
  WHERE tech_name <> ''
)
INSERT INTO technologies (name, category, badge_url)
SELECT
  m.tech_name,
  'tool'::technology_category,
  'https://img.shields.io/badge/' || replace(m.tech_name, ' ', '%20') || '-111827?style=for-the-badge'
FROM missing_about_names m
LEFT JOIN technologies t ON lower(t.name) = lower(m.tech_name)
WHERE t.id IS NULL;

-- Backfill projects ↔ technologies relation from legacy projects.stack
INSERT INTO project_technologies (project_id, technology_id, "order")
SELECT
  p.id,
  t.id,
  ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY u.ordinality) - 1
FROM projects p
CROSS JOIN LATERAL unnest(p.stack) WITH ORDINALITY AS u(tech_name, ordinality)
JOIN technologies t ON lower(t.name) = lower(trim(u.tech_name))
ON CONFLICT (project_id, technology_id) DO NOTHING;

-- Seed default home and about stacks if empty
INSERT INTO home_stack (technology_id, "order")
SELECT t.id, ROW_NUMBER() OVER (ORDER BY t.id) - 1
FROM technologies t
WHERE NOT EXISTS (SELECT 1 FROM home_stack)
ON CONFLICT (technology_id) DO NOTHING;

INSERT INTO about_stack (technology_id, category, "order")
SELECT t.id, t.category, ROW_NUMBER() OVER (PARTITION BY t.category ORDER BY t.id) - 1
FROM technologies t
WHERE NOT EXISTS (SELECT 1 FROM about_stack)
ON CONFLICT (technology_id) DO NOTHING;
