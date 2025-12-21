
import { Wine, UserPreferences, Recommendation } from "../types";

export class SommelierService {
  /**
   * Чисто локальний алгоритм ранжування на основі евристичних правил сомельє.
   * Виключає будь-яку залежність від зовнішніх API.
   */
  getRecommendations(
    wines: Wine[], 
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = wines.filter(wine => {
      if (excludedIds.includes(wine.id)) return false;
      
      // Жорсткий фільтр: Ціна
      if (wine.price > preferences.priceRange[1]) return false;
      
      // Жорсткий фільтр: Стиль
      if (preferences.likedStyles.length > 0 && !preferences.likedStyles.includes(wine.type)) return false;

      // Жорсткий фільтр: Рік (Vintage)
      if (preferences.yearRange && wine.year !== 0 && wine.year < preferences.yearRange[0]) return false;

      // Жорсткий фільтр: Витримка
      if (preferences.minAging && wine.agingMonths < preferences.minAging) return false;

      // Жорсткий фільтр: Небажані нотки
      const wineDataStr = `${wine.aroma} ${wine.grape} ${wine.name}`.toLowerCase();
      const hasDislikedNote = (preferences.dislikedNotes || []).some(note => 
        wineDataStr.includes(note.toLowerCase())
      );
      if (hasDislikedNote) return false;
      
      return true;
    });

    const scoredCandidates = candidates.map(wine => {
      let score = 0;
      const wineDataStr = `${wine.aroma} ${wine.foodPairing} ${wine.grape} ${wine.region}`.toLowerCase();
      
      // 1. Улюблені нотки (Вага: +30 за кожну)
      let matchedNotesCount = 0;
      preferences.favoriteNotes.forEach(note => {
        if (wineDataStr.includes(note.toLowerCase())) {
          score += 30;
          matchedNotesCount++;
        }
      });

      // 2. Відповідність тілу (Вага: +40 за ідеальний збіг)
      if (preferences.preferredBody) {
        const diff = Math.abs(wine.body - preferences.preferredBody);
        if (diff === 0) score += 40;
        else if (diff === 1) score += 15;
      }

      // 3. Бонуси за витримку
      if (wine.agingMonths >= 12) score += 10;
      if (wine.agingMonths >= 24) score += 15;

      // 4. Регіональні переваги (якщо реалізовано в інтерфейсі)
      if (preferences.preferredRegions && preferences.preferredRegions.length > 0) {
        if (preferences.preferredRegions.some(r => wine.region.includes(r))) {
          score += 20;
        }
      }

      // 5. Поправочний коефіцієнт для "балансу" (ігристі та десертні отримують невеликий буст якщо обрані)
      if (wine.type === 'Sparkling' || wine.type === 'Dessert') score += 5;

      // Нормалізація скору до 100% (умовно)
      const finalScore = Math.min(99, Math.round((score / 150) * 100));

      return { wine, score: finalScore };
    });

    // Сортування за спаданням релевантності
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(item => ({
      wineId: item.wine.id,
      explanation: this.generateExplanation(item.wine, preferences, item.score),
      score: item.score
    }));
  }

  /**
   * Генератор експертних висновків на основі шаблонів та даних об'єкта.
   */
  private generateExplanation(wine: Wine, prefs: UserPreferences, score: number): string {
    const matchedNotes = prefs.favoriteNotes.filter(n => 
      wine.aroma.toLowerCase().includes(n.toLowerCase())
    );

    const bodyDescriptions: Record<number, string> = {
      1: 'невагомим та ефірним',
      2: 'легким та освіжаючим',
      3: 'збалансованим середнім',
      4: 'певним та структурним',
      5: 'монументальним та повнотілим'
    };

    const intro = score > 80 
      ? `Ідеальний вибір для вашого профілю. ` 
      : score > 60 
      ? `Чудова пропозиція, що відповідає основним критеріям. `
      : `Цікавий варіант з характерними рисами. `;

    let analysis = `Це вино з ${bodyDescriptions[wine.body] || 'характерним'} тілом. `;
    
    if (matchedNotes.length > 0) {
      analysis += `Система ідентифікувала ключові для вас дескриптори: ${matchedNotes.slice(0, 3).join(', ')}. `;
    } else {
      analysis += `Вас може зацікавити унікальна палітра ароматів: ${wine.aroma.split(',').slice(0, 2).join(', ')}. `;
    }

    const pairing = `Найкраще розкривається у поєднанні з ${wine.foodPairing.toLowerCase()}.`;
    
    return `${intro}${analysis}${pairing}`;
  }
}
