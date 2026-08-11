import React, { useState } from 'react';
import { User, UserRole, Material } from '../types';
import { RoleBadge } from './RoleBadge';
import { X, GraduationCap, BookOpen, School, Bookmark, FileText, Edit2, LogOut, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveUserProfile } from '../lib/firebase';

interface UserProfileDrawerProps {
  isOpen: boolean;
  currentUser: User | null;
  materials: Material[];
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onOpenMaterial: (mat: Material) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  currentUser,
  materials,
  onClose,
  onUpdateUser,
  onLogout,
  onOpenMaterial
}) => {
  if (!isOpen || !currentUser) return null;

  const [activeTab, setActiveTab] = useState<'published' | 'saved' | 'edit'>('published');
  const [saving, setSaving] = useState(false);

  // Edit mode fields
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [subject, setSubject] = useState(currentUser.subject || '');
  const [bio, setBio] = useState(currentUser.bio || '');

  const publishedMaterials = materials.filter(m => m.author?.id === currentUser.id);
  const savedMaterials = materials.filter(m => m.userSaved);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: User = {
      ...currentUser,
      name,
      role,
      institution,
      subject,
      bio
    };

    try {
      await saveUserProfile(updated);
      onUpdateUser(updated);
      setActiveTab('published');
    } catch (err) {
      console.error('Error saving profile:', err);
      onUpdateUser(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden z-10"
        >
          {/* Drawer Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <h3 className="font-bold text-base">Профіль користувача</h3>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile Summary Card */}
          <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
            <div className="flex items-start gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-base truncate">{currentUser.name}</h4>
                <div className="mt-1">
                  <RoleBadge role={currentUser.role} size="md" />
                </div>
                <div className="text-xs text-slate-500 mt-2 truncate">{currentUser.institution}</div>
                <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200/80">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <div className="text-sm font-bold text-slate-800">{publishedMaterials.length}</div>
                <div className="text-[10px] text-slate-500 font-medium">Опубліковано</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <div className="text-sm font-bold text-amber-600">{savedMaterials.length}</div>
                <div className="text-[10px] text-slate-500 font-medium">Збережено</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-semibold bg-slate-50">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'published' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText size={14} />
              <span>Публікації ({publishedMaterials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'saved' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark size={14} />
              <span>Збережені ({savedMaterials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                activeTab === 'edit' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit2 size={14} />
              <span>Налаштування</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'published' && (
              <div className="space-y-3">
                {publishedMaterials.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Ви ще не опублікували жодного педагогічного матеріалу.
                  </div>
                ) : (
                  publishedMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => {
                        onOpenMaterial(mat);
                        onClose();
                      }}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{mat.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                          <span>{mat.targetSubject}</span>
                          <span>•</span>
                          <span>♥ {mat.likesCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-3">
                {savedMaterials.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    У вас немає збережених матеріалів.
                  </div>
                ) : (
                  savedMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => {
                        onOpenMaterial(mat);
                        onClose();
                      }}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{mat.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                          <span>{mat.author?.name}</span>
                          {mat.author?.role && <RoleBadge role={mat.author.role} size="sm" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'edit' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ПІБ Користувача:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Роль / Вид діяльності:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        role === 'teacher' ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-white border-slate-200'
                      }`}
                    >
                      <GraduationCap size={16} />
                      <span>Викладач</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        role === 'student' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-white border-slate-200'
                      }`}
                    >
                      <BookOpen size={16} />
                      <span>Студент</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('pupil')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        role === 'pupil' ? 'bg-sky-100 border-sky-500 text-sky-900' : 'bg-white border-slate-200'
                      }`}
                    >
                      <School size={16} />
                      <span>Учень</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Навчальний заклад:</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Предмет / Спеціальність:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Біографія:</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{saving ? 'Збереження...' : 'Зберегти змінений профіль'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Вийти з акаунту
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
