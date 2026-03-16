ALTER TABLE technologies
ADD COLUMN IF NOT EXISTS devicon_slug TEXT;

UPDATE technologies
SET devicon_slug = CASE LOWER(name)
  WHEN 'go' THEN 'go'
  WHEN 'typescript' THEN 'typescript'
  WHEN 'javascript' THEN 'javascript'
  WHEN 'java' THEN 'java'
  WHEN 'python' THEN 'python'
  WHEN 'dart' THEN 'dart'
  WHEN 'react' THEN 'react'
  WHEN 'tailwindcss' THEN 'tailwindcss'
  WHEN 'vite' THEN 'vitejs'
  WHEN 'flutter' THEN 'flutter'
  WHEN 'html5' THEN 'html5'
  WHEN 'css3' THEN 'css3'
  WHEN 'figma' THEN 'figma'
  WHEN 'docker' THEN 'docker'
  WHEN 'postgresql' THEN 'postgresql'
  WHEN 'sqlite' THEN 'sqlite'
  WHEN 'django' THEN 'django'
  WHEN 'fastapi' THEN 'fastapi'
  WHEN 'nginx' THEN 'nginx'
  WHEN 'linux' THEN 'linux'
  WHEN 'aws' THEN 'amazonwebservices'
  WHEN 'git' THEN 'git'
  WHEN 'github' THEN 'github'
  WHEN 'vs code' THEN 'vscode'
  WHEN 'vercel' THEN NULL
  WHEN 'hono' THEN NULL
  WHEN 'burp suite' THEN NULL
  ELSE devicon_slug
END;