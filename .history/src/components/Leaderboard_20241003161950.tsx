'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Award } from 'lucide-react';
import styles from './Leaderboard.module.css';
import { useTelegramUser } from '../hooks/useTelegramUser';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { gameConfig } from '@/config/gameConfig';
import { formatNumber } from '@/utils/formatNumber';
import MiniProfile from './MiniProfile';
import { useUser } from '@/contexts/UserContext';
import { useColor } from '@/contexts/ColorContext';
import TabBar from './TabBar';

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

const leaderboardData: LeaderboardEntry[] = [
  { id: 1, name: "Emma Johnson", username: "emma_j", points: 1250, tickets: 25, socialMedia: { instagram: "emma_j_insta" } },
  { id: 2, name: "Liam Williams", username: "liam_w", points: 1180, tickets: 23, socialMedia: { twitter: "liam_w_twitter" } },
  { id: 3, name: "Olivia Brown", username: "olivia_b", points: 1150, tickets: 22, socialMedia: { instagram: "olivia_b_insta" } },
  { id: 4, name: "Noah Davis", username: "noah_d", points: 1100, tickets: 21, socialMedia: { twitter: "noah_d_twitter" } },
  { id: 5, name: "Ava Wilson", username: "ava_w", points: 1050, tickets: 20, socialMedia: { instagram: "ava_w_insta" } },
  { id: 6, name: "Sophia Taylor", username: "sophia_t", points: 1000, tickets: 19, socialMedia: { twitter: "sophia_t_twitter" } },
  { id: 7, name: "Jackson Anderson", username: "jackson_a", points: gameConfig.initialPoints, tickets: gameConfig.initialTickets, socialMedia: { instagram: "jackson_a_insta" } },
  { id: 8, name: "Isabella Thomas", username: "isabella_t", points: 900, tickets: 17, socialMedia: { twitter: "isabella_t_twitter" } },
  { id: 9, name: "Lucas White", username: "lucas_w", points: 850, tickets: 16, socialMedia: { instagram: "lucas_w_insta" } },
  { id: 10, name: "Mia Harris", username: "mia_h", points: 800, tickets: 15, socialMedia: { twitter: "mia_h_twitter" } },
];

const Leaderboard: React.FC = () => {
  const { user } = useTelegramUser();
  const { userTickets } = useUser();
  const { color } = useColor();
  useScrollToTop();
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [sortedLeaderboard, setSortedLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const updatedLeaderboard = [...leaderboardData];
    if (user?.username) {
      const userIndex = updatedLeaderboard.findIndex(entry => entry.id === 7);
      if (userIndex !== -1) {
        updatedLeaderboard[userIndex] = {
          ...updatedLeaderboard[userIndex],
          username: user.username,
          tickets: userTickets
        };
      }
    }
    const sorted = updatedLeaderboard.sort((a, b) => b.tickets - a.tickets);
    setSortedLeaderboard(sorted);
  }, [user, userTickets]);

  const userEntry = user?.username 
    ? sortedLeaderboard.find(entry => entry.username === user.username) || leaderboardData[6]
    : leaderboardData[6];
  const userPosition = sortedLeaderboard.findIndex(entry => entry.id === userEntry.id) + 1;

  const userName = user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : userEntry.name;

  const handleUserClick = (entry: LeaderboardEntry) => {
    setSelectedUser(entry);
  };

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
          <h1 className={styles.title}>Leaderboard</h1>
          <div className={styles.pointsBalance}>
            <Star className={styles.pointsIcon} style={{ stroke: color, fill: 'url(#coinGradient)' }} />
            <span className={styles.pointsAmount}>{formatNumber(userEntry.points)}</span>
          </div>
        </div>
        <div className={styles.userPosition} style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}15 100%)` }}>
          <Award className={styles.trophyIcon} style={{ color: color }} />
          <div className={styles.positionInfo}>
            <span className={styles.positionLabel}>Your position</span>
            <span className={styles.positionText}>{userPosition}</span>
          </div>
        </div>
        <ul className={styles.leaderboardList}>
          {sortedLeaderboard.slice(0, gameConfig.leaderboard.displayCount).map((entry, index) => (
            <li 
              key={entry.id} 
              className={`${styles.leaderboardItem} ${entry.id === userEntry.id ? styles.currentUser : ''}`}
              onClick={() => handleUserClick(entry)}
              style={entry.id === userEntry.id ? { background: `${color}15`, borderColor: `${color}50` } : {}}
            >
              <div className={styles.rank} style={{ color: color }}>{index + 1}</div>
              <div className={styles.userInfo}>
                <span className={styles.name}>{entry.id === userEntry.id ? userName : entry.name}</span>
                <span className={styles.username}>@{entry.id === userEntry.id ? userEntry.username : entry.username}</span>
              </div>
              <div className={styles.ticketsInfo}>
                <span className={styles.tickets} style={{ color: color }}>{formatNumber(entry.tickets)}</span>
                <ChevronRight size={20} className={styles.chevron} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <TabBar activeTab="leaderboard" onTabChange={() => {}} />
    </div>
  );
};

export default Leaderboard;