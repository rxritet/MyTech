import Hero from "../components/sections/Hero";
import { Marquee } from "../components/ui/Marquee";

const MARQUEE_ITEMS = [
  "Go", "TypeScript", "React", "PostgreSQL",
  "Docker", "Hono", "Tailwind", "Vite",
  "Linux", "Nginx", "Git", "Figma",
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
    </main>
  );
}
