import React from 'react';
import { Quote, GroundingChunk } from '../types';
import { LinkIcon } from '@heroicons/react/24/outline';

interface QuoteDisplayProps {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
  onNextQuote: () => void;
  groundingChunks?: GroundingChunk[] | null;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading, error, onNextQuote, groundingChunks }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4 md:p-8 text-center bg-[var(--netflix-dark)]"> {/* Full screen feel */}
      <div className="bg-[var(--netflix-dark-secondary)] p-6 sm:p-10 rounded-xl shadow-2xl max-w-3xl w-full relative"> {/* Darker card */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--netflix-red)] mb-8">A Moment of Truth</h2>
        
        {isLoading && <div className="text-xl text-[var(--netflix-text-secondary)]">Fetching wisdom...</div>}
        {error && <div className="text-xl text-red-400">Error: {error}</div>}
        
        {!isLoading && !error && quote && (
          <div className="min-h-[150px] sm:min-h-[200px] flex flex-col justify-center"> {/* Ensure space for quote */}
            <blockquote className="mb-8">
              <p className="text-2xl sm:text-3xl md:text-4xl font-medium italic text-white leading-relaxed sm:leading-loose">
                "{quote.text}"
              </p>
            </blockquote>
            <div className="flex justify-between items-end text-sm mt-4">
                {quote.sourceBook && (
                    <cite className="text-[var(--netflix-text-muted)] text-left block">From: {quote.sourceBook}</cite>
                )}
                {!quote.sourceBook && <div />} {/* Placeholder for spacing */}
                {quote.author && (
                <footer className="text-[var(--netflix-text-secondary)] text-right block">
                    — {quote.author}
                </footer>
                )}
            </div>
          </div>
        )}

        {!isLoading && !error && !quote && (
            <p className="text-xl text-[var(--netflix-text-secondary)]">No quote available at the moment. Try again!</p>
        )}

        <button
          onClick={onNextQuote}
          disabled={isLoading}
          className="primary-action-button px-8 py-3 rounded-lg text-lg font-semibold transition-transform duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-10"
        >
          {isLoading ? 'Loading...' : 'Next Truth'}
        </button>

        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-700 text-left">
            <h4 className="text-sm font-semibold text-[var(--netflix-red)] mb-2 flex items-center">
              <LinkIcon className="w-4 h-4 mr-1" /> Sources:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {groundingChunks.map((chunk, index) =>
                chunk.web && chunk.web.uri ? (
                  <li key={index} className="text-xs text-[var(--netflix-text-muted)]">
                    <a
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--netflix-red)] hover:underline"
                      title={chunk.web.title}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteDisplay;