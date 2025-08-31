import React from 'react';

interface AutoMovingCategoryBarProps {
  filterCategories: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const AutoMovingCategoryBar: React.FC<AutoMovingCategoryBarProps> = ({
  filterCategories,
  selectedFilter,
  onFilterChange,
}) => {
  // Separate "All" from the rest of the categories for different layout treatment
  const allButtonCategory = filterCategories[0]; // Assuming "All" is always first
  const otherCategories = filterCategories.slice(1);

  const renderButton = (filterItem: string, index: number) => (
    <button
      key={`cat-${filterItem}-${index}`}
      onClick={() => onFilterChange(filterItem)}
      className={`
        px-5 py-2 text-sm font-medium rounded-full transition-all duration-150 ease-in-out
        focus:outline-none whitespace-nowrap
        mx-2 flex-shrink-0 
        bg-black 
        border 
        ${selectedFilter === filterItem
          ? 'bg-[var(--netflix-red)] text-white border-[var(--netflix-red)] scale-105 shadow-md'
          : 'border-[var(--netflix-red)] text-[var(--netflix-red)] hover:bg-red-900/30'
        }
      `}
      aria-pressed={selectedFilter === filterItem}
    >
      {filterItem}
    </button>
  );

  const containerClasses = `
    sticky top-[3.75rem] md:top-[5rem] bg-[var(--netflix-dark)] z-30 py-3 mb-6 md:mb-8 
    flex items-center w-full
  `;

  return (
    <div className={containerClasses}>
      {/* Static "All" button with a divider for visual separation */}
      <div className="pl-2 pr-2 border-r border-neutral-700/60 flex-shrink-0">
        {renderButton(allButtonCategory, 0)}
      </div>
      
      {/* Auto-scrolling container for other categories */}
      <div className="flex-grow overflow-hidden category-bar-hover-pause">
        <div className="flex w-max animate-auto-scroll-categories">
            {/* Render the list twice for a seamless loop */}
            {otherCategories.map((cat, index) => renderButton(cat, index))}
            {otherCategories.map((cat, index) => renderButton(cat, index + otherCategories.length))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AutoMovingCategoryBar);