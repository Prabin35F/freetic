import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../types';
import { XMarkIcon, PlayCircleIcon, MicrophoneIcon, TagIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon, CalendarDaysIcon, EyeIcon, SpeakerWaveIcon as SpeakerOutlineIcon, LanguageIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import AudioNarrationPlayer from './AudioNarrationPlayer';
import RedTwinkleParticles from './RedTwinkleParticles';
import TypingTitle from './TypingTitle';
import useLocalStorage from '../hooks/useLocalStorage';
import { useToast } from './Toast';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  allBooks: Book[];
  onViewBook: (book: Book) => void;
  onPlayAudio: (book: Book) => void;
  setActiveView: (view: string) => void;
}

const LANGUAGES: Record<string, string> = {
  'en': 'English',
  'ne': 'Nepali (नेपाली)',
  'hi': 'Hindi (हिन्दी)',
  'es': 'Spanish (Español)',
  'fr': 'French (Français)',
  'de': 'German (Deutsch)',
  'ar': 'Arabic (العربية)',
  'zh-CN': 'Chinese (简体中文)',
  'ja': 'Japanese (日本語)',
  'pt': 'Portuguese (Português)',
  'ru': 'Russian (Русский)',
};

const getInitialLang = () => {
    try {
        const browserLang = navigator.language.split('-')[0];
        return Object.keys(LANGUAGES).includes(browserLang) ? browserLang : 'en';
    } catch (e) {
        return 'en';
    }
};

const BookModal: React.FC<BookModalProps> = ({ book, onClose, allBooks, onViewBook, onPlayAudio, setActiveView }) => {
  const [isNarrationVisible, setIsNarrationVisible] = useState(false);
  const [isTitleFinished, setIsTitleFinished] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // --- Translation State ---
  const [targetLanguage, setTargetLanguage] = useLocalStorage<string>('freetic-targetLang', getInitialLang());

  const getPlainText = (html: string) => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    } catch (e) {
        console.error("Could not parse HTML string", e);
        return html; // fallback to raw string
    }
  };
  
  const handleExploreSupply = () => {
    onClose();
    setActiveView('supply');
  };

  const handleTranslateRequest = (htmlContent: string) => {
    if (targetLanguage === 'en') {
        addToast('Please select a language other than English to translate to.', 'info');
        return;
    }
    const plainText = getPlainText(htmlContent);
    if(plainText) {
        const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLanguage}&text=${encodeURIComponent(plainText)}&op=translate`;
        // Open in a new, smaller window to simulate a PiP experience.
        // This is necessary because Google blocks iframe embedding.
        // Note: This may be blocked by some popup blockers.
        const windowFeatures = 'width=600,height=700,resizable=yes,scrollbars=yes';
        window.open(translateUrl, 'google-translate-pip', windowFeatures);
    } else {
        addToast('No text to translate.', 'info');
    }
  };

  useEffect(() => {
    // Reset states when book changes
    setIsNarrationVisible(false);
    setIsTitleFinished(false);
  }, [book]);

  useEffect(() => {
    if (isNarrationVisible && playerRef.current) {
        playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isNarrationVisible]);


  if (!book) return null;
  
  const getYouTubeEmbedUrl = (youtubeUrl: string) => {
    if (youtubeUrl.includes('embed/')) return youtubeUrl;
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube-nocookie.com/embed/${videoIdMatch[1]}` : undefined;
  };
  
  const embedUrl = book.trailerUrl ? getYouTubeEmbedUrl(book.trailerUrl) : undefined;

  const similarBooks = allBooks
    .filter(b => b.id !== book.id && b.category === book.category)
    .sort(() => 0.5 - Math.random()) // Basic shuffle for variety
    .slice(0, 10); // Show up to 10 similar books
    
  const handleCloseModal = () => {
    setIsNarrationVisible(false); // ensure player is hidden and speech cancelled
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-black text-[var(--netflix-text-primary)] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fadeIn scrollbar-hide">
        <RedTwinkleParticles />
        <div className="relative z-10">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[var(--netflix-text-secondary)] hover:text-white transition-colors z-20 bg-black/50 rounded-full p-1"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

            <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-t-lg">
              <img 
                src={book.visualSceneImageUrl || book.carouselCoverImageUrl || book.coverImageUrl} 
                alt={`${book.title} scene`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            </div>
            
            <div className="p-6 md:p-8 relative -mt-24 md:-mt-32 z-10">
              <div className="flex flex-col md:flex-row gap-6 mb-6 md:items-end">
                <img 
                  src={book.coverImageUrl} 
                  alt={book.title} 
                  className="w-40 h-60 md:w-48 md:h-72 object-cover rounded-md shadow-lg self-center md:self-auto flex-shrink-0 border-2 border-neutral-700" 
                />
                <div className="flex-grow pt-4 md:pt-0">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-lg min-h-[48px] md:min-h-[56px]">
                    <TypingTitle text={book.title} key={book.id} onFinished={() => setIsTitleFinished(true)} />
                    {book.isHot && isTitleFinished && (
                      <span className="ml-2 text-sm font-bold text-[var(--netflix-red)] bg-red-900/60 px-2 py-1 rounded-md align-middle shadow-sm animate-fadeIn">HOT</span>
                    )}
                  </h1>
                  <p className="text-lg text-[var(--netflix-text-secondary)] mb-1 drop-shadow-md">by {book.author}</p>
                  <div className="flex items-center text-sm text-[var(--netflix-text-muted)] mb-3">
                    {book.publicationYear && <><CalendarDaysIcon className="w-4 h-4 mr-1"/> {book.publicationYear} <span className="mx-2">|</span></>}
                    <span>{book.category}</span>
                    {book.isTrending && <><span className="mx-2">|</span><span className="text-orange-400 flex items-center"><span role="img" aria-label="fire" className="mr-1">🔥</span>Trending</span></>}
                  </div>
                  <p className="text-sm text-[var(--netflix-text-secondary)] italic mb-4 line-clamp-2">{book.oneLinerHook}</p>
                </div>
              </div>
              
              <div className="flex justify-end items-center -mt-4 gap-2 sm:gap-4 flex-wrap">
                  <button 
                    onClick={handleExploreSupply}
                    className="bg-transparent border border-neutral-600 hover:border-[var(--netflix-red)] text-neutral-300 hover:text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors"
                  >
                    Explore Freetic Supply
                  </button>
                  {book.isAutoReadEnabled && (
                    <button
                        onClick={() => setIsNarrationVisible(!isNarrationVisible)}
                        className="bg-[var(--narration-blue)] hover:bg-[#005a8d] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5"
                        title="Let AI read this summary to you in natural voice."
                    >
                        <SpeakerOutlineIcon className="w-4 h-4"/>
                        <span className="hidden sm:inline">{isNarrationVisible ? "Close Reader" : "Auto Read"}</span>
                        <span className="sm:hidden">{isNarrationVisible ? "Close" : "Read"}</span>
                    </button>
                  )}
                  <div className="flex items-center">
                    <label htmlFor="language-selector" className="text-sm text-neutral-400 mr-2">Translate to:</label>
                    <select 
                      id="language-selector"
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="language-selector-ai"
                      aria-label="Select language for translation"
                    >
                      {Object.entries(LANGUAGES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
              </div>

              <div
                className="h-[2px] bg-[var(--netflix-red)] shadow-[0_0_10px_2px_var(--netflix-red)] my-8"
                role="separator"
              ></div>

              <div className="space-y-6">
                {book.brutalTruth && (
                  <div className="relative">
                    <h4 className="text-xl font-semibold text-[var(--netflix-red)] mb-2 flex items-center"><SparklesIcon className="w-5 h-5 mr-2"/> Brutal Truth</h4>
                    <div className="text-lg md:text-xl text-[var(--netflix-text-secondary)] italic leading-relaxed rendered-rich-text">
                        <p dangerouslySetInnerHTML={{ __html: `"${book.brutalTruth}"` }} />
                    </div>
                     <button
                        onClick={() => handleTranslateRequest(`"${book.brutalTruth}"`)}
                        className="simple-translate-btn"
                        aria-label={`Translate this section to ${LANGUAGES[targetLanguage]}`}
                      >
                        <LanguageIcon className="w-4 h-4" />
                        <span>Translate</span>
                      </button>
                  </div>
                )}

                {book.whyThisBookIsPerfect && (
                  <div className="relative">
                    <h4 className="text-xl font-semibold text-[var(--netflix-red)] mb-2">Why This Book is Perfect for You</h4>
                    <div className="text-[var(--netflix-text-secondary)] leading-relaxed rendered-rich-text" dangerouslySetInnerHTML={{ __html: book.whyThisBookIsPerfect }} />
                    <button
                      onClick={() => handleTranslateRequest(book.whyThisBookIsPerfect || '')}
                      className="simple-translate-btn"
                      aria-label={`Translate this section to ${LANGUAGES[targetLanguage]}`}
                    >
                      <LanguageIcon className="w-4 h-4" />
                      <span>Translate</span>
                    </button>
                  </div>
                )}

                {book.coreValueParagraph && (
                     <div className="relative">
                        <h4 className="text-xl font-semibold text-[var(--netflix-red)] mb-2">Core Idea</h4>
                        <div className="text-[var(--netflix-text-secondary)] leading-relaxed rendered-rich-text" dangerouslySetInnerHTML={{ __html: book.coreValueParagraph }} />
                        <button
                          onClick={() => handleTranslateRequest(book.coreValueParagraph || '')}
                          className="simple-translate-btn"
                          aria-label={`Translate this section to ${LANGUAGES[targetLanguage]}`}
                        >
                          <LanguageIcon className="w-4 h-4" />
                          <span>Translate</span>
                        </button>
                    </div>
                )}
                
                {book.externalLink && (
                  <div className="pt-4 text-center">
                    <a
                      href={book.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-action-button px-8 py-3 rounded-lg text-lg font-bold transition-transform hover:scale-105 inline-flex items-center justify-center gap-3"
                      title="This takes you to an official store link to purchase the book externally."
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      Buy Now if you want to learn Deeper
                    </a>
                  </div>
                )}

                {book.caption && (
                    <div className="relative">
                      <h4 className="text-xl font-semibold text-[var(--netflix-red)] mb-2">Why This Book Matters</h4>
                      <div className="text-[var(--netflix-text-secondary)] leading-relaxed rendered-rich-text" dangerouslySetInnerHTML={{ __html: book.caption }} />
                      <button
                        onClick={() => handleTranslateRequest(book.caption || '')}
                        className="simple-translate-btn"
                        aria-label={`Translate this section to ${LANGUAGES[targetLanguage]}`}
                      >
                        <LanguageIcon className="w-4 h-4" />
                        <span>Translate</span>
                      </button>
                    </div>
                )}
                
                {embedUrl && (
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-[var(--netflix-red)] mb-2 flex items-center"><PlayCircleIcon className="w-6 h-6 mr-2" /> Hear BOOK From the Author Voice.</h3>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title={`${book.title} - Video Summary`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {book.podcastUrl && (
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><MicrophoneIcon className="w-6 h-6 mr-2 text-[var(--netflix-red)]" /> Book Podcast by expert about this book</h3>
                    <div className="bg-neutral-800 p-4 rounded-lg shadow">
                      <p className="text-md font-medium text-white">{book.podcastTitle || "Book Podcast"}</p>
                      {book.podcastDuration && <p className="text-sm text-[var(--netflix-text-muted)]">Duration: {book.podcastDuration}</p>}
                      <audio onPlay={() => book && onPlayAudio(book)} controls controlsList="nodownload" src={book.podcastUrl} className="w-full mt-2 filter invert-[15%] hue-rotate-[180deg] saturate-[500%] brightness-150">
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}
                
                {book.detailedSummary && (
                  <div className="pt-2 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-semibold text-[var(--netflix-red)] flex items-center"><ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" /> Detailed Summary</h4>
                    </div>
                    <div ref={playerRef}>
                    {isNarrationVisible && book.detailedSummary && (
                        <div className="my-4">
                            <AudioNarrationPlayer 
                                text={book.detailedSummary} 
                                voiceSelection={book.autoReadVoice || 'Default'}
                                onClose={() => setIsNarrationVisible(false)}
                            />
                        </div>
                    )}
                    </div>
                    <div className="text-[var(--netflix-text-secondary)] leading-relaxed whitespace-pre-line rendered-rich-text" dangerouslySetInnerHTML={{ __html: book.detailedSummary }} />
                    <button
                      onClick={() => handleTranslateRequest(book.detailedSummary || '')}
                      className="simple-translate-btn"
                      aria-label={`Translate this section to ${LANGUAGES[targetLanguage]}`}
                    >
                      <LanguageIcon className="w-4 h-4" />
                      <span>Translate</span>
                    </button>
                  </div>
                )}

                {book.tags && book.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-neutral-700">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center"><TagIcon className="w-5 h-5 mr-2 text-[var(--netflix-red)]" /> Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2.5 py-1 bg-neutral-800 text-[var(--netflix-red)] text-xs font-semibold rounded-full lowercase shadow-sm border border-transparent hover:border-[var(--netflix-red)]/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {similarBooks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-neutral-700">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <EyeIcon className="w-5 h-5 mr-2 text-[var(--netflix-red)]" /> You Might Also Like
                    </h4>
                    <div className="flex overflow-x-auto space-x-4 pb-3 -mx-1 px-1 scrollbar-hide">
                      {similarBooks.map(similarBook => (
                        <div 
                          key={similarBook.id} 
                          className="flex-shrink-0 w-28 sm:w-32 cursor-pointer group rounded-md overflow-hidden"
                          onClick={() => onViewBook(similarBook)}
                          title={`View ${similarBook.title}`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewBook(similarBook);}}
                        >
                          <img 
                            src={similarBook.coverImageUrl} 
                            alt={similarBook.title} 
                            className="w-full h-40 sm:h-48 object-cover rounded-md shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105 border-2 border-neutral-700 group-hover:border-[var(--netflix-red)]"
                          />
                          <p className="mt-2 text-xs text-center text-[var(--netflix-text-secondary)] group-hover:text-white line-clamp-2 px-1">
                            {similarBook.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;