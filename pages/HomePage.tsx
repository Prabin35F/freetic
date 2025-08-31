

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Book } from '../types';
import { FILTER_BAR_CATEGORIES } from '../constants';
import BookCard from '../components/BookCard';
import AutoMovingCategoryBar from '../components/AutoMovingCategoryBar';
import { useAppContext } from '../AppContext';
import AdPlayer from '../components/AdPlayer';
import FireflyParticles from '../components/FireflyParticles';
import { ApkDownloadButton } from '../components/ApkDownloadButton';
import { AdminBookForm } from '../components/AdminBookForm';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { TicTacToeGame } from '../components/TicTacToeGame';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

interface HomePageProps {
  onBookClick: (book: Book) => void;
}

export default function HomePage({ onBookClick }: HomePageProps): React.ReactElement {
  const { 
    books, 
    adConfig, 
    searchTerm, 
    isAdminAuthenticated,
    logoutAdmin,
    addBook,
    updateBook,
    deleteBook,
  } = useAppContext();
  
  const [currentTopCarouselIndex, setCurrentTopCarouselIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [shuffledGridBooks, setShuffledGridBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const topCarouselBooks = useMemo(() => books.filter(b => b.isFeaturedInTopCarousel), [books]);

  useEffect(() => {
    if (topCarouselBooks.length > 1) {
      const timer = setInterval(() => {
        setCurrentTopCarouselIndex(prevIndex => (prevIndex + 1) % topCarouselBooks.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [topCarouselBooks.length]);
  
  const handleSaveBook = (bookData: Book, podcastFile?: File | null) => {
    if (editingBook) {
      updateBook(bookData, podcastFile);
    } else {
      addBook(bookData, podcastFile);
    }
    setEditingBook(null);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  const lowerCaseSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        lowerCaseSearchTerm === '' ||
        book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)) ||
        book.category.toLowerCase().includes(lowerCaseSearchTerm);

      let matchesFilter = false;
      if (activeFilter === "All") {
        matchesFilter = true;
      } else if (activeFilter === "Trending Now") {
        matchesFilter = !!book.isTrending;
      } else if (activeFilter === "Staff Picks") {
        matchesFilter = !!book.isStaffPick;
      } else {
        matchesFilter = book.category === activeFilter;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [books, lowerCaseSearchTerm, activeFilter]);

  const todaysCoreIdeaBookCandidate = useMemo(() => books.find(b => b.isTodaysCoreIdea), [books]);

  const todaysCoreIdeaBook = useMemo(() => {
      if (todaysCoreIdeaBookCandidate && filteredBooks.some(b => b.id === todaysCoreIdeaBookCandidate.id)) {
          return todaysCoreIdeaBookCandidate;
      }
      return null;
  }, [todaysCoreIdeaBookCandidate, filteredBooks]);

  const mainGridBooks = useMemo(() => {
    let booksForGrid = [...filteredBooks];
    
    const score = (book: Book): number => {
      if (book.isPushedToTop) return 6;
      if (book.isTrending) return 5;
      if (book.isStaffPick) return 4;
      if (book.isHot) return 3;
      if (book.isRecommended) return 2;
      if (book.isSignature) return 1;
      return 0;
    };
    booksForGrid.sort((a, b) => score(b) - score(a));

    if (todaysCoreIdeaBook) {
        return booksForGrid.filter(book => book.id !== todaysCoreIdeaBook.id);
    }
    return booksForGrid;
  }, [filteredBooks, todaysCoreIdeaBook]);

  const shuffleBooks = useCallback((booksToShuffle: Book[]) => {
    return [...booksToShuffle].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    setShuffledGridBooks(shuffleBooks(mainGridBooks));
  }, [mainGridBooks, shuffleBooks]);
  
  const handleRefreshFeed = useCallback(() => {
    setShuffledGridBooks(shuffleBooks(mainGridBooks));
  }, [mainGridBooks, shuffleBooks]);
  
  const discoverTitle = useMemo(() => {
    if (searchTerm) {
        return `Results for "${searchTerm}"`;
    }
    if (activeFilter !== "All") {
        return activeFilter;
    }
    return <span className="premium-title-red">Discover More</span>;
  }, [searchTerm, activeFilter]);

  const shouldDisplayAd = useMemo(() => {
    if (!adConfig.isEnabled || !adConfig.script) {
      return false;
    }
    const now = new Date();
    const startDate = adConfig.adStartDate ? new Date(adConfig.adStartDate) : null;
    const endDate = adConfig.adEndDate ? new Date(adConfig.adEndDate) : null;

    if (startDate && now < startDate) {
      return false;
    }
    if (endDate && now > endDate) {
      return false;
    }
    return true;
  }, [adConfig]);
  
  const adDisplay = useMemo(() => {
    if (!shouldDisplayAd || !adConfig.dimensions) return null;
    
    return (
        <div className="my-12">
            <h3 className="text-center text-sm text-neutral-500 mb-2 uppercase tracking-wider">Advertisement</h3>
            <AdPlayer 
              scriptContent={adConfig.script} 
              dimensions={adConfig.dimensions} 
            />
        </div>
    );
  }, [shouldDisplayAd, adConfig]);

  const baseDelay = 120; // ms for word animation

  // Slogan 1 parts
  const slogan1_line1_words = "You don’t need 100 books,".split(' ');
  const slogan1_line2_words = "You need the".split(' ');
  const slogan1_line1_len = slogan1_line1_words.length;
  const slogan1_line2_len = slogan1_line2_words.length;

  // Slogan 2 parts
  const slogan2_line1_words = "Don’t read more.".split(' ');
  const slogan2_line2_words = "Read".split(' ');
  const slogan2_line1_len = slogan2_line1_words.length;
  
  // Slogan 3 parts
  const slogan3_line1_words = "Great readers know when to".split(' ');
  const slogan3_line1_len = slogan3_line1_words.length;


  return (
    <>
      <FireflyParticles />
      <div className="min-h-screen bg-transparent text-white relative z-10">
        
        {isAdminAuthenticated && (
          <div className="container mx-auto px-4 py-8 bg-black/50 backdrop-blur-sm rounded-b-lg mb-8 border-b-2 border-t-2 border-[var(--netflix-red)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
              <button
                onClick={logoutAdmin}
                className="primary-action-button px-4 py-2 rounded-md font-semibold flex items-center"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
              </button>
            </div>
            
            <div className="space-y-10">
              <AdminBookForm
                key={editingBook ? editingBook.id : 'new-book-form'}
                bookToEdit={editingBook}
                onSave={handleSaveBook}
                onCancel={editingBook ? () => setEditingBook(null) : undefined}
              />
              
              <div className="mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold text-[var(--netflix-red)] mb-6">Existing Books List</h3>
                {books.length > 0 ? (
                  <div className="space-y-4">
                    {books.slice().sort((a,b) => (a.title || '').localeCompare(b.title || '')).map(book => (
                      <div key={book.id} className="bg-[var(--netflix-dark-secondary)] p-3 sm:p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-md sm:text-lg text-white truncate" title={book.title}>{book.title}</p>
                          <p className="text-xs sm:text-sm text-[var(--netflix-text-secondary)]">{book.author} - <span className="text-xs text-[var(--netflix-red)]/80">{book.category}</span></p>
                        </div>
                        <div className="space-x-2 flex-shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-xs sm:text-sm primary-action-button px-2.5 sm:px-3 py-1 sm:py-1.5 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${book.title}"? This cannot be undone.`)) {
                                deleteBook(book.id);
                                if (editingBook?.id === book.id) {
                                  setEditingBook(null);
                                }
                              }
                            }}
                            className="text-xs sm:text-sm bg-neutral-600 hover:bg-neutral-500 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--netflix-text-muted)] italic">No books added yet. Use the form above to add one.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isAdminAuthenticated && (
          <>
            {topCarouselBooks.length > 0 && (
              <div className="relative w-full aspect-video max-h-[800px] shadow-2xl overflow-hidden">
                {topCarouselBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentTopCarouselIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    <BookCard book={book} onClick={() => onBookClick(book)} isFeatured={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 lg:p-16 max-w-3xl pointer-events-none">
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg line-clamp-2">{book.title}</h1>
                      <h3 className="text-md md:text-lg text-neutral-200 mb-1 md:mb-2 drop-shadow-md">By {book.author}</h3>
                      <p className="text-md md:text-xl text-neutral-100 mb-4 md:mb-6 drop-shadow-lg line-clamp-2 sm:line-clamp-3">{book.brutalTruth || book.oneLinerHook}</p>
                       <div className="pointer-events-auto">
                          <button 
                              onClick={(e) => { e.stopPropagation(); onBookClick(book); }}
                              className="primary-action-button px-8 py-3 rounded-md text-base md:text-lg font-bold"
                          >
                              Access Now
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
                {topCarouselBooks.length > 1 && (
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {topCarouselBooks.map((_, index) => (
                          <button key={index} onClick={() => setCurrentTopCarouselIndex(index)} 
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentTopCarouselIndex ? 'bg-[var(--netflix-red)]' : 'bg-neutral-500/70 hover:bg-neutral-400/70'}`}></button>
                      ))}
                  </div>
                )}
              </div>
            )}
            
            <AutoMovingCategoryBar 
              filterCategories={FILTER_BAR_CATEGORIES}
              selectedFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
            
            <div className="container mx-auto px-4 pt-10 md:pt-12 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 max-w-4xl mx-auto leading-tight md:leading-snug">
                {slogan1_line1_words.map((word, i) => <span key={i} className="slogan-word" style={{ animationDelay: `${i * baseDelay}ms`}}>{word}&nbsp;</span>)}
                <br className="hidden sm:block" />
                {slogan1_line2_words.map((word, i) => <span key={i} className="slogan-word" style={{ animationDelay: `${(slogan1_line1_len + i) * baseDelay}ms`}}>{word}&nbsp;</span>)}
                <span className="slogan-word" style={{ animationDelay: `${(slogan1_line1_len + slogan1_line2_len) * baseDelay}ms`}}>
                  <span className="text-[var(--netflix-red)] font-bold">right ones.</span>
                </span>
              </h2>
              <div className="slogan-underline" />
            </div>

            <div className="container mx-auto px-4 pb-8">
              {adConfig.placement === 'after_hero' && adDisplay}
              
              {todaysCoreIdeaBook && (
                  <div className="my-12 p-6 ai-recommender-background rounded-xl highlight-section-with-accent">
                      <h2 className="text-2xl font-semibold text-[var(--netflix-red)] mb-4">Today's Core Idea</h2>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <div className="flex-shrink-0 w-[150px] sm:w-[200px]">
                               <BookCard 
                                  book={todaysCoreIdeaBook} 
                                  onClick={() => onBookClick(todaysCoreIdeaBook)} 
                                />
                          </div>
                          <div className="flex-grow">
                              <h3 className="text-xl font-bold mt-2 sm:mt-0">{todaysCoreIdeaBook.title}</h3>
                              <p className="text-sm text-neutral-400">{todaysCoreIdeaBook.author}</p>
                              
                              {todaysCoreIdeaBook.brutalTruth && (
                                <blockquote className="my-4 core-idea-quote">
                                  <p className="text-lg text-neutral-200 leading-relaxed">
                                    {todaysCoreIdeaBook.brutalTruth}
                                  </p>
                                </blockquote>
                              )}

                              <p className="mt-2 text-neutral-300 line-clamp-3 md:line-clamp-4">{todaysCoreIdeaBook.coreValueParagraph || todaysCoreIdeaBook.caption}</p>
                              <button 
                                  onClick={() => onBookClick(todaysCoreIdeaBook)}
                                  className="primary-action-button mt-3 px-4 py-2 rounded-md text-sm font-semibold"
                              >
                                 Access Now
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              <div className="container mx-auto px-4 my-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 max-w-4xl mx-auto leading-tight md:leading-snug">
                    {slogan2_line1_words.map((word, i) => <span key={i} className="slogan-word" style={{ animationDelay: `${i * baseDelay}ms`}}>{word}&nbsp;</span>)}
                    <br className="hidden sm:block" />
                    {slogan2_line2_words.map((word, i) => <span key={i} className="slogan-word" style={{ animationDelay: `${(slogan2_line1_len + i) * baseDelay}ms`}}>{word}&nbsp;</span>)}
                    <span className="slogan-word" style={{ animationDelay: `${(slogan2_line1_len + 1) * baseDelay}ms`}}>
                        <span className="text-[var(--netflix-red)] font-bold">deeper.</span>
                    </span>
                </h2>
                <div className="slogan-underline" />
              </div>

              {mainGridBooks.length > 0 && (
                <div className="my-12 p-4 sm:p-6 ai-recommender-background rounded-xl">
                   <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <h2 className="text-2xl md:text-3xl font-bold premium-title-red">
                      {discoverTitle}
                    </h2>
                    <button
                      onClick={handleRefreshFeed}
                      className="primary-action-button px-4 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 flex-shrink-0"
                      aria-label="Refresh the book feed"
                    >
                      <span role="img" aria-label="refresh icon">🔁</span> Refresh Feed
                    </button>
                  </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {shuffledGridBooks.map(book => (
                         <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
                      ))}
                   </div>
                </div>
              )}
              
              {adConfig.placement === 'between_rows' && mainGridBooks.length > 0 && adDisplay}

              {filteredBooks.length === 0 && (searchTerm || (activeFilter !== "All")) && (
                <div className="text-center py-10">
                  <p className="text-xl text-neutral-400">No books found matching your criteria.</p>
                </div>
              )}
              
            </div>

            <div className="container mx-auto px-4 my-16 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-100 max-w-4xl mx-auto leading-tight md:leading-snug">
                    {slogan3_line1_words.map((word, i) => <span key={i} className="slogan-word" style={{ animationDelay: `${i * baseDelay}ms`}}>{word}&nbsp;</span>)}
                    <span className="slogan-word" style={{ animationDelay: `${slogan3_line1_len * baseDelay}ms`}}>
                        <span className="text-[var(--netflix-red)] font-bold">pause.</span>
                    </span>
                </h2>
                <div className="slogan-underline" />
            </div>

            <div className="w-full container mx-auto px-4 my-12">
                <TicTacToeGame />
            </div>

            <TestimonialCarousel />
          </>
        )}
      </div>
      <ApkDownloadButton />
    </>
  );
};