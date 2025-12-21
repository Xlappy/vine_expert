
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { WINE_TYPES, POPULAR_NOTES } from '../constants';

interface PreferenceManagerProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  compact?: boolean;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, onChange, compact = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleStyle = (style: string) => {
    const newStyles = preferences.likedStyles.includes(style)
      ? preferences.likedStyles.filter(s => s !== style)
      : [...preferences.likedStyles, style];
    onChange({ ...preferences, likedStyles: newStyles });
  };

  const toggleNote = (note: string, type: 'like' | 'dislike') => {
    if (type === 'like') {
      const newNotes = preferences.favoriteNotes.includes(note)
        ? preferences.favoriteNotes.filter(n => n !== note)
        : [...preferences.favoriteNotes, note];
      const newDisliked = (preferences.dislikedNotes || []).filter(n => n !== note);
      onChange({ ...preferences, favoriteNotes: newNotes, dislikedNotes: newDisliked });
    } else {
      const newDisliked = (preferences.dislikedNotes || []).includes(note)
        ? preferences.dislikedNotes.filter(n => n !== note)
        : [...(preferences.dislikedNotes || []), note];
      const newLiked = preferences.favoriteNotes.filter(n => n !== note);
      onChange({ ...preferences, favoriteNotes: newLiked, dislikedNotes: newDisliked });
    }
  };

  const translateType = (type: string) => {
    const map: Record<string, string> = {
      'Red': 'Червоне', 'White': 'Біле', 'Rosé': 'Рожеве', 'Sparkling': 'Ігристе', 'Dessert': 'Десертне'
    };
    return map[type] || type;
  };

  return (
    <div className={`bg-white transition-all duration-700 ${
      compact 
        ? 'p-8 rounded-[3rem] shadow-2xl border border-stone-100' 
        : 'p-6 rounded-3xl shadow-sm border border-stone-100'
    } space-y-8`}>
      
      {/* Стилі */}
      <div>
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 block">КЛАСИФІКАЦІЯ</label>
        <div className={`flex flex-wrap gap-2 ${compact ? 'justify-center' : ''}`}>
          {WINE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleStyle(type)}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border tracking-tight ${
                preferences.likedStyles.includes(type)
                  ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/10'
                  : 'bg-stone-50 text-stone-500 border-stone-100 hover:border-stone-200'
              }`}
            >
              {translateType(type)}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${compact && !showAdvanced ? 'hidden' : ''}`}>
        {/* Ціна */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">ЦІНА (₴)</label>
            <span className="text-stone-900 font-black text-sm">{preferences.priceRange[1]}</span>
          </div>
          <input
            type="range" min="100" max="30000" step="500"
            value={preferences.priceRange[1]}
            onChange={(e) => onChange({ ...preferences, priceRange: [preferences.priceRange[0], Number(e.target.value)] })}
            className="w-full"
          />
        </div>

        {/* Vintage Year Filter */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">ВІНТАЖ (ВІД)</label>
            <span className="text-stone-900 font-black text-sm">{preferences.yearRange?.[0] || 2010}</span>
          </div>
          <input
            type="range" min="1990" max="2024" step="1"
            value={preferences.yearRange?.[0] || 2010}
            onChange={(e) => onChange({ ...preferences, yearRange: [Number(e.target.value), 2024] })}
            className="w-full"
          />
        </div>

        {/* Technical Params Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block text-center">ВИДТРИМКА</label>
            <select 
              value={preferences.minAging || 0}
              onChange={(e) => onChange({ ...preferences, minAging: Number(e.target.value) })}
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-3 py-2 text-[10px] font-black text-stone-900 focus:ring-1 focus:ring-stone-900 outline-none uppercase"
            >
              <option value="0">БЕЗ ВИМОГ</option>
              <option value="6">6+ МІС</option>
              <option value="12">12+ МІС</option>
              <option value="24">24+ МІС</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block text-center">ЩІЛЬНІСТЬ</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(b => (
                <button
                  key={b}
                  onClick={() => onChange({ ...preferences, preferredBody: b })}
                  className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${
                    preferences.preferredBody === b 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                      : 'bg-stone-50 text-stone-400 border-stone-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {compact && (
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-stone-400 hover:text-stone-900 font-bold text-[9px] uppercase tracking-widest py-3 border-t border-stone-50 transition-all"
        >
          {showAdvanced ? 'ПРИХОВАТИ ФІЛЬТРИ ↑' : 'РОЗШИРЕНІ ПАРАМЕТРИ ↓'}
        </button>
      )}

      <div className={`space-y-8 transition-all duration-700 overflow-hidden ${
        (compact && !showAdvanced) ? 'max-h-0 opacity-0 invisible' : 'max-h-[1000px] opacity-100 visible'
      }`}>
        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 block">ДОМІНАНТНІ НОТИ</label>
          <div className={`flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1 ${compact ? 'justify-center' : ''}`}>
            {POPULAR_NOTES.map(note => (
              <button
                key={note}
                onClick={() => toggleNote(note, 'like')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-tight transition-all ${
                  preferences.favoriteNotes.includes(note)
                    ? 'bg-rose-50 text-rose-900 border-rose-200'
                    : 'bg-white text-stone-400 border-stone-100'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100">
          <label className="text-[10px] font-bold text-rose-900 uppercase tracking-widest mb-4 block flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-900 rounded-full animate-pulse shadow-sm"></span>
            ВИКЛЮЧИТИ
          </label>
          <div className={`flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar p-1 ${compact ? 'justify-center' : ''}`}>
            {POPULAR_NOTES.map(note => (
              <button
                key={note}
                onClick={() => toggleNote(note, 'dislike')}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-tight transition-all ${
                  (preferences.dislikedNotes || []).includes(note)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-300 border-stone-50'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceManager;
