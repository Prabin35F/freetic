import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import AdPlayer from './AdPlayer';

const PreFooterAdPlaceholder: React.FC = () => {
  const { adConfig } = useAppContext();

  const shouldDisplay = useMemo(() => {
    if (!adConfig.isEnabled || !adConfig.script || adConfig.placement !== 'before_footer') {
      return false;
    }
    const now = new Date();
    const startDate = adConfig.adStartDate ? new Date(adConfig.adStartDate) : null;
    const endDate = adConfig.adEndDate ? new Date(adConfig.adEndDate) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  }, [adConfig]);

  if (!shouldDisplay) {
    return null;
  }
  
  return (
    <div className="w-full container mx-auto px-4 md:px-8 my-12">
      <h3 className="text-center text-sm text-neutral-500 mb-2 uppercase tracking-wider">Advertisement</h3>
      <AdPlayer 
        scriptContent={adConfig.script} 
        dimensions={adConfig.dimensions || 'cinematic_16_9'}
      />
    </div>
  );
};

export default PreFooterAdPlaceholder;