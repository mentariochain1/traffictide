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

const Leaderboard: React.FC = () => {
  const { user } = useTelegramUser();
  const { color } = useColor();
  useScrollToTop();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // Здесь должен быть API запрос для получения данных лидерборда
    // Для примера используем моковые данные
    const mockData: LeaderboardEntry[] = [
      { id: 1, name: "Emma Johnson", username: "emma_j", points: 1250, tickets: 25, socialMedia: { instagram: "emma_j_insta" } },
      { id: 2, name: "Liam Williams", username: "liam_w", points: 1180, tickets: 23, socialMedia: { twitter: "liam_w_twitter" } },
      { id: 3, name: "Olivia Brown", username: "olivia_b", points: 1150, tickets: 22, socialMedia: { instagram: "olivia_b_insta" } },
      { id: 4, name: "Noah Davis", username: "noah_d", points: 1100, tickets: 21, socialMedia: { twitter: "noah_d_twitter" } },
      { id: 5, name: "Ava Wilson", username: "ava_w", points: 1050, tickets: 20, socialMedia: { instagram: "ava_w_insta" } },
      { id: 6, name: "Sophia Taylor", username: "sophia_t", points: 1000, tickets: 19, socialMedia: { twitter: "sophia_t_twitter" } },
      { id: 7, name: "Jackson Anderson", username: "jackson_a", points: 950, tickets: 18, socialMedia: { instagram: "jackson_a_insta" } },
      { id: 8, name: "Isabella Thomas", username: "isabella_t", points: 900, tickets: 17, socialMedia: { twitter: "isabella_t_twitter" } },
      { id: 9, name: "Lucas White", username: "lucas_w", points: 850, tickets: 16, socialMedia: { instagram: "lucas_w_insta" } },
      { id: 10, name: "Mia Harris", username: "mia_h", points: 800, tickets: 15, socialMedia: { twitter: "mia_h_twitter" } },
    ];

    if (user) {
      const userEntry: LeaderboardEntry = {
        id: 0,
        name: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
        username: user.username || 'current_user',
        points: gameConfig.initialPoints,
        tickets: gameConfig.initialTickets,
        socialMedia: {},
      };
      mockData.push(userEntry);
    }

    setLeaderboardData(mockData);
  }, [user]);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => b.tickets - a.tickets);
  }, [leaderboardData]);

  const userEntry = useMemo(() => {
    return sortedLeaderboard.find(entry => entry.id === 0);
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
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <div className={styles.pointsBalance}>
            <Star className={styles.pointsIcon} style={{ stroke: color, fill: `url(#coinGradient)` }} />
            <span className={styles.pointsAmount}>{formatNumber(userEntry?.points ?? 0)}</span>
          </div>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {userEntry && (
          <div className={styles.userPosition} style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}15 100%)` }}>
            <Award className={styles.trophyIcon} style={{ color }} />
            <div className={styles.positionInfo}>
              <span className={styles.positionLabel}>Your position</span>
              <span className={styles.positionText}>{userPosition}</span>
            </div>
          </div>
        )}
        <ul className={styles.leaderboardList}>
          {sortedLeaderboard.map((entry, index) => (
            <li 
              key={entry.id}
              className={`${styles.leaderboardItem} ${entry.id === 0 ? styles.currentUser : ''}`}
              onClick={() => handleUserClick(entry)}
              style={entry.id === 0 ? { background: `${color}15`, borderColor: `${color}50` } : {}}
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
          ))}
        </ul>
      </div>
      <TabBar />
    </div>
  );
};

export default Leaderboard;