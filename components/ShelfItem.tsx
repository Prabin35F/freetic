
import React from 'react';
import { Shelf, Book } from '../types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import BookCard from './BookCard';

interface ShelfItemProps {
  shelf: Shelf;
  booksOnShelf: Book[];
  onRenameShelf: (shelfId: string, newName: string) => void;
  onDeleteShelf: (shelfId: string) => void;
  onRemoveBookFromShelf: (shelfId: string, bookId: string) => void;
  onViewBook: (book: Book) => void;
}

const ShelfItem: React.FC<ShelfItemProps> = ({
  shelf,
  booksOnShelf,
  onRenameShelf,
  onDeleteShelf,
  onRemoveBookFromShelf,
  onViewBook,
}) => {
  const handleRename = () => {
    const newName = prompt(`Rename shelf "${shelf.name}":`, shelf.name);
    if (newName && newName.trim() !== '' && newName !== shelf.name) {
      onRenameShelf(shelf.id, newName.trim());
    }
  };

  return (
    <div className="bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-[var(--netflix-red)]">{shelf.name}</h3>
        <div className="space-x-3">
          <button
            onClick={handleRename}
            className="text-[var(--netflix-text-secondary)] hover:text-white transition-colors"
            title="Rename shelf"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDeleteShelf(shelf.id)}
            className="text-[var(--netflix-text-secondary)] hover:text-[var(--netflix-red)] transition-colors"
            title="Delete shelf"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {booksOnShelf.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {booksOnShelf.map((book) => (
            <div key={book.id} className="relative group">
              <BookCard book={book} onClick={() => onViewBook(book)} />
              <button
                onClick={() => onRemoveBookFromShelf(shelf.id, book.id)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-red-700/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from shelf"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[var(--netflix-text-muted)] italic">This shelf is empty. Add some books from the Discover page!</p>
      )}
    </div>
  );
};

export default ShelfItem;
