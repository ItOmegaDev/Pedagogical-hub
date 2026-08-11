import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, BookOpen, School } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', showLabel = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  switch (role) {
    case 'teacher':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/50 shadow-2xs ${sizeClasses[size]}`}
          title="Педагог / Викладач / Вчитель"
        >
          <GraduationCap size={iconSizes[size]} className="text-amber-700 dark:text-amber-400 shrink-0" />
          {showLabel && <span>Викладач</span>}
        </span>
      );
    case 'student':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/50 shadow-2xs ${sizeClasses[size]}`}
          title="Студент вищого навчального закладу або коледжу"
        >
          <BookOpen size={iconSizes[size]} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
          {showLabel && <span>Студент</span>}
        </span>
      );
    case 'pupil':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-200 border border-sky-300/60 dark:border-sky-700/50 shadow-2xs ${sizeClasses[size]}`}
          title="Учень школи або ліцею"
        >
          <School size={iconSizes[size]} className="text-sky-700 dark:text-sky-400 shrink-0" />
          {showLabel && <span>Учень</span>}
        </span>
      );
  }
};
