import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, Star, Thermometer, Wind, Share2, Award, Zap } from 'lucide-react';
import { Wine } from '../types';
import clsx from 'clsx'; // Make sure clsx is imported

interface WineDetailsPanelProps {
    wine: Wine | null;
    isOpen: boolean;
    onClose: () => void;
}

const StatBar: React.FC<{ label: string; value: number; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <Icon size={14} className="text-white/60" />
        </div>
        <div className="flex-grow">
            <div className="flex justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{label}</span>
                <span className="text-[10px] uppercase font-bold text-gold">{value}/5</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                />
            </div>
        </div>
    </div>
);

const WineDetailsPanel: React.FC<WineDetailsPanelProps> = ({ wine, isOpen, onClose }) => {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!wine) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[45%] lg:w-[35%] bg-[#0B0C10] border-l border-white/10 shadow-2xl z-[70] overflow-y-auto hide-scrollbar"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {/* Hero Image Section */}
                        <div className={clsx(
                            "h-64 relative overflow-hidden",
                            wine.type === 'Red' && "bg-gradient-to-b from-red-950 via-[#0B0C10] to-[#0B0C10]",
                            wine.type === 'White' && "bg-gradient-to-b from-yellow-900/40 via-[#0B0C10] to-[#0B0C10]",
                            wine.type === 'Rosé' && "bg-gradient-to-b from-pink-900/40 via-[#0B0C10] to-[#0B0C10]",
                            wine.type === 'Sparkling' && "bg-gradient-to-b from-amber-700/30 via-[#0B0C10] to-[#0B0C10]",
                            wine.type === 'Dessert' && "bg-gradient-to-b from-orange-900/40 via-[#0B0C10] to-[#0B0C10]",
                        )}>
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0C10] to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <span className="text-[10rem]">🍷</span>
                            </div>
                        </div>

                        <div className="px-10 -mt-10 relative">
                            {/* Badges */}
                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">
                                    {wine.origin} Collection
                                </span>
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold/10 text-gold border border-gold/10">
                                    {wine.rating || 'N/A'} Rating
                                </span>
                            </div>

                            <h2 className="font-serif text-4xl text-white mb-2 leading-tight">
                                {wine.name}
                            </h2>
                            <div className="flex items-center gap-2 text-subtle font-sans text-sm mb-8">
                                <span>{wine.region}, {wine.country}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{wine.year}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10 border-y border-white/5 py-6">
                                <div>
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-1">Grapes</span>
                                    <span className="text-white font-serif italic text-lg">{wine.grape}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-1">Alcohol</span>
                                    <span className="text-white font-serif italic text-lg">{wine.alcohol}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-1">Aging</span>
                                    <span className="text-white font-serif italic text-lg">{wine.agingMonths} Months</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase font-bold tracking-widest text-subtle mb-1">Price</span>
                                    <span className="text-gold font-serif italic text-lg">{wine.price} ₴</span>
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div>
                                    <h3 className="text-lg font-serif text-white mb-4">Aroma Profile</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {wine.aroma.split(',').map(note => (
                                            <span key={note} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/80 hover:bg-white/10 transition-colors cursor-default">
                                                {note.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-serif text-white mb-4">Characteristics</h3>
                                    <StatBar label="Body" value={wine.body} icon={Droplet} />
                                    <StatBar label="Tannins" value={wine.tannins} icon={Wind} />
                                    <StatBar label="Acidity" value={wine.acidity} icon={Zap} />
                                    <StatBar label="Sweetness" value={wine.sweetness} icon={Star} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-serif text-white mb-4">Sommelier's Note</h3>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 italic text-white/70 font-serif leading-relaxed">
                                        "{wine.description || `An exquisite ${wine.year} ${wine.type} from ${wine.region}. It pairs beautifully with ${wine.foodPairing.toLowerCase()}.`}"
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-widest rounded-xl transition-all mb-10 shadow-[0_0_30px_rgba(114,47,55,0.3)] hover:shadow-[0_0_40px_rgba(114,47,55,0.5)]">
                                Add to Collection
                            </button>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WineDetailsPanel;
