import React, { createContext, useState } from 'react';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node'

interface User {
  username: string;
  password: string;
}

interface State {
  users: User[];
}

const adapter = new JSONFileSync<State>('../db/db.js');
const db = new LowSync<State>(adapter, { users: [] });

interface AuthContextProps {
  isAuthenticated: boolean;
  register: (username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const register = (username: string, password: string) => {
    db.read();
    const users = db.data?.users || [];
    users.push({ username, password });
    db.write();
  };

  const login = (username: string, password: string) => {
    db.read();
    const users = db.data?.users || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      setIsAuthenticated(true);
    } else {
      console.log('Identifiants incorrects')
    }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};