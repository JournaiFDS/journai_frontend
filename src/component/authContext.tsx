import React, { createContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    // Fonction d'initialisation de la base de données
    const initializeDB = async () => {
      try {
        // Ouvrir ou créer la base de données
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

    // Appel de la fonction d'initialisation de la base de données
    initializeDB();
  }, []);

  const register = (username: string, password: string) => {
    if (!db) return;
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const newUser = { username, password };
    const request = store.add(newUser);

    request.onsuccess = () => {
      console.log('User registered successfully');
    };

    request.onerror = (event: any) => {
      console.error('Error registering user:', event.target.errorCode);
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
      } else {
        console.log('Identifiants incorrects');
      }
    };

    request.onerror = (event: any) => {
      console.error('Error logging in:', event.target.errorCode);
    };
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
