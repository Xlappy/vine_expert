import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Wine, UserPreferences, Recommendation, AppView } from './types';
import { SommelierService } from './services/geminiService';
import { api } from './services/api';
import WineTable from './components/WineTable';
import PreferenceManager from './components/PreferenceManager';
import WineModal from './components/WineModal';
import ReplacementModal from './components/ReplacementModal';
import AddWineModal from './components/AddWineModal';

type DatabaseSubView = 'red_ua' | 'red_ex' | 'white_ua' | 'white_ex' | 'other';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('sommelier');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView>('red_ua');
  const [wines, setWines] = useState<Wine[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    likedStyles: ['Red'],
    dislikedGrapes: [],
    priceRange: [200, 5000],
    yearRange: [2015, 2024],
    favoriteNotes: ['Ягоди', 'Дуб'],
    dislikedNotes: [],
    preferredRegions: [],
    minAging: 0,
    preferredBody: 3,
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [replacingId, setReplacingId] = useState<string | number | null>(null);
  const [selectedWineId, setSelectedWineId] = useState<string | number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Favorites handled locally for now or API? User didn't specify favorites API. 
  // We keep local storage for favorites but use number/string IDs
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('vinexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wines from API
  useEffect(() => {
    const loadWines = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.fetchWines();
        setWines(data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити базу вин. Перевірте з’єднання з сервером.');
      } finally {
        setLoading(false);
      }
    };
    loadWines();
  }, []);

  useEffect(() => {
    localStorage.setItem('vinexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const sommelier = useMemo(() => new SommelierService(), []);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    if (!hasAnalyzed) {
      setHasAnalyzed(true);
    }

    try {
      const recs = await sommelier.getRecommendations(wines, preferences);
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
      setError('Помилка при отриманні рекомендацій.');
    } finally {
      setLoading(false);
    }
  }, [wines, preferences, sommelier, hasAnalyzed]);

  const toggleFavorite = (id: string | number) => {
    const idStr = String(id);
    setFavorites(prev =>
      prev.includes(idStr) ? prev.filter(f => f !== idStr) : [...prev, idStr]
    );
  };

  const addWine = async (newWine: Wine) => {
    try {
      // Create copy without ID (DB handles it)
      const { id, ...wineData } = newWine;
      const created = await api.createWine(wineData);
      setWines(prev => [created, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add wine", err);
      alert('Помилка при додаванні вина');
    }
  };

  const autoReplace = async (oldId: string | number) => {
    const currentIds = recommendations.map(r => String(r.wineId));
    // Gemini service requires string IDs for exclusion logic usually, need to check
    // Actually getRecommendations definition: feedback?: { rejectedId: string, reason: str }
    // We are just asking for new recs. 
    // The previous logic was specialized in `sommelierService.ts`. 
    // In Gemini, we might need to re-prompt or just filter locally if we want simple replace.
    // For now, let's just ask Gemini again excluding the old one?
    // Implementation:
    const oldIdStr = String(oldId);

    setLoading(true);
    try {
      // We emulate "replace" by asking for new recommendations with a reject reason
      // Or simpler: filter out the old one from candidates passed to AI?
      // `sommelier.getRecommendations` takes `wines`. We can filter `wines` passed to it.
      const filteredWines = wines.filter(w => String(w.id) !== oldIdStr);
      const recs = await sommelier.getRecommendations(filteredWines, preferences, { rejectedId: oldIdStr, reason: "User requested replacement" });

      // Update only the replaced one? Or replace all?
      // The user wants to replace ONE card.
      // We can take the first new recommendation that isn't in current list.
      const newRec = recs.find(r => !currentIds.includes(String(r.wineId)));
      if (newRec) {
        setRecommendations(prev => prev.map(r => String(r.wineId) === oldIdStr ? newRec : r));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setReplacingId(null);
    }
  };

  const manualReplace = async (oldId: string | number, newWineId: string | number) => {
    // For manual replace, we just swap it. 
    // But we need the "explanation" which we don't have for the new wine.
    // We could ask AI for explanation for this specific wine?
    // Or just swap with generic text.
    // Ideally, we ask AI to explain why THIS specific wine fits.

    // Simplification for now: Just swap and keep old explanation or "Manual Selection".
    // Or call AI for single explanation?
    // The previous app logic: `newRec` was found in `allCandidates`.

    const wine = wines.find(w => w.id === newWineId);
    if (!wine) return;

    setRecommendations(prev => prev.map(r => String(r.wineId) === String(oldId) ? {
      wineId: newWineId,
      explanation: `Вино ${wine.name} було обрано вами вручну.`,
      score: 100
    } : r));
    setReplacingId(null);
  };

  const updateWineList = async (updatedWines: Wine[]) => {
    // Assuming single update for now as Table sends list but usually edits one
    // But `WineTable` sends `[editForm]` which is array of 1.
    for (const w of updatedWines) {
      try {
        await api.updateWine(w.id, w);
        setWines(prev => prev.map(existing => existing.id === w.id ? w : existing));
      } catch (e) {
        console.error("Update failed", e);
        alert("Не вдалося оновити вино");
      }
    }
  };

  // Handlers for deleting wines? WineTable has no delete button in provided code. 
  // It only has Edit.
  // If we need delete, we can add it. Use API `deleteWine`.

  const filteredDatabase = useMemo(() => {
    switch (dbSubView) {
      case 'red_ua': return wines.filter(w => w.type === 'Red' && w.origin === 'Ukrainian');
      case 'red_ex': return wines.filter(w => w.type === 'Red' && w.origin === 'Export');
      case 'white_ua': return wines.filter(w => w.type === 'White' && w.origin === 'Ukrainian');
      case 'white_ex': return wines.filter(w => w.type === 'White' && w.origin === 'Export');
      case 'other': return wines.filter(w => !['Red', 'White'].includes(w.type));
      default: return wines;
    }
  }, [wines, dbSubView]);

  const favoriteWines = useMemo(() => {
    return wines.filter(w => favorites.includes(String(w.id)));
  }, [wines, favorites]);

  const alternatives = useMemo(() => {
    if (!replacingId) return [];
    // Only show wines not currently recommended
    const currentIds = recommendations.map(r => String(r.wineId));
    return wines.filter(w => !currentIds.includes(String(w.id)));
    // Previous logic called sommelier to get ranked alternatives.
    // For now, return all available wines as alternatives for manual selection.
    // Or we could limit?
  }, [replacingId, wines, recommendations]);

  const getWineIcon = (type: string) => {
    switch (type) {
      case 'Red': return '🍷';
      case 'White': return '🥂';
      case 'Sparkling': return '🍾';
      case 'Rosé': return '🌸';
      default: return '🍶';
    }
  };

  const selectedWine = useMemo(() => wines.find(w => w.id === selectedWineId), [wines, selectedWineId]);
  const replacingWine = useMemo(() => wines.find(w => w.id === replacingId), [wines, replacingId]);

  if (error && wines.length === 0) {
    // Full screen error if no data
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f7] font-['Montserrat']">
        <div className="text-center p-10">
          <h1 className="text-3xl font-black text-stone-900 mb-4">ПОМИЛКА СЕРВЕРА</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold uppercase hover:bg-black transition-all">Спробувати ще раз</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen selection:bg-rose-100 pb-20 font-['Montserrat'] bg-[#fcf9f7]">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-2xl border-b border-stone-100 sticky top-0 z-[70] px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('sommelier'); setHasAnalyzed(false); setRecommendations([]); }}>
            <div className="w-9 h-9 bg-stone-900 rounded-lg flex items-center justify-center shadow-lg transition-all group-hover:scale-105">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <div>
              <h1 className="text-md font-black text-stone-900 leading-tight tracking-tight">VINEXPERT</h1>
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">Enterprise Sommelier</p>
            </div>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            {[
              { id: 'sommelier', label: 'Підбір' },
              { id: 'database', label: 'База знань' },
              { id: 'favorites', label: `Обране (${favorites.length})` },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id as AppView)}
                className={`px-5 py-2 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${view === btn.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-6 px-6">
        {view === 'favorites' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Ваша Колекція</h2>
            {favoriteWines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteWines.map(wine => (
                  <div key={wine.id} onClick={() => setSelectedWineId(wine.id)} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-5xl">{getWineIcon(wine.type)}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(wine.id); }} className="text-xl">❤️</button>
                    </div>
                    <h3 className="font-black text-xl text-stone-900 mb-1 leading-tight">{wine.name}</h3>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{wine.region} • {wine.year}</p>
                    <div className="mt-6 pt-4 border-t border-stone-50 flex justify-between items-center">
                      <span className="text-stone-900 font-black text-lg">{wine.price} ₴</span>
                      <span className="text-[10px] font-black text-rose-900 uppercase">Досьє →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 border-2 border-dashed border-stone-200 rounded-[3rem] bg-white/50">
                <p className="text-stone-300 font-black uppercase tracking-widest text-[10px]">Колекція порожня</p>
              </div>
            )}
          </div>
        )}

        {view === 'database' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">Реєстр</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-stone-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg hover:bg-black transition-all">+ Додати</button>
              </div>
              <div className="flex flex-wrap justify-center gap-1 p-1 bg-stone-100 rounded-xl">
                {['red_ua', 'red_ex', 'white_ua', 'white_ex', 'other'].map(sub => (
                  <button key={sub} onClick={() => setDbSubView(sub as DatabaseSubView)} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${dbSubView === sub ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-200'}`}>{sub.replace('_', ' ')}</button>
                ))}
              </div>
            </div>
            {/* Show loading state for db view if reloading? */}
            {loading && wines.length === 0 ? (
              <div className="text-center py-10">Завантаження...</div>
            ) : (
              <WineTable wines={filteredDatabase} onUpdate={updateWineList} title="Активні записи" />
            )}
          </div>
        )}

        {view === 'sommelier' && (
          <div className="relative">
            <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 ${hasAnalyzed ? 'items-start' : 'items-center justify-center pt-12 md:pt-20'}`}>

              <div className={`transition-all duration-700 ${hasAnalyzed ? 'lg:w-[320px] w-full shrink-0 sticky top-24' : 'max-w-2xl w-full text-center'}`}>
                {!hasAnalyzed && (
                  <div className="mb-10 animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter mb-4 leading-tight uppercase">ВИННИЙ <br /><span className="text-stone-400">АНАЛІЗ</span></h2>
                    <p className="text-stone-500 text-base font-medium max-w-md mx-auto leading-relaxed">Система VinExpert підбере ідеальну колекцію на основі ваших смакових преференцій.</p>
                  </div>
                )}

                <PreferenceManager preferences={preferences} onChange={setPreferences} compact={!hasAnalyzed} />

                <div className={`mt-8 ${!hasAnalyzed ? 'flex justify-center' : ''}`}>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className={`bg-stone-900 text-white font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${hasAnalyzed ? 'w-full py-4 rounded-2xl text-xs' : 'px-16 py-6 rounded-[2.5rem] text-lg'
                      } ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-black'}`}
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                    <span className="uppercase tracking-widest">{hasAnalyzed ? 'Оновити Аналіз' : 'Запустити Аналіз'}</span>
                  </button>
                </div>
              </div>

              {/* Results Canvas */}
              <div className={`flex-grow w-full transition-all duration-1000 ${hasAnalyzed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute invisible'}`}>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">РЕЗУЛЬТАТИ ПІДБОРУ</h3>
                  <span className="text-[9px] font-bold text-stone-400 uppercase border border-stone-200 px-3 py-1 rounded-full">Optimal Match Ready</span>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendations.map((rec) => {
                      const wine = wines.find(w => String(w.id) === String(rec.wineId));
                      if (!wine) return null;

                      return (
                        <div key={wine.id} className="bg-white rounded-[2.5rem] border border-stone-100 flex flex-col overflow-hidden transition-all hover:shadow-xl animate-fadeIn group h-full">
                          <div className={`p-8 pb-5 relative ${wine.type === 'Red' ? 'bg-rose-50/20' : wine.type === 'White' ? 'bg-amber-50/20' : 'bg-stone-50/20'}`}>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-4xl">{getWineIcon(wine.type)}</span>
                              <div className="text-right">
                                <div className="text-lg font-black text-stone-900">{wine.price} ₴</div>
                                <div className="text-[8px] font-bold text-rose-900 uppercase tracking-wider">MATCH: {rec.score || 95}%</div>
                              </div>
                            </div>
                            <h3 className="font-black text-xl text-stone-900 mb-1 leading-tight uppercase line-clamp-2 min-h-[3rem]">{wine.name}</h3>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                              <span>{wine.region}</span>
                              <span className="w-1 h-1 bg-stone-200 rounded-full my-auto"></span>
                              <span>{wine.year || 'N/A'}</span>
                              <span className="w-1 h-1 bg-stone-200 rounded-full my-auto"></span>
                              <span>{wine.agingMonths}М</span>
                            </div>
                          </div>

                          <div className="p-8 pt-5 flex-grow flex flex-col">
                            <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 mb-6 flex-grow">
                              <p className="text-[13px] text-stone-600 leading-relaxed font-medium italic line-clamp-4">
                                "{rec.explanation}"
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mb-1.5">Щільність</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map(b => <div key={b} className={`h-1 flex-1 rounded-full ${wine.body >= b ? 'bg-stone-900' : 'bg-stone-100'}`}></div>)}
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mb-1.5">Сорт</span>
                                <span className="text-[9px] font-black text-stone-900 uppercase truncate">{wine.grape}</span>
                              </div>
                            </div>

                            <div className="flex gap-3 mt-auto pt-4 border-t border-stone-50">
                              <button
                                onClick={() => setSelectedWineId(wine.id)}
                                className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-black transition-all active:scale-95"
                              >
                                Докладно
                              </button>
                              <button
                                onClick={() => setReplacingId(wine.id)}
                                className="flex-1 bg-white text-stone-900 border border-stone-200 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-stone-50 transition-all active:scale-95"
                              >
                                Замінити
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-stone-200 rounded-[3rem] px-10 text-center bg-white/40">
                    <span className="text-6xl mb-6 opacity-10">🔍</span>
                    <h3 className="text-xl font-black text-stone-900 mb-2 tracking-tight uppercase">
                      {loading ? 'Аналізуємо вподобання...' : 'Нічого не знайдено'}
                    </h3>
                    {!loading && <p className="text-stone-500 text-sm max-w-xs font-medium leading-relaxed">Спробуйте змінити фільтри або розширити ціновий діапазон.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 px-10 bg-white/80 backdrop-blur-xl border-t border-stone-100 z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SYSTEM ACTIVE</span>
            <span className={`opacity-30 hidden sm:inline ${error ? 'text-red-500 opacity-100' : ''}`}>
              {error ? `ERROR: ${error}` : 'DB v2.0 CONNECTED'}
            </span>
          </div>
          <div className="flex items-center gap-2 italic lowercase font-medium">
            vinexpert pro <span className="text-[8px] not-italic uppercase font-black text-stone-900">sommelier edition</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedWine && (
        <WineModal wine={selectedWine} isOpen={!!selectedWineId} onClose={() => setSelectedWineId(null)} isFavorite={favorites.includes(String(selectedWine.id))} onToggleFavorite={() => toggleFavorite(selectedWine.id)} />
      )}
      {replacingWine && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalWine={replacingWine} alternatives={alternatives} allWines={wines} onSelect={(newId) => manualReplace(replacingId!, newId)} onAutoSelect={() => autoReplace(replacingId!)} />
      )}
      <AddWineModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addWine} />
    </div>
  );
};

export default App;
