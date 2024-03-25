import React, { useState } from 'react';
import { useAuth } from '../component/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom d'utilisateur:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Mot de passe:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Se connecter" />
    </form>
  );
}