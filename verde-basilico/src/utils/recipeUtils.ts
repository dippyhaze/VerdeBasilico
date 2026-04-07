/**
 * Mappatura dei nomi area di TheMealDB ai codici nazione ISO.
 */
export const areaToCountryCode: Record<string, string> = {
  'Italian': 'IT',
  'Chinese': 'CN',
  'Mexican': 'MX',
  'Japanese': 'JP',
  'French': 'FR',
  'American': 'US',
  'British': 'GB',
  'Indian': 'IN',
  'Greek': 'GR',
  'Spanish': 'ES',
  'Canadian': 'CA',
  'Jamaican': 'JM',
  'Dutch': 'NL',
  'Egyptian': 'EG',
  'Irish': 'IE',
  'Kenyan': 'KE',
  'Malaysian': 'MY',
  'Moroccan': 'MA',
  'Croatian': 'HR',
  'Norwegian': 'NO',
  'Portuguese': 'PT',
  'Russian': 'RU',
  'Slovak': 'SK',
  'Thai': 'TH',
  'Tunisian': 'TN',
  'Turkish': 'TR',
  'Vietnamese': 'VN'
};

/**
 * Seleziona un elemento casuale da un array.
 * Usata nel Wizard per suggerire una ricetta a sorpresa.
 */
export const pickRandom = <T>(array: T[]): T | null => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};