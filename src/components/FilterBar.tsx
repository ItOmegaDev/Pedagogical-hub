import React from 'react';
import { Category, MaterialType } from '../types';
import { Search, Filter, Layers, FileText, Presentation, Image as ImageIcon, Newspaper, BookMarked, HelpCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  selectedType: MaterialType | 'all';
  onTypeChange: (type: MaterialType | 'all') => void;
  sortBy: 'popular' | 'newest' | 'likes';
  onSortChange: (sort: 'popular' | 'newest' | 'likes') => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults
}) => {
  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Всі рівні' },
    { id: 'elementary', label: '1-4 класи (Початкова)' },
    { id: 'middle', label: '5-9 класи (Середня)' },
    { id: 'high', label: '10-11 класи (Старша)' },
    { id: 'university', label: 'Вища освіта' },
    { id: 'preschool', label: 'Дошкільна' },
  ];

  const types: { id: MaterialType | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Всі формати', icon: <Layers size={14} /> },
    { id: 'document', label: 'PDF/DOC', icon: <FileText size={14} /> },
    { id: 'presentation', label: 'Презентації', icon: <Presentation size={14} /> },
    { id: 'photo', label: 'Фото', icon: <ImageIcon size={14} /> },
    { id: 'news', label: 'Новини', icon: <Newspaper size={14} /> },
    { id: 'lesson', label: 'Конспекти', icon: <BookMarked size={14} /> },
    { id: 'test', label: 'Тести', icon: <HelpCircle size={14} /> },
  ];

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedType !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Search Bar & Sort selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Пошук матеріалу за назвою, тегом, предметом чи автором..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Сортування:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'popular' | 'newest' | 'likes')}
            className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="newest">Новіші спочатку</option>
            <option value="popular">Найбільше переглядів</option>
            <option value="likes">Найбільше лайків</option>
          </select>
        </div>
      </div>

      {/* Filter Category & Format pills */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        {/* Format Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">Формат:</span>
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                selectedType === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">Рівень:</span>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results summary bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          Знайдено матеріалів: <span className="font-bold text-slate-900">{totalResults}</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <X size={14} />
            <span>Скинути фільтри</span>
          </button>
        )}
      </div>
    </div>
  );
};
