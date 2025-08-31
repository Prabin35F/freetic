import React from 'react';
import { HistoryRecord } from '../types';
import { TrashIcon, ClockIcon, BookOpenIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface HistoryListProps {
  history: HistoryRecord[];
  onViewBook: (bookId: string) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onViewBook, onDelete, onClearAll }) => {
  if (history.length === 0) {
    return (
        <div className="bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-lg mb-8 text-center">
             <h3 className="text-2xl font-semibold text-[var(--netflix-red)] mb-4">Recently Viewed</h3>
             <p className="text-[var(--netflix-text-muted)] italic">Your viewing history is empty.</p>
        </div>
    );
  }

  return (
    <div className="bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-[var(--netflix-red)]">Recently Viewed</h3>
        <button
          onClick={onClearAll}
          className="text-sm text-[var(--netflix-text-muted)] hover:text-[var(--netflix-red)] transition-colors flex items-center gap-1"
          title="Clear all history"
        >
          <TrashIcon className="w-4 h-4" />
          Clear All
        </button>
      </div>
      <ul className="space-y-3">
        {history.map(record => (
          <li key={record.id} className="flex items-center justify-between p-3 bg-neutral-800 rounded-md group">
            <div className="flex items-center gap-3 min-w-0">
               {record.mode === 'read' ? (
                <BookOpenIcon className="w-5 h-5 text-sky-400 flex-shrink-0" title="Read" />
               ) : (
                <SpeakerWaveIcon className="w-5 h-5 text-green-400 flex-shrink-0" title="Audio" />
               )}
              <div className="min-w-0">
                <button 
                  onClick={() => onViewBook(record.bookId)}
                  className="text-white font-medium hover:underline truncate text-left"
                  title={record.bookTitle}
                >
                  {record.bookTitle}
                </button>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <ClockIcon className="w-3 h-3" />
                  {new Date(record.openedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => record.id && onDelete(record.id)}
              className="text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-full"
              title="Delete this entry"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
