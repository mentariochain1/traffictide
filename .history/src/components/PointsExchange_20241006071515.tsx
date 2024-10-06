import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Star, Ticket } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/telegramWebApp';
import { gameConfig } from '@/config/gameConfig';
import { useUser } from '@/contexts/UserContext';
import styles from './PointsExchange.module.css';

interface PointsExchangeProps {
  userPoints: number;
  onExchange: (pointsSpent: number, ticketsEarned: number) => void;
}

const PointsExchange: React.FC<PointsExchangeProps> = ({ userPoints, onExchange }) => {
  const { userTickets, updateUserTickets } = useUser();
  const [isOpening, setIsOpening] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [earnedTickets, setEarnedTickets] = useState(0);
  const [progress, setProgress] = useState(100);

  const { casePrice, minTickets, maxTickets, ticketProbabilities } = useMemo(() => gameConfig.pointExchange, []);

  const getRandomTickets = useCallback(() => {
    const rand = Math.random() * 100;
    let cumulativeProbability = 0;
    for (const prob of ticketProbabilities) {
      cumulativeProbability += prob.probability;
      if (rand <= cumulativeProbability) {
        const [min, max] = prob.range;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    return minTickets; // Fallback to minimum tickets
  }, [ticketProbabilities, minTickets]);

  const openCase = useCallback(() => {
    if (userPoints < casePrice) {
      triggerHapticFeedback('impact', 'heavy');
      return;
    }

    setIsOpening(true);
    triggerHapticFeedback('impact', 'medium');

    // Case opening simulation
    setTimeout(() => {
      const ticketsEarned = getRandomTickets();
      onExchange(casePrice, ticketsEarned);
      updateUserTickets(userTickets + ticketsEarned);
      setEarnedTickets(ticketsEarned);
      setIsOpening(false);
      setShowNotification(true);
      setProgress(100);
    }, 2000);
  }, [userPoints, casePrice, getRandomTickets, onExchange, updateUserTickets, userTickets]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNotification) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timer);
            setShowNotification(false);
            return 0;
          }
          return prevProgress - 1;
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [showNotification]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Exchange Points for Tickets</h2>
      <ExchangeInfo casePrice={casePrice} minTickets={minTickets} maxTickets={maxTickets} />
      <OpenCaseButton isOpening={isOpening} userPoints={userPoints} casePrice={casePrice} onClick={openCase} />
      <Notification show={showNotification} earnedTickets={earnedTickets} progress={progress} />
    </div>
  );
};

interface ExchangeInfoProps {
  casePrice: number;
  minTickets: number;
  maxTickets: number;
}

const ExchangeInfo: React.FC<ExchangeInfoProps> = React.memo(({ casePrice, minTickets, maxTickets }) => (
  <div className={styles.exchangeInfo}>
    <ExchangeItem icon={<Star size={32} />} value={casePrice} label="Points" />
    <ArrowRight size={24} className={styles.arrowIcon} />
    <ExchangeItem icon={<Ticket size={32} />} value={`${minTickets}-${maxTickets}`} label="Tickets" />
  </div>
));

ExchangeInfo.displayName = 'ExchangeInfo';

interface ExchangeItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

const ExchangeItem: React.FC<ExchangeItemProps> = React.memo(({ icon, value, label }) => (
  <div className={styles.exchangeItem}>
    <div className={styles.exchangeIcon}>{icon}</div>
    <div className={styles.exchangeDetails}>
      <span className={styles.exchangeValue}>{value}</span>
      <span className={styles.exchangeLabel}>{label}</span>
    </div>
  </div>
));

ExchangeItem.displayName = 'ExchangeItem';

interface OpenCaseButtonProps {
  isOpening: boolean;
  userPoints: number;
  casePrice: number;
  onClick: () => void;
}

const OpenCaseButton: React.FC<OpenCaseButtonProps> = React.memo(({ isOpening, userPoints, casePrice, onClick }) => (
  <button 
    className={`${styles.openButton} ${isOpening ? styles.opening : ''}`}
    onClick={onClick}
    disabled={isOpening || userPoints < casePrice}
  >
    {isOpening ? 'Opening...' : 'Open Case'}
  </button>
));

OpenCaseButton.displayName = 'OpenCaseButton';

interface NotificationProps {
  show: boolean;
  earnedTickets: number;
  progress: number;
}

const Notification: React.FC<NotificationProps> = React.memo(({ show, earnedTickets, progress }) => (
  show && (
    <div className={styles.notification}>
      <div className={styles.notificationContent}>
        Congratulations! You received {earnedTickets} tickets!
      </div>
      <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
    </div>
  )
));

Notification.displayName = 'Notification';

export default React.memo(PointsExchange);