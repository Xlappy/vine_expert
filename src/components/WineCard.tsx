import React from 'react';
import { motion } from 'framer-motion';
import { Wine, Heart, Info, Droplets, Grape, Clock } from 'lucide-react';
import { Wine as WineType } from '../types';
import clsx from 'clsx';

interface WineCardProps {
    wine: WineType;
    onClick: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent) => void;
}

const WineCard: React.FC<WineCardProps> = ({ wine, onClick, isFavorite, onToggleFavorite }) => {
    return (
        <motion.div
            layoutId={`wine-${wine.id}`}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative h-[420px] w-full rounded-[2rem] overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            {/* Background with abstract gradient based on wine type */}
            <div className={clsx(
                "absolute inset-0 transition-opacity duration-700",
                wine.type === 'Red' && "bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-900",
                wine.type === 'White' && "bg-gradient-to-br from-yellow-900/40 via-slate-900 to-slate-900",
                wine.type === 'Rosé' && "bg-gradient-to-br from-pink-900/40 via-slate-900 to-slate-900",
                wine.type === 'Sparkling' && "bg-gradient-to-br from-amber-700/30 via-slate-900 to-slate-900",
                wine.type === 'Dessert' && "bg-gradient-to-br from-orange-900/40 via-slate-900 to-slate-900",
            )} />

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500" />

            {/* Content Container */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10 border border-white/5 rounded-[2rem] shadow-2xl group-hover:border-white/10 transition-colors">

                {/* Top Badges */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md text-white/80 border border-white/5">
                            {wine.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md text-gold border border-white/5">
                            {wine.year || 'NV'}
                        </span>
                    </div>
                    <button
                        onClick={onToggleFavorite}
                        className={clsx(
                            "p-3 rounded-full backdrop-blur-md border transition-all duration-300",
                            isFavorite
                                ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(114,47,55,0.4)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Center Visual / Bottle Placeholder */}
                <div className="flex-grow flex items-center justify-center py-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform">
                    {/* Using icons for now, but imagine this is a bottle image */}
                    <Wine size={82} strokeWidth={0.5} className={clsx(
                        "drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]",
                        wine.type === 'Red' ? "text-red-700" :
                            wine.type === 'White' ? "text-yellow-100" :
                                wine.type === 'Rosé' ? "text-pink-300" :
                                    "text-amber-200"
                    )} />
                </div>

                {/* Bottom Info */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-serif text-2xl leading-none text-white font-medium mb-2 group-hover:text-gold transition-colors duration-300">
                            {wine.name}
                        </h3>
                        <p className="text-xs font-sans text-subtle uppercase tracking-wider line-clamp-1">
                            {wine.region}, {wine.country}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-white/60">
                                <Grape size={14} className="text-white/40" />
                                <span className="text-[10px] uppercase font-medium max-w-[80px] truncate">{wine.grape}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/60">
                                <Clock size={14} className="text-white/40" />
                                <span className="text-[10px] uppercase font-medium">{wine.agingMonths}m</span>
                            </div>
                        </div>
                        <span className="text-lg font-serif italic text-gold">
                            {wine.price} ₴
                        </span>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default WineCard;
