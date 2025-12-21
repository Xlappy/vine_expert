
import { Wine } from './types';

export const INITIAL_WINES: Wine[] = [
  // --- ЧЕРВОНІ УКРАЇНСЬКІ ---
  { id: 'ua-r-1', name: 'Beykush Кара Кермен', type: 'Red', origin: 'Ukrainian', grape: 'Сапераві, Темпранільйо', region: 'Миколаївщина', year: 2018, body: 5, tannins: 5, acidity: 3, sweetness: 1, alcohol: '14.5%', aroma: 'Сухофрукти, шоколад, спеції', foodPairing: 'М’ясо на грилі, дичина', price: 1800, agingMonths: 24 },
  { id: 'ua-r-2', name: 'Shabo Grande Reserve', type: 'Red', origin: 'Ukrainian', grape: 'Каберне Совіньйон', region: 'Одещина', year: 2017, body: 4, tannins: 4, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Чорна смородина, ваніль', foodPairing: 'Стейк, тверді сири', price: 1200, agingMonths: 18 },
  { id: 'ua-r-3', name: 'Колоніст Каберне Мерло', type: 'Red', origin: 'Ukrainian', grape: 'Каберне, Мерло', region: 'Придунайська Бессарабія', year: 2019, body: 4, tannins: 3, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Ягоди, слива', foodPairing: 'Смажена качка', price: 650, agingMonths: 9 },
  { id: 'ua-r-4', name: 'Stakhovsky Ace Merlot', type: 'Red', origin: 'Ukrainian', grape: 'Мерло', region: 'Закарпаття', year: 2019, body: 3, tannins: 3, acidity: 3, sweetness: 1, alcohol: '13.8%', aroma: 'Вишня, трюфель', foodPairing: 'Телятина', price: 850, agingMonths: 12 },
  { id: 'ua-r-5', name: 'Одеський Чорний Князя Трубецького', type: 'Red', origin: 'Ukrainian', grape: 'Одеський Чорний', region: 'Херсонщина', year: 2020, body: 4, tannins: 4, acidity: 3, sweetness: 1, alcohol: '13.5%', aroma: 'Тютюн, ожина', foodPairing: 'Баранина', price: 450, agingMonths: 6 },
  { id: 'ua-r-6', name: 'Artania Red Beykush', type: 'Red', origin: 'Ukrainian', grape: 'Каберне, Мерло, Сапераві', region: 'Миколаївщина', year: 2021, body: 3, tannins: 2, acidity: 3, sweetness: 1, alcohol: '13.0%', aroma: 'Червоні ягоди, спеції', foodPairing: 'Піца, легкі м’ясні закуски', price: 380, agingMonths: 0 },
  { id: 'ua-r-7', name: 'Chateau Chizay Cabernet', type: 'Red', origin: 'Ukrainian', grape: 'Каберне Совіньйон', region: 'Закарпаття', year: 2020, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '12.5%', aroma: 'Пасльон, сап’ян', foodPairing: 'Гриби, червоне м’ясо', price: 320, agingMonths: 6 },

  // --- ЧЕРВОНІ ЕКСПОРТНІ ---
  { id: 'ex-r-1', name: 'Chateau Margaux', type: 'Red', origin: 'Export', grape: 'Каберне Совіньйон', region: 'Бордо, Франція', year: 2015, body: 5, tannins: 5, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Ожина, кедр, тютюн', foodPairing: 'Ягнятина, яловичина', price: 24000, agingMonths: 36 },
  { id: 'ex-r-2', name: 'Tignanello Antinori', type: 'Red', origin: 'Export', grape: 'Санджовезе, Каберне', region: 'Тоскана, Італія', year: 2019, body: 4, tannins: 4, acidity: 4, sweetness: 1, alcohol: '14.0%', aroma: 'Ягоди, прянощі, графіт', foodPairing: 'Паста з рагу, стейк', price: 6500, agingMonths: 24 },
  { id: 'ex-r-3', name: 'Penfolds Bin 389', type: 'Red', origin: 'Export', grape: 'Каберне Шираз', region: 'Південна Австралія', year: 2019, body: 5, tannins: 5, acidity: 3, sweetness: 1, alcohol: '14.5%', aroma: 'Слива, шоколад, м’ята', foodPairing: 'Стейк на вугіллі', price: 3500, agingMonths: 18 },
  { id: 'ex-r-4', name: 'Muga Reserva Rioja', type: 'Red', origin: 'Export', grape: 'Темпранільйо', region: 'Ріоха, Іспанія', year: 2018, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '14.0%', aroma: 'Шкіра, ваніль, ожина', foodPairing: 'Хамон, зрілі сири', price: 1100, agingMonths: 24 },
  { id: 'ex-r-5', name: 'Catena Malbec', type: 'Red', origin: 'Export', grape: 'Мальбек', region: 'Мендоса, Аргентина', year: 2021, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '13.5%', aroma: 'Фіалка, слива, чорний перець', foodPairing: 'Гриль, бургери', price: 750, agingMonths: 12 },
  { id: 'ex-r-6', name: 'Yellow Tail Shiraz', type: 'Red', origin: 'Export', grape: 'Шираз', region: 'Австралія', year: 2022, body: 3, tannins: 2, acidity: 3, sweetness: 2, alcohol: '13.5%', aroma: 'Джем, спеції', foodPairing: 'Барбекю', price: 290, agingMonths: 0 },

  // --- БІЛІ УКРАЇНСЬКІ ---
  { id: 'ua-w-1', name: 'Beykush Арбіна', type: 'White', origin: 'Ukrainian', grape: 'Ркацителі', region: 'Миколаївщина', year: 2019, body: 4, tannins: 2, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Айва, абрикос, горіхи', foodPairing: 'Гостра азійська кухня', price: 1100, agingMonths: 6 },
  { id: 'ua-w-2', name: 'Колоніст Рислінг', type: 'White', origin: 'Ukrainian', grape: 'Рислінг', region: 'Придунайська Бессарабія', year: 2021, body: 2, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Яблуко, мінерали, лайм', foodPairing: 'Морепродукти, річкова риба', price: 550, agingMonths: 0 },
  { id: 'ua-w-3', name: 'Shabo Reserve Chardonnay', type: 'White', origin: 'Ukrainian', grape: 'Шардоне', region: 'Одещина', year: 2021, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Білі квіти, вершки, персик', foodPairing: 'Птиця під вершковим соусом', price: 420, agingMonths: 4 },
  { id: 'ua-w-4', name: 'Chizay Furmint', type: 'White', origin: 'Ukrainian', grape: 'Фурмінт', region: 'Закарпаття', year: 2022, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Груша, мед, мінерали', foodPairing: 'М’які сири, салати', price: 340, agingMonths: 0 },
  { id: 'ua-w-5', name: 'Villa Tinta Сухолиманське', type: 'White', origin: 'Ukrainian', grape: 'Сухолиманський Білий', region: 'Одещина', year: 2022, body: 2, tannins: 1, acidity: 3, sweetness: 1, alcohol: '11.5%', aroma: 'Трава, польові квіти', foodPairing: 'Легкі закуски', price: 210, agingMonths: 0 },

  // --- БІЛІ ЕКСПОРТНІ ---
  { id: 'ex-w-1', name: 'Cloudy Bay Sauvignon Blanc', type: 'White', origin: 'Export', grape: 'Совіньйон Блан', region: 'Мальборо, Нова Зеландія', year: 2022, body: 2, tannins: 1, acidity: 5, sweetness: 1, alcohol: '13.0%', aroma: 'Грейпфрут, маракуя, аґрус', foodPairing: 'Козячий сир, спаржа', price: 1500, agingMonths: 0 },
  { id: 'ex-w-2', name: 'Santa Margherita Pinot Grigio', type: 'White', origin: 'Export', grape: 'Піно Гріджо', region: 'Альто-Адідже, Італія', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Зелене яблуко, цитрус', foodPairing: 'Різотто, морепродукти', price: 850, agingMonths: 0 },
  { id: 'ex-w-3', name: 'Louis Jadot Chablis', type: 'White', origin: 'Export', grape: 'Шардоне', region: 'Бургундія, Франція', year: 2021, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.5%', aroma: 'Кремінь, лимон, білий персик', foodPairing: 'Устриці, запечена риба', price: 1800, agingMonths: 0 },
  { id: 'ex-w-4', name: 'Dr. Loosen Riesling L', type: 'White', origin: 'Export', grape: 'Рислінг', region: 'Мозель, Німеччина', year: 2022, body: 2, tannins: 1, acidity: 5, sweetness: 3, alcohol: '8.5%', aroma: 'Персик, мінерали, абрикос', foodPairing: 'Гостра тайська їжа', price: 480, agingMonths: 0 },

  // --- РОЖЕВІ ---
  { id: 'ua-ro-1', name: 'Beykush Рожеве', type: 'Rosé', origin: 'Ukrainian', grape: 'Піно Нуар', region: 'Миколаївщина', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Полуниця, малина', foodPairing: 'Креветки, салати', price: 450, agingMonths: 0 },
  { id: 'ex-ro-1', name: 'Whispering Angel', type: 'Rosé', origin: 'Export', grape: 'Гренаш, Роль', region: 'Прованс, Франція', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Грейпфрут, квіти, персик', foodPairing: 'Середземноморська кухня', price: 1350, agingMonths: 0 },
  { id: 'ua-ro-2', name: 'Chateau Chizay Pinot Noir Rose', type: 'Rosé', origin: 'Ukrainian', grape: 'Піно Нуар', region: 'Закарпаття', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.0%', aroma: 'Барбарис, вишня', foodPairing: 'Фрукти, м’які сири', price: 290, agingMonths: 0 },

  // --- ІГРИСТІ ---
  { id: 'ua-s-1', name: 'Artwinery Artwine 18', type: 'Sparkling', origin: 'Ukrainian', grape: 'Шардоне, Рислінг', region: 'Бахмут/Одеса', year: 2018, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Випічка, яблуко, цитрус', foodPairing: 'Ікра, тверді сири', price: 650, agingMonths: 18 },
  { id: 'ex-s-1', name: 'Moet & Chandon Imperial', type: 'Sparkling', origin: 'Export', grape: 'Піно Нуар, Шардоне', region: 'Шампань, Франція', year: 0, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Бріош, зелене яблуко, горіхи', foodPairing: 'Суші, аперитив', price: 2800, agingMonths: 24 },
  { id: 'ex-s-2', name: 'Mionetto Prosecco DOC', type: 'Sparkling', origin: 'Export', grape: 'Глера', region: 'Венето, Італія', year: 0, body: 2, tannins: 1, acidity: 4, sweetness: 2, alcohol: '11.0%', aroma: 'Груша, мед, акація', foodPairing: 'Десерти, фрукти', price: 550, agingMonths: 0 },
  { id: 'ua-s-2', name: 'Shabo Classic Brut', type: 'Sparkling', origin: 'Ukrainian', grape: 'Шардоне, Піно Нуар', region: 'Одещина', year: 0, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Цитрус, квіти', foodPairing: 'Біла риба', price: 320, agingMonths: 12 },
  { id: 'ex-s-3', name: 'Freixenet Cordon Negro', type: 'Sparkling', origin: 'Export', grape: 'Парельяда', region: 'Каталонія, Іспанія', year: 0, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '11.5%', aroma: 'Яблуко, лимон', foodPairing: 'Тапас, легкі закуски', price: 480, agingMonths: 9 },

  // --- ДЕСЕРТНІ ---
  { id: 'ua-d-1', name: 'Колоніст Мускатне', type: 'Dessert', origin: 'Ukrainian', grape: 'Мускат Оттонель', region: 'Придунайська Бессарабія', year: 2021, body: 4, tannins: 1, acidity: 3, sweetness: 5, alcohol: '12.0%', aroma: 'Чайна троянда, екзотичні фрукти', foodPairing: 'Блакитні сири, випічка', price: 450, agingMonths: 0 },
  { id: 'ex-d-1', name: 'Chateau d’Yquem', type: 'Dessert', origin: 'Export', grape: 'Семійон, Совіньйон', region: 'Сотерн, Франція', year: 2017, body: 5, tannins: 1, acidity: 5, sweetness: 5, alcohol: '13.5%', aroma: 'Мед, шафран, курага', foodPairing: 'Фуа-гра, рокфор', price: 18000, agingMonths: 36 },
  { id: 'ex-d-2', name: 'Graham’s 10 Year Old Tawny Port', type: 'Dessert', origin: 'Export', grape: 'Туріга Насьональ', region: 'Дору, Португалія', year: 0, body: 5, tannins: 2, acidity: 3, sweetness: 5, alcohol: '20.0%', aroma: 'Горіхи, інжир, карамель', foodPairing: 'Горіховий торт, шоколад', price: 1250, agingMonths: 120 },
  { id: 'ua-d-2', name: 'Chizay Троянда Карпат', type: 'Dessert', origin: 'Ukrainian', grape: 'Трамінер Рожевий', region: 'Закарпаття', year: 2017, body: 5, tannins: 1, acidity: 4, sweetness: 5, alcohol: '16.0%', aroma: 'Троянда, мед, спеції', foodPairing: 'Витримані сири, горіхи', price: 780, agingMonths: 24 }
];

export const WINE_TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'];
export const ORIGIN_TYPES = ['Ukrainian', 'Export'];

export const POPULAR_NOTES = [
  'Ягоди', 'Ожина', 'Вишня', 'Слива', 'Дуб', 'Ваніль', 'Шоколад', 'Тютюн', 
  'Прянощі', 'Цитрус', 'Яблуко', 'Груша', 'Персик', 'Абрикос', 'Квіти', 
  'Мінерали', 'Мед', 'Трюфель', 'Трава', 'Кедр', 'Кремінь', 'Бріош', 'Троянда', 'Горіхи'
];
