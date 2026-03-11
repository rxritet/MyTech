import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  secret: string | null;
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false, secret: null });

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mytech_admin_secret");
    if (saved) {
      setSecret(saved);
      setIsAdmin(true);
    }
  }, []);

  // Global keyboard shortcut: Ctrl+Shift+Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyZ") {
        e.preventDefault();
        if (!isAdmin) {
          const pass = prompt("Admin Secret:");
          if (pass) {
            localStorage.setItem("mytech_admin_secret", pass);
            setSecret(pass);
            setIsAdmin(true);
          }
        } else {
          if (confirm("Deactivate admin mode?")) {
            localStorage.removeItem("mytech_admin_secret");
            setSecret(null);
            setIsAdmin(false);
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin, secret }}>
      {children}
    </AdminContext.Provider>
  );
}
