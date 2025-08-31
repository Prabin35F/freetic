import React from 'react';

const SupplyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--netflix-dark)] text-white">
      <header className="px-4 md:px-8 pt-6 pb-4 text-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold premium-title-red animate-slogan">Freetic Supply</h1>
        <div className="slogan-underline" />
        <p className="text-md text-[var(--netflix-text-secondary)] mt-4 max-w-2xl mx-auto animate-slogan" style={{ animationDelay: '0.4s' }}>
            Exclusive merchandise for the thinkers and seekers. All transactions are securely handled by Printify.
        </p>
      </header>
      <div className="w-full p-4 md:px-6 md:pb-6 pt-0">
        <iframe
          src="https://freetic.printify.me/all"
          title="Freetic Supply Store"
          className="w-full h-[250vh] border-2 border-neutral-800 rounded-lg shadow-2xl"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default SupplyPage;