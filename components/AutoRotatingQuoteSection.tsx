import React, { useState, useEffect } from 'react';

const QUOTES = [
  "Some pages speak louder than people.",
  "A quiet book can awaken a loud mind.",
  "Reading is not escape. It's return.",
  "Words find you when the world loses you.",
  "Books don’t ask. They answer.",
  "A good story remembers you.",
  "Every line you read, rewrites you.",
  "The right sentence is a mirror.",
  "A shelf of books is a map of minds.",
  "We read to remember who we are.",
  "In silence, books speak loudest.",
  "Some truths are too honest for conversation. That’s why books exist.",
  "Not every book changes you. But the ones that do, never leave.",
  "Great books don’t teach. They awaken.",
  "A reader lives more lives than time allows.",
  "Books are the quietest and most constant of friends.",
  "A reader lives a thousand lives before he dies.",
  "Words have weight; they build or break worlds.",
  "Reading is the soul’s nourishment.",
  "The best minds are forged in pages.",
  "Literature is the art of discovering the extraordinary in the ordinary.",
  "A book is a garden carried in the pocket.",
  "Books wash away the dust of everyday life.",
  "The pen is the tongue of the mind.",
  "To read is to voyage through time.",
  "Books are the mirrors of the soul.",
  "Every book is a portal to a new world.",
  "Reading is an exercise in empathy.",
  "Books are the training ground for the mind.",
  "Great books demand nothing less than your full presence.",
  "Words planted in the mind grow into wisdom.",
  "A true book never lets you go.",
  "Books are the architects of thought.",
  "Reading is the art of getting lost and found.",
  "The stories we read shape the stories we live."
];

const QUOTE_CYCLE_DURATION = 7000; // 7 seconds

const AutoRotatingQuoteSection: React.FC = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % QUOTES.length);
        }, QUOTE_CYCLE_DURATION);
        return () => clearInterval(timer);
    }, []);

    const currentQuote = QUOTES[currentQuoteIndex];

    return (
        <section className="pt-16 pb-12 md:pt-24 md:pb-16 text-center overflow-hidden" aria-roledescription="inspirational quote">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="quote-container" style={{ minHeight: '6rem' }}>
                    <blockquote
                        key={currentQuoteIndex}
                        className="quote-animation"
                        aria-live="polite"
                    >
                        <p className="text-2xl md:text-3xl italic text-[var(--netflix-text-secondary)] leading-relaxed">
                            <span className="text-[var(--netflix-red)]/70">“</span>
                            {currentQuote}
                            <span className="text-[var(--netflix-red)]/70">”</span>
                        </p>
                    </blockquote>
                </div>
            </div>
        </section>
    );
};

export default AutoRotatingQuoteSection;
