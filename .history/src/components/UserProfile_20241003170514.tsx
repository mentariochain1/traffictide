'use client';

import React, { useState } from 'react';
import { Instagram, Twitter, ChevronRight, Star, Ticket } from 'lucide-react';
import Image from 'next/image';
import { useTelegramUser } from '../hooks/useTelegramUser';
import styles from './UserProfile.module.css';
import EditProfile from '@/components/EditProfile';
import PointsExchange from '@/components/PointsExchange';
import { gameConfig } from '@/config/gameConfig';
import { formatNumber } from '@/utils/formatNumber';
import { useColor } from '@/contexts/ColorContext';
import TabBar from './TabBar';

interface SocialAccounts {
  instagram: string;
  twitter: string;
  tiktok: string;
  phantom: string;
  avatarBorderColor: string;
}

const UserProfile: React.FC = () => {
  const { user } = useTelegramUser();
  const [isEditing, setIsEditing] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccounts>({
    instagram: '',
    twitter: '',
    tiktok: '',
    phantom: '',
    avatarBorderColor: '',
  });
  const [points, setPoints] = useState(gameConfig.initialPoints);
  const [tickets, setTickets] = useState(gameConfig.initialTickets);
  const { color, setColor } = useColor();

  const getAvatarUrl = (userId: string) => {
    const backgroundColors = [
      'b6e3f4', 'd1c4e9', 'ffcdd2', 'c8e6c9', 'fff9c4', 'f0f4c3', 'e1bee7', 'ffccbc'
    ];
    const colorIndex = parseInt(userId) % backgroundColors.length;
    const backgroundColor = backgroundColors[colorIndex];
    return `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${userId}&backgroundColor=${backgroundColor}`;
  };

  if (!user) return null;

  const telegramName = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
  const telegramUsername = user.username ? `@${user.username}` : '';

  const handleEditClose = (data: SocialAccounts) => {
    setSocialAccounts(data);
    setColor(data.avatarBorderColor);
    setIsEditing(false);
  };

  const handleExchange = (pointsSpent: number, ticketsEarned: number) => {
    setPoints(prevPoints => prevPoints - pointsSpent);
    setTickets(prevTickets => prevTickets + ticketsEarned);
  };

  const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  };

  const shouldUseDarkText = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const textColor = shouldUseDarkText(color) ? '#000000' : '#FFFFFF';

  if (isEditing) {
    return <EditProfile onClose={handleEditClose} initialData={socialAccounts} />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.scrollContainer}>
        <div 
          className={styles.gradientOverlay} 
          style={{ 
            background: `linear-gradient(to bottom, #000000 0%, ${color}80 100%)`
          }}
        >
          <div className={styles.header}>
            <div className={styles.avatarContainer}>
              <div 
                className={styles.avatarBorder} 
                style={{ 
                  '--avatar-color-1': color,
                  '--avatar-color-2': adjustColor(color, 30)
                } as React.CSSProperties}
              ></div>
              <div className={styles.avatarInner}>
                <Image
                  src={getAvatarUrl(user.id.toString())}
                  alt="User Avatar"
                  layout="fill"
                  className={styles.avatar}
                  unoptimized
                />
              </div>
            </div>
            <h1 className={styles.name}>{telegramName}</h1>
            {telegramUsername && <p className={styles.username}>{telegramUsername}</p>}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <Star className={styles.statIcon} style={{ color: color }} />
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{formatNumber(points)}</span>
                <span className={styles.statLabel}>Points</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <Ticket className={styles.statIcon} style={{ color: color }} />
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{formatNumber(tickets)}</span>
                <span className={styles.statLabel}>Tickets</span>
              </div>
            </div>
          </div>

          <div className={styles.exchangeContainer}>
            <PointsExchange userPoints={points} onExchange={handleExchange} />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle} style={{ '--accent-color': color } as React.CSSProperties}>
              Connected Accounts
            </h2>
            <ul className={styles.connectionsList}>
              <ConnectionItem 
                icon={<Instagram size={24} />} 
                label="Instagram" 
                username={socialAccounts.instagram || 'Not connected'} 
              />
              <ConnectionItem 
                icon={<Twitter size={24} />} 
                label="X (Twitter)" 
                username={socialAccounts.twitter || 'Not connected'} 
              />
              <ConnectionItem 
                icon={<TikTokIcon />} 
                label="TikTok" 
                username={socialAccounts.tiktok || 'Not connected'} 
              />
              <ConnectionItem 
                icon={<PhantomIcon />} 
                label="Phantom Wallet" 
                username={socialAccounts.phantom || 'Not connected'} 
              />
            </ul>
          </div>

          <button 
            className={styles.editButton} 
            onClick={() => setIsEditing(true)}
            style={{ backgroundColor: color, color: textColor }}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <TabBar activeTab="profile" onTabChange={() => {}} />
    </div>
  );
};

interface ConnectionItemProps {
  icon: React.ReactNode;
  label: string;
  username: string;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ icon, label, username }) => (
  <li className={styles.connectionItem}>
    <div className={styles.connectionIcon}>{icon}</div>
    <div className={styles.connectionInfo}>
      <span className={styles.connectionLabel}>{label}</span>
      <span className={styles.connectionUsername}>{username}</span>
    </div>
    <ChevronRight size={20} className={styles.chevronIcon} />
  </li>
);

const TikTokIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

const PhantomIcon: React.FC = () => (
  <Image src="/assets/phantom.svg" alt="Phantom" width={24} height={24} />
);

export default UserProfile;