'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const TaskList = dynamic(() => import('../components/TaskList'));
const UserProfile = dynamic(() => import('../components/UserProfile'));
const Leaderboard = dynamic(() => import('../components/Leaderboard'));
const TaskDetail = dynamic(() => import('../components/TaskDetail'));

const pageVariants = {
  initial: { opacity: 0, x: '100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '-100%' },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

export default function Home() {
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateViewportHeight = () => {
      if (window.Telegram?.WebApp) {
        setViewportHeight(`${window.Telegram.WebApp.viewportHeight}px`);
      } else {
        setViewportHeight('100vh');
      }
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);

    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  const renderContent = () => {
    if (pathname === '/' && selectedTaskId === null) {
      return <TaskList onTaskSelect={(taskId) => setSelectedTaskId(taskId)} />;
    }
    
    if (pathname === '/' && selectedTaskId !== null) {
      return <TaskDetail taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {pathname === '/profile' && <UserProfile />}
          {pathname === '/leaderboard' && <Leaderboard />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col text-white min-h-screen" style={{ height: viewportHeight }}>
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
