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

const generateMockData = (currentUser: { first_name: string; username: string }): LeaderboardEntry[] => {
  const names = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina'
  ];

  return names.map((name, index) => ({
    id: index + 1,
    name: name,
    username: `user_${name.toLowerCase()}`,
    points: Math.floor(Math.random() * 1000) + 500,
    tickets: Math.floor(Math.random() * 50) + 10,
    socialMedia: {
      instagram: Math.random() > 0.5 ? `insta_${name.toLowerCase()}` : undefined,
      twitter: Math.random() > 0.5 ? `twitter_${name.toLowerCase()}` : undefined,
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
    if (user) {
      const mockData = generateMockData({ first_name: user.first_name, username: user.username || '' });
      const userEntry: LeaderboardEntry = {
        id: 0,
        name: user.first_name,
        username: user.username || 'current_user',
        points: Math.floor(Math.random() * 1000) + 500,
        tickets: Math.floor(Math.random() * 50) + 10,
        socialMedia: {},
      };
      const userPosition = Math.floor(Math.random() * 20);
      mockData.splice(userPosition, 0, userEntry);
      setLeaderboardData(mockData);
    }
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
        {userEntry && <UserPosition position={userPosition} color={color} />}
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
  userEntry: LeaderboardEntry | undefined;
  color: string;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = React.memo(({ userEntry, color }) => (
  <div className={styles.header}>
    <h1 className={styles.title}>Leaderboard</h1>
    <div className={styles.pointsBalance}>
      <Star className={styles.pointsIcon} style={{ stroke: color, fill: `url(#coinGradient-${color})` }} />
      <span className={styles.pointsAmount}>{formatNumber(userEntry?.points ?? 0)}</span>
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