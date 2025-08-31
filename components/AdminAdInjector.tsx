import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';
import { AdConfiguration } from '../types';
import AdPlayer from './AdPlayer'; // Import the new AdPlayer

interface AdminAdInjectorProps {
  initialConfig: AdConfiguration;
  onSave: (config: AdConfiguration) => void;
}

const AdminAdInjector: React.FC<AdminAdInjectorProps> = ({ initialConfig, onSave }) => {
  const [adScript, setAdScript] = useState(initialConfig.script);
  const [isEnabled, setIsEnabled] = useState(initialConfig.isEnabled);
  const [placement, setPlacement] = useState(initialConfig.placement || 'between_rows');
  const [dimensions, setDimensions] = useState(initialConfig.dimensions || 'cinematic_16_9');
  const [adStartDate, setAdStartDate] = useState(initialConfig.adStartDate || '');
  const [adEndDate, setAdEndDate] = useState(initialConfig.adEndDate || '');
  const { addToast } = useToast();

  useEffect(() => {
    setAdScript(initialConfig.script);
    setIsEnabled(initialConfig.isEnabled);
    setPlacement(initialConfig.placement || 'between_rows');
    setDimensions(initialConfig.dimensions || 'cinematic_16_9');
    setAdStartDate(initialConfig.adStartDate || '');
    setAdEndDate(initialConfig.adEndDate || '');
  }, [initialConfig]);

  const handleSave = () => {
    onSave({ 
      script: adScript, 
      isEnabled, 
      placement: placement as AdConfiguration['placement'], 
      dimensions: dimensions as AdConfiguration['dimensions'],
      adStartDate: adStartDate || undefined,
      adEndDate: adEndDate || undefined,
    });
    addToast('Ad configuration saved!', 'success');
  };

  const exampleScript = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_CLIENT_ID"
     data-ad-slot="YOUR_AD_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
<\/script>`;
  
  const inputClass = "w-full px-3 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-md focus:ring-[var(--netflix-red)] focus:border-[var(--netflix-red)] outline-none";
  const labelClass = "block text-sm font-medium text-[var(--netflix-text-secondary)] mb-1";


  return (
    <div className="bg-[var(--netflix-dark-secondary)] p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-[var(--netflix-red)] mb-4">Ad Injector</h3>
      <p className="text-sm text-[var(--netflix-text-muted)] mb-4">
        Inject ad scripts here. Configure placement, dimensions, and scheduling.
        The "Cinematic (16:9)" dimension will create a responsive container; ensure your ad script can fill it.
        "Between Content Rows" places the ad after the main "All Insights" book list and before any category carousels or the footer.
      </p>

      <div className="mb-4">
        <label htmlFor="adEnabled" className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="adEnabled"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="h-4 w-4 text-[var(--netflix-red)] bg-neutral-700 border-neutral-600 rounded focus:ring-[var(--netflix-red)]"
          />
          <span className="ml-2 text-sm text-[var(--netflix-text-secondary)]">Enable Ads</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label htmlFor="adPlacement" className={labelClass}>Ad Placement</label>
          <select 
            id="adPlacement" 
            value={placement} 
            onChange={(e) => setPlacement(e.target.value as AdConfiguration['placement'])} 
            className={inputClass}
          >
            <option value="after_hero">After Hero Carousel</option>
            <option value="between_rows">Between Content Rows (after "All Insights")</option>
            <option value="before_footer">Before Footer</option>
            <option value="sidebar">Sidebar (Desktop Only)</option>
          </select>
        </div>
        <div>
          <label htmlFor="adDimensions" className={labelClass}>Ad Dimensions</label>
          <select 
            id="adDimensions" 
            value={dimensions} 
            onChange={(e) => setDimensions(e.target.value as AdConfiguration['dimensions'])} 
            className={inputClass}
          >
            <option value="cinematic_16_9">Cinematic (16:9 Responsive)</option>
            <option value="728x90">728x90 (Leaderboard)</option>
            <option value="300x250">300x250 (Medium Rectangle)</option>
            <option value="320x50">320x50 (Mobile Banner)</option>
            <option value="custom">Custom (defined in script)</option>
          </select>
        </div>
      </div>

      <h4 className="text-lg font-medium text-[var(--netflix-red)] mt-6 mb-3 pt-4 border-t border-neutral-700">Scheduling</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label htmlFor="adStartDate" className={labelClass}>Ad Campaign Start (Optional)</label>
          <input 
            type="datetime-local"
            id="adStartDate"
            name="adStartDate"
            value={adStartDate}
            onChange={(e) => setAdStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="adEndDate" className={labelClass}>Ad Campaign End (Optional)</label>
          <input 
            type="datetime-local"
            id="adEndDate"
            name="adEndDate"
            value={adEndDate}
            onChange={(e) => setAdEndDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>


      <div className="mb-4 pt-4 border-t border-neutral-700">
        <label htmlFor="adScript" className={labelClass}>
          Ad Script Code
        </label>
        <textarea
          id="adScript"
          value={adScript}
          onChange={(e) => setAdScript(e.target.value)}
          placeholder={exampleScript}
          rows={10}
          className={`${inputClass} font-mono text-sm`}
          spellCheck="false"
        />
      </div>

      <button
        onClick={handleSave}
        className="primary-action-button px-6 py-2 rounded-md font-semibold"
      >
        Save Ad Configuration
      </button>

      {isEnabled && adScript && dimensions && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-[var(--netflix-text-secondary)] mb-2">Live Ad Preview Area</h4>
          <p className="text-xs text-neutral-500 mb-2">Note: Actual rendering depends on the ad network and script. This is a basic container. Scheduling is not applied in this preview. For 'Cinematic (16:9)', the container below will maintain aspect ratio.</p>
          <AdPlayer 
            scriptContent={adScript} 
            dimensions={dimensions as AdConfiguration['dimensions']} 
          />
        </div>
      )}
    </div>
  );
};

export default AdminAdInjector;