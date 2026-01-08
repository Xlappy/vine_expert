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

const WineCard: React.FC<WineCardProps> = React.memo(({ wine, onClick, isFavorite, onToggleFavorite }) => {
    return (
        <motion.div
            layoutId={`wine-${wine.id}`}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative h-[420px] w-full rounded-[2rem] overflow-hidden cursor-pointer gpu-boost"
            onClick={onClick}
        >
            {/* Background with abstract gradient based on wine type - simplified for performance */}
            <div className={clsx(
                "absolute inset-0 transition-opacity duration-700",
                wine.type === 'Red' && "bg-gradient-to-br from-red-950/60 to-slate-950",
                wine.type === 'White' && "bg-gradient-to-br from-yellow-900/30 to-slate-950",
                wine.type === 'Rosé' && "bg-gradient-to-br from-pink-900/30 to-slate-950",
                wine.type === 'Sparkling' && "bg-gradient-to-br from-amber-700/20 to-slate-950",
                wine.type === 'Dessert' && "bg-gradient-to-br from-orange-900/30 to-slate-950",
            )} />

            {/* Content Container - simplified glass effect */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10 border border-white/5 rounded-[2rem] shadow-2xl group-hover:border-white/10 transition-colors bg-white/[0.02]">
                {/* Top Badges */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white/80 border border-white/5">
                            {wine.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/20 text-gold border border-gold/10">
                            {wine.year || 'NV'}
                        </span>
                    </div>
                    <button
                        onClick={onToggleFavorite}
                        className={clsx(
                            "p-3 rounded-full border transition-all duration-300",
                            isFavorite
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Center Visual */}
                <div className="flex-grow flex items-center justify-center py-6">
                    <Wine size={82} strokeWidth={0.5} className={clsx(
                        "drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110",
                        wine.type === 'Red' ? "text-red-700" :
                            wine.type === 'White' ? "text-yellow-100/80" :
                                wine.type === 'Rosé' ? "text-pink-300/80" :
                                    "text-amber-200/80"
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
                            <div className="flex items-center gap-1.5 text-white/50">
                                <Grape size={14} className="text-white/30" />
                                <span className="text-[10px] uppercase font-medium max-w-[80px] truncate">{wine.grape}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/50">
                                <Clock size={14} className="text-white/30" />
                                <span className="text-[10px] uppercase font-medium">{wine.agingMonths}m</span>
                            </div>
                        </div>
                        <span className="text-lg font-serif italic text-gold/90">
                            {wine.price} ₴
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default WineCard;
