import React, { useState } from 'react';
import type { HistoryItem } from '../../../types';
import { Heart, XCircle, LayoutGrid } from 'lucide-react';
import styles from './index.module.css';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (id: string) => void;
}

type FilterType = 'all' | 'liked' | 'disliked';

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'liked') return item.liked;
    if (filter === 'disliked') return !item.liked;
    return true;
  });

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}></span>
        <p>La tua cronologia è vuota. Inizia a cercare!</p>
      </div>
    );
  }

  return (
    <div className={styles.historySection}>
      <div className={styles.filterBar}>
        <button 
          className={`${styles.filterBtn} ${filter === 'all' && styles.activeFilter}`}
          onClick={() => setFilter('all')}
        >
          <LayoutGrid size={14} /> All
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'liked' && styles.activeFilter}`}
          onClick={() => setFilter('liked')}
        >
          <Heart size={14} /> Liked
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'disliked' && styles.activeFilter}`}
          onClick={() => setFilter('disliked')}
        >
          <XCircle size={14} /> Disliked
        </button>
      </div>

      <div className={styles.list}>
        {filteredItems.map((item) => (
          <div key={item.timestamp} className={styles.item} onClick={() => onSelect(item.idMeal)}>
            <img src={item.strMealThumb} alt={item.strMeal} className={styles.thumb} />
            <div className={styles.content}>
              <p className={styles.mealName}>{item.strMeal}</p>
              <span className={`${styles.badge} ${item.liked ? styles.liked : styles.disliked}`}>
                {item.liked ? 'Liked' : 'Disliked'}
              </span>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className={styles.meta}>Nessun elemento corrisponde al filtro.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryList;