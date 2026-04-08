import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { fetchRecipesByFilter } from '../../../api/mealApi';
import { pickRandom } from '../../../utils/recipeUtils';
import StepArea from './../StepArea';
import StepCategory from './../StepCategory'
import Loader from '../../../components/Loader';
import ErrorState from '../../../components/ErrorState';

import styles from './index.module.css';

const Wizard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSelecting, setIsSelecting] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const currentStep = parseInt(searchParams.get('step') || '1');

  const goToStep = (step: number, extraParams: Record<string, string> = {}) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...current, ...extraParams, step: step.toString() });
  };

  const handleFinalSelection = async (category: string) => {
    const area = searchParams.get('area') || '';
    setIsSelecting(true);
    setNoResults(false);

    try {
      const list = await fetchRecipesByFilter(area, category);
      if (list && list.length > 0) {
        const randomRecipe = pickRandom(list);
        if (randomRecipe)
          navigate(`/recipe/${randomRecipe.idMeal}`);
      } else {
        setNoResults(true);
      }
    } catch (error) {
      console.error("Errore durante la selezione:", error);
    } finally {
      setIsSelecting(false);
    }
  };

  if (isSelecting) return (
    <Loader text="Stiamo cercando il piatto perfetto per te..." />
  );

  if (noResults) return (
    <ErrorState handleReset={() => { setNoResults(false); goToStep(1); }}>
      <h3 className={styles.emptyTitle}>Nessun piatto trovato</h3>
      <p className={styles.emptyText}>
        Ops! Sembra che non ci siano ricette "{searchParams.get('category')}" per la cucina "{searchParams.get('area')}".
      </p>
    </ErrorState>
  );

  return (
    <>
      <div className={styles.stepperContainer}>
        <div className={styles.stepperLine}>
          <div className={styles.lineProgress} style={{ width: currentStep === 1 ? '0%' : '100%' }}></div>
        </div>
        <div className={styles.steps}>
          {[1, 2].map((step) => (
            <div key={step} className={`${styles.stepCircle} ${currentStep >= step ? styles.active : ''}`}>
              {currentStep > step ? <Check size={18} /> : step}
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <StepArea onNext={(area) => goToStep(2, { area })} />
      )}

      {currentStep === 2 && (
        <StepCategory
          onNext={handleFinalSelection}
          onBack={() => goToStep(1)}
        />
      )}
    </>
  );
};

export default Wizard;