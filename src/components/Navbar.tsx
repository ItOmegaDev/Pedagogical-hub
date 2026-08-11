import React from 'react';
import { User } from '../types';
import { RoleBadge } from './RoleBadge';
import { PlusCircle, UserCheck, BookOpen, Sparkles, LogIn, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  currentUser: User | null;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileDrawer: () => void;
  materialsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenCreateModal,
  onOpenAuthModal,
  onOpenProfileDrawer,
  materialsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
          >
            <BookOpen size={22} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Педагогічний Хаб
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Database size={10} />
                <span>Онлайн</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Платформа освітніх матеріалів • {materialsCount} публікацій у хмарі
            </p>
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-3">
          {/* Create Material Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Викласти матеріал</span>
          </motion.button>

          {/* User Auth or Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfileDrawer}
              className="flex items-center gap-2.5 p-1.5 pr-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-700 group-hover:border-blue-400 transition"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{currentUser.name}</div>
                <RoleBadge role={currentUser.role} size="sm" />
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
            >
              <LogIn size={15} className="text-blue-400" />
              <span>Увійти через Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
