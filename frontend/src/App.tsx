import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { useActiveSection } from "./hooks/useActiveSection";

const SECTION_IDS = ["hero", "projects", "about", "services", "contact"];

export default function App() {
  const scrollProgress = useScrollProgress();
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Scroll progress bar — sits above everything */}
      <div
        id="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <Navbar activeSection={activeSection} />

      <main>
        <Hero />
        <Projects />
        <About />
        <Services />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
