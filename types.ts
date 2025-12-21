
export interface Wine {
  id: string;
  name: string;
  type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert';
  origin: 'Ukrainian' | 'Export';
  grape: string;
  region: string;
  year: number;
  body: number; // 1-5
  tannins: number; // 1-5
  acidity: number; // 1-5
  sweetness: number; // 1-5
  alcohol: string;
  aroma: string;
  foodPairing: string;
  price: number;
  agingMonths: number;
}

export interface UserPreferences {
  likedStyles: string[];
  dislikedGrapes: string[];
  priceRange: [number, number];
  yearRange: [number, number]; // Нове: діапазон років
  favoriteNotes: string[];
  dislikedNotes: string[];
  preferredRegions: string[]; // Нове: бажані регіони
  minAging: number;
  preferredBody: number;
}

export interface Recommendation {
  wineId: string;
  explanation: string;
  score?: number;
}

export type AppView = 'sommelier' | 'database' | 'favorites';
