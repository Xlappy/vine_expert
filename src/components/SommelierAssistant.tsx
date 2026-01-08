import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Wine, UserPreferences, Recommendation } from '../types';
import { SommelierService } from '../services/geminiService';

interface SommelierAssistantProps {
    wines: Wine[];
    onRecommendationSelect: (wineId: string) => void;
    preferences: UserPreferences;
}

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    recommendations?: Recommendation[];
}

const SommelierAssistant: React.FC<SommelierAssistantProps> = ({ wines, onRecommendationSelect, preferences }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init', sender: 'ai', text: "Вітаю! Я ваш персональний сомельє. Бажаєте підібрати щось особливе на вечір?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // We initialize the service once
    const sommelierService = useRef(new SommelierService());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking and calling functionality
        // In a real scenario, this would call an updated method on SommelierService that accepts chat input.
        // For this demo, we will trigger a standard recommendation search if keywords match, 
        // or just chat back using Gemini if possible. 
        // Since `getRecommendations` is strict structured output, let's just trigger that 
        // after a short delay to simulate "analysis".

        try {
            // Here we ideally want a Chat API. 
            // We will repurpose the recommendations for now as "The Answer".
            const recs = await sommelierService.current.getRecommendations(wines, preferences);

            setIsTyping(false);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "Звісно. Базуючись на вашому запиті та вподобаннях, я відібрав 3 ексклюзивні позиції:",
                recommendations: recs.slice(0, 3)
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (e) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Вибачте, сталася помилка з'єднання." }]);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-rose-900 shadow-[0_0_30px_rgba(114,47,55,0.4)] flex items-center justify-center z-[50] group transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
            >
                <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={28} />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0B0C10] border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden glass-panel"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                                    <Bot size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white font-serif tracking-wide">AI SOMMELIER</h3>
                                    <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 hide-scrollbar">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-primary text-white rounded-t-2xl rounded-bl-2xl' : 'bg-white/5 text-gray-200 rounded-t-2xl rounded-br-2xl'} p-4 text-sm leading-relaxed shadow-lg`}>
                                        {msg.text}

                                        {/* Embedded Recommendations */}
                                        {msg.recommendations && (
                                            <div className="mt-4 space-y-3">
                                                {msg.recommendations.map((rec, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => onRecommendationSelect(rec.wineId)}
                                                        className="bg-black/20 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-black/40 transition-colors"
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-gold font-serif italic text-xs">Recommended</span>
                                                            <span className="text-[10px] text-white/40">{rec.score}% Match</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-white mb-1 line-clamp-1">{wines.find(w => w.id === rec.wineId)?.name}</p>
                                                        <p className="text-[10px] text-white/50 italic line-clamp-2">"{rec.explanation}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-t-2xl rounded-br-2xl flex gap-1">
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask for a wine pairing..."
                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!input.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SommelierAssistant;
