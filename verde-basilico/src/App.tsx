import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ChevronDown, History } from 'lucide-react';
import Header from './components/Layout/Header';
import Wizard from './features/recommender/Wizard';
import HistoryList from './features/recommender/HistoryList';
import { useLocalStorage } from './hooks/useLocalStorage';
import QuickSearch from './components/Search/QuickSearch';
import ResultView from './features/recommender/ResultView';
import type { HistoryItem, Recipe } from './types';
import styles from './App.module.css';


const App: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('recipeHistory', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleFeedback = (recipe: Recipe, liked: boolean) => {
    const newItem: HistoryItem = {
      ...recipe,
      liked,
      timestamp: Date.now()
    };
    setHistory((prevHistory) => {
      const filteredHistory = prevHistory.filter(item => item.idMeal !== recipe.idMeal);
      return [newItem, ...filteredHistory];
    });
    setIsHistoryOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className={styles.appContainer}>
      {/* Header rimane fuori dalla grid per occupare tutta la larghezza */}
      <Header />
      <main className={styles.dashboardGrid}>
        {/* ROW 1: QuickSearch centrata */}
        <div className={styles.fullWidthRow}>
          <QuickSearch onSelect={(recipe) => navigate(`/recipe/${recipe.idMeal}`)} />
        </div>

        {/* ROW 2: Wizard e History */}
        <section className={styles.wizardCard}>
          <Routes>
            <Route path="/" element={<Wizard />} />
            <Route path="/recipe/:idMeal" element={<ResultView onFeedback={handleFeedback} />} />
          </Routes>
        </section>

        <div className={`${styles.historyCard} ${isHistoryOpen ? styles.isOpen : ''}`}>
          <div
            className={styles.accordionHeader}
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <div style={{ display: 'flex' }}>
              <History className={styles.historyIcon} size={20} />
              <h3 className={styles.sectionTitle}>
                Ultime Ricerche
              </h3>
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
            <HistoryList items={history}
              onSelect={(id) => navigate(`/recipe/${id}`)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;