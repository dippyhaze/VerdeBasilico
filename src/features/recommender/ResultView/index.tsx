import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Recipe } from '../../../types';
import { fetchRecipeById, fetchRecipesByFilter } from '../../../api/mealApi';
import { ArrowLeft, ThumbsUp, ThumbsDown, Utensils, Leaf, ChefHat } from 'lucide-react';
import Loader from '../../../components/Loader';
import { pickRandom } from '../../../utils/recipeUtils';
import ErrorState from '../../../components/ErrorState';
import styles from './index.module.css';

interface ResultViewProps {
  onFeedback: (recipe: Recipe, liked: boolean) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ onFeedback }) => {
  const { idMeal } = useParams<{ idMeal: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ingredientsToShow = showAllIngredients
    ? recipe?.ingredients
    : recipe?.ingredients.slice(0, 4);

  const goToWizard = (step: number, extraParams: Record<string, string> = {}) => {
    const { area, category } = extraParams;
    navigate(`/?area=${area}&step=${step}&category=${category}`,);
  };

  const handleNewIdea = async () => {
    const newRecipeList = await fetchRecipesByFilter(recipe?.strArea || null, recipe?.strCategory || null);
    if (newRecipeList && newRecipeList.length > 0) {
      const filteredList = newRecipeList.filter(r => r.idMeal !== recipe?.idMeal);
      if (filteredList.length === 0) {
        setErrorMessage("Non ci sono altre ricette disponibili.");
        return;
      }
      const randomRecipe = pickRandom(filteredList);
      navigate(`/recipe/${randomRecipe?.idMeal}`);
    } else {
      setErrorMessage("Errore nel caricamento delle ricette.");
    }
  }

  const handleReset = () => {
    setErrorMessage(null);
    if (!recipe) {
      navigate('/');
    }
  };

  useEffect(() => {
    const loadRecipe = async () => {
      if (!idMeal) return;

      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchRecipeById(idMeal);
        if (data) {
          setRecipe(data);
        } else {
          setErrorMessage("Ricetta non trovata.");
        }
      } catch (err) {
        console.error("Errore fetch ricetta:", err);
        setErrorMessage("Errore nel caricamento della ricetta.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [idMeal]);

  useEffect(() => {
    if (recipe && recipe.ingredients.length > 4) {
      buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showAllIngredients]);

  if (loading) return <Loader text="Carichiamo la tua ricetta..." />;
  if (errorMessage || !recipe) return <ErrorState handleReset={handleReset}><div className={styles.errorState}>Ops! {errorMessage}</div></ErrorState>;

  return (
    <div className={styles.resultContainer}>
      <div className={styles.actionContainer}>
        <button className={styles.actionBtn} onClick={() => goToWizard(2, { area: recipe.strArea, category: recipe.strCategory })}>
          <ArrowLeft size={18} /> Torna alla ricerca
        </button>
        <button className={styles.actionBtn} onClick={handleNewIdea}>
          <ChefHat size={18} /> Nuova Idea
        </button>
      </div>
      <div className={styles.recipeCard}>
        <div className={styles.imageWrapper}>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
          <div className={styles.headerContent}>
            <div className={styles.badgeRow}>
              <span className={styles.areaBadge}>
                {recipe.strArea}
              </span>
              <span className={styles.categoryBadge}>{recipe.strCategory}</span>
            </div>
            <h1 className={styles.mainTitle}>{recipe.strMeal}</h1>
          </div>
        </div>

        <div className={styles.recipeBody}>
          <div className={styles.ingredientsSection}>
            <h3><Utensils size={20} className={styles.ingIcon} /> Ingredienti</h3>
            <ul className={styles.ingredientsGrid}>
              {ingredientsToShow?.map((ing, idx) => (
                <li key={idx}><Leaf size={16} className={styles.ingIcon} /> {ing}</li>
              ))}
            </ul>

            {recipe.ingredients.length > 4 && (
              <button
                className={styles.showMoreBtn}
                ref={buttonRef}
                onClick={() => setShowAllIngredients(!showAllIngredients)}
              >
                {showAllIngredients ? "Mostra meno" : `+ altri ${recipe.ingredients.length - 4}`}
              </button>
            )}
          </div>

          <div className={styles.footerActions}>
            <h4>Ti ispira questo piatto?</h4>
            <div className={styles.buttonGroup}>
              <button
                className={styles.primaryBtn}
                onClick={() => onFeedback(recipe, true)}
              >
                <ThumbsUp size={20} /> Sì, lo scelgo!
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => onFeedback(recipe, false)}
              >
                <ThumbsDown size={20} /> No, cambia idea
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;