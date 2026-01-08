
export interface Wine {
  id: string | number;
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
  description?: string;
  image_url?: string | null;
  country?: string;
  rating?: number;
}

export interface UserPreferences {
  likedStyles: string[];
  dislikedGrapes: string[];
  priceRange: [number, number];
  yearRange: [number, number];
  favoriteNotes: string[];
  dislikedNotes: string[];
  preferredRegions: string[];
  minAging: number;
  preferredBody: number;
}

export interface Recommendation {
  wineId: string | number;
  explanation: string;
  score?: number;
}



export type AppView = 'sommelier' | 'database' | 'favorites';
