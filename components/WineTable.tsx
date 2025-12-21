
import React, { useState } from 'react';
import { Wine } from '../types';
import { WINE_TYPES, ORIGIN_TYPES } from '../constants';

interface WineTableProps {
  wines: Wine[];
  onUpdate: (updatedWines: Wine[]) => void;
  title: string;
}

const WineTable: React.FC<WineTableProps> = ({ wines, onUpdate, title }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Wine | null>(null);

  const startEdit = (wine: Wine) => {
    setEditingId(wine.id);
    setEditForm({ ...wine });
  };

  const handleSave = () => {
    if (editForm) {
      onUpdate([editForm]);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev!,
      [name]: ['year', 'body', 'tannins', 'acidity', 'sweetness', 'price', 'agingMonths'].includes(name)
        ? Number(value)
        : value
    }));
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-stone-100 animate-fadeIn">
      <div className="px-10 py-7 border-b border-stone-50 flex justify-between items-center bg-stone-50/20">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">{title}</h3>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{wines.length} РЕЄСТРАЦІЙ</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-100">
              {['Назва', 'Сорт', 'Рік', 'Ціна (₴)', 'Дії'].map(h => (
                <th key={h} className="px-10 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {wines.map((wine) => (
              <tr key={wine.id} className="hover:bg-stone-50/40 transition-colors group">
                {editingId === wine.id ? (
                  <>
                    <td className="px-10 py-4"><input className="w-full bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none uppercase tracking-tight" name="name" value={editForm?.name} onChange={handleChange} /></td>
                    <td className="px-10 py-4"><input className="w-full bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none uppercase tracking-tight" name="grape" value={editForm?.grape} onChange={handleChange} /></td>
                    <td className="px-10 py-4"><input className="w-24 bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none" type="number" name="year" value={editForm?.year} onChange={handleChange} /></td>
                    <td className="px-10 py-4"><input className="w-28 bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none" type="number" name="price" value={editForm?.price} onChange={handleChange} /></td>
                    <td className="px-10 py-4 space-x-6">
                      <button onClick={handleSave} className="text-stone-900 font-bold text-[10px] uppercase tracking-wider hover:underline">ЗБЕРЕГТИ</button>
                      <button onClick={() => setEditingId(null)} className="text-stone-300 font-bold text-[10px] uppercase tracking-wider hover:text-stone-500">СКАСУВАТИ</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-10 py-6 text-sm font-black text-stone-900 tracking-tight uppercase">{wine.name}</td>
                    <td className="px-10 py-6 text-[11px] text-stone-500 font-bold uppercase tracking-wide">{wine.grape}</td>
                    <td className="px-10 py-6 text-[11px] text-stone-400 font-black tracking-tight">{wine.year}</td>
                    <td className="px-10 py-6 text-sm font-black text-stone-900 tracking-tight">{wine.price}</td>
                    <td className="px-10 py-6">
                      <button onClick={() => startEdit(wine)} className="text-stone-400 group-hover:text-stone-900 text-[10px] font-bold uppercase tracking-wider transition-colors hover:underline">РЕДАГУВАТИ</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WineTable;
