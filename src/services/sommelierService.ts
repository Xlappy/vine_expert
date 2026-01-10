
import { Wine, UserPreferences, Recommendation } from "../types";

export class SommelierService {
    /**
     * Чисто локальний алгоритм ранжування на основі евристичних правил сомельє.
     * Виключає будь-яку залежність від зовнішніх API.
     */
    getRecommendations(
        wines: Wine[],
        preferences: UserPreferences,
        excludedIds: (string | number)[] = []
    ): Recommendation[] {
        const candidates = wines.filter(wine => {
            if (excludedIds.includes(String(wine.id))) return false;

            // Strict filters
            if (wine.price < preferences.priceRange[0] || wine.price > preferences.priceRange[1]) return false;
            if (preferences.likedStyles.length > 0 && !preferences.likedStyles.includes(wine.type)) return false;

            // Year filter (if provided)
            if (preferences.yearRange && wine.year !== 0) {
                if (wine.year < preferences.yearRange[0] || wine.year > preferences.yearRange[1]) return false;
            }

            // Exclude disliked notes
            const wineText = `${wine.aroma} ${wine.grape} ${wine.name} ${wine.description}`.toLowerCase();
            const isDisliked = preferences.dislikedNotes.some(note => wineText.includes(note.toLowerCase()));
            if (isDisliked) return false;

            return true;
        });

        const scoredCandidates = candidates.map(wine => {
            let score = 50; // Base score
            const wineText = `${wine.aroma} ${wine.foodPairing} ${wine.grape} ${wine.region} ${wine.description}`.toLowerCase();

            // 1. Preferred Aroma Notes (Weight: High)
            preferences.favoriteNotes.forEach(note => {
                if (wineText.includes(note.toLowerCase())) score += 25;
            });

            // 2. Body Match (Weight: Very High)
            const bodyDiff = Math.abs(wine.body - (preferences.preferredBody || 3));
            if (bodyDiff === 0) score += 40;
            else if (bodyDiff === 1) score += 20;
            else score -= 10;

            // 3. Aging Bonus
            if (wine.agingMonths >= (preferences.minAging || 0)) {
                score += 15;
                if (wine.agingMonths > 12) score += 10;
            }

            // 4. Region Preferences
            if (preferences.preferredRegions.some(r => wine.region.toLowerCase().includes(r.toLowerCase()))) {
                score += 30;
            }

            // 5. Rating Bonus
            if (wine.rating) score += (wine.rating * 5);

            // Normalize to 0-100
            const normalizedScore = Math.min(100, Math.max(0, Math.round((score / 180) * 100)));

            return { wine, score: normalizedScore };
        });

        return scoredCandidates
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                wineId: item.wine.id,
                explanation: this.generateExpertExplanation(item.wine, preferences, item.score),
                score: item.score
            }));
    }

    private generateExpertExplanation(wine: Wine, prefs: UserPreferences, score: number): string {
        const matchingNotes = prefs.favoriteNotes.filter(n =>
            `${wine.aroma} ${wine.description}`.toLowerCase().includes(n.toLowerCase())
        );

        const bodyTerm = wine.body >= 4 ? 'повнотілий та структурний' : wine.body <= 2 ? 'легкий та елегантний' : 'збалансований';

        let msg = "";
        if (score >= 85) msg = "Безапеляційний вибір. ";
        else if (score >= 70) msg = "Рекомендовано сомельє. ";
        else msg = "Цікава альтернатива. ";

        msg += `Цей ${bodyTerm} ${wine.type.toLowerCase()} ідеально підходить під ваші критерії`;

        if (matchingNotes.length > 0) {
            msg += `, особливо завдяки ноткам ${matchingNotes.slice(0, 2).join(' та ')}.`;
        } else {
            msg += ".";
        }

        return msg;
    }
}
