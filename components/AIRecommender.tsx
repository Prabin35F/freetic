import React, { useState, useCallback } from 'react';
import { Book } from '../types';
import { getAIRecommendations } from '../services/geminiService';
import { useAppContext } from '../AppContext';
import AIRecommendationCard from './AIRecommendationCard';
import BookModal from './BookModal';
import Spinner from './Spinner';
import { SparklesIcon } from '@heroicons/react/24/outline';

const AIRecommender: React.FC = () => {
    // FIX: Get setActiveView from context to pass to the BookModal.
    const { books, addHistoryRecord, setActiveView } = useAppContext();
    const [query, setQuery] = useState('');
    const [recommendations, setRecommendations] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const isAIAvailable = !!process.env.API_KEY;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        setHasSearched(true);

        try {
            const recommendedIds = await getAIRecommendations(query, books);
            
            if (recommendedIds.length === 0) {
                setError("I couldn't find specific recommendations for that. Try rephrasing your request, for example: 'I want to build better habits' or 'How can I understand my own biases?'");
            } else {
                const recommendedBooks = recommendedIds
                    .map(id => books.find(book => book.id === id))
                    .filter((b): b is Book => b !== undefined);
                setRecommendations(recommendedBooks);
            }
        } catch (e: any) {
            console.error(e);
            setError("The AI assistant is currently unavailable. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBookClick = useCallback((book: Book) => {
        setSelectedBook(book);
        addHistoryRecord(book, 'read');
    }, [addHistoryRecord]);

    const handleCloseModal = useCallback(() => {
        setSelectedBook(null);
    }, []);

    if (!isAIAvailable) {
        return null;
    }

    return (
        <>
            <div className="my-10 md:my-16 min-h-[220px] flex flex-col justify-center items-center">
                {!isExpanded ? (
                    <div className="text-center animate-fadeIn">
                        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 flex items-center justify-center gap-3">
                            <SparklesIcon className="w-8 h-8 text-[var(--netflix-red)]" />
                            <span>AI Book Finder</span>
                        </h3>
                         <p className="text-center text-[var(--netflix-text-secondary)] mb-6 max-w-xl mx-auto">
                            Can't decide what to read? Describe your goals or feelings, and let our AI guide you to the perfect book.
                        </p>
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="primary-action-button px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                            aria-label="Launch AI Book Finder"
                        >
                            Launch AI Assistant
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="ai-recommender-background p-6 sm:p-8 rounded-xl max-w-4xl mx-auto animate-reveal-3d">
                            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                                <SparklesIcon className="w-8 h-8 text-[var(--netflix-red)]" />
                                <span>AI Book Finder</span>
                            </h3>
                            <p className="text-center text-[var(--netflix-text-secondary)] mb-6 max-w-2xl mx-auto">
                                Tell me what's on your mind. Describe a problem, a goal, or a feeling, and I'll find the right books for you.
                            </p>
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., I want to stop procrastinating..."
                                    className="flex-grow w-full px-5 py-3 text-white bg-neutral-800 border border-neutral-600 rounded-md focus:ring-2 focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none placeholder-neutral-500 text-base"
                                    aria-label="Describe what you want to learn or improve"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="primary-action-button px-6 py-3 rounded-md font-semibold text-base transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner size="sm" color="text-white"/> Thinking...
                                        </>
                                    ) : (
                                        "Find Books with AI"
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="max-w-4xl mx-auto mt-8">
                            {error && (
                                <div className="text-center py-6 px-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
                                    {error}
                                </div>
                            )}
                            {recommendations.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-white mb-2">Here are my top recommendations for you:</h4>
                                    {recommendations.map(book => (
                                        <AIRecommendationCard key={book.id} book={book} onView={handleBookClick} />
                                    ))}
                                </div>
                            )}
                            {hasSearched && !isLoading && !error && recommendations.length === 0 && !error && (
                                <div className="text-center py-6 text-neutral-400">
                                    <p>Enter a query above to get personalized recommendations.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {selectedBook && (
                <BookModal 
                    book={selectedBook} 
                    onClose={handleCloseModal}
                    allBooks={books}
                    onViewBook={handleBookClick}
                    onPlayAudio={(book) => addHistoryRecord(book, 'audio')}
                    // FIX: Pass the required setActiveView prop to the modal.
                    setActiveView={setActiveView}
                />
            )}
        </>
    );
};

export default AIRecommender;