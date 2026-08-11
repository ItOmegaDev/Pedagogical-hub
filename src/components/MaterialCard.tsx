import React from 'react';
import { Material, User } from '../types';
import { RoleBadge } from './RoleBadge';
import { MaterialTypeBadge } from './MaterialTypeBadge';
import { Eye, Heart, MessageSquare, Bookmark, FileText, Image as ImageIcon, Presentation, ArrowUpRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MaterialCardProps {
  material: Material;
  currentUser: User | null;
  onOpenDetail: (material: Material) => void;
  onToggleLike: (materialId: string, e: React.MouseEvent) => void;
  onToggleSave: (materialId: string, e: React.MouseEvent) => void;
  onDeleteMaterial?: (materialId: string, e: React.MouseEvent) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  currentUser,
  onOpenDetail,
  onToggleLike,
  onToggleSave,
  onDeleteMaterial
}) => {
  const isAuthor = currentUser && material.author && currentUser.id === material.author.id;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'elementary': return 'Початкова школа';
      case 'middle': return 'Середня школа';
      case 'high': return 'Старша школа';
      case 'university': return 'Вища освіта';
      case 'preschool': return 'Дошкільна освіта';
      case 'general': default: return 'Загальна вища/середня';
    }
  };

  // Render thumbnail header
  const renderThumbnail = () => {
    if (material.type === 'photo' && material.images && material.images.length > 0) {
      return (
        <div className="relative h-48 w-full overflow-hidden bg-slate-900 group-hover:opacity-95 transition">
          <img
            src={material.images[0]}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
            <ImageIcon size={13} />
            <span>{material.images.length} фото</span>
          </div>
        </div>
      );
    }

    if (material.type === 'presentation' && material.slides && material.slides.length > 0) {
      return (
        <div className="relative h-48 w-full overflow-hidden bg-amber-900/90 group-hover:opacity-95 transition">
          <img
            src={material.slides[0].imageUrl}
            alt={material.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Presentation size={13} />
            <span>{material.slides.length} слайдів</span>
          </div>
        </div>
      );
    }

    if (material.type === 'news' && material.fileUrl) {
      return (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={material.fileUrl}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      );
    }

    // Default document thumbnail card
    return (
      <div className="h-36 w-full bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/40 border-b border-slate-100 p-4 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <MaterialTypeBadge type={material.type} />
          {material.pageCount && (
            <span className="text-xs text-slate-500 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200">
              {material.pageCount} стор.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 z-10 mt-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              {material.targetSubject}
            </div>
            <div className="text-xs text-slate-600 truncate font-mono">
              {material.fileName || 'Документ_матеріал.pdf'}
            </div>
          </div>
        </div>

        {/* Decorative background lines */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <FileText size={120} className="text-blue-900" />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top action buttons: Save & Delete */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <button
          onClick={(e) => onToggleSave(material.id, e)}
          title={material.userSaved ? 'Видалити із збережених' : 'Зберегти матеріал'}
          className={`p-2 rounded-full backdrop-blur-md transition ${
            material.userSaved
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-amber-600 shadow-2xs'
          }`}
        >
          <Bookmark size={15} className={material.userSaved ? 'fill-white' : ''} />
        </button>

        {isAuthor && onDeleteMaterial && (
          <button
            onClick={(e) => onDeleteMaterial(material.id, e)}
            title="Видалити власний матеріал"
            className="p-2 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white backdrop-blur-md shadow-2xs transition"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Card Header / Preview Area */}
      <div className="cursor-pointer" onClick={() => onOpenDetail(material)}>
        {renderThumbnail()}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Tags header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {getCategoryLabel(material.category)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDate(material.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(material)}
            className="text-base font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 transition"
          >
            {material.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {material.description}
          </p>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {material.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Author info & Engagement stats */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Author info */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={material.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={material.author?.name || 'Автор'}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {material.author?.name || 'Педагог'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {material.author?.institution || 'Освітній заклад'}
                </div>
              </div>
            </div>

            {material.author?.role && <RoleBadge role={material.author.role} size="sm" />}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={(e) => onToggleLike(material.id, e)}
                className={`flex items-center gap-1 transition ${
                  material.userLiked
                    ? 'text-rose-600 font-semibold scale-105'
                    : 'hover:text-rose-600'
                }`}
              >
                <Heart size={14} className={material.userLiked ? 'fill-rose-600' : ''} />
                <span>{material.likesCount || 0}</span>
              </button>

              {/* Comments count */}
              <button
                onClick={() => onOpenDetail(material)}
                className="flex items-center gap-1 hover:text-blue-600 transition"
              >
                <MessageSquare size={14} />
                <span>{material.commentsCount || 0}</span>
              </button>

              {/* Views */}
              <span className="flex items-center gap-1 text-slate-400">
                <Eye size={13} />
                <span>{material.viewsCount || 0}</span>
              </span>
            </div>

            {/* View Reader Action Button */}
            <button
              onClick={() => onOpenDetail(material)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition"
            >
              <span>Читати</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
