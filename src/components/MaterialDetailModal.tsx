import React, { useState } from 'react';
import { Material, User, Comment } from '../types';
import { RoleBadge } from './RoleBadge';
import { MaterialTypeBadge } from './MaterialTypeBadge';
import {
  X, Heart, Bookmark, MessageSquare, Share2, Download, Printer, Maximize2,
  Minimize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Send, CornerDownRight,
  Eye, FileText, Presentation, Image as ImageIcon, Check, Sparkles, BookOpen, ThumbsUp, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MaterialDetailModalProps {
  material: Material | null;
  currentUser: User | null;
  onClose: () => void;
  onToggleLike: (materialId: string) => void;
  onToggleSave: (materialId: string) => void;
  onAddComment: (materialId: string, content: string) => void;
  onAddReply: (materialId: string, commentId: string, content: string) => void;
  onDeleteMaterial?: (materialId: string) => void;
  onOpenAuth: () => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  material,
  currentUser,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAddReply,
  onDeleteMaterial,
  onOpenAuth
}) => {
  if (!material) return null;

  const isAuthor = currentUser && material.author && currentUser.id === material.author.id;

  // View state
  const [activeTab, setActiveTab] = useState<'viewer' | 'comments' | 'info'>('viewer');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Presentation slides state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Photo gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Comment input state
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const totalPages = material.pageCount || 10;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownload = () => {
    alert(`Завантаження матеріалу "${material.title}" розпочато!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newCommentText.trim()) return;

    onAddComment(material.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!replyText.trim()) return;

    onAddReply(material.id, commentId, replyText.trim());
    setReplyText('');
    setReplyingToCommentId(null);
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${
        isFullscreen ? 'p-0' : ''
      }`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden border border-slate-200 z-10 ${
            isFullscreen ? 'h-screen rounded-none max-w-none' : 'max-w-5xl max-h-[92vh]'
          }`}
        >
          {/* TOP MODAL NAVBAR */}
          <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <MaterialTypeBadge type={material.type} />
              <h2 className="text-sm sm:text-base font-bold truncate max-w-md text-slate-100">
                {material.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Delete if Author */}
              {isAuthor && onDeleteMaterial && (
                <button
                  onClick={() => onDeleteMaterial(material.id)}
                  title="Видалити матеріал"
                  className="p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline">Видалити</span>
                </button>
              )}

              {/* Quick Actions */}
              <button
                onClick={() => onToggleLike(material.id)}
                className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition ${
                  material.userLiked
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Heart size={15} className={material.userLiked ? 'fill-white' : ''} />
                <span className="hidden sm:inline">{material.likesCount || 0}</span>
              </button>

              <button
                onClick={() => onToggleSave(material.id)}
                className={`p-2 rounded-lg text-xs font-semibold transition ${
                  material.userSaved
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark size={15} className={material.userSaved ? 'fill-slate-950' : ''} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
              >
                {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hidden sm:block"
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* READER TOOLBAR */}
          <div className="bg-slate-800 text-slate-300 px-4 py-2 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveTab('viewer')}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'viewer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen size={13} />
                <span>Легкий перегляд</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'comments' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={13} />
                <span>Обговорення ({material.commentsCount || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'info' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText size={13} />
                <span>Про матеріал</span>
              </button>
            </div>

            {/* Reader Controls */}
            {activeTab === 'viewer' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-700">
                  <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))} className="hover:text-white p-0.5">
                    <ZoomOut size={14} />
                  </button>
                  <span className="w-10 text-center font-mono text-[11px]">{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel(Math.min(160, zoomLevel + 15))} className="hover:text-white p-0.5">
                    <ZoomIn size={14} />
                  </button>
                </div>

                <button onClick={handlePrint} className="hover:text-white p-1 rounded hover:bg-slate-700 transition hidden sm:block">
                  <Printer size={15} />
                </button>

                <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition">
                  <Download size={13} />
                  <span className="hidden sm:inline">Завантажити</span>
                </button>
              </div>
            )}
          </div>

          {/* MODAL MAIN CONTENT BODY */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
            {activeTab === 'viewer' && (
              <div className="flex flex-col items-center">
                {/* PHOTO GALLERY */}
                {material.type === 'photo' && material.images && material.images.length > 0 ? (
                  <div className="w-full max-w-4xl bg-white p-4 rounded-2xl shadow-md border border-slate-200">
                    <div className="relative h-[420px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={material.images[currentImageIndex]}
                        alt={`Фото ${currentImageIndex + 1}`}
                        className="max-h-full max-w-full object-contain transition-all duration-300"
                        style={{ transform: `scale(${zoomLevel / 100})` }}
                      />
                      {material.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((currentImageIndex - 1 + material.images!.length) % material.images!.length)}
                            className="absolute left-3 p-2 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((currentImageIndex + 1) % material.images!.length)}
                            className="absolute right-3 p-2 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* PRESENTATION SLIDES */}
                {material.type === 'presentation' && material.slides && material.slides.length > 0 ? (
                  <div className="w-full max-w-4xl bg-white p-5 rounded-2xl shadow-md border border-slate-200 space-y-4">
                    <div className="relative h-[380px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                      <img
                        src={material.slides[currentSlideIndex].imageUrl}
                        alt="Slide"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                        <div className="bg-amber-500/90 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full w-max mb-1">
                          Слайд {currentSlideIndex + 1} з {material.slides.length}
                        </div>
                        <h4 className="text-lg font-bold">{material.slides[currentSlideIndex].title}</h4>
                      </div>
                      <button
                        disabled={currentSlideIndex <= 0}
                        onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                        className="absolute left-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 disabled:opacity-30 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        disabled={currentSlideIndex >= material.slides.length - 1}
                        onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                        className="absolute right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 disabled:opacity-30 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    {material.slides[currentSlideIndex].notes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
                        <span className="font-bold text-amber-950 block mb-1">📝 Примітки викладача:</span>
                        <p>{material.slides[currentSlideIndex].notes}</p>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* DOCUMENT / LESSON / TEST / NEWS */}
                {(material.type === 'document' || material.type === 'lesson' || material.type === 'test' || material.type === 'news') && (
                  <div
                    className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12 w-full max-w-3xl transition-all duration-300 font-serif"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start font-sans">
                      <div>
                        <div className="text-xs uppercase font-bold text-blue-700 tracking-wider">
                          {material.targetSubject} • {material.author?.institution || 'Освіта'}
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 mt-1">{material.title}</h1>
                      </div>
                      {material.author?.role && <RoleBadge role={material.author.role} size="md" />}
                    </div>

                    <div className="text-slate-800 leading-relaxed text-sm space-y-4 whitespace-pre-line">
                      {material.docPreviewContent || material.description}
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 font-sans">
                      <span>Автор: {material.author?.name || 'Педагог'}</span>
                      <span>Сторінка 1 з {totalPages}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS */}
            {activeTab === 'comments' && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={20} />
                    Обговорення матеріалу ({material.commentsCount || 0})
                  </h3>
                  <span className="text-xs text-slate-500">Залиште запитання чи відгук</span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt="User"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={
                          currentUser
                            ? `Напишіть коментар як ${currentUser.name}...`
                            : 'Увійдіть для написання коментаря...'
                        }
                        className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pl-12">
                    {currentUser ? (
                      <div className="flex items-center gap-2">
                        <RoleBadge role={currentUser.role} size="sm" />
                        <span className="text-xs text-slate-500">{currentUser.name}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="text-xs text-blue-600 font-semibold hover:underline"
                      >
                        🔑 Авторизація
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Send size={14} />
                      Опублікувати
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {(!material.comments || material.comments.length === 0) ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      Поки немає коментарів. Будьте першим!
                    </div>
                  ) : (
                    material.comments.map((comment: Comment) => (
                      <div key={comment.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{comment.author?.name || 'Педагог'}</span>
                                {comment.author?.role && <RoleBadge role={comment.author.role} size="sm" />}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString('uk-UA')}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 pl-10 leading-relaxed">{comment.content}</p>

                        <div className="pl-10 flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <button
                            onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 hover:text-blue-600 font-medium"
                          >
                            <CornerDownRight size={13} />
                            <span>Відповісти</span>
                          </button>
                        </div>

                        {replyingToCommentId === comment.id && (
                          <form onSubmit={(e) => handleReplySubmit(comment.id, e)} className="mt-3 pl-10 flex items-center gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Напишіть відповідь..."
                              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700">
                              Надіслати
                            </button>
                          </form>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 pl-10 space-y-2 border-l-2 border-blue-200">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-slate-800">{reply.author?.name}</span>
                                  {reply.author?.role && <RoleBadge role={reply.author.role} size="sm" />}
                                </div>
                                <p className="text-slate-600">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{material.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{material.description}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-4">
                  <img
                    src={material.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-base">{material.author?.name || 'Педагог'}</h4>
                      {material.author?.role && <RoleBadge role={material.author.role} size="md" />}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">{material.author?.institution}</div>
                    <div className="text-xs text-slate-500">{material.author?.subject}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Категорія</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{material.category}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Обсяг</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{material.pageCount || 1} стор.</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Переглядів</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{material.viewsCount || 0}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Лайки</div>
                    <div className="text-xs font-bold text-rose-600 mt-1">♥ {material.likesCount || 0}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
