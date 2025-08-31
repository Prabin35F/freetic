

import React, { useState, useEffect, useMemo } from 'react';

interface TypingSubheadingProps {
  text: string;
  speed?: number; // Speed in ms per character
}

const TypingSubheading: React.FC<TypingSubheadingProps> = ({ text, speed = 80 }) => {
  // Key to force re-render and restart animation
  const [animationKey, setAnimationKey] = useState(0);

  // Loop the animation every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prevKey => prevKey + 1);
    }, 9000); // 9 seconds

    return () => clearInterval(interval);
  }, []);

  const [showCursor, setShowCursor] = useState(false);
  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    setShowCursor(false); // Reset cursor for the new animation run
    const typingDuration = chars.length * speed;
    
    const timer = setTimeout(() => {
      setShowCursor(true);
    }, typingDuration + 100);

    return () => clearTimeout(timer);
  }, [animationKey, chars.length, speed]);

  return (
    <div key={animationKey} className="typing-subheading-wrapper" aria-label={text}>
      <span>
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="typing-subheading-char"
            style={{ animationDelay: `${index * speed}ms` }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      {showCursor && <span className="typing-subheading-cursor" aria-hidden="true"></span>}
    </div>
  );
};

export default TypingSubheading;