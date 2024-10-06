'use client';

import React, { useRef } from 'react';
import { ListTodo, Trophy, User } from 'lucide-react';
import styles from './TabBar.module.css';
import { triggerHapticFeedback } from '@/utils/telegramWebApp';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useColor } from '@/contexts/ColorContext';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab }) => {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { color } = useColor();

  const smoothScrollToTop = () => {
    const scrollableElement = document.querySelector('main') || document.documentElement;
    scrollableElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleTabClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === tab) {
      smoothScrollToTop();
      triggerHapticFeedback('impact', 'medium');
    } else {
      router.push(`/${tab === 'tasks' ? '' : tab}`);
      triggerHapticFeedback('impact', 'light');
    }
  };

  const shouldUseDarkText = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const textColor = shouldUseDarkText(color) ? '#000000' : '#FFFFFF';

  return (
    <nav className={styles.tabBar}>
      <div className={styles.tabBarContent}>
        {['tasks', 'leaderboard', 'profile'].map((tab, index) => (
          <Link
            key={tab}
            href={`/${tab === 'tasks' ? '' : tab}`}
            className={`${styles.tabBarItem} ${pathname === `/${tab === 'tasks' ? '' : tab}` ? styles.active : ''}`}
            onClick={handleTabClick(tab)}
            ref={(el) => {
              if (el) tabRefs.current[index] = el;
            }}
            style={pathname === `/${tab === 'tasks' ? '' : tab}` ? { 
              '--active-color': color,
              '--text-color': textColor
            } as React.CSSProperties : {}}
          >
            <motion.div 
              className={styles.tabBarItemContent}
              initial={false}
              animate={{ 
                y: pathname === `/${tab === 'tasks' ? '' : tab}` ? -4 : 0,
                scale: pathname === `/${tab === 'tasks' ? '' : tab}` ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className={styles.tabBarIcon}>
                {tab === 'tasks' ? <ListTodo size={24} /> : tab === 'leaderboard' ? <Trophy size={24} /> : <User size={24} />}
              </span>
              <span className={styles.tabBarLabel}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;