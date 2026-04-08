import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 47.9375rem)');
    const tabletQuery = window.matchMedia('(min-width: 48rem) and (max-width: 64rem)');
    const desktopQuery = window.matchMedia('(min-width: 64.0625rem)');

    const updateMatches = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    updateMatches();

    mobileQuery.addEventListener('change', updateMatches);
    tabletQuery.addEventListener('change', updateMatches);
    desktopQuery.addEventListener('change', updateMatches);

    return () => {
      mobileQuery.removeEventListener('change', updateMatches);
      tabletQuery.removeEventListener('change', updateMatches);
      desktopQuery.removeEventListener('change', updateMatches);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};
