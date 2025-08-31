


import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShelvesPage from './pages/ShelvesPage';
import SupplyPage from './pages/SupplyPage';
import { ToastProvider } from './components/Toast';
import { AppProvider, useAppContext } from './AppContext';
import PreFooterAdPlaceholder from './components/PreFooterAdPlaceholder';
import { AIHelperWidget } from './components/AIHelperWidget';
import AutoRotatingQuoteSection from './components/AutoRotatingQuoteSection';
import BookModal from './components/BookModal';
import { Book } from './types';

const AppContent: React.FC = () => {
  // FIX: Get activeView and setActiveView from the global context instead of local state.
  const { books, isAdminAuthenticated, addHistoryRecord, activeView, setActiveView } = useAppContext();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // When the view changes, scroll to the top of the page for a clean transition.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const handleBookClick = useCallback((book: Book) => {
    setSelectedBook(book);
    addHistoryRecord(book, 'read');
  }, [addHistoryRecord]);

  const handleCloseModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomePage onBookClick={handleBookClick} />;
      case 'shelves':
        return <ShelvesPage />;
      case 'supply':
        return <SupplyPage />;
      default:
        return <HomePage onBookClick={handleBookClick}/>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView}
        allBooks={books}
        onSuggestionClick={handleBookClick}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>

      <PreFooterAdPlaceholder />
      <AutoRotatingQuoteSection />

      {/* New Footer Divider */}
      <div className="container mx-auto px-4 my-10 md:my-14">
          <div className="footer-divider"></div>
      </div>
      
      <Footer />
      <AIHelperWidget />

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={handleCloseModal} 
          allBooks={books}
          onViewBook={handleBookClick}
          onPlayAudio={(book) => addHistoryRecord(book, 'audio')}
          setActiveView={setActiveView}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
};

export default App;