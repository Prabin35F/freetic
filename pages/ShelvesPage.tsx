

import React, { useState, useCallback } from 'react';
import { Book, Shelf } from '../types';
import ShelfItem from '../components/ShelfItem';
import BookModal from '../components/BookModal';
import { useToast } from '../components/Toast';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../AppContext';
import HistoryList from '../components/HistoryList';

const ShelvesPage: React.FC = () => {
  const { 
    books, 
    shelves, 
    addShelf, 
    renameShelf, 
    deleteShelf, 
    removeBookFromShelf,
    history,
    addHistoryRecord,
    deleteHistoryRecord,
    clearHistory,
    // FIX: Get setActiveView from context to pass to the BookModal.
    setActiveView,
  } = useAppContext();
  const [newShelfName, setNewShelfName] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { addToast } = useToast();

  const handleCreateShelf = () => {
    if (newShelfName.trim() === '') {
      addToast('Shelf name cannot be empty.', 'error');
      return;
    }
    addShelf(newShelfName.trim());
    setNewShelfName('');
    // Toast handled by AppContext
  };

  const handleViewBook = useCallback((book: Book) => {
    setSelectedBook(book);
    addHistoryRecord(book, 'read');
  }, [addHistoryRecord]);
  
  const handleViewBookFromHistory = useCallback((bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
        handleViewBook(book);
    } else {
        addToast("Book not found. It may have been deleted.", "error");
    }
  }, [books, handleViewBook, addToast]);

  const handleCloseModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const getBooksForShelf = (shelf: Shelf): Book[] => {
    return shelf.bookIds.map(bookId => books.find(b => b.id === bookId)).filter(Boolean) as Book[];
  };
  
  const inputClass = "flex-grow sm:flex-grow-0 px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none";

  return (
    <div className="container mx-auto px-4 py-8 text-white bg-[var(--netflix-dark)]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--netflix-red)] mb-4 sm:mb-0">History</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            placeholder="New shelf name (e.g., Read Next)"
            className={inputClass}
          />
          <button
            onClick={handleCreateShelf}
            className="primary-action-button p-2 rounded-md flex items-center justify-center"
            title="Create new shelf"
          >
            <PlusCircleIcon className="w-6 h-6" />
            <span className="ml-1 hidden sm:inline">Create Shelf</span>
          </button>
        </div>
      </div>

      <HistoryList
        history={history}
        onViewBook={handleViewBookFromHistory}
        onDelete={deleteHistoryRecord}
        onClearAll={() => {
            if(window.confirm('Are you sure you want to clear your entire viewing history? This cannot be undone.')) {
                clearHistory();
            }
        }}
      />

      {shelves.length > 0 ? (
        <div className="space-y-10">
          {shelves.map((shelf) => (
            <ShelfItem
              key={shelf.id}
              shelf={shelf}
              booksOnShelf={getBooksForShelf(shelf)}
              onRenameShelf={(shelfId, newName) => {
                renameShelf(shelfId, newName);
                // Toast handled by AppContext
              }}
              onDeleteShelf={(shelfId) => {
                if (window.confirm(`Are you sure you want to delete shelf "${shelf.name}"? This action cannot be undone.`)) {
                  deleteShelf(shelfId);
                   // Toast handled by AppContext
                }
              }}
              onRemoveBookFromShelf={(shelfId, bookId) => {
                removeBookFromShelf(shelfId, bookId);
                // Toast handled by AppContext
              }}
              onViewBook={handleViewBook}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--netflix-text-muted)]">You don't have any shelves yet.</p>
          <p className="text-neutral-500 mt-2">Create one above to start organizing your books!</p>
        </div>
      )}

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={handleCloseModal}
          allBooks={books} /* Pass all books from context */
          onViewBook={handleViewBook} /* Pass the handler to view a book */
          onPlayAudio={(book) => addHistoryRecord(book, 'audio')}
          // FIX: Pass the required setActiveView prop to the modal.
          setActiveView={setActiveView}
        />
      )}
    </div>
  );
};

export default ShelvesPage;