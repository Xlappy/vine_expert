
import { GoogleGenAI, Type } from "@google/genai";
import { Wine, UserPreferences, Recommendation } from "../types";

export class SommelierService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async getRecommendations(
    wines: Wine[], 
    preferences: UserPreferences,
    feedback?: { rejectedId: string, reason: string }
  ): Promise<Recommendation[]> {
    const prompt = `
      Ти — сомельє світового класу. Твоє завдання — надати професійну пораду українською мовою.
      
      Доступна колекція вин: ${JSON.stringify(wines)}
      
      Уподобання користувача:
      - Стилі: ${preferences.likedStyles.join(', ')}
      - Небажані сорти винограду: ${preferences.dislikedGrapes.join(', ')}
      - Діапазон цін: ${preferences.priceRange[0]} - ${preferences.priceRange[1]} грн
      - Улюблені аромати/ноти: ${preferences.favoriteNotes.join(', ')}
      
      ${feedback ? `КРИТИЧНЕ ОНОВЛЕННЯ: Користувач щойно відхилив вино з ID "${feedback.rejectedId}" через: "${feedback.reason}". Запропонуй заміну, виключивши це вино.` : ''}

      Завдання: Рекомендуй рівно 3 вина з наданого списку, які найкраще відповідають цим критеріям.
      Якщо відповідних вин менше 3, запропонуй найближчі варіанти.
      Поясни ЧОМУ для кожної рекомендації професійним, але привітним тоном українською мовою.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              wineId: { type: Type.STRING, description: "ID вина з наданого списку" },
              explanation: { type: Type.STRING, description: "Детальне пояснення українською мовою" }
            },
            required: ["wineId", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse sommelier response", e);
      return [];
    }
  }
}
