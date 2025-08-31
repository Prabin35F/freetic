import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ApkDownloadSectionContent: React.FC = () => (
    <>
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            <span role="img" aria-label="mobile phone icon" className="mr-2">📱</span>
            Download the FREETIC App
        </h3>
        <p className="text-center text-[var(--netflix-text-secondary)] mb-8 max-w-2xl mx-auto">
            Want FREETIC on your phone? Experience the full book journey anytime, anywhere.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side: Instructions */}
            <div className="space-y-4 text-left">
                <div>
                    <h4 className="font-bold text-white mb-1"><span className="text-lg text-[var(--netflix-red)]">Step 1:</span> Message Our Official Number</h4>
                    <p className="text-sm text-[var(--netflix-text-secondary)] md:pl-8">
                        Tap the number below to open WhatsApp.
                    </p>
                    <a
                        href="https://wa.me/9779847419597"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-lg text-[var(--sky-blue)] hover:text-[var(--sky-blue-active)] transition-colors md:pl-8 block"
                    >
                        📞 +977 9847419597
                    </a>
                </div>
                 <div>
                    <h4 className="font-bold text-white mb-1"><span className="text-lg text-[var(--netflix-red)]">Step 2:</span> Request The Secure Link</h4>
                    <p className="text-sm text-[var(--netflix-text-secondary)] md:pl-8">
                        Ask for the “Official APK File.” Our verified owner will send you a private and secure download link.
                    </p>
                </div>
            </div>

            {/* Right side: Security Alert */}
            <div className="border border-red-700/50 bg-red-900/20 p-4 rounded-lg flex items-start gap-3">
                <span className="text-3xl flex-shrink-0 mt-0.5" aria-hidden="true">🚨</span>
                <div>
                    <h5 className="font-bold text-[var(--netflix-red)]">Important Security Alert</h5>
                    <p className="text-sm text-red-300/90 leading-relaxed">
                        Never download the FREETIC app from unofficial websites, random links, or third-party sources. We strongly disallow any unauthorized distribution. Only trust the APK sent directly from our verified WhatsApp number.
                    </p>
                </div>
            </div>
        </div>

        <div className="text-center mt-10">
            <a
                href="https://wa.me/9779847419597?text=Hello!%20I'd%20like%20to%20request%20the%20Official%20FREETIC%20APK%20File."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block primary-action-button px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
                Request APK via WhatsApp
            </a>
        </div>
    </>
);


export const ApkDownloadButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="w-full flex justify-center my-16 px-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="
                        button-shine-effect
                        relative inline-flex items-center justify-center
                        rounded-lg bg-[var(--netflix-red)] hover:bg-[#f40612]
                        px-8 py-4 font-bold text-white text-lg
                        shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50
                        transition-all duration-300 transform hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-400
                    "
                    aria-label="Open APK download instructions"
                >
                    <span className="relative flex items-center gap-3">
                        <span role="img" aria-label="mobile phone icon">📱</span>
                        Download the FREETIC App
                    </span>
                </button>
            </div>

            {isModalOpen && (
                 <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeIn"
                        onClick={() => setIsModalOpen(false)} 
                        aria-hidden="true"
                    ></div>

                    {/* Desktop Modal Container */}
                    <div 
                        role="dialog" 
                        aria-modal="true" 
                        aria-labelledby="apk-download-title"
                        className="hidden md:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-50"
                    >
                         <div className="apk-download-container p-8 md:p-12 rounded-xl relative animate-fadeIn">
                             <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-black/50 rounded-full p-1 z-10"
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-7 h-7" />
                            </button>
                            <div id="apk-download-title" className="sr-only">Download the FREETIC App Instructions</div>
                            <ApkDownloadSectionContent />
                        </div>
                    </div>
                    
                    {/* Mobile Drawer Container */}
                    <div 
                        role="dialog" 
                        aria-modal="true" 
                        aria-labelledby="apk-download-title-mobile"
                        className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--netflix-dark-secondary)] w-full rounded-t-2xl p-6 shadow-2xl animate-slide-up z-50 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="relative">
                             <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute -top-2 -right-2 text-neutral-400 hover:text-white"
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-8 h-8" />
                            </button>
                             <div id="apk-download-title-mobile" className="sr-only">Download the FREETIC App Instructions</div>
                            <ApkDownloadSectionContent />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};