import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  register: (username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  register: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate(); // Utilisez useNavigate pour la navigation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = (event: any) => {
          console.error('Database error:', event.target.errorCode);
        };

        request.onsuccess = (event: any) => {
          const database = event.target.result;
          setDb(database);
        };

        request.onupgradeneeded = (event: any) => {
          const database = event.target.result;
          const objectStore = database.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('username', 'username', { unique: true });
          objectStore.createIndex('password', 'password', { unique: false });
        };
      } catch (error) {
        console.error('IndexedDB initialization error:', error);
      }
    };

    initializeDB();
  }, []);

  const register = (username: string, password: string) => {
    if (!db) return;
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const newUser = { username, password };
    const request = store.add(newUser);

    request.onsuccess = () => {
      console.log('Utilisateur enregistré avec succès');
      toast('Utilisateur enregistré avec succès', {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: 'Valider',
          onClick: () => {},
        },
      });
      navigate('/login'); // Naviguer vers la page de connexion après l'enregistrement
    };

    request.onerror = (event: any) => {
      console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', event.target.errorCode);
      toast('Erreur lors de l\'enregistrement de l\'utilisateur', {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: 'Valider',
          onClick: () => {},
        },
      });
    };
  };

  const login = (username: string, password: string) => {
    if (!db) return;
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const index = store.index('username');
    const request = index.get(username);

    request.onsuccess = (event: any) => {
      const user = event.target.result;
      if (user && user.password === password) {
        setIsAuthenticated(true);
        toast('Connexion réussie', {
          description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
          action: {
            label: 'Valider',
            onClick: () => {},
          },
        });
      } else {
        console.log('Identifiants incorrects');
        toast('Identifiants incorrects', {
          description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
          action: {
            label: 'Valider',
            onClick: () => {},
          },
        });
      }
    };

    request.onerror = (event: any) => {
      console.error('Erreur lors de la connexion:', event.target.errorCode);
      toast('Erreur lors de la connexion', {
        description: `Le ${new Date().toLocaleDateString()}, à ${new Date().toLocaleTimeString()}`,
        action: {
          label: 'Valider',
          onClick: () => {},
        },
      });
    };
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
