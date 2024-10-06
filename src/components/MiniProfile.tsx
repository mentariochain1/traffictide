'use client';

import React, { useEffect } from 'react';
import { Star, Ticket, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import styles from './MiniProfile.module.css';
import { formatNumber } from '@/utils/formatNumber';
import { getTelegramWebApp } from '@/utils/telegramWebApp';
import { useColor } from '@/contexts/ColorContext';
import { useTelegramUser } from '../hooks/useTelegramUser';

interface MiniProfileProps {
  user: {
    id: number;
    name: string;
    username: string;
    points: number;
    tickets: number;
    socialMedia: {
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    };
  };
  onClose: () => void;
  isCurrentUser: boolean;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ user, onClose, isCurrentUser }) => {
  const { color } = useColor();
  const { user: telegramUser } = useTelegramUser();

  const getAvatarUrl = (userId: string) => {
    const backgroundColors = [
      'b6e3f4', 'd1c4e9', 'ffcdd2', 'c8e6c9', 'fff9c4', 'f0f4c3', 'e1bee7', 'ffccbc'
    ];
    const colorIndex = parseInt(userId) % backgroundColors.length;
    const backgroundColor = backgroundColors[colorIndex];
    return `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${userId}&backgroundColor=${backgroundColor}`;
  };

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClose);
    }

    return () => {
      if (webApp) {
        webApp.BackButton.offClick(onClose);
        webApp.BackButton.hide();
      }
    };
  }, [onClose]);

  const handleSocialMediaClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const displayName = isCurrentUser && telegramUser 
    ? `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`
    : user.name;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <div 
            className={styles.avatarBorder} 
            style={{ 
              '--avatar-color-1': color,
              '--avatar-color-2': color
            } as React.CSSProperties}
          ></div>
          <div className={styles.avatarInner}>
            <Image
              src={isCurrentUser && telegramUser ? getAvatarUrl(telegramUser.id.toString()) : getAvatarUrl(user.id.toString())}
              alt={displayName}
              layout="fill"
              className={styles.avatar}
              unoptimized
            />
          </div>
        </div>
        <h2 className={styles.name}>{displayName}</h2>
        <p className={styles.username}>@{user.username}</p>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <Star className={styles.statIcon} style={{ color: color }} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{formatNumber(user.points)}</span>
            <span className={styles.statLabel}>Points</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Ticket className={styles.statIcon} style={{ color: color }} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{formatNumber(user.tickets)}</span>
            <span className={styles.statLabel}>Tickets</span>
          </div>
        </div>
      </div>
      {isCurrentUser && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ '--accent-color': color } as React.CSSProperties}>
            Connected Accounts
          </h2>
          <ul className={styles.connectionsList}>
            <ConnectionItem 
              icon={<Instagram size={24} />} 
              label="Instagram" 
              username={user.socialMedia.instagram || 'Not connected'} 
              onClick={() => handleSocialMediaClick(`https://instagram.com/${user.socialMedia.instagram}`)}
            />
            <ConnectionItem 
              icon={<Twitter size={24} />} 
              label="X (Twitter)" 
              username={user.socialMedia.twitter || 'Not connected'} 
              onClick={() => handleSocialMediaClick(`https://twitter.com/${user.socialMedia.twitter}`)}
            />
            <ConnectionItem 
              icon={<TikTokIcon />} 
              label="TikTok" 
              username={user.socialMedia.tiktok || 'Not connected'} 
              onClick={() => handleSocialMediaClick(`https://tiktok.com/@${user.socialMedia.tiktok}`)}
            />
          </ul>
        </div>
      )}
    </div>
  );
};

interface ConnectionItemProps {
  icon: React.ReactNode;
  label: string;
  username: string;
  onClick: () => void;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ icon, label, username, onClick }) => (
  <li className={styles.connectionItem} onClick={onClick}>
    <div className={styles.connectionIcon}>{icon}</div>
    <div className={styles.connectionInfo}>
      <span className={styles.connectionLabel}>{label}</span>
      <span className={styles.connectionUsername}>{username}</span>
    </div>
  </li>
);

const TikTokIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

export default MiniProfile;