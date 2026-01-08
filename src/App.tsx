import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, UserPreferences, AppView } from './types';
import { api } from './services/api'; // Assuming this exists from previous step
import WineCard from './components/WineCard';
import WineDetailsPanel from './components/WineDetailsPanel';
import Navigation from './components/Navigation';
import SommelierAssistant from './components/SommelierAssistant';
import { Filter } from 'lucide-react';
import clsx from 'clsx';

function App() {
    const [view, setView] = useState<AppView>('database');
    const [wines, setWines] = useState<Wine[]>([]);
    const [selectedWineId, setSelectedWineId] = useState<string | number | null>(null);
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('vinexpert_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [preferences, setPreferences] = useState<UserPreferences>({
        likedStyles: ['Red'],
        dislikedGrapes: [],
        priceRange: [200, 5000],
        yearRange: [2015, 2024],
        favoriteNotes: [],
        dislikedNotes: [],
        preferredRegions: [],
        minAging: 0,
        preferredBody: 3,
    });
    const [loading, setLoading] = useState(true);

    // Load Data
    useEffect(() => {
        const loadWines = async () => {
            try {
                const data = await api.fetchWines();
                setWines(data);
            } catch (err) {
                console.error("Failed to load wines", err);
            } finally {
                // Pseudo loading delay for effect
                setTimeout(() => setLoading(false), 1000);
            }
        };
        loadWines();
    }, []);

    // Persist Favorites
    useEffect(() => {
        localStorage.setItem('vinexpert_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        const idStr = String(id);
        setFavorites(prev =>
            prev.includes(idStr) ? prev.filter(f => f !== idStr) : [...prev, idStr]
        );
    };

    const selectedWine = wines.find(w => w.id === selectedWineId) || null;

    // Filtering Logic
    const filteredWines = view === 'favorites'
        ? wines.filter(w => favorites.includes(String(w.id)))
        : wines;

    return (
        <div className="min-h-screen bg-background text-white selection:bg-gold/30 selection:text-gold font-sans overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
            </div>

            <div className="relative z-10 px-6 pt-12 pb-32 max-w-[1600px] mx-auto">

                {/* Header Area */}
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40 mb-4 tracking-tight drop-shadow-lg">
                            {view === 'favorites' ? 'My Cellar' : 'Wine Collection'}
                        </h1>
                        <p className="text-subtle font-medium text-sm md:text-base max-w-lg leading-relaxed">
                            Curated selection of premium vintages using advanced AI sommelier analysis.
                        </p>
                    </div>

                    {/* Simple Filter Trigger (Visual Only for now) */}
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-white/60 hover:text-white group">
                        <Filter size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
                    </button>
                </header>

                {/* Loading State */}
                {loading ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
                        <p className="text-white/40 font-serif italic animate-pulse">Decanting data...</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {filteredWines.map((wine) => (
                                <motion.div
                                    key={wine.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <WineCard
                                        wine={wine}
                                        onClick={() => setSelectedWineId(wine.id)}
                                        isFavorite={favorites.includes(String(wine.id))}
                                        onToggleFavorite={(e) => toggleFavorite(e, wine.id)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredWines.length === 0 && (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-40">
                        <p className="font-serif text-2xl mb-2">No wines found.</p>
                        <p className="text-sm">Try exploring the collection to add to your favorites.</p>
                    </div>
                )}

            </div>

            {/* Floating Navigation Dock */}
            <Navigation currentView={view} onChangeView={setView} />

            {/* Side Panel for Details */}
            <WineDetailsPanel
                wine={selectedWine}
                isOpen={!!selectedWineId}
                onClose={() => setSelectedWineId(null)}
            />

            {/* AI Sommelier Chat */}
            <SommelierAssistant
                wines={wines}
                preferences={preferences}
                onRecommendationSelect={(id) => setSelectedWineId(id)}
            />
        </div>
    );
}

export default App;
