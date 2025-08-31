
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Book } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (book: Book) => void;
  allBooks: Book[];
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSuggestionClick, allBooks, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Sync internal query state if initialQuery prop changes (e.g., from global state via Navbar)
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

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

  // Handle clicks outside the search component to close the suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSuggestionItemClick = (book: Book) => {
    setQuery(''); // Clear local query
    setSuggestions([]);
    setIsFocused(false);
    onSuggestionClick(book); // Notify parent
  };

  return (
    <form ref={searchContainerRef} onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto my-6 md:my-8">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        placeholder="Search titles or authors for live suggestions..."
        className="w-full px-5 py-3 pr-14 text-white bg-[var(--netflix-card-bg)] border border-neutral-700 rounded-full focus:ring-2 focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none placeholder-neutral-500 text-base"
        autoComplete="off"
        aria-haspopup="listbox"
        aria-expanded={isFocused && suggestions.length > 0}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center justify-center px-5 text-[var(--netflix-red)] hover:text-red-400"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      {isFocused && suggestions.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full bg-[var(--netflix-card-bg)] border border-neutral-700 rounded-lg shadow-2xl z-20 overflow-hidden animate-fadeIn"
          role="listbox"
        >
          <ul>
            {suggestions.map(book => (
              <li key={book.id} role="option" aria-selected="false">
                <button
                  type="button"
                  onClick={() => handleSuggestionItemClick(book)}
                  className="w-full text-left flex items-center gap-4 p-3 hover:bg-[var(--netflix-hover-bg)] transition-colors"
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
        </div>
      )}
    </form>
  );
};

export default SearchBar;
