import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchRecipes } from '../../../api/mealApi';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Recipe } from '../../../types';

import styles from './index.module.css';

interface QuickSearchProps {
  onSelect: (recipe: Recipe) => void;
}

const QuickSearch: React.FC<QuickSearchProps> = ({ onSelect }) => {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedTerm = useDebounce(term, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setShowNotFound(false);

      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedTerm.length > 2) {
        setLoading(true);
        const results = await searchRecipes(debouncedTerm);
        setSuggestions(results ? results.slice(0, 5) : []);
        if (!results || results.length === 0) {
          setShowNotFound(true);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedTerm]);

  const handleSelect = (recipe: Recipe | null) => {
    if (recipe) {
      onSelect(recipe);
    }
    setTerm('');
    setShowNotFound(false);
    setSuggestions([]);
  };

  return (
    <div className={styles.searchWrapper} ref={searchRef}>
      <div className={styles.inputContainer}>
        {loading ? (
          <Loader2 className={`${styles.icon} ${styles.spinner}`} size={18} />
        ) : (
          <Search className={styles.icon} size={18} />
        )}
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Cerca una ricetta express..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        {suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((recipe) => (
              <li
                key={recipe.idMeal}
                className={styles.suggestionItem}
                tabIndex={0}
                role="button"
                onClick={() => handleSelect(recipe)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(recipe);
                  } else if (e.key === 'Escape') {
                    setSuggestions([]);
                  }
                }}
              >
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                <span>{recipe.strMeal}</span>
              </li>
            ))}
          </ul>
        )}
        {showNotFound && (
          <ul className={styles.suggestionsList}>
            <li onClick={() => handleSelect(null)} className={styles.suggestionItem}>
              <span>Nessun risultato trovato</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuickSearch;