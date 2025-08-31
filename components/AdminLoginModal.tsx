
import React, { useState, FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { useAppContext } from '../AppContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulLogin: () => void; // Called after context's loginAdmin and ready to proceed
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccessfulLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loginAdmin } = useAppContext();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      loginAdmin(); // Update global authentication state
      onSuccessfulLogin(); // Notify parent to close modal and navigate
      setUsername(''); // Reset fields
      setPassword('');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleClose = () => {
    setError(null);
    setUsername('');
    setPassword('');
    onClose();
  }

  return (
    <div className="admin-login-modal-backdrop animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
      <div className="admin-login-modal-container">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-[var(--netflix-text-secondary)] hover:text-white p-1 rounded-full hover:bg-neutral-700 transition-colors"
          aria-label="Close admin login"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 id="admin-login-title" className="text-2xl font-bold text-center text-[var(--netflix-red)] mb-6">
          Admin Panel Access
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="admin-login-modal-input"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-login-modal-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="admin-login-modal-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full primary-action-button font-semibold py-2.5 rounded-md transition-opacity duration-150 hover:opacity-90 mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;