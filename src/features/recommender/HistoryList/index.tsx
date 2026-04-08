import React from 'react';
import type { HistoryItem } from '../../../types';
import { BadgeX } from 'lucide-react';
import styles from './index.module.css';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
}


const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect }) => {


  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <BadgeX size={48} className={styles.emptyIcon} />
        <p>La tua cronologia è vuota. Inizia a cercare!</p>
      </div>
    );
  }

  return (
    <div className={styles.historySection}>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.timestamp} className={styles.item} onClick={() => onSelect(item.idMeal)}>
            <img src={item.strMealThumb} alt={item.strMeal} className={styles.thumb} />
            <div className={styles.content}>
              <p className={styles.mealName}>{item.strMeal}</p>
              <span className={`${styles.badge} ${item.liked ? styles.liked : styles.disliked}`}>
                {item.liked ? 'Liked' : 'Disliked'}
              </span>
              <span className={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className={styles.meta}>Nessun elemento corrisponde al filtro.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryList;