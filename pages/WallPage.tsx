
import React, { useState, useEffect, useCallback } from 'react';
import QuoteDisplay from '../components/QuoteDisplay';
import { Quote, GroundingChunk } from '../types';
import { INITIAL_QUOTES, CATEGORIES } from '../constants';
import { fetchRandomTruthQuote } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';

const WallPage: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[] | null>(null);
  const { addToast } = useToast();

  const getNextQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGroundingChunks(null);
    try {
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const { quote: geminiQuote, groundingChunks: chunks } = await fetchRandomTruthQuote(randomCategory.toString()); // Ensure topic is string
      if (geminiQuote) {
        setCurrentQuote(geminiQuote);
        if (chunks) setGroundingChunks(chunks);
      } else {
        throw new Error("Gemini returned no quote, using fallback.");
      }
    } catch (apiError: any) {
      console.warn("Failed to fetch quote from Gemini API, using fallback:", apiError.message);
      const isApiKeyError = apiError.message.includes("API key not found") || apiError.message.includes("API_KEY") || apiError.message.includes("client not initialized");
      addToast(
        isApiKeyError
        ? "Using fallback quotes. Gemini API key might be missing or invalid." 
        : "Could not fetch new quote. Using fallback.", 
        isApiKeyError ? "error" : "info"
      );
      
      let fallbackQuote: Quote;
      if (INITIAL_QUOTES.length > 0) {
        const randomIndex = Math.floor(Math.random() * INITIAL_QUOTES.length);
        fallbackQuote = INITIAL_QUOTES[randomIndex];
        // Ensure fallback quote is different from current if possible and more than one quote exists
        if (INITIAL_QUOTES.length > 1 && fallbackQuote.id === currentQuote?.id) {
          fallbackQuote = INITIAL_QUOTES[(randomIndex + 1) % INITIAL_QUOTES.length];
        }
      } else {
        // Absolute fallback if INITIAL_QUOTES is empty
        fallbackQuote = { id: 'fallback-empty', text: "No quotes available at the moment. Please try again later.", author: "System"};
      }
      setCurrentQuote(fallbackQuote);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuote, addToast]); 

  useEffect(() => {
    getNextQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial quote fetch. No need to re-run on getNextQuote change.

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--netflix-dark)]"> {/* Ensure parent has dark bg */}
      {isLoading && !currentQuote ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Spinner size="lg" color="text-[var(--netflix-red)]"/>
        </div>
      ) : (
        <QuoteDisplay
          quote={currentQuote}
          isLoading={isLoading && !!currentQuote} // Show spinner on button if loading new quote but old one is visible
          error={error}
          onNextQuote={getNextQuote}
          groundingChunks={groundingChunks}
        />
      )}
    </div>
  );
};

export default WallPage;