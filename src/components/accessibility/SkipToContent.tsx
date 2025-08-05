import React from 'react';

/**
 * Skip to content link for screen reader accessibility
 * Should be the first interactive element on the page
 */
export const SkipToContent: React.FC = () => {
  const handleSkip = (): void => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
};