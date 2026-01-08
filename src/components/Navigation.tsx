import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Search, Heart, Sparkles, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { AppView } from '../types';

interface NavigationProps {
    currentView: AppView;
    onChangeView: (view: AppView) => void;
    cartCount?: number;
}

const navItems = [
    { id: 'sommelier', icon: Sparkles, label: 'Expert' },
    { id: 'database', icon: Wine, label: 'Collection' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
];

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl shadow-black/50">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id as AppView)}
                            className="relative group px-6 py-3 rounded-full flex items-center gap-2 overflow-hidden transition-all duration-300"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <Icon
                                size={20}
                                className={clsx(
                                    "relative z-10 transition-colors duration-300",
                                    isActive ? "text-gold" : "text-white/40 group-hover:text-white/80"
                                )}
                            />

                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 'auto', opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="relative z-10 text-xs font-bold uppercase tracking-widest text-white whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Navigation;
