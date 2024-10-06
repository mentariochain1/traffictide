import { useEffect } from 'react';

interface ScrollToTopProps {
  children: React.ReactNode;
  activeTab: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children, activeTab }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return <>{children}</>;
};

export default ScrollToTop;