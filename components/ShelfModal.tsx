import React, { useState } from 'react';
import { Shelf } from '../types';
import { XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface ShelfModalProps {
  shelves: Shelf[];
  bookIdToAdd: string | null;
  onClose: () => void;
  onAddToExistingShelf: (shelfId: string, bookId: string) => void;
  onCreateAndAddShelf: (shelfName: string, bookId: string) => void;
}

const ShelfModal: React.FC<ShelfModalProps> = ({
  shelves,
  bookIdToAdd,
  onClose,
  onAddToExistingShelf,
  onCreateAndAddShelf,
}) => {
  const [newShelfName, setNewShelfName] = useState('');

  if (!bookIdToAdd) return null;

  const handleCreateAndAdd = () => {
    if (newShelfName.trim()) {
      onCreateAndAddShelf(newShelfName.trim(), bookIdToAdd);
      setNewShelfName(''); 
    }
  };
  
  const inputClass = "flex-grow px-3 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none";


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--netflix-dark-secondary)] text-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--netflix-text-secondary)] hover:text-white"
          aria-label="Close"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        <h3 className="text-xl font-semibold text-[var(--netflix-red)] mb-4">Add to Shelf</h3>

        {shelves.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-[var(--netflix-text-secondary)] mb-2">Select an existing shelf:</p>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
              {shelves.map((shelf) => (
                <button
                  key={shelf.id}
                  onClick={() => onAddToExistingShelf(shelf.id, bookIdToAdd)}
                  className="w-full text-left px-4 py-2 bg-neutral-700 hover:bg-[var(--netflix-hover-bg)] rounded-md transition-colors"
                >
                  {shelf.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-[var(--netflix-text-secondary)] mb-2">Or create a new shelf:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
              placeholder="New shelf name (e.g., 'To Read')"
              className={inputClass}
            />
            <button
              onClick={handleCreateAndAdd}
              disabled={!newShelfName.trim()}
              className="primary-action-button p-2 rounded-md disabled:opacity-50"
              title="Create and add"
            >
              <PlusCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelfModal;