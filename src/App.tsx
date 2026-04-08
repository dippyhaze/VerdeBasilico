import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Wizard from './features/recommender/Wizard';
import { useLocalStorage } from './hooks/useLocalStorage';
import QuickSearch from './components/Search/QuickSearch';
import ResultView from './features/recommender/ResultView';
import HistoryCard from './features/recommender/HistoryCard';
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
      <Header />
      <main className={styles.dashboardGrid}>
        <div className={styles.fullWidthRow}>
          <QuickSearch onSelect={(recipe) => navigate(`/recipe/${recipe.idMeal}`)} />
        </div>

        <section className={styles.wizardCard}>
          <Routes>
            <Route path="/" element={<Wizard />} />
            <Route path="/recipe/:idMeal" element={<ResultView onFeedback={handleFeedback} />} />
          </Routes>
        </section>
        <HistoryCard history={history}
          isHistoryOpen={isHistoryOpen}
          setIsHistoryOpen={setIsHistoryOpen}
        />
      </main>
    </div>
  );
};

export default App;