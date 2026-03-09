import { useState, useEffect } from "react";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    const savedSecret = localStorage.getItem("mytech_admin_secret");
    if (savedSecret) {
      setSecret(savedSecret);
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyZ") {
        e.preventDefault();
        setIsAdmin((prev) => {
          if (!prev) {
            const pass = prompt("Admin Secret:");
            if (pass) {
              localStorage.setItem("mytech_admin_secret", pass);
              setSecret(pass);
              return true;
            }
            return prev;
          } else {
            if (confirm("Deactivate admin mode?")) {
              localStorage.removeItem("mytech_admin_secret");
              setSecret(null);
              return false;
            }
            return prev;
          }
        });
      }
    };

    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  return { isAdmin, secret };
}

