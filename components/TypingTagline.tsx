import React, { useState, useEffect } from 'react';

const TAGLINES = [
    "For the seekers.",
    "For the thinkers.",
    "For the rare ones."
];

const TYPING_SPEED_MS = 50;
const DELETING_SPEED_MS = 30;
const PAUSE_MS = 2500;

const TypingTagline: React.FC = () => {
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [animationPhase, setAnimationPhase] = useState<'typing' | 'deleting'>('typing');

    useEffect(() => {
        const currentTagline = TAGLINES[taglineIndex];
        let phaseTimer: ReturnType<typeof setTimeout>;

        if (animationPhase === 'typing') {
            const typingDuration = currentTagline.length * TYPING_SPEED_MS;
            phaseTimer = setTimeout(() => {
                setAnimationPhase('deleting');
            }, typingDuration + PAUSE_MS);
        } else { // deleting phase
            const deletingDuration = currentTagline.length * DELETING_SPEED_MS;
            const nextWordDelay = 500;
            phaseTimer = setTimeout(() => {
                setTaglineIndex(prev => (prev + 1) % TAGLINES.length);
                setAnimationPhase('typing');
            }, deletingDuration + nextWordDelay);
        }

        return () => clearTimeout(phaseTimer);
    }, [taglineIndex, animationPhase]);

    const currentTagline = TAGLINES[taglineIndex];
    const chars = currentTagline.split('');

    return (
        <div className="typing-tagline-container" aria-live="polite" aria-label={currentTagline}>
            <span className={`typing-tagline ${animationPhase}`}>
                {chars.map((char, index) => (
                    <span
                        key={index}
                        className="tagline-char"
                        style={{
                            animationDelay: `${(animationPhase === 'typing' 
                                ? index * TYPING_SPEED_MS 
                                : (chars.length - 1 - index) * DELETING_SPEED_MS
                            )}ms`
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </span>
            <span 
                className="typing-cursor"
                style={{
                     // Hide cursor during deletion phase
                    animationName: animationPhase === 'deleting' ? 'none' : 'blink',
                    opacity: animationPhase === 'deleting' ? 0 : 1,
                    transition: 'opacity 0.2s ease-in-out'
                }}
                aria-hidden="true"
            ></span>
        </div>
    );
}

export default TypingTagline;