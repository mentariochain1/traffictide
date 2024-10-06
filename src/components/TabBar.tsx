'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { ListTodo, Trophy, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useColor } from '@/contexts/ColorContext';
import { triggerHapticFeedback } from '@/utils/telegramWebApp';
import styles from './TabBar.module.css';

interface TabConfig {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const TabBar: React.FC = () => {
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { color } = useColor();

  const tabs: TabConfig[] = useMemo(() => [
    { key: 'tasks', icon: <ListTodo size={24} />, label: 'Tasks', path: '/' },
    { key: 'leaderboard', icon: <Trophy size={24} />, label: 'Leaderboard', path: '/leaderboard' },
    { key: 'profile', icon: <User size={24} />, label: 'Profile', path: '/profile' },
  ], []);

  const smoothScrollToTop = useCallback(() => {
    const scrollableElement = document.querySelector('main') || document.documentElement;
    scrollableElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTabClick = useCallback((tab: TabConfig) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === tab.path) {
      smoothScrollToTop();
      triggerHapticFeedback('impact', 'medium');
    } else {
      router.push(tab.path);
      triggerHapticFeedback('impact', 'light');
    }
  }, [pathname, router, smoothScrollToTop]);

  const shouldUseDarkText = useCallback((color: string | null | undefined): boolean => {
    if (!color || typeof color !== 'string' || color.length < 7) return true;
    const hex = color.replace(/^#/, '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return true;
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }, []);

  const textColor = useMemo(() => shouldUseDarkText(color) ? '#000000' : '#FFFFFF', [color, shouldUseDarkText]);

  return (
    <nav className={styles.tabBar}>
      <div className={styles.tabBarContent}>
        {tabs.map((tab, index) => (
          <Link
            key={tab.key}
            href={tab.path}
            className={`${styles.tabBarItem} ${pathname === tab.path ? styles.active : ''}`}
            onClick={handleTabClick(tab)}
            ref={(el: HTMLAnchorElement | null) => {
              tabRefs.current[index] = el;
            }}
            style={pathname === tab.path ? { 
              '--active-color': color,
              '--text-color': textColor
            } as React.CSSProperties : {}}
          >
            <motion.div 
              className={styles.tabBarItemContent}
              initial={false}
              animate={{ 
                y: pathname === tab.path ? -4 : 0,
                scale: pathname === tab.path ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className={styles.tabBarIcon}>{tab.icon}</span>
              <span className={styles.tabBarLabel}>{tab.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;