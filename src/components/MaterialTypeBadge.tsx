import React from 'react';
import { MaterialType } from '../types';
import { FileText, Presentation, Image as ImageIcon, Newspaper, BookMarked, HelpCircle } from 'lucide-react';

interface MaterialTypeBadgeProps {
  type: MaterialType;
  size?: 'sm' | 'md';
}

export const MaterialTypeBadge: React.FC<MaterialTypeBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';
  const iconSize = size === 'sm' ? 12 : 14;

  switch (type) {
    case 'document':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClass}`}>
          <FileText size={iconSize} className="text-blue-600" />
          <span>Документ PDF</span>
        </span>
      );
    case 'presentation':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/80 ${sizeClass}`}>
          <Presentation size={iconSize} className="text-orange-600" />
          <span>Презентація</span>
        </span>
      );
    case 'photo':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 ${sizeClass}`}>
          <ImageIcon size={iconSize} className="text-purple-600" />
          <span>Фотозвіт</span>
        </span>
      );
    case 'news':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClass}`}>
          <Newspaper size={iconSize} className="text-emerald-600" />
          <span>Новина</span>
        </span>
      );
    case 'lesson':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80 ${sizeClass}`}>
          <BookMarked size={iconSize} className="text-teal-600" />
          <span>Конспект уроку</span>
        </span>
      );
    case 'test':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClass}`}>
          <HelpCircle size={iconSize} className="text-rose-600" />
          <span>Тест / Завдання</span>
        </span>
      );
  }
};
