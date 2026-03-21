import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  secret: string | null;
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false, secret: null });

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: Readonly<{ children: ReactNode }>) {
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
        if (isAdmin) {
          if (!confirm("Deactivate admin mode?")) {
            return;
          }
          localStorage.removeItem("mytech_admin_secret");
          setSecret(null);
          setIsAdmin(false);
        } else {
          const pass = prompt("Admin Secret:");
          if (pass) {
            localStorage.setItem("mytech_admin_secret", pass);
            setSecret(pass);
            setIsAdmin(true);
          }
        }
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [isAdmin]);

  const value = useMemo(
    () => ({ isAdmin, secret }),
    [isAdmin, secret],
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
