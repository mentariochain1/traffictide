'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, Star, Award } from 'lucide-react';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { gameConfig } from '@/config/gameConfig';
import { formatNumber } from '@/utils/formatNumber';
import { useColor } from '@/contexts/ColorContext';
import MiniProfile from './MiniProfile';
import TabBar from './TabBar';
import styles from './Leaderboard.module.css';

interface LeaderboardEntry {
  id: number;
  name: string;
  username: string;
  points: number;
  tickets: number;
  socialMedia: {
    instagram?: string;
    twitter?: string;
  };
}

const generateMockData = (): LeaderboardEntry[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    points: Math.floor(Math.random() * 1000) + 500,
    tickets: Math.floor(Math.random() * 50) + 10,
    socialMedia: {
      instagram: Math.random() > 0.5 ? `insta_user${i + 1}` : undefined,
      twitter: Math.random() > 0.5 ? `twitter_user${i + 1}` : undefined,
    },
  }));
};

const Leaderboard: React.FC = () => {
  const { user } = useTelegramUser();
  const { color } = useColor();
  useScrollToTop();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const mockData = generateMockData();
    // Вставляем текущего пользователя в случайную позицию
    const userPosition = Math.floor(Math.random() * 20);
    mockData[userPosition] = {
      id: 0,
      name: user?.first_name || 'Current User',
      username: user?.username || 'current_user',
      points: Math.floor(Math.random() * 1000) + 500,
      tickets: Math.floor(Math.random() * 50) + 10,
      socialMedia: {},
    };
    setLeaderboardData(mockData);
  }, [user]);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => b.tickets - a.tickets);
  }, [leaderboardData]);

  const userEntry = useMemo(() => {
    return sortedLeaderboard.find(entry => entry.id === 0) || sortedLeaderboard[0];
  }, [sortedLeaderboard]);

  const userPosition = useMemo(() => {
    return sortedLeaderboard.findIndex(entry => entry.id === 0) + 1;
  }, [sortedLeaderboard]);

  const handleUserClick = useCallback((entry: LeaderboardEntry) => {
    setSelectedUser(entry);
  }, []);

  if (selectedUser) {
    return (
      <MiniProfile 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        isCurrentUser={selectedUser.id === 0}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LeaderboardHeader userEntry={userEntry} color={color} />
        <UserPosition position={userPosition} color={color} />
        <LeaderboardList 
          entries={sortedLeaderboard.slice(0, gameConfig.leaderboard.displayCount)}
          currentUserId={0}
          onUserClick={handleUserClick}
          color={color}
        />
      </div>
      <TabBar />
    </div>
  );
};

interface LeaderboardHeaderProps {
  userEntry: LeaderboardEntry;
  color: string;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = React.memo(({ userEntry, color }) => (
  <div className={styles.header}>
    <h1 className={styles.title}>Leaderboard</h1>
    <div className={styles.pointsBalance}>
      <Star className={styles.pointsIcon} style={{ stroke: color, fill: `url(#coinGradient-${color})` }} />
      <span className={styles.pointsAmount}>{formatNumber(userEntry.points)}</span>
    </div>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id={`coinGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
    </svg>
  </div>
));

LeaderboardHeader.displayName = 'LeaderboardHeader';

interface UserPositionProps {
  position: number;
  color: string;
}

const UserPosition: React.FC<UserPositionProps> = React.memo(({ position, color }) => (
  <div className={styles.userPosition} style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}15 100%)` }}>
    <Award className={styles.trophyIcon} style={{ color }} />
    <div className={styles.positionInfo}>
      <span className={styles.positionLabel}>Your position</span>
      <span className={styles.positionText}>{position}</span>
    </div>
  </div>
));

UserPosition.displayName = 'UserPosition';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentUserId: number;
  onUserClick: (entry: LeaderboardEntry) => void;
  color: string;
}

const LeaderboardList: React.FC<LeaderboardListProps> = React.memo(({ 
  entries, currentUserId, onUserClick, color 
}) => (
  <ul className={styles.leaderboardList}>
    {entries.map((entry, index) => (
      <LeaderboardItem 
        key={entry.id}
        entry={entry}
        index={index}
        isCurrentUser={entry.id === currentUserId}
        onUserClick={onUserClick}
        color={color}
      />
    ))}
  </ul>
));

LeaderboardList.displayName = 'LeaderboardList';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
  onUserClick: (entry: LeaderboardEntry) => void;
  color: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = React.memo(({ 
  entry, index, isCurrentUser, onUserClick, color 
}) => (
  <li 
    className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUser : ''}`}
    onClick={() => onUserClick(entry)}
    style={isCurrentUser ? { background: `${color}15`, borderColor: `${color}50` } : {}}
  >
    <div className={styles.rank} style={{ color }}>{index + 1}</div>
    <div className={styles.userInfo}>
      <span className={styles.name}>{entry.name}</span>
      <span className={styles.username}>@{entry.username}</span>
    </div>
    <div className={styles.ticketsInfo}>
      <span className={styles.tickets} style={{ color }}>{formatNumber(entry.tickets)}</span>
      <ChevronRight size={20} className={styles.chevron} />
    </div>
  </li>
));

LeaderboardItem.displayName = 'LeaderboardItem';

export default Leaderboard;