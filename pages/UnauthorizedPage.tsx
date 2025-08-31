
import React from 'react';
import { Link } from 'wouter';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-[var(--netflix-dark)] text-white p-6 text-center">
      <ShieldExclamationIcon className="w-20 h-20 sm:w-24 sm:h-24 text-[var(--netflix-red)] mb-6" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-3">403</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--netflix-text-secondary)]">Access Denied</h2>
      <p className="text-md sm:text-lg text-center text-[var(--netflix-text-muted)] mb-8 max-w-md">
        Sorry, you do not have the necessary permissions to access this page.
        If you believe this is an error, please contact the site administrator.
      </p>
      <Link
        to="/"
        className="primary-action-button px-6 py-2.5 sm:px-8 sm:py-3 rounded-md text-base sm:text-lg font-semibold transition-transform duration-150 hover:scale-105"
        aria-label="Go to Homepage"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedPage;