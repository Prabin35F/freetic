



import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, HomeIcon, ClockIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../AppContext';
import AnimatedLogo from './AnimatedLogo';
import { Book } from '../types';
import SearchOverlay from './SearchOverlay';
import TypingSubheading from './TypingSubheading';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  allBooks: Book[];
  onSuggestionClick: (book: Book) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, allBooks, onSuggestionClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setSearchTerm } = useAppContext();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeOverlays = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOverlayOpen(false);
  };
  
  const handleViewChange = (view: string) => {
    setActiveView(view);
    closeOverlays();
  };

  const handleLogoClick = () => handleViewChange('home');

  const handleSearchSubmit = (query: string) => {
    setSearchTerm(query);
    setActiveView('home');
    setIsSearchOverlayOpen(false);
  };
  
  const handleSuggestionItemClick = (book: Book) => {
    onSuggestionClick(book);
    setIsSearchOverlayOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const mainNavLinks = (isMobile: boolean) => (
    <>
      <a href="#home" className={`premium-nav-link ${activeView === 'home' ? 'active' : ''}`} style={isMobile ? { animationDelay: '100ms' } : {}} onClick={(e) => { e.preventDefault(); handleViewChange('home'); }}>
        <HomeIcon className="h-5 w-5" />
        <span>Home</span>
      </a>
      <a href="#shelves" className={`premium-nav-link ${activeView === 'shelves' ? 'active' : ''}`} style={isMobile ? { animationDelay: '200ms' } : {}} onClick={(e) => { e.preventDefault(); handleViewChange('shelves'); }}>
        <ClockIcon className="h-5 w-5" />
        <span>History</span>
      </a>
      <a href="#supply" className={`premium-nav-link ${activeView === 'supply' ? 'active' : ''}`} style={isMobile ? { animationDelay: '300ms' } : {}} onClick={(e) => { e.preventDefault(); handleViewChange('supply'); }}>
        <ShoppingBagIcon className="h-5 w-5" />
        <span>Supply</span>
      </a>
    </>
  );

  return (
    <>
      <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left section (Logo) */}
            <div className="flex-shrink-0">
              <a href="#home" className="flex items-end gap-2.5" onClick={(e) => { e.preventDefault(); handleLogoClick(); }}>
                <AnimatedLogo />
                <TypingSubheading text="For Seekers & Thinkers" />
              </a>
            </div>

            {/* Center section (Desktop Nav Links) */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {mainNavLinks(false)}
            </div>

            {/* Right section (Actions & Mobile Toggle) */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
                className="premium-icon-btn"
                aria-label="Open search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              <div className="ml-2 md:hidden">
                <button
                  onClick={handleMobileMenuToggle}
                  type="button"
                  className="premium-icon-btn"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay md:hidden" 
          onClick={closeOverlays}
          aria-hidden="true"
        >
          <div 
            className="mobile-menu-pane-premium"
            onClick={e => e.stopPropagation()} // Prevent clicks inside from closing the menu
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleMobileMenuToggle}
                type="button"
                className="premium-icon-btn"
              >
                 <span className="sr-only">Close main menu</span>
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {mainNavLinks(true)}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay 
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        allBooks={allBooks}
        onSuggestionClick={handleSuggestionItemClick}
        onSearchSubmit={handleSearchSubmit}
      />
    </>
  );
};

export default Navbar;