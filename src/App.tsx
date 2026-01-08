import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, AppView } from './types';
import { api } from './services/api'; // Assuming this exists from previous step
import WineCard from './components/WineCard';
import WineDetailsPanel from './components/WineDetailsPanel';
import Navigation from './components/Navigation';
import ExpertSystem from './components/ExpertSystem';
import { Filter, Search, PlusCircle, ArrowUpDown } from 'lucide-react';
import clsx from 'clsx';
import AddWineModal from './components/AddWineModal';

function App() {
    const [view, setView] = useState<AppView>('database');
    const [wines, setWines] = useState<Wine[]>([]);
    const [selectedWineId, setSelectedWineId] = useState<string | number | null>(null);
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('vinexpert_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedType, setSelectedType] = useState<string | 'All'>('All');
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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

    const handleAddWine = async (newWine: Omit<Wine, 'id'>) => {
        try {
            const added = await api.createWine(newWine);
            setWines(prev => [added, ...prev]);
        } catch (err) {
            console.error("Failed to add wine", err);
            throw err;
        }
    };

    const selectedWine = wines.find(w => w.id === selectedWineId) || null;

    // Advanced Filtering Logic
    const filteredWines = wines.filter(wine => {
        // 1. View filter (favorites)
        if (view === 'favorites' && !favorites.includes(String(wine.id))) return false;

        // 2. Search query filter
        if (searchQuery) {
            const lowSearch = searchQuery.toLowerCase();
            const matches =
                wine.name.toLowerCase().includes(lowSearch) ||
                wine.grape.toLowerCase().includes(lowSearch) ||
                wine.region.toLowerCase().includes(lowSearch) ||
                wine.country?.toLowerCase().includes(lowSearch);
            if (!matches) return false;
        }

        // 3. Price filter
        if (wine.price < priceRange[0] || wine.price > priceRange[1]) return false;

        // 4. Type filter
        if (selectedType !== 'All' && wine.type !== selectedType) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-background text-white selection:bg-gold/30 selection:text-gold font-sans overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
            </div>

            <div className="relative z-10 px-6 pt-12 pb-32 max-w-[1600px] mx-auto">

                {/* Header Area */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40 mb-4 tracking-tight drop-shadow-lg">
                                {view === 'favorites' ? 'My Cellar' : view === 'sommelier' ? 'Expert Guide' : 'Collection'}
                            </h1>
                            <p className="text-subtle font-medium text-sm md:text-base max-w-lg leading-relaxed">
                                {view === 'sommelier'
                                    ? 'Personalized wine selection powered by expert heuristics.'
                                    : 'Manage your personal vintage collection and tasting notes.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 group"
                            >
                                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Add Wine</span>
                            </button>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    {view !== 'sommelier' && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="relative flex-grow group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={20} />
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name, grape, or region..."
                                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] pl-16 pr-6 py-5 text-white outline-none focus:border-gold/30 focus:bg-white/[0.07] transition-all"
                                    />
                                </div>

                                <button
                                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                    className={clsx(
                                        "px-8 py-5 rounded-[1.5rem] border flex items-center gap-3 transition-all",
                                        isFilterExpanded
                                            ? "bg-gold/10 border-gold/40 text-gold shadow-[0_0_20px_rgba(197,160,89,0.1)]"
                                            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                                    )}
                                >
                                    <Filter size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Advanced Filters</span>
                                </button>
                            </div>

                            <AnimatePresence>
                                {isFilterExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="glass-panel p-8 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-10">
                                            {/* Style Select */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-subtle">Wine Style</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['All', 'Red', 'White', 'Rosé', 'Sparkling', 'Dessert'].map(type => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setSelectedType(type)}
                                                            className={clsx(
                                                                "px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border",
                                                                selectedType === type
                                                                    ? "bg-primary border-primary text-white"
                                                                    : "bg-white/5 border-white/10 text-white/40 hover:white"
                                                            )}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price Range */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-subtle">Price Range</label>
                                                    <span className="text-[10px] font-bold text-gold">{priceRange[1]} ₴ Max</span>
                                                </div>
                                                <input
                                                    type="range" min="0" max="10000" step="100"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                    className="w-full accent-gold h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                                                />
                                            </div>

                                            {/* Sort Placeholder */}
                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-subtle">Sort By</label>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-white/40 hover:text-white flex items-center justify-center gap-2">
                                                        <ArrowUpDown size={14} /> Price
                                                    </button>
                                                    <button className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-white/40 hover:text-white flex items-center justify-center gap-2">
                                                        <ArrowUpDown size={14} /> Rating
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </header>

                {/* Loading State */}
                {loading ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
                        <p className="text-white/40 font-serif italic animate-pulse">Decanting data...</p>
                    </div>
                ) : (
                    view === 'sommelier' ? (
                        <ExpertSystem
                            wines={wines}
                            onWineClick={setSelectedWineId}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                        />
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
                    )
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

            {/* Modal for adding new wine */}
            <AddWineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddWine}
            />


        </div>
    );
}

export default App;
