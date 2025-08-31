

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { APP_NAME } from '../constants';
import AdminLoginModal from './AdminLoginModal'; // Import the new modal

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Scroll-triggered animation for the entire footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFooterVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleAdminLoginClick = () => {
    setIsAdminLoginModalOpen(true);
  };

  const handleAdminLoginModalClose = () => {
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginModalOpen(false);
    // No more navigation. The global state change will re-render the homepage.
  };

  return (
    <>
      <footer 
        ref={footerRef} 
        className={`app-footer ${isFooterVisible ? 'footer-visible' : ''}`}
        role="contentinfo"
        aria-label="Site Footer"
      >
        <div className="footer-content-wrapper">
          {/* Quote container and divider removed */}

          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          <p className="footer-tagline">
            For Only&nbsp;
            <a
              href="https://www.youtube.com/@SomeUnfilteredKnowledge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-current hover:underline"
            >
              Some Unfiltered Knowledge Audience
            </a>
          </p>

          <p className="mt-4 text-xs text-[var(--netflix-text-secondary)] tracking-wide">
            Special thanks to our First Users: Prabina, Kamal, Arun, Sandeep, Sudarsan, Prabesh, Namraj, <a href="https://www.facebook.com/PrabinGhimire35F" target="_blank" rel="noopener noreferrer" className="font-extrabold text-sm text-[var(--netflix-red)] hover:underline" style={{ textShadow: '0 0 8px var(--netflix-red)' }}>PRABIN</a> & Namita...
          </p>

          <div className="mt-8">
            <button
              onClick={handleAdminLoginClick}
              className="text-sm text-[var(--netflix-text-muted)] hover:text-[var(--netflix-red)] transition-colors duration-150 underline decoration-dotted hover:decoration-solid"
            >
              Thank you
            </button>
          </div>
        </div>
      </footer>
      <AdminLoginModal 
        isOpen={isAdminLoginModalOpen}
        onClose={handleAdminLoginModalClose}
        onSuccessfulLogin={handleAdminLoginSuccess}
      />
    </>
  );
};

export default Footer;