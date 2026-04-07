import type { Recipe, RecipeSummary, Category } from '../types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Interfaccia per il formato grezzo restituito da TheMealDB
 */
interface RawMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strSource: string;
  [key: string]: string | undefined; // Per strIngredient1, strMeasure1, ecc.
}

/**
 * Helper per trasformare il formato "sporco" di TheMealDB 
 * in un oggetto Recipe pulito e tipizzato.
 */
const formatRecipe = (meal: RawMeal): Recipe => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ing.trim()}`.trim());
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strMealThumb: meal.strMealThumb,
    strYoutube: meal.strYoutube,
    strSource: meal.strSource,
    ingredients,
  };
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  const data = await res.json();
  return data.meals ? data.meals.map(formatRecipe) : [];
};

/**
 * Recupera una singola ricetta per ID
 */
export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  if (!data.meals) throw new Error('Recipe not found');
  return formatRecipe(data.meals[0]);
};

/**
 * Recupera tutte le categorie (usato in StepCategory)
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
};

/**
 * Filtra ricette per Area e/o Categoria (usato nel Wizard)
 */
export const fetchRecipesByFilter = async (
  area: string | null,
  category: string | null
): Promise<RecipeSummary[]> => {

  // Caso 1: Entrambi i filtri sono presenti (Logica "E")
  const [areaRes, catRes] = await Promise.all([
    fetch(`${BASE_URL}/filter.php?a=${area}`).then(res => res.json()),
    fetch(`${BASE_URL}/filter.php?c=${category}`).then(res => res.json())
  ]);

  const areaMeals: RecipeSummary[] = areaRes.meals || [];
  const catMeals: RecipeSummary[] = catRes.meals || [];

  // Ottimizzazione: Usiamo un Set per una ricerca O(1) invece di nested loop O(n*m)
  const catMealIds = new Set(catMeals.map(m => m.idMeal));

  return areaMeals.filter(areaMeal =>
    catMealIds.has(areaMeal.idMeal)
  );
};