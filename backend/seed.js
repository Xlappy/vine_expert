
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

const winesData = [
  // --- ЧЕРВОНІ УКРАЇНСЬКІ ---
  { name: 'Beykush Кара Кермен', type: 'Red', country: 'Ukraine', region: 'Миколаївщина', year: 2018, body: 5, tannins: 5, acidity: 3, sweetness: 1, alcohol: '14.5%', aroma: 'Сухофрукти, шоколад, спеції', foodPairing: 'М’ясо на грилі, дичина', price: 1800, agingMonths: 24, grape: 'Сапераві, Темпранільйо' },
  { name: 'Shabo Grande Reserve', type: 'Red', country: 'Ukraine', region: 'Одещина', year: 2017, body: 4, tannins: 4, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Чорна смородина, ваніль', foodPairing: 'Стейк, тверді сири', price: 1200, agingMonths: 18, grape: 'Каберне Совіньйон' },
  { name: 'Колоніст Каберне Мерло', type: 'Red', country: 'Ukraine', region: 'Придунайська Бессарабія', year: 2019, body: 4, tannins: 3, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Ягоди, слива', foodPairing: 'Смажена качка', price: 650, agingMonths: 9, grape: 'Каберне, Мерло' },
  { name: 'Stakhovsky Ace Merlot', type: 'Red', country: 'Ukraine', region: 'Закарпаття', year: 2019, body: 3, tannins: 3, acidity: 3, sweetness: 1, alcohol: '13.8%', aroma: 'Вишня, трюфель', foodPairing: 'Телятина', price: 850, agingMonths: 12, grape: 'Мерло' },
  { name: 'Одеський Чорний Князя Трубецького', type: 'Red', country: 'Ukraine', region: 'Херсонщина', year: 2020, body: 4, tannins: 4, acidity: 3, sweetness: 1, alcohol: '13.5%', aroma: 'Тютюн, ожина', foodPairing: 'Баранина', price: 450, agingMonths: 6, grape: 'Одеський Чорний' },
  { name: 'Artania Red Beykush', type: 'Red', country: 'Ukraine', region: 'Миколаївщина', year: 2021, body: 3, tannins: 2, acidity: 3, sweetness: 1, alcohol: '13.0%', aroma: 'Червоні ягоди, спеції', foodPairing: 'Піца, легкі м’ясні закуски', price: 380, agingMonths: 0, grape: 'Каберне, Мерло, Сапераві' },
  { name: 'Chateau Chizay Cabernet', type: 'Red', country: 'Ukraine', region: 'Закарпаття', year: 2020, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '12.5%', aroma: 'Пасльон, сап’ян', foodPairing: 'Гриби, червоне м’ясо', price: 320, agingMonths: 6, grape: 'Каберне Совіньйон' },

  // --- ЧЕРВОНІ ЕКСПОРТНІ ---
  { name: 'Chateau Margaux', type: 'Red', country: 'France', region: 'Бордо', year: 2015, body: 5, tannins: 5, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Ожина, кедр, тютюн', foodPairing: 'Ягнятина, яловичина', price: 24000, agingMonths: 36, grape: 'Каберне Совіньйон' },
  { name: 'Tignanello Antinori', type: 'Red', country: 'Italy', region: 'Тоскана', year: 2019, body: 4, tannins: 4, acidity: 4, sweetness: 1, alcohol: '14.0%', aroma: 'Ягоди, прянощі, графіт', foodPairing: 'Паста з рагу, стейк', price: 6500, agingMonths: 24, grape: 'Санджовезе, Каберне' },
  { name: 'Penfolds Bin 389', type: 'Red', country: 'Australia', region: 'Південна Австралія', year: 2019, body: 5, tannins: 5, acidity: 3, sweetness: 1, alcohol: '14.5%', aroma: 'Слива, шоколад, м’ята', foodPairing: 'Стейк на вугіллі', price: 3500, agingMonths: 18, grape: 'Каберне Шираз' },
  { name: 'Muga Reserva Rioja', type: 'Red', country: 'Spain', region: 'Ріоха', year: 2018, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '14.0%', aroma: 'Шкіра, ваніль, ожина', foodPairing: 'Хамон, зрілі сири', price: 1100, agingMonths: 24, grape: 'Темпранільйо' },
  { name: 'Catena Malbec', type: 'Red', country: 'Argentina', region: 'Мендоса', year: 2021, body: 4, tannins: 3, acidity: 3, sweetness: 1, alcohol: '13.5%', aroma: 'Фіалка, слива, чорний перець', foodPairing: 'Гриль, бургери', price: 750, agingMonths: 12, grape: 'Мальбек' },
  { name: 'Yellow Tail Shiraz', type: 'Red', country: 'Australia', region: 'Австралія', year: 2022, body: 3, tannins: 2, acidity: 3, sweetness: 2, alcohol: '13.5%', aroma: 'Джем, спеції', foodPairing: 'Барбекю', price: 290, agingMonths: 0, grape: 'Шираз' },

  // --- БІЛІ УКРАЇНСЬКІ ---
  { name: 'Beykush Арбіна', type: 'White', country: 'Ukraine', region: 'Миколаївщина', year: 2019, body: 4, tannins: 2, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Айва, абрикос, горіхи', foodPairing: 'Гостра азійська кухня', price: 1100, agingMonths: 6, grape: 'Ркацителі' },
  { name: 'Колоніст Рислінг', type: 'White', country: 'Ukraine', region: 'Придунайська Бессарабія', year: 2021, body: 2, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Яблуко, мінерали, лайм', foodPairing: 'Морепродукти, річкова риба', price: 550, agingMonths: 0, grape: 'Рислінг' },
  { name: 'Shabo Reserve Chardonnay', type: 'White', country: 'Ukraine', region: 'Одещина', year: 2021, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '13.5%', aroma: 'Білі квіти, вершки, персик', foodPairing: 'Птиця під вершковим соусом', price: 420, agingMonths: 4, grape: 'Шардоне' },
  { name: 'Chizay Furmint', type: 'White', country: 'Ukraine', region: 'Закарпаття', year: 2022, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Груша, мед, мінерали', foodPairing: 'М’які сири, салати', price: 340, agingMonths: 0, grape: 'Фурмінт' },
  { name: 'Villa Tinta Сухолиманське', type: 'White', country: 'Ukraine', region: 'Одещина', year: 2022, body: 2, tannins: 1, acidity: 3, sweetness: 1, alcohol: '11.5%', aroma: 'Трава, польові квіти', foodPairing: 'Легкі закуски', price: 210, agingMonths: 0, grape: 'Сухолиманський Білий' },

  // --- БІЛІ ЕКСПОРТНІ ---
  { name: 'Cloudy Bay Sauvignon Blanc', type: 'White', country: 'New Zealand', region: 'Мальборо', year: 2022, body: 2, tannins: 1, acidity: 5, sweetness: 1, alcohol: '13.0%', aroma: 'Грейпфрут, маракуя, аґрус', foodPairing: 'Козячий сир, спаржа', price: 1500, agingMonths: 0, grape: 'Совіньйон Блан' },
  { name: 'Santa Margherita Pinot Grigio', type: 'White', country: 'Italy', region: 'Альто-Адідже', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Зелене яблуко, цитрус', foodPairing: 'Різотто, морепродукти', price: 850, agingMonths: 0, grape: 'Піно Гріджо' },
  { name: 'Louis Jadot Chablis', type: 'White', country: 'France', region: 'Бургундія', year: 2021, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.5%', aroma: 'Кремінь, лимон, білий персик', foodPairing: 'Устриці, запечена риба', price: 1800, agingMonths: 0, grape: 'Шардоне' },
  { name: 'Dr. Loosen Riesling L', type: 'White', country: 'Germany', region: 'Мозель', year: 2022, body: 2, tannins: 1, acidity: 5, sweetness: 3, alcohol: '8.5%', aroma: 'Персик, мінерали, абрикос', foodPairing: 'Гостра тайська їжа', price: 480, agingMonths: 0, grape: 'Рислінг' },

  // --- РОЖЕВІ ---
  { name: 'Beykush Рожеве', type: 'Rosé', country: 'Ukraine', region: 'Миколаївщина', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Полуниця, малина', foodPairing: 'Креветки, салати', price: 450, agingMonths: 0, grape: 'Піно Нуар' },
  { name: 'Whispering Angel', type: 'Rosé', country: 'France', region: 'Прованс', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '13.0%', aroma: 'Грейпфрут, квіти, персик', foodPairing: 'Середземноморська кухня', price: 1350, agingMonths: 0, grape: 'Гренаш, Роль' },
  { name: 'Chateau Chizay Pinot Noir Rose', type: 'Rosé', country: 'Ukraine', region: 'Закарпаття', year: 2022, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.0%', aroma: 'Барбарис, вишня', foodPairing: 'Фрукти, м’які сири', price: 290, agingMonths: 0, grape: 'Піно Нуар' },

  // --- ІГРИСТІ ---
  { name: 'Artwinery Artwine 18', type: 'Sparkling', country: 'Ukraine', region: 'Бахмут/Одеса', year: 2018, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Випічка, яблуко, цитрус', foodPairing: 'Ікра, тверді сири', price: 650, agingMonths: 18, grape: 'Шардоне, Рислінг' },
  { name: 'Moet & Chandon Imperial', type: 'Sparkling', country: 'France', region: 'Шампань', year: 0, body: 3, tannins: 1, acidity: 5, sweetness: 1, alcohol: '12.0%', aroma: 'Бріош, зелене яблуко, горіхи', foodPairing: 'Суші, аперитив', price: 2800, agingMonths: 24, grape: 'Піно Нуар, Шардоне' },
  { name: 'Mionetto Prosecco DOC', type: 'Sparkling', country: 'Italy', region: 'Венето', year: 0, body: 2, tannins: 1, acidity: 4, sweetness: 2, alcohol: '11.0%', aroma: 'Груша, мед, акація', foodPairing: 'Десерти, фрукти', price: 550, agingMonths: 0, grape: 'Глера' },
  { name: 'Shabo Classic Brut', type: 'Sparkling', country: 'Ukraine', region: 'Одещина', year: 0, body: 3, tannins: 1, acidity: 4, sweetness: 1, alcohol: '12.5%', aroma: 'Цитрус, квіти', foodPairing: 'Біла риба', price: 320, agingMonths: 12, grape: 'Шардоне, Піно Нуар' },
  { name: 'Freixenet Cordon Negro', type: 'Sparkling', country: 'Spain', region: 'Каталонія', year: 0, body: 2, tannins: 1, acidity: 4, sweetness: 1, alcohol: '11.5%', aroma: 'Яблуко, лимон', foodPairing: 'Тапас, легкі закуски', price: 480, agingMonths: 9, grape: 'Парельяда' },

  // --- ДЕСЕРТНІ ---
  { name: 'Колоніст Мускатне', type: 'Dessert', country: 'Ukraine', region: 'Придунайська Бессарабія', year: 2021, body: 4, tannins: 1, acidity: 3, sweetness: 5, alcohol: '12.0%', aroma: 'Чайна троянда, екзотичні фрукти', foodPairing: 'Блакитні сири, випічка', price: 450, agingMonths: 0, grape: 'Мускат Оттонель' },
  { name: 'Chateau d’Yquem', type: 'Dessert', country: 'France', region: 'Сотерн', year: 2017, body: 5, tannins: 1, acidity: 5, sweetness: 5, alcohol: '13.5%', aroma: 'Мед, шафран, курага', foodPairing: 'Фуа-гра, рокфор', price: 18000, agingMonths: 36, grape: 'Семійон, Совіньйон' },
  { name: 'Graham’s 10 Year Old Tawny Port', type: 'Dessert', country: 'Portugal', region: 'Дору', year: 0, body: 5, tannins: 2, acidity: 3, sweetness: 5, alcohol: '20.0%', aroma: 'Горіхи, інжир, карамель', foodPairing: 'Горіховий торт, шоколад', price: 1250, agingMonths: 120, grape: 'Туріга Насьональ' },
  { name: 'Chizay Троянда Карпат', type: 'Dessert', country: 'Ukraine', region: 'Закарпаття', year: 2017, body: 5, tannins: 1, acidity: 4, sweetness: 5, alcohol: '16.0%', aroma: 'Троянда, мед, спеції', foodPairing: 'Витримані сири, горіхи', price: 780, agingMonths: 24, grape: 'Трамінер Рожевий' }
];

console.log("Starting database initialization...");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS wines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    country TEXT,
    region TEXT,
    year INTEGER,
    rating REAL,
    price REAL,
    description TEXT,
    image_url TEXT,
    grape TEXT,
    body INTEGER,
    tannins INTEGER,
    acidity INTEGER,
    sweetness INTEGER,
    alcohol TEXT,
    aroma TEXT,
    foodPairing TEXT,
    agingMonths INTEGER
  )`);

  db.run(`DELETE FROM wines`);

  const stmt = db.prepare(`INSERT INTO wines (
    name, type, country, region, year, rating, price, description, image_url,
    grape, body, tannins, acidity, sweetness, alcohol, aroma, foodPairing, agingMonths
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  winesData.forEach(wine => {
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    stmt.run(
      wine.name, wine.type, wine.country, wine.region, wine.year, rating, wine.price,
      wine.aroma + '. ' + wine.foodPairing,
      null,
      wine.grape, wine.body, wine.tannins, wine.acidity, wine.sweetness, wine.alcohol,
      wine.aroma, wine.foodPairing, wine.agingMonths
    );
  });

  stmt.finalize(() => {
    console.log(`Database seeded with ${winesData.length} wines.`);
    db.close((err) => {
      if (err) console.error("Error closing database:", err.message);
      else console.log("Database connection closed.");
    });
  });
});
