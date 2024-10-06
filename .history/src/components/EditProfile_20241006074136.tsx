import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Instagram, Twitter, Palette } from 'lucide-react';
import Image from 'next/image';
import { getTelegramWebApp, triggerHapticFeedback } from '@/utils/telegramWebApp';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useColor } from '@/contexts/ColorContext';
import styles from './EditProfile.module.css';

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
  const { setColor } = useColor();

  const [formData, setFormData] = useState<SocialAccounts>(initialData);

  const shouldUseDarkText = useCallback((color: string | null | undefined): boolean => {
    if (!color || typeof color !== 'string') return true;
    const hex = color.replace(/^#/, '');
    if (hex.length !== 3 && hex.length !== 6) return true;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }, []);

  const textColor = useMemo(() => shouldUseDarkText(formData.avatarBorderColor) ? '#000000' : '#FFFFFF', [formData.avatarBorderColor, shouldUseDarkText]);

  const handleInputChange = useCallback((field: keyof SocialAccounts) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setFormData(prev => ({ ...prev, avatarBorderColor: newColor }));
    setColor(newColor);
  }, [setColor]);

  const handleSave = useCallback(() => {
    triggerHapticFeedback('impact', 'medium');
    onClose(formData);
  }, [formData, onClose]);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(handleSave);

      webApp.MainButton.text = "Save Profile";
      webApp.MainButton.color = formData.avatarBorderColor || '#FFFFFF';
      webApp.MainButton.textColor = textColor;
      webApp.MainButton.show();
      webApp.MainButton.onClick(handleSave);
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(handleSave);
        webApp.MainButton.hide();
        webApp.MainButton.offClick(handleSave);
      }
    };
  }, [handleSave, formData.avatarBorderColor, textColor]);

  const handleInputFocus = useCallback(() => {
    triggerHapticFeedback('impact', 'light');
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SocialInput
          icon={<Instagram size={24} />}
          value={formData.instagram}
          onChange={handleInputChange('instagram')}
          onFocus={handleInputFocus}
          placeholder="Instagram username"
        />
        <SocialInput
          icon={<Twitter size={24} />}
          value={formData.twitter}
          onChange={handleInputChange('twitter')}
          onFocus={handleInputFocus}
          placeholder="Twitter username"
        />
        <SocialInput
          icon={<TikTokIcon />}
          value={formData.tiktok}
          onChange={handleInputChange('tiktok')}
          onFocus={handleInputFocus}
          placeholder="TikTok username"
        />
        <SocialInput
          icon={<PhantomIcon />}
          value={formData.phantom}
          onChange={handleInputChange('phantom')}
          onFocus={handleInputFocus}
          placeholder="Phantom wallet address"
        />
        <ColorInput
          color={formData.avatarBorderColor || '#FFFFFF'}
          onChange={handleColorChange}
          onFocus={handleInputFocus}
        />
      </main>
    </div>
  );
};

interface SocialInputProps {
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  placeholder: string;
}

const SocialInput: React.FC<SocialInputProps> = React.memo(({
  icon, value, onChange, onFocus, placeholder
}) => (
  <div className={styles.inputGroup}>
    <div className={styles.inputIcon}>{icon}</div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      className={styles.input}
      autoCapitalize="none"
    />
  </div>
));

SocialInput.displayName = 'SocialInput';

interface ColorInputProps {
  color: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

const ColorInput: React.FC<ColorInputProps> = React.memo(({ color, onChange, onFocus }) => (
  <div className={styles.inputGroup}>
    <div className={styles.inputIcon}>
      <Palette size={24} color={color} />
    </div>
    <input
      type="color"
      value={color}
      onChange={onChange}
      onFocus={onFocus}
      className={styles.colorInput}
    />
    <span className={styles.colorLabel}>Avatar Border Color</span>
  </div>
));

ColorInput.displayName = 'ColorInput';

const TikTokIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

const PhantomIcon: React.FC = () => (
  <Image src="/assets/phantom.svg" alt="Phantom" width={24} height={24} />
);

export default React.memo(EditProfile);