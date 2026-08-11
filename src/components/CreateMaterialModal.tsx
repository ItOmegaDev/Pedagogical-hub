import React, { useState } from 'react';
import { Material, MaterialType, Category, User } from '../types';
import { X, Upload, FileText, Presentation, Image as ImageIcon, Newspaper, BookMarked, HelpCircle, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateMaterialModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onPublish: (newMaterial: Omit<Material, 'id'>) => void;
  onOpenAuth: () => void;
}

export const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onPublish,
  onOpenAuth
}) => {
  if (!isOpen) return null;

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>('document');
  const [category, setCategory] = useState<Category>('middle');
  const [targetSubject, setTargetSubject] = useState('Математика');
  const [docContent, setDocContent] = useState('');
  const [tagsInput, setTagsInput] = useState('НУШ, Інновації');
  const [uploadedFileName, setUploadedFileName] = useState('Методичний_матеріал_2026.pdf');
  const [photoUrlInput, setPhotoUrlInput] = useState('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80');
  const [publishing, setPublishing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert('Будь ласка, заповніть назву та короткий опис матеріалу.');
      return;
    }

    setPublishing(true);

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newMaterialData: Omit<Material, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      targetSubject: targetSubject.trim() || 'Загальний предмет',
      author: currentUser,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      userLiked: false,
      userSaved: false,
      fileName: uploadedFileName,
      fileSize: '3.4 МБ',
      pageCount: type === 'presentation' ? 10 : 6,
      fileUrl: type === 'photo' || type === 'news' ? photoUrlInput : undefined,
      images: type === 'photo' ? [photoUrlInput, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'] : undefined,
      slides: type === 'presentation' ? [
        {
          id: 1,
          title: `Слайд 1: ${title.trim()}`,
          imageUrl: photoUrlInput,
          notes: 'Вступні методичні зауваження для викладача.'
        },
        {
          id: 2,
          title: 'Слайд 2: Ключові тези та практичні приклади',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
          notes: 'Аналіз результатів та обговорення в класі.'
        }
      ] : undefined,
      docPreviewContent: docContent.trim() || `${title.trim()}\n\n${description.trim()}\n\nВступний розділ та практичні вказівки для проведення заняття за програмою Міністерства освіти і науки України.`,
      tags: parsedTags.length > 0 ? parsedTags : ['Освіта', 'НУШ'],
      comments: []
    };

    try {
      await onPublish(newMaterialData);
      onClose();
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div>
              <h3 className="font-bold text-lg leading-tight">Публікація педагогічного матеріалу</h3>
              <p className="text-xs text-slate-400">Доступно для викладачів, студентів та учнів</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[78vh]">
            {/* Material Type Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Тип педагогічного матеріалу:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setType('document')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'document' ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText size={16} className="text-blue-600 shrink-0" />
                  <span>Документ PDF/DOC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('presentation')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'presentation' ? 'border-orange-600 bg-orange-50 text-orange-900 ring-2 ring-orange-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Presentation size={16} className="text-orange-600 shrink-0" />
                  <span>Презентація PPTX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('photo')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'photo' ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ImageIcon size={16} className="text-purple-600 shrink-0" />
                  <span>Фотогалерея</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('news')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'news' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Newspaper size={16} className="text-emerald-600 shrink-0" />
                  <span>Новина / Стаття</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('lesson')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'lesson' ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <BookMarked size={16} className="text-teal-600 shrink-0" />
                  <span>Конспект уроку</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('test')}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                    type === 'test' ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <HelpCircle size={16} className="text-rose-600 shrink-0" />
                  <span>Тест / Завдання</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Назва матеріалу: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="наприклад, Інтерактивний урок з математики для 9 класу"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Category & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Освітній рівень:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="elementary">Початкова школа (1-4 класи)</option>
                  <option value="middle">Середня школа (5-9 класи)</option>
                  <option value="high">Старша школа (10-11 класи)</option>
                  <option value="university">Вища освіта / Коледжі</option>
                  <option value="preschool">Дошкільна освіта</option>
                  <option value="general">Загальна педагогіка</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Предмет / Дисципліна:</label>
                <input
                  type="text"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  placeholder="наприклад, Фізика, Історія, НУШ"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Анотація / Короткий опис: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишіть мету, цільову аудиторію та очікувані результати..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 p-5 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Upload size={20} />
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold text-blue-600">Завантажте файл</span> для прив'язки
              </div>
              <input
                type="text"
                value={uploadedFileName}
                onChange={(e) => setUploadedFileName(e.target.value)}
                className="mt-2 text-xs font-mono text-center text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200 inline-block max-w-xs"
              />
            </div>

            {/* Content for Lightweight Reader */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Текст матеріалу (для режиму перегляду):
              </label>
              <textarea
                rows={4}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Введіть текст конспекту або матеріалу..."
                className="w-full px-3.5 py-2.5 text-xs font-serif border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Теги / Ключові слова (через кому):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="НУШ, ЗНО, Математика"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Скасувати
              </button>

              <button
                type="submit"
                disabled={publishing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Check size={16} />
                <span>{publishing ? 'Публікація...' : 'Опублікувати матеріал'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
