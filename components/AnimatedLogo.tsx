import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="flex items-center text-2xl font-bold" aria-label="Freetic">
      <svg
        width="22"
        height="32"
        viewBox="0 0 22 32"
        xmlns="http://www.w3.org/2000/svg"
        className="f-logo-svg mr-0.5"
        aria-hidden="true"
      >
        {/* 
          Path for the letter 'F'. It's composed of segments that will be animated.
          The total length is approximately 26 (vertical) + 16 (top) + 11 (middle) = 53.
          We use a stroke-dasharray of 60 to be safe.
        */}
        <path
          d="M3 3 L 3 29 M 3 3 L 19 3 M 3 14 L 14 14"
          className="f-logo-path"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[var(--netflix-text-primary)] tracking-tight">reetic</span>
    </div>
  );
};

export default AnimatedLogo;
