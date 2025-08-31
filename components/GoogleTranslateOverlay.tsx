import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface GoogleTranslateOverlayProps {
  text: string;
  targetLang: string;
  onClose: () => void;
  languages: Record<string, string>;
}

const GoogleTranslateOverlay: React.FC<GoogleTranslateOverlayProps> = ({ text, targetLang, onClose, languages }) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);

    const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate&ui=tob`;
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (overlayRef.current) {
            setIsDragging(true);
            const rect = overlayRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    return (
        <div
            ref={overlayRef}
            className="google-translate-overlay"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            <div
                className="google-translate-header"
                onMouseDown={handleMouseDown}
            >
                <h4 className="google-translate-title">Translate to {languages[targetLang]}</h4>
                <button onClick={onClose} className="google-translate-close" aria-label="Close Translator">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
            <iframe
                src={translateUrl}
                className="google-translate-iframe"
                title="Google Translate"
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
        </div>
    );
};

export default GoogleTranslateOverlay;
