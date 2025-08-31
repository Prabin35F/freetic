import React, { useState, useEffect, useMemo } from 'react';

interface TypingTitleProps {
  text: string;
  speed?: number; // Speed in ms per character
  onFinished?: () => void;
}

const TypingTitle: React.FC<TypingTitleProps> = ({ text, speed = 35, onFinished }) => {
  const [isTyping, setIsTyping] = useState(true);

  // Memoize the characters array to prevent re-creation on re-renders
  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    // Reset typing state when the text changes
    setIsTyping(true);
    
    // Calculate total duration for the animation
    const typingDuration = chars.length * speed;
    
    // Set a timer to mark typing as finished
    const timer = setTimeout(() => {
      setIsTyping(false);
      if (onFinished) {
        onFinished();
      }
    }, typingDuration + 200); // Add a small buffer for the animation to feel complete

    // Cleanup timer on component unmount or if dependencies change
    return () => clearTimeout(timer);
  }, [text, chars.length, speed, onFinished]);

  return (
    <span aria-label={text}>
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="typing-title-char"
          style={{ animationDelay: `${index * speed}ms` }}
          aria-hidden="true" // Hide individual chars from screen readers
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {isTyping && <span className="typing-cursor-smooth" aria-hidden="true"></span>}
    </span>
  );
};

export default TypingTitle;
