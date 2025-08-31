import React, { useState } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { useToast } from './Toast';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      addToast('Login successful!', 'success');
      onLoginSuccess();
    } else {
      addToast('Invalid credentials.', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--netflix-dark)] p-4">
      <div className="bg-[var(--netflix-dark-secondary)] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--netflix-red)] mb-8">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full primary-action-button font-semibold py-3 rounded-md transition-opacity duration-150 hover:opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;