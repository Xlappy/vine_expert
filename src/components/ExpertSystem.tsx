
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, UserPreferences, Recommendation } from '../types';
import { SommelierService } from '../services/sommelierService';
import { WINE_TYPES, POPULAR_NOTES } from '../constants';
import WineCard from './WineCard';
import { Filter, ChevronRight, RotateCcw, Sparkles, Wine as WineIcon } from 'lucide-react';
import clsx from 'clsx';

interface ExpertSystemProps {
    wines: Wine[];
    onWineClick: (id: string | number) => void;
    favorites: string[];
    onToggleFavorite: (e: React.MouseEvent, id: string | number) => void;
}

const ExpertSystem: React.FC<ExpertSystemProps> = ({ wines, onWineClick, favorites, onToggleFavorite }) => {
    const [preferences, setPreferences] = useState<UserPreferences>({
        likedStyles: ['Red'],
        dislikedGrapes: [],
        priceRange: [0, 10000],
        yearRange: [2000, 2024],
        favoriteNotes: [],
        dislikedNotes: [],
        preferredRegions: [],
        minAging: 0,
        preferredBody: 3,
    });

    const [excludedWineIds, setExcludedWineIds] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const sommelierService = useMemo(() => new SommelierService(), []);

    const toggleStyle = useCallback((style: string) => {
        setPreferences(prev => ({
            ...prev,
            likedStyles: prev.likedStyles.includes(style)
                ? prev.likedStyles.filter(s => s !== style)
                : [...prev.likedStyles, style]
        }));
    }, []);

    const toggleNote = useCallback((note: string, mode: 'like' | 'dislike') => {
        setPreferences(prev => {
            if (mode === 'like') {
                const isLiked = prev.favoriteNotes.includes(note);
                return {
                    ...prev,
                    favoriteNotes: isLiked ? prev.favoriteNotes.filter(n => n !== note) : [...prev.favoriteNotes, note],
                    dislikedNotes: prev.dislikedNotes.filter(n => n !== note)
                };
            } else {
                const isDisliked = prev.dislikedNotes.includes(note);
                return {
                    ...prev,
                    dislikedNotes: isDisliked ? prev.dislikedNotes.filter(n => n !== note) : [...prev.dislikedNotes, note],
                    favoriteNotes: prev.favoriteNotes.filter(n => n !== note)
                };
            }
        });
    }, []);

    const excludeWine = useCallback((id: string | number) => {
        setExcludedWineIds(prev => [...prev, String(id)]);
    }, []);

    const recommendations = useMemo(() => {
        return sommelierService.getRecommendations(wines, preferences, excludedWineIds);
    }, [wines, preferences, sommelierService, excludedWineIds]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in relative">
            {/* Sidebar Filters */}
            <motion.div
                initial={false}
                animate={{ width: isFilterOpen ? '320px' : '60px' }}
                className="glass-panel rounded-[2rem] overflow-hidden shrink-0 hidden lg:block relative min-h-[600px]"
            >
                <div className={clsx("p-8 h-full transition-opacity duration-300", !isFilterOpen && "opacity-0 pointer-events-none")}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-serif text-2xl text-white">Filters</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setExcludedWineIds([])}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-subtle hover:text-white transition-colors"
                                title="Reset replaced wines"
                            >
                                <RotateCcw size={14} className="rotate-180" />
                            </button>
                            <button onClick={() => setPreferences({
                                likedStyles: [],
                                dislikedGrapes: [],
                                priceRange: [0, 10000],
                                yearRange: [2000, 2024],
                                favoriteNotes: [],
                                dislikedNotes: [],
                                preferredRegions: [],
                                minAging: 0,
                                preferredBody: 3,
                            })} className="p-1.5 rounded-lg hover:bg-white/5 text-subtle hover:text-white transition-colors" title="Reset preferences">
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8 h-[calc(100vh-400px)] overflow-y-auto pr-2 hide-scrollbar">
                        {/* Wine Styles */}
                        <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-4">Wine Style</span>
                            <div className="flex flex-wrap gap-2">
                                {WINE_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleStyle(type)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-full text-xs transition-all border",
                                            preferences.likedStyles.includes(type)
                                                ? "bg-primary border-primary text-white"
                                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preferred Body */}
                        <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-4">Body Intensity ({preferences.preferredBody}/5)</span>
                            <input
                                type="range" min="1" max="5" step="1"
                                value={preferences.preferredBody}
                                onChange={(e) => setPreferences(prev => ({ ...prev, preferredBody: parseInt(e.target.value) }))}
                                className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Price Filter */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle">Min Price</span>
                                    <span className="text-[10px] font-bold text-gold">{preferences.priceRange[0]} ₴</span>
                                </div>
                                <input
                                    type="range" min="0" max="5000" step="50"
                                    value={preferences.priceRange[0]}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, priceRange: [Math.min(parseInt(e.target.value), prev.priceRange[1]), prev.priceRange[1]] }))}
                                    className="w-full accent-gold h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle">Max Price</span>
                                    <span className="text-[10px] font-bold text-gold">{preferences.priceRange[1]} ₴</span>
                                </div>
                                <input
                                    type="range" min="0" max="10000" step="100"
                                    value={preferences.priceRange[1]}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, priceRange: [prev.priceRange[0], Math.max(parseInt(e.target.value), prev.priceRange[0])] }))}
                                    className="w-full accent-gold h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Aroma Notes (Like/Dislike) */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle">Aroma Profiles</span>
                                <span className="text-[9px] text-white/20 italic">Dbl-click to dislike</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_NOTES.map(note => {
                                    const isLiked = preferences.favoriteNotes.includes(note);
                                    const isDisliked = preferences.dislikedNotes.includes(note);
                                    return (
                                        <button
                                            key={note}
                                            onClick={() => toggleNote(note, 'like')}
                                            onDoubleClick={(e) => {
                                                e.preventDefault();
                                                toggleNote(note, 'dislike');
                                            }}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-lg text-[10px] transition-all border select-none",
                                                isLiked && "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
                                                isDisliked && "bg-red-500/20 border-red-500/50 text-red-400",
                                                !isLiked && !isDisliked && "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                            )}
                                        >
                                            {note}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="absolute top-8 right-4 text-white/40 hover:text-white transition-colors"
                >
                    {isFilterOpen ? <ChevronRight className="rotate-180" size={20} /> : <Filter size={20} />}
                </button>
            </motion.div>

            {/* Recommendations Content */}
            <div className="flex-grow min-h-[600px]">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                            <Sparkles className="text-gold" size={24} />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl text-white">Expert Matches</h2>
                            <p className="text-xs text-subtle uppercase tracking-widest font-bold">Top {recommendations.length} recommendations</p>
                        </div>
                    </div>
                    {excludedWineIds.length > 0 && (
                        <button
                            onClick={() => setExcludedWineIds([])}
                            className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-gold/30"
                        >
                            Reset {excludedWineIds.length} replacements
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {recommendations.map((rec) => {
                            const wine = wines.find(w => String(w.id) === String(rec.wineId));
                            if (!wine) return null;
                            return (
                                <motion.div
                                    key={wine.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    layout
                                >
                                    <div className="relative group">
                                        <WineCard
                                            wine={wine}
                                            onClick={() => onWineClick(wine.id)}
                                            isFavorite={favorites.includes(String(wine.id))}
                                            onToggleFavorite={(e) => onToggleFavorite(e, wine.id)}
                                        />

                                        {/* Dynamic Replacement & Analysis UI */}
                                        <div className="absolute top-4 inset-x-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                                            <div className="glass-panel p-5 rounded-2xl border-gold/30 bg-slate-950/90 shadow-2xl pointer-events-auto">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                                        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Expert Analysis</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-white/60">{rec.score}% Match</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                excludeWine(wine.id);
                                                            }}
                                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold transition-colors"
                                                            title="Find another similar wine"
                                                        >
                                                            <RotateCcw size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-white/90 italic leading-relaxed font-serif mb-4">
                                                    "{rec.explanation}"
                                                </p>
                                                <div className="flex gap-2 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gold" style={{ width: `${rec.score}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {recommendations.length === 0 && (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-40">
                        <WineIcon size={64} className="mb-6 stroke-1" />
                        <p className="font-serif text-2xl mb-2">No matches found.</p>
                        <p className="text-sm">Try resetting your exclusions or adjusting filters.</p>
                        <button
                            onClick={() => {
                                setExcludedWineIds([]);
                                setPreferences({
                                    likedStyles: [],
                                    dislikedGrapes: [],
                                    priceRange: [0, 10000],
                                    yearRange: [2000, 2024],
                                    favoriteNotes: [],
                                    dislikedNotes: [],
                                    preferredRegions: [],
                                    minAging: 0,
                                    preferredBody: 3,
                                });
                            }}
                            className="mt-6 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            Reset All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertSystem;
