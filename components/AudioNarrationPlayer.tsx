
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X } from 'lucide-react';
import Spinner from './Spinner';

interface AudioNarrationPlayerProps {
  text: string;
  voiceSelection: 'Male' | 'Female' | 'Default';
  onClose: () => void;
}

const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({ text, voiceSelection, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isUnsupported, setIsUnsupported] = useState(false);
    const [error, setError] = useState('');

    const sentencesRef = useRef<string[]>([]);
    const currentIndexRef = useRef(0);
    // Ref to get the latest isPlaying state inside async callbacks like onend
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // When the component is unmounted, stop any speech.
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Setup sentences and wait for voices to be ready
    useEffect(() => {
        const synth = window.speechSynthesis;
        if (!synth) {
            setIsUnsupported(true);
            return;
        }

        const onVoicesChanged = () => {
            if (synth.getVoices().length > 0) {
                setIsReady(true);
            }
        };

        // Split text into sentences for playback control
        sentencesRef.current = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
        currentIndexRef.current = 0;
        
        synth.addEventListener('voiceschanged', onVoicesChanged);
        // If voices are already loaded, trigger ready state immediately
        if (synth.getVoices().length > 0) {
            onVoicesChanged();
        }

        return () => {
            synth.removeEventListener('voiceschanged', onVoicesChanged);
        };
    }, [text]);

    const playSentences = useCallback(() => {
        const synth = window.speechSynthesis;
        
        // Stop condition checks
        if (!isPlayingRef.current || !isReady || isUnsupported) {
            return;
        }
        
        const index = currentIndexRef.current;
        if (index >= sentencesRef.current.length) {
            setIsPlaying(false); // Finished playing
            currentIndexRef.current = 0; // Reset for next play
            return;
        }

        const sentence = sentencesRef.current[index];
        const utterance = new SpeechSynthesisUtterance(sentence);
        
        // --- Voice Selection ---
        const voices = synth.getVoices();
        if (voices.length > 0) {
            let selectedVoice: SpeechSynthesisVoice | null = null;
            const lang = 'en-US';
            const findVoice = (gender: 'male' | 'female', preferredNames: string[]) =>
                voices.find(v => v.lang.startsWith(lang) && preferredNames.some(name => v.name.includes(name))) ||
                voices.find(v => v.lang.startsWith(lang) && v.name.toLowerCase().includes(gender)) ||
                null;

            if (voiceSelection === 'Male') {
                selectedVoice = findVoice('male', ['Google US English', 'David', 'Mark', 'Alex']);
            } else if (voiceSelection === 'Female') {
                selectedVoice = findVoice('female', ['Google US English', 'Zira', 'Samantha', 'Susan', 'Tessa']);
            }
            utterance.voice = selectedVoice || voices.find(v => v.lang.startsWith(lang) && v.default) || voices.find(v => v.lang.startsWith(lang)) || voices[0];
        }
        // --- End Voice Selection ---

        utterance.onend = () => {
            // When one sentence finishes, move to the next and continue playing
            if (isPlayingRef.current) {
                currentIndexRef.current++;
                playSentences(); // Recurse to play the next sentence
            }
        };
        
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            console.error("SpeechSynthesis Error:", event.error, event);
            setError(`Error: ${event.error}. Please try again.`);
            setIsPlaying(false);
        };

        // This is a safety net for some browsers. If the synth is somehow paused, resume it.
        if (synth.paused) {
          synth.resume();
        }
        synth.speak(utterance);

    }, [isReady, isUnsupported, voiceSelection]);

    // This effect links the `isPlaying` state to the `playSentences` action.
    useEffect(() => {
        if (isPlaying) {
            playSentences();
        }
    }, [isPlaying, playSentences]);


    const handlePlayPause = () => {
        if (!isReady || isUnsupported) return;

        const willBePlaying = !isPlaying;
        const synth = window.speechSynthesis;

        if (willBePlaying) {
             // If we're at the end of the text, reset the index before playing again.
            if (currentIndexRef.current >= sentencesRef.current.length) {
                currentIndexRef.current = 0;
            }
            // Trigger the useEffect to start playing.
            setIsPlaying(true);
        } else {
            // When pausing, cancel any ongoing speech immediately.
            synth.cancel();
            setIsPlaying(false);
        }
    };

    const handleClose = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        onClose();
    };

    const renderStatusText = () => {
        if (error) return 'Error';
        if (isUnsupported) return 'Unsupported Browser';
        if (!isReady) return 'Loading voices...';
        if (isPlaying) return 'Playing...';
        return 'Ready to play';
    };

    const renderMainButton = () => {
        if (!isReady || isUnsupported) {
            return (
                <div className="flex items-center justify-center w-12 h-12">
                     <Spinner size="sm" color="text-sky-400" />
                </div>
            );
        }
        return (
             <button
              onClick={handlePlayPause}
              className="narration-player-button play-pause"
              aria-label={isPlaying ? "Pause Narration" : "Play Narration"}
              disabled={!isReady}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
        );
    };
    
    return (
        <div className="narration-player animate-fadeIn">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {renderMainButton()}
                    <div>
                        <p className="font-semibold text-white">AI Narration</p>
                        <p className="text-sm text-neutral-300">
                           {renderStatusText()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="narration-player-button"
                    aria-label="Close narration player"
                >
                    <X size={24} />
                </button>
            </div>
            {error && <p className="text-red-400 text-xs text-center mt-2 px-2">{error}</p>}
            {isUnsupported && <p className="text-amber-400 text-xs text-center mt-2 px-2">Sorry, your browser doesn't support Text-to-Speech.</p>}
        </div>
    );
};

export default AudioNarrationPlayer;
