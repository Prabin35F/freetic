import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface CarouselProps {
  children: ReactNode[];
  title?: ReactNode; // Accept ReactNode for more flexible titles
  itemWidth?: string; // e.g., 'w-[200px]' for the new BookCard size. Will be applied to child wrapper.
  gap?: string; // e.g., 'gap-4'
}

const Carousel: React.FC<CarouselProps> = ({ children, title, itemWidth = 'w-auto', gap = 'gap-4' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        setIsOverflowing(scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth);
      }
    };
    // Debounce or throttle checkOverflow if performance becomes an issue
    const timeoutId = setTimeout(checkOverflow, 100); // Slight delay for rendering
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children]);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by a percentage of visible width, or by a fixed amount (e.g., 3-4 cards)
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75; // Scroll 75% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-8 md:mb-12"> {/* Increased margin bottom */}
      {title && <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">{title}</h2>} {/* Removed padding */}
      <div className="relative group">
        {isOverflowing && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none -ml-3 sm:-ml-5"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none -mr-3 sm:-mr-5"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </>
        )}
        <div
          ref={scrollContainerRef}
          className={`flex overflow-x-auto py-2 scrollbar-hide ${gap}`} // Removed padding
        >
          {/* Each child should manage its own width, e.g. BookCard w-[200px] */}
          {/* The itemWidth prop on Carousel is for a wrapper if needed, but direct child styling is often better */}
          {children.map((child, index) => (
             // Key should be unique to the child if possible, e.g. book.id
            <div key={index} className={`flex-shrink-0 ${itemWidth}`}> {/* itemWidth applied here */}
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;