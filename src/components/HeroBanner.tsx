import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, BookOpen, School, Sparkles, Database, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroBannerProps {
  activeRoleFilter: UserRole | 'all';
  onSelectRoleFilter: (role: UserRole | 'all') => void;
  onOpenCreate: () => void;
  onOpenAuth: () => void;
  hasUser: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeRoleFilter,
  onSelectRoleFilter,
  onOpenCreate,
  onOpenAuth,
  hasUser
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Інтерактивна освітня платформа для обміну знаннями</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-100"
        >
          Обмін педагогічними матеріалами, доповідями та конспектами
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl"
        >
          Авторизуйтесь через Google та виберіть напрямок вашої діяльності (учень, студент або викладач) для публікації та зручного перегляду документації з системою лайків та обговорень.
        </motion.p>

        {/* Role Activity Selection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="space-y-2 pt-2"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Оберіть напрямок діяльності матеріалів:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectRoleFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoleFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Всі види матеріалів</span>
            </button>

            <button
              onClick={() => onSelectRoleFilter('teacher')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoleFilter === 'teacher'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <GraduationCap size={16} />
              <span>Викладачі та Вчителі</span>
            </button>

            <button
              onClick={() => onSelectRoleFilter('student')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoleFilter === 'student'
                  ? 'bg-emerald-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen size={16} />
              <span>Студенти та Науковці</span>
            </button>

            <button
              onClick={() => onSelectRoleFilter('pupil')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeRoleFilter === 'pupil'
                  ? 'bg-sky-400 text-slate-950 shadow-md scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <School size={16} />
              <span>Учні шкіл та ліцеїв</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
