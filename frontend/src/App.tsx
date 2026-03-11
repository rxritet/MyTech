import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactPage from "./pages/ContactPage";
import WorkTermsPage from "./pages/WorkTermsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <div className="min-h-screen bg-gray-950 text-white font-sans dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<WorkTermsPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
        </div>
      </AdminProvider>
    </BrowserRouter>
  );
}
