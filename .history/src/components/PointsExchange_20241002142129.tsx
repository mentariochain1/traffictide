import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Ticket } from 'lucide-react';
import styles from './PointsExchange.module.css';
import { triggerHapticFeedback } from '@/utils/telegramWebApp';
import { gameConfig } from '@/config/gameConfig';
import { useUser } from '@/contexts/UserContext';

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
  const { casePrice, minTickets, maxTickets, ticketProbabilities } = gameConfig.pointExchange;

  const getRandomTickets = () => {
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
  };

  const openCase = () => {
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
  };

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
      <div className={styles.exchangeInfo}>
        <div className={styles.exchangeItem}>
          <Star size={32} className={styles.icon} />
          <div className={styles.exchangeDetails}>
            <span className={styles.exchangeValue}>{casePrice}</span>
            <span className={styles.exchangeLabel}>Points</span>
          </div>
        </div>
        <ArrowRight size={24} className={styles.arrowIcon} />
        <div className={styles.exchangeItem}>
          <Ticket size={32} className={styles.icon} />
          <div className={styles.exchangeDetails}>
            <span className={styles.exchangeValue}>{minTickets}-{maxTickets}</span>
            <span className={styles.exchangeLabel}>Tickets</span>
          </div>
        </div>
      </div>
      <button 
        className={`${styles.openButton} ${isOpening ? styles.opening : ''}`}
        onClick={openCase}
        disabled={isOpening || userPoints < casePrice}
      >
        {isOpening ? 'Opening...' : 'Open Case'}
      </button>
      {showNotification && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            Congratulations! You received {earnedTickets} tickets!
          </div>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default PointsExchange;