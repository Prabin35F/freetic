import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Book } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  allBooks: Book[];
  onSuggestionClick: (book: Book) => void;
  onSearchSubmit: (query: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  allBooks,
  onSuggestionClick,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the overlay opens
      setTimeout(() => inputRef.current?.focus(), 100);
      // Reset query on open
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Handle Escape key to close
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  useEffect(() => {
    // Filter books for suggestions as the user types
    if (query.length > 1) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredBooks = allBooks
        .filter(book =>
            book.title.toLowerCase().includes(lowerCaseQuery) ||
            book.author.toLowerCase().includes(lowerCaseQuery)
        )
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredBooks);
    } else {
      setSuggestions([]);
    }
  }, [query, allBooks]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    }
  };

  const handleSuggestionItemClick = (book: Book) => {
    onSuggestionClick(book);
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="search-overlay-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div className="search-overlay-container">
        <button onClick={onClose} className="search-overlay-close-btn" aria-label="Close search">
          <XMarkIcon className="w-8 h-8" />
        </button>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a book, an author, or an idea..."
            className="search-overlay-input"
            autoComplete="off"
            aria-haspopup="listbox"
            aria-expanded={suggestions.length > 0}
          />
        </form>

        {suggestions.length > 0 && (
          <ul className="search-suggestions-list scrollbar-hide" role="listbox">
            {suggestions.map(book => (
              <li key={book.id} role="option" aria-selected="false">
                <button
                  onClick={() => handleSuggestionItemClick(book)}
                  className="search-suggestion-item"
                >
                  <img src={book.coverImageUrl} alt={book.title} className="w-10 h-14 object-cover rounded-sm flex-shrink-0 border border-neutral-700" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{book.title}</p>
                    <p className="text-sm text-neutral-400 truncate">{book.author}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;