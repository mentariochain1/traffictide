'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, CheckCircle, X } from 'lucide-react';
import styles from './TaskList.module.css';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { gameConfig } from '@/config/gameConfig';
import { formatNumber } from '@/utils/formatNumber';
import { useColor } from '@/contexts/ColorContext';
import TabBar from '@/components/TabBar';

interface Task {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  type: 'daily' | 'weekly';
}

interface TaskListProps {
  onTaskSelect: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  useScrollToTop();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPromo, setShowPromo] = useState(true);
  const [userPoints] = useState(gameConfig.initialPoints);
  const { color } = useColor();

  useEffect(() => {
    // Here should be an API request to get the list of tasks
    // For example, we use mock data
    setTasks([
      { id: 1, title: 'Complete profile', points: 100, completed: true, type: 'daily' },
      { id: 2, title: 'Connect social media', points: 200, completed: false, type: 'daily' },
      { id: 3, title: 'Invite 3 friends', points: 300, completed: false, type: 'weekly' },
      { id: 4, title: 'Make first post', points: 150, completed: false, type: 'daily' },
      { id: 5, title: 'Complete 5 daily tasks', points: 250, completed: false, type: 'weekly' },
      { id: 6, title: 'Share app with friends', points: 180, completed: false, type: 'daily' },
      { id: 7, title: 'Complete a survey', points: 120, completed: false, type: 'weekly' },
      { id: 8, title: 'Watch tutorial video', points: 90, completed: false, type: 'daily' },
      { id: 9, title: 'Rate the app', points: 110, completed: false, type: 'weekly' },
      { id: 10, title: 'Join community chat', points: 130, completed: false, type: 'weekly' },
    ]);
  }, []);

  const dailyTasks = tasks.filter(task => task.type === 'daily');
  const weeklyTasks = tasks.filter(task => task.type === 'weekly');

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;

  const renderTaskList = (taskList: Task[], title: string) => (
    <div className={styles.taskSection}>
      <h2 className={styles.sectionTitle} style={{ '--accent-color': color } as React.CSSProperties}>{title}</h2>
      <ul className={styles.taskList}>
        {taskList.map(task => (
          <li key={task.id} className={styles.taskItem} onClick={() => onTaskSelect(task.id)}>
            <div className={styles.taskInfo}>
              <span className={styles.taskTitle}>{task.title}</span>
              <div className={styles.taskMeta}>
                <span className={styles.taskPoints} style={{ color: color }}>{task.points}</span>
                {task.completed ? (
                  <CheckCircle className={styles.completedIcon} style={{ color: color }} />
                ) : (
                  <ChevronRight className={styles.chevron} />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.scrollContainer}>
        <div className={styles.content}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.header}>
            <h1 className={styles.title}>Tasks</h1>
            <div className={styles.pointsBalance}>
              <Star className={styles.pointsIcon} style={{ stroke: color, fill: 'url(#coinGradient)' }} />
              <span className={styles.pointsAmount}>{formatNumber(userPoints)}</span>
            </div>
          </div>
          {showPromo && (
            <div className={styles.promoContainer} style={{ 
              background: `linear-gradient(135deg, ${color}20 0%, ${color}20 100%)`,
              borderColor: `${color}50`
            }}>
              <Star className={styles.promoIcon} style={{ color: color }} />
              <p className={styles.promoText}>Complete tasks to earn points and climb the leaderboard!</p>
              <button className={styles.closePromo} onClick={() => setShowPromo(false)}>
                <X size={16} />
              </button>
            </div>
          )}
          <div className={styles.progressContainer}>
            <div className={styles.progressInfo}>
              <span className={styles.progressText}>Your progress</span>
              <span className={styles.progressPercentage}>{completedTasks}/{totalTasks}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${color}, ${color})`
                }}
              ></div>
            </div>
          </div>
          {renderTaskList(dailyTasks, 'Daily Tasks')}
          {renderTaskList(weeklyTasks, 'Weekly Tasks')}
        </div>
      </div>
      <TabBar activeTab="tasks" onTabChange={() => {}} />
    </div>
  );
};

export default TaskList;