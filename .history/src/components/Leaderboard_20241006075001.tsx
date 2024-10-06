'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, Star, Award } from 'lucide-react';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { gameConfig } from '@/config/gameConfig';
import { formatNumber } from '@/utils/formatNumber';
import { useUser } from '@/contexts/UserContext';
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

const Leaderboard: React.FC = () => {
  const { user } = useTelegramUser();
  const { userTickets } = useUser();
  const { color } = useColor();
  useScrollToTop();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call
    const mockLeaderboardData: LeaderboardEntry[] = [
      { id: 1, name: "Emma Johnson", username: "emma_j", points: 1250, tickets: 25, socialMedia: { instagram: "emma_j_insta" } },
      { id: 2, name: "Liam Williams", username: "liam_w", points: 1180, tickets: 23, socialMedia: { twitter: "liam_w_twitter" } },
      // ... (other entries)
    ];
    setLeaderboardData(mockLeaderboardData);
  }, []);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => b.tickets - a.tickets);
  }, [leaderboardData]);

  const userEntry = useMemo(() => {
    if (!user?.username) return leaderboardData[6]; // Default entry if user is not found
    return sortedLeaderboard.find(entry => entry.username === user.username) || leaderboardData[6];
  }, [user, sortedLeaderboard, leaderboardData]);

  const userPosition = useMemo(() => {
    return sortedLeaderboard.findIndex(entry => entry.id === userEntry.id) + 1;
  }, [sortedLeaderboard, userEntry]);

  const userName = useMemo(() => {
    return user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : userEntry.name;
  }, [user, userEntry]);

  const handleUserClick = useCallback((entry: LeaderboardEntry) => {
    setSelectedUser(entry);
  }, []);

  if (selectedUser) {
    return (
      <MiniProfile 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
        isCurrentUser={selectedUser.id === userEntry.id}
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
          currentUser={userEntry}
          userName={userName}
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
  currentUser: LeaderboardEntry;
  userName: string;
  onUserClick: (entry: LeaderboardEntry) => void;
  color: string;
}

const LeaderboardList: React.FC<LeaderboardListProps> = React.memo(({ 
  entries, currentUser, userName, onUserClick, color 
}) => (
  <ul className={styles.leaderboardList}>
    {entries.map((entry, index) => (
      <LeaderboardItem 
        key={entry.id}
        entry={entry}
        index={index}
        isCurrentUser={entry.id === currentUser.id}
        userName={userName}
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
  userName: string;
  onUserClick: (entry: LeaderboardEntry) => void;
  color: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = React.memo(({ 
  entry, index, isCurrentUser, userName, onUserClick, color 
}) => (
  <li 
    className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUser : ''}`}
    onClick={() => onUserClick(entry)}
    style={isCurrentUser ? { background: `${color}15`, borderColor: `${color}50` } : {}}
  >
    <div className={styles.rank} style={{ color }}>{index + 1}</div>
    <div className={styles.userInfo}>
      <span className={styles.name}>{isCurrentUser ? userName : entry.name}</span>
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