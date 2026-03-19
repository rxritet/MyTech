import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ContactPage from "./pages/ContactPage";
import WorkTermsPage from "./pages/WorkTermsPage";
import AddProjectPage from "./pages/AddProjectPage";
import AdminStackPage from "./pages/AdminStackPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <div className="app-shell flex min-h-screen flex-col font-sans">
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-2] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent_18%)]" />
          <ScrollToTop />
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/add" element={<AddProjectPage />} />
              <Route path="/admin/stack" element={<AdminStackPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<WorkTermsPage />} />
              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AdminProvider>
    </BrowserRouter>
  );
}
