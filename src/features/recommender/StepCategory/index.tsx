import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';
import StepHeader from '../../../components/StepHeader';
import Loader from '../../../components/Loader';

import styles from './index.module.css';

interface Category {
  idCategory: string;
  strCategory: string;
}

interface Props {
  onNext: (cat: string) => void;
  onBack: () => void;
}

const StepCategory: React.FC<Props> = ({ onNext, onBack }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePillClick = (categoryName: string) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, category: categoryName });
  };

  return (
    <div className={styles.container}>
      <StepHeader stepInfo="Step 2: Scegli la Categoria" />
      {loading ? (
        <Loader text="Carichiamo le categorie..." />
      ) : (
        <>
          <div className={styles.pillContainer}>
            {categories.map((cat, index) => {
              const isActive = selectedCategory === cat.strCategory;
              return (
                <button
                  key={cat.idCategory}
                  type="button"
                  className={`${styles.pill} ${isActive ? styles.activePill : ''}`}
                  data-index={index % 6}
                  onClick={() => handlePillClick(cat.strCategory)}
                >
                  {cat.strCategory}
                </button>
              );
            })
            }
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnBack} onClick={onBack}>
              <ArrowLeft size={16} /> Indietro
            </button>

            <button
              type="button"
              className={styles.btnSubmit}
              disabled={!selectedCategory}
              onClick={() => selectedCategory && onNext(selectedCategory)}
            >
              Trova Ricetta <ChefHat size={18} />
            </button>
          </div>
        </>)}
    </div>
  );
};

export default StepCategory;