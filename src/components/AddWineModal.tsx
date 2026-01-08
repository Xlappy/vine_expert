
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Upload, Save } from 'lucide-react';
import { Wine, WineType } from '../types';
import { WINE_TYPES, ORIGIN_TYPES } from '../constants';

interface AddWineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (wine: Omit<Wine, 'id'>) => Promise<void>;
}

const AddWineModal: React.FC<AddWineModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState<Omit<Wine, 'id'>>({
        name: '',
        type: 'Red',
        origin: 'Ukrainian',
        grape: '',
        region: '',
        year: new Date().getFullYear(),
        body: 3,
        tannins: 3,
        acidity: 3,
        sweetness: 1,
        alcohol: '13.5%',
        aroma: '',
        foodPairing: '',
        price: 0,
        agingMonths: 0,
        description: '',
        country: 'Ukraine',
        rating: 4.5
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd(formData);
            onClose();
            // Reset form
            setFormData({
                name: '',
                type: 'Red',
                origin: 'Ukrainian',
                grape: '',
                region: '',
                year: new Date().getFullYear(),
                body: 3,
                tannins: 3,
                acidity: 3,
                sweetness: 1,
                alcohol: '13.5%',
                aroma: '',
                foodPairing: '',
                price: 0,
                agingMonths: 0,
                description: '',
                country: 'Ukraine',
                rating: 4.5
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h2 className="font-serif text-3xl text-white">Add New Vintage</h2>
                                <p className="text-subtle text-sm">Expand your digital cellar collection</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto hide-scrollbar flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Wine Name</label>
                                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="Grand Reserve Merlot..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Style</label>
                                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all">
                                                {WINE_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Vintage</label>
                                            <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Grape Variety</label>
                                        <input required name="grape" value={formData.grape} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="Merlot, Cabernet..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Region</label>
                                            <input required name="region" value={formData.region} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="Bordeaux" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Country</label>
                                            <input required name="country" value={formData.country} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="France" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Price (₴)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Alc %</label>
                                            <input name="alcohol" value={formData.alcohol} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="13.5%" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Characteristics */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        {[
                                            { name: 'body', label: 'Body' },
                                            { name: 'tannins', label: 'Tannins' },
                                            { name: 'acidity', label: 'Acidity' },
                                            { name: 'sweetness', label: 'Sweetness' }
                                        ].map(stat => (
                                            <div key={stat.name} className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <label className="text-[10px] uppercase font-bold tracking-widest text-subtle">{stat.label}</label>
                                                    <span className="text-xs text-gold">{(formData as any)[stat.name]}/5</span>
                                                </div>
                                                <input
                                                    type="range" min="1" max="5" step="1"
                                                    name={stat.name}
                                                    value={(formData as any)[stat.name]}
                                                    onChange={handleChange}
                                                    className="w-full accent-primary h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Aroma Notes</label>
                                        <input name="aroma" value={formData.aroma} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="Blackberry, Vanilla, Oak" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Food Pairing</label>
                                        <input name="foodPairing" value={formData.foodPairing} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-all" placeholder="Grilled lamb, Aged cheeses" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-subtle px-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:gold/50 outline-none transition-all resize-none" placeholder=" winemaker's notes..." />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(114,47,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Add to Collection</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddWineModal;
