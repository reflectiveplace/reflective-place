import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const AUTH_KEY = 'reflective-place-auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearAllStorage() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error('Error al limpiar el storage:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      // Solo limpiar si la página se está descartando (no si se está guardando en caché)
      // Esto evita limpiar en navegaciones internas de la SPA
      if (event.persisted === false) {
        clearAllStorage();
      }
    };

    // pagehide es más confiable que beforeunload/unload para detectar cierre real
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'LKMX2025+') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAllStorage();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}