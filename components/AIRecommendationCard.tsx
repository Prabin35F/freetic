import React from 'react';
import { Book } from '../types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface AIRecommendationCardProps {
  book: Book;
  onView: (book: Book) => void;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ book, onView }) => {
  return (
    <div className="bg-[var(--netflix-dark-secondary)] rounded-lg shadow-lg flex flex-col sm:flex-row items-start p-4 gap-4 animate-fadeIn border border-transparent hover:border-[var(--netflix-red)]/50 transition-colors duration-200">
      <img src={book.coverImageUrl} alt={book.title} className="w-28 h-44 object-cover rounded-md flex-shrink-0 shadow-md" />
      <div className="flex flex-col justify-between h-full flex-grow">
        <div>
          <h4 className="text-lg font-bold text-white">{book.title}</h4>
          <p className="text-sm text-neutral-400 mb-3">{book.author}</p>
          <p className="text-sm text-neutral-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {book.whyThisBookIsPerfect || book.caption}
          </p>
        </div>
        <button
          onClick={() => onView(book)}
          className="primary-action-button mt-4 px-4 py-1.5 rounded-md text-sm font-semibold self-start flex items-center gap-1.5"
        >
          <InformationCircleIcon className="w-4 h-4" />
          More Info
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationCard;