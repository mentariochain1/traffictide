import { useEffect } from 'react';

export const useScrollToTop = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);
};