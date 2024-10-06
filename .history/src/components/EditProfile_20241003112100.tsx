import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, Twitter, Palette } from 'lucide-react';
import Image from 'next/image';
import styles from './EditProfile.module.css';
import { getTelegramWebApp, triggerHapticFeedback } from '@/utils/telegramWebApp';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useColor } from '@/contexts/ColorContext';

interface SocialAccounts {
  instagram: string;
  twitter: string;
  tiktok: string;
  phantom: string;
  avatarBorderColor: string;
}

interface EditProfileProps {
  onClose: (data: SocialAccounts) => void;
  initialData: SocialAccounts;
}

const EditProfile: React.FC<EditProfileProps> = ({ onClose, initialData }) => {
  useScrollToTop();
  const { color, setColor } = useColor();

  const [instagram, setInstagram] = useState(initialData.instagram);
  const [twitter, setTwitter] = useState(initialData.twitter);
  const [tiktok, setTiktok] = useState(initialData.tiktok);
  const [phantom, setPhantom] = useState(initialData.phantom);

  const shouldUseDarkText = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const textColor = shouldUseDarkText(color) ? '#000000' : '#FFFFFF';

  const handleSave = useCallback(() => {
    console.log('Saved:', { instagram, twitter, tiktok, phantom, avatarBorderColor: color });
    triggerHapticFeedback('impact', 'medium');
    onClose({ instagram, twitter, tiktok, phantom, avatarBorderColor: color });
  }, [instagram, twitter, tiktok, phantom, color, onClose]);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleSave);

      webApp.MainButton.text = "Save Profile";
      webApp.MainButton.color = color;
      webApp.MainButton.textColor = textColor;
      webApp.MainButton.show();
      webApp.MainButton.onClick(handleSave);
    }

    window.scrollTo(0, 0);
    
    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(handleSave);
        webApp.MainButton.hide();
        webApp.MainButton.offClick(handleSave);
      }
    };
  }, [handleSave, color, textColor]);

  const handleInputFocus = () => {
    triggerHapticFeedback('impact', 'light');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <Instagram size={24} />
          </div>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Instagram username"
            className={styles.input}
            autoCapitalize="none"
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <Twitter size={24} />
          </div>
          <input
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Twitter username"
            className={styles.input}
            autoCapitalize="none"
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <TikTokIcon />
          </div>
          <input
            type="text"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="TikTok username"
            className={styles.input}
            autoCapitalize="none"
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <PhantomIcon />
          </div>
          <input
            type="text"
            value={phantom}
            onChange={(e) => setPhantom(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Phantom wallet address"
            className={styles.input}
            autoCapitalize="none"
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <Palette size={24} color={color} />
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              const webApp = getTelegramWebApp();
              if (webApp) {
                webApp.MainButton.color = e.target.value;
                webApp.MainButton.textColor = shouldUseDarkText(e.target.value) ? '#000000' : '#FFFFFF';
              }
            }}
            onFocus={handleInputFocus}
            className={styles.colorInput}
          />
          <span className={styles.colorLabel}>Avatar Border Color</span>
        </div>
      </main>
    </div>
  );
};

const TikTokIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

const PhantomIcon: React.FC = () => (
  <Image src="/assets/phantom.svg" alt="Phantom" width={24} height={24} />
);

export default EditProfile;