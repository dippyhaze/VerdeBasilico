/**
 * Rappresenta una ricetta completa e dettagliata
 * (Risultato di lookup.php?i=id o search.php?s=name)
 */
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  strSource?: string;
  ingredients: string[];
}

export interface HistoryItem extends Recipe {
  liked: boolean;
  timestamp: number;
}

/**
 * Rappresenta l'anteprima di una ricetta nella lista filtri
 * (Risultato di filter.php?c=Category o filter.php?a=Area)
 */
export interface RecipeSummary {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

/**
 * Definizioni per i filtri del Wizard
 */
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Area {
  strArea: string;
}