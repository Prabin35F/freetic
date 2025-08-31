import React, { useEffect, useRef } from 'react';
import { AdConfiguration } from '../types';

interface AdPlayerProps {
  scriptContent: string;
  dimensions: AdConfiguration['dimensions'];
}

const AdPlayer: React.FC<AdPlayerProps> = ({ scriptContent, dimensions }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container && scriptContent) {
      // Clear previous ad content
      container.innerHTML = '';

      // Create a temporary div to parse the scriptContent
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = scriptContent;

      // Append child nodes from tempDiv to the actual container
      while (tempDiv.firstChild) {
        container.appendChild(tempDiv.firstChild);
      }
      
      // Find all script tags within the newly added content and re-execute them
      const scripts = Array.from(container.getElementsByTagName('script'));
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy attributes (src, type, async, etc.)
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy inline script content
        if (oldScript.innerHTML) {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }

        // Add error handling for external scripts
        if (newScript.src) {
            newScript.onerror = () => {
                console.error(`Freetic AdPlayer: Failed to load script with src: ${newScript.src}`);
            };
        }
        
        // Replace the old script tag with the new one to trigger execution
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }

    // Cleanup: remove content when component unmounts or scriptContent changes
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [scriptContent]);

  const adContainerBaseClasses = "mx-auto flex items-center justify-center bg-neutral-900 text-neutral-500 overflow-hidden";
  let adStyle: React.CSSProperties = { maxWidth: '100%' };
  let currentContainerClasses = adContainerBaseClasses;

  const DIMS_MAP: { [key: string]: { width: string; height: string } } = {
    '728x90': { width: '728px', height: '90px' },
    '300x250': { width: '300px', height: '250px' },
    '320x50': { width: '320px', height: '50px' },
  };

  if (dimensions === 'cinematic_16_9') {
    currentContainerClasses += " relative w-full"; 
    adStyle.paddingTop = '56.25%'; // 16:9 aspect ratio
  } else if (dimensions && DIMS_MAP[dimensions as keyof typeof DIMS_MAP]) {
    adStyle.width = DIMS_MAP[dimensions as keyof typeof DIMS_MAP].width;
    adStyle.height = DIMS_MAP[dimensions as keyof typeof DIMS_MAP].height;
  } else { // 'custom' or unrecognized fixed dimensions
    adStyle.width = 'auto'; // Or some default, like 100%
    adStyle.height = 'auto'; // Or some default
    // For 'custom', the script itself should define dimensions or be responsive
  }
  
  // Styles for the inner div that will contain the script
  const innerWrapperStyle: React.CSSProperties = dimensions === 'cinematic_16_9' ? 
    { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } : 
    {};

  return (
    <div className={currentContainerClasses} style={adStyle} aria-live="polite" title="Advertisement Area">
      <div ref={adContainerRef} style={innerWrapperStyle}>
        {/* Script content will be injected here by useEffect */}
        {!scriptContent && (
           <span className="text-xs p-2">
             
           </span>
        )}
      </div>
    </div>
  );
};

export default AdPlayer;