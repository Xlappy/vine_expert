
import { Wine, UserPreferences, Recommendation } from "../types";

export class SommelierService {
  /**
   * Розширений алгоритм ранжування з врахуванням технічних характеристик та органолептики
   */
  getRecommendations(
    wines: Wine[], 
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = wines.filter(wine => {
      if (excludedIds.includes(wine.id)) return false;
      
      // Ціна
      if (wine.price > preferences.priceRange[1]) return false;
      
      // Стиль
      if (preferences.likedStyles.length > 0 && !preferences.likedStyles.includes(wine.type)) return false;

      // Рік врожаю (Vintage)
      if (preferences.yearRange && wine.year < preferences.yearRange[0]) return false;

      // Витримка
      if (preferences.minAging && wine.agingMonths < preferences.minAging) return false;

      // Небажані нотки
      const wineDataStr = `${wine.aroma} ${wine.grape}`.toLowerCase();
      const hasDislikedNote = (preferences.dislikedNotes || []).some(note => 
        wineDataStr.includes(note.toLowerCase())
      );
      if (hasDislikedNote) return false;
      
      return true;
    });

    const scoredCandidates = candidates.map(wine => {
      let score = 0;
      const wineDataStr = `${wine.aroma} ${wine.foodPairing} ${wine.grape} ${wine.region}`.toLowerCase();
      
      // 1. Улюблені нотки (Вага: +25 за кожну)
      preferences.favoriteNotes.forEach(note => {
        if (wineDataStr.includes(note.toLowerCase())) score += 25;
      });

      // 2. Відповідність тілу (Вага: +40 за ідеальний збіг)
      if (preferences.preferredBody) {
        const diff = Math.abs(wine.body - preferences.preferredBody);
        if (diff === 0) score += 40;
        else if (diff === 1) score += 20;
      }

      // 3. Преміальність за витримку
      if (wine.agingMonths >= 12) score += 10;
      if (wine.agingMonths >= 24) score += 20;

      // 4. Актуальність (свіжіші роки мають невеликий бонус для білих, старіші - для червоних)
      if (wine.type === 'Red' && wine.year < 2018) score += 15;
      if (wine.type === 'White' && wine.year >= 2021) score += 10;

      return { wine, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(item => ({
      wineId: item.wine.id,
      explanation: this.generateExplanation(item.wine, preferences, item.score),
      score: item.score
    }));
  }

  private generateExplanation(wine: Wine, prefs: UserPreferences, score: number): string {
    const matches = prefs.favoriteNotes.filter(n => 
      wine.aroma.toLowerCase().includes(n.toLowerCase())
    );

    const bodyText = wine.body >= 4 ? 'вражаючою структурою' : 'витонченим профілем';
    const regionText = wine.origin === 'Ukrainian' ? `видатний приклад ${wine.region}` : `класичний ${wine.region}`;

    let text = `Це вино з ${bodyText} та характерними ознаками регіону ${wine.region}. `;
    
    if (matches.length > 0) {
      text += `Алгоритм виділив ноти ${matches.join(', ')}, які ви цінуєте. `;
    }
    
    text += `Гастрономічний потенціал розкривається з ${wine.foodPairing.toLowerCase()}.`;
    return text;
  }
}
