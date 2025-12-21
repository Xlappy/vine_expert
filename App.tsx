
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Wine, UserPreferences, Recommendation, AppView } from './types';
import { INITIAL_WINES } from './constants';
import { SommelierService } from './services/sommelierService';
import WineTable from './components/WineTable';
import PreferenceManager from './components/PreferenceManager';
import WineModal from './components/WineModal';
import ReplacementModal from './components/ReplacementModal';
import AddWineModal from './components/AddWineModal';

type DatabaseSubView = 'red_ua' | 'red_ex' | 'white_ua' | 'white_ex' | 'other';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('sommelier');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView>('red_ua');
  const [wines, setWines] = useState<Wine[]>(() => {
    const saved = localStorage.getItem('vinexpert_db');
    return saved ? JSON.parse(saved) : INITIAL_WINES;
  });
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
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('vinexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('vinexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vinexpert_db', JSON.stringify(wines));
  }, [wines]);

  const sommelier = useMemo(() => new SommelierService(), []);

  const fetchRecommendations = useCallback(() => {
    setLoading(true);
    if (!hasAnalyzed) {
      setTimeout(() => setHasAnalyzed(true), 200);
    }
    
    setTimeout(() => {
      const recs = sommelier.getRecommendations(wines, preferences);
      setRecommendations(recs.slice(0, 3));
      setLoading(false);
    }, 1000);
  }, [wines, preferences, sommelier, hasAnalyzed]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addWine = (newWine: Wine) => {
    setWines(prev => [newWine, ...prev]);
    setIsAddModalOpen(false);
  };

  const autoReplace = (oldId: string) => {
    const currentIds = recommendations.map(r => r.wineId);
    const alternativesRecs = sommelier.getRecommendations(wines, preferences, currentIds);
    if (alternativesRecs.length > 0) {
      setRecommendations(prev => prev.map(r => r.wineId === oldId ? alternativesRecs[0] : r));
    }
    setReplacingId(null);
  };

  const manualReplace = (oldId: string, newWineId: string) => {
    const currentIds = recommendations.map(r => r.wineId);
    const allCandidates = sommelier.getRecommendations(wines, preferences, currentIds.filter(id => id !== oldId));
    const newRec = allCandidates.find(r => r.wineId === newWineId);
    if (newRec) {
      setRecommendations(prev => prev.map(r => r.wineId === oldId ? newRec : r));
    }
    setReplacingId(null);
  };

  const updateWineList = (updatedWines: Wine[]) => {
    setWines(prev => {
      const updatedMap = new Map(prev.map(w => [w.id, w]));
      updatedWines.forEach(w => updatedMap.set(w.id, w));
      return Array.from(updatedMap.values());
    });
  };

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
    return wines.filter(w => favorites.includes(w.id));
  }, [wines, favorites]);

  const alternatives = useMemo(() => {
    if (!replacingId) return [];
    const currentIds = recommendations.map(r => r.wineId);
    return sommelier.getRecommendations(wines, preferences, currentIds);
  }, [replacingId, wines, preferences, recommendations, sommelier]);

  const getWineIcon = (type: string) => {
    switch(type) {
      case 'Red': return '🍷';
      case 'White': return '🥂';
      case 'Sparkling': return '🍾';
      case 'Rosé': return '🌸';
      default: return '🍶';
    }
  };

  const selectedWine = useMemo(() => wines.find(w => w.id === selectedWineId), [wines, selectedWineId]);
  const replacingWine = useMemo(() => wines.find(w => w.id === replacingId), [wines, replacingId]);

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
                className={`px-5 py-2 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${
                  view === btn.id 
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
            <WineTable wines={filteredDatabase} onUpdate={updateWineList} title="Активні записи" />
          </div>
        )}

        {view === 'sommelier' && (
          <div className="relative">
            <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 ${hasAnalyzed ? 'items-start' : 'items-center justify-center pt-12 md:pt-20'}`}>
              
              <div className={`transition-all duration-700 ${hasAnalyzed ? 'lg:w-[320px] w-full shrink-0 sticky top-24' : 'max-w-2xl w-full text-center'}`}>
                {!hasAnalyzed && (
                  <div className="mb-10 animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter mb-4 leading-tight uppercase">ВИННИЙ <br/><span className="text-stone-400">АНАЛІЗ</span></h2>
                    <p className="text-stone-500 text-base font-medium max-w-md mx-auto leading-relaxed">Система VinExpert підбере ідеальну колекцію на основі ваших смакових преференцій.</p>
                  </div>
                )}
                
                <PreferenceManager preferences={preferences} onChange={setPreferences} compact={!hasAnalyzed} />
                
                <div className={`mt-8 ${!hasAnalyzed ? 'flex justify-center' : ''}`}>
                  <button 
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className={`bg-stone-900 text-white font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                      hasAnalyzed ? 'w-full py-4 rounded-2xl text-xs' : 'px-16 py-6 rounded-[2.5rem] text-lg'
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
                      const wine = wines.find(w => w.id === rec.wineId);
                      if (!wine) return null;

                      return (
                        <div key={wine.id} className="bg-white rounded-[2.5rem] border border-stone-100 flex flex-col overflow-hidden transition-all hover:shadow-xl animate-fadeIn group h-full">
                          <div className={`p-8 pb-5 relative ${wine.type === 'Red' ? 'bg-rose-50/20' : wine.type === 'White' ? 'bg-amber-50/20' : 'bg-stone-50/20'}`}>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-4xl">{getWineIcon(wine.type)}</span>
                              <div className="text-right">
                                <div className="text-lg font-black text-stone-900">{wine.price} ₴</div>
                                <div className="text-[8px] font-bold text-rose-900 uppercase tracking-wider">MATCH: {rec.score}%</div>
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
                                  {[1,2,3,4,5].map(b => <div key={b} className={`h-1 flex-1 rounded-full ${wine.body >= b ? 'bg-stone-900' : 'bg-stone-100'}`}></div>)}
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
                    <h3 className="text-xl font-black text-stone-900 mb-2 tracking-tight uppercase">Нічого не знайдено</h3>
                    <p className="text-stone-500 text-sm max-w-xs font-medium leading-relaxed">Спробуйте змінити фільтри або розширити ціновий діапазон.</p>
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
            <span className="opacity-30 hidden sm:inline">DB v1.5.0</span>
          </div>
          <div className="flex items-center gap-2 italic lowercase font-medium">
             vinexpert pro <span className="text-[8px] not-italic uppercase font-black text-stone-900">sommelier edition</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedWine && (
        <WineModal wine={selectedWine} isOpen={!!selectedWineId} onClose={() => setSelectedWineId(null)} isFavorite={favorites.includes(selectedWine.id)} onToggleFavorite={toggleFavorite} />
      )}
      {replacingWine && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalWine={replacingWine} alternatives={alternatives} allWines={wines} onSelect={(newId) => manualReplace(replacingId!, newId)} onAutoSelect={() => autoReplace(replacingId!)} />
      )}
      <AddWineModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addWine} />
    </div>
  );
};

export default App;
