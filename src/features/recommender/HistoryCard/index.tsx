import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, History, LayoutGrid, XCircle } from 'lucide-react';
import HistoryList from '../HistoryList';
import styles from './index.module.css';
import type { HistoryItem } from '../../../types';
import { useResponsive } from '../../../hooks/useResponsive';

interface HistoryCardProps {
    history: HistoryItem[];
    isHistoryOpen: boolean;
    setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type FilterType = 'all' | 'liked' | 'disliked';

const HistoryCard: React.FC<HistoryCardProps> = ({ history, isHistoryOpen, setIsHistoryOpen }) => {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredItems = history.filter((item) => {
        if (filter === 'liked') return item.liked;
        if (filter === 'disliked') return !item.liked;
        return true;
    });
    return (
        <section className={`${styles.historyCard} ${isHistoryOpen ? styles.isOpen : ''}`}>
            <div
                className={styles.accordionHeader}
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
                <div className={styles.headerContent}>
                    <div style={{ display: 'flex' }}>
                        <History className={styles.historyIcon} size={20} />
                        <h3 className={styles.sectionTitle}>
                            Ultime Ricerche
                        </h3>
                    </div>
                    {!(isMobile && !isHistoryOpen) && (
                        <div 
                            className={styles.filterBar}
                            onClick={(e) => e.stopPropagation()}
                        >
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
                        </div>)}
                </div>
                <div>
                    <ChevronDown
                        className={styles.chevronIcon}
                        size={20}
                        style={{ transform: isHistoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
                    />
                </div>
            </div>
            <div className={styles.accordionContent}>
                <HistoryList items={filteredItems}
                    onSelect={(id) => navigate(`/recipe/${id}`)}
                />
            </div>
        </section>)
};

export default HistoryCard;
