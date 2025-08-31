import React, { useMemo } from 'react';
import { Book } from '../types';
import { FilmIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  isFeatured?: boolean; 
  displayHook?: boolean; 
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, isFeatured = false }) => {
  const imageUrl = isFeatured ? book.carouselCoverImageUrl || book.coverImageUrl : book.coverImageUrl;

  const isRecent = useMemo(() => {
    if (!book.createdAt) return false;
    const createdDate = new Date(book.createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 48; // Considered "NEW" if added in the last 48 hours
  }, [book.createdAt]);

  if (isFeatured) { 
    // Typically, featured items are curated, so "NEW" badge might be less relevant or handled differently.
    return (
      <div
        className={`relative w-full h-full cursor-pointer group bg-neutral-800`}
        onClick={onClick}
        style={{ aspectRatio: '16/9' }}
      >
        <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-xl transform transition-all duration-300 ease-in-out group 
                  w-full aspect-[2/3]
                  bg-[var(--netflix-card-bg)] hover:scale-105 hover:shadow-2xl hover:z-10 cursor-pointer
                  ${book.isSignature ? 'red-signature-border' : ''}
                `}
      onClick={onClick}
      style={{ flexShrink: 0 }}
    >
      <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
      
      {/* Badges */}
      {isRecent && (
         <div className="absolute top-2 left-2 bg-[var(--netflix-red)] text-white text-xs font-bold px-2 py-0.5 rounded-sm z-20 shadow-md">
           NEW
         </div>
      )}
      {book.isTrending && (
        <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm z-20 shadow-md flex items-center">
          <span role="img" aria-label="fire emoji" className="mr-0.5">🔥</span> Trending
        </div>
      )}

      {/* New "always visible" title/author block at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0 pointer-events-none z-10">
        <h3 className="text-white text-base font-bold line-clamp-2 [text-shadow:1px_1px_3px_rgba(0,0,0,1)]">{book.title}</h3>
        <p className="text-neutral-300 text-sm line-clamp-1 [text-shadow:1px_1px_3px_rgba(0,0,0,1)]">{book.author}</p>
      </div>

      {/* The hover panel that reveals all details */}
      <div className="absolute inset-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-10">
        <h3 className="text-white text-lg font-bold line-clamp-2 mb-1 [text-shadow:1px_1px_4px_rgba(0,0,0,1)]">
          {book.title}
          {book.isHot && <span className="ml-1.5 text-xs font-bold text-[var(--netflix-red)] bg-red-900/50 px-1.5 py-0.5 rounded-sm align-middle">HOT</span>}
        </h3>
        <p className="text-neutral-300 text-sm line-clamp-1 mb-1 [text-shadow:1px_1px_4px_rgba(0,0,0,1)]">{book.author}</p>
        {book.brutalTruth && <p className="text-neutral-400 text-xs italic line-clamp-2 mb-2 [text-shadow:1px_1px_3px_rgba(0,0,0,0.8)]">"{book.brutalTruth}"</p>}
        
        <div className="flex space-x-2 mt-auto items-center">
          {book.podcastUrl && <SpeakerWaveIcon className="w-5 h-5 text-white" title="Has audio summary"/>}
          {book.trailerUrl && <FilmIcon className="w-5 h-5 text-white" title="Has trailer"/>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;