import React, { useState, useEffect, useMemo } from 'react';
import { Material, User, UserRole, Category, MaterialType } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { MaterialCard } from './components/MaterialCard';
import { MaterialDetailModal } from './components/MaterialDetailModal';
import { CreateMaterialModal } from './components/CreateMaterialModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import {
  subscribeToMaterials,
  publishMaterial,
  toggleLikeFirestore,
  toggleSaveFirestore,
  addCommentFirestore,
  addReplyFirestore,
  incrementViewFirestore,
  deleteMaterialFirestore,
  saveUserProfile,
  getUserProfile
} from './lib/storage';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { PlusCircle, Sparkles, BookOpen, Layers, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function App() {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Firestore materials state (starts empty)
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI Modal / Drawer states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Filter states
  const [activeRoleFilter, setActiveRoleFilter] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MaterialType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'likes'>('newest');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const existingProfile = await getUserProfile(fbUser.uid);
        if (existingProfile) {
          setCurrentUser(existingProfile);
        } else {
          // Default initial profile
          const initialUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Педагог України',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: 'teacher',
            institution: 'ЗЗСО України',
            subject: 'Загальні дисципліни',
            bio: 'Користувач освітньої платформи.',
            verified: true,
            createdAt: new Date().toISOString()
          };
          await saveUserProfile(initialUser);
          setCurrentUser(initialUser);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Subscribe to Firestore Real-Time Materials feed
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMaterials(
      currentUser?.id || null,
      (mats) => {
        setMaterials(mats);
        setLoading(false);
      },
      (err) => {
        console.error('Real-time subscription error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Handle publishing a material to Firestore
  const handlePublishMaterial = async (newMaterialData: Omit<Material, 'id'>) => {
    try {
      await publishMaterial(newMaterialData);
      showToast('✨ Матеріал успішно опубліковано!');
    } catch (err) {
      console.error('Publish error:', err);
      showToast('❌ Помилка публікації. Перевірте з’єднання.');
    }
  };

  // Handle Like Toggle
  const handleToggleLike = async (materialId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const mat = materials.find(m => m.id === materialId);
    if (!mat) return;

    try {
      await toggleLikeFirestore(materialId, currentUser.id, !!mat.userLiked);
      showToast(mat.userLiked ? 'Вподобайку вилучено' : '❤️ Додано вподобайку!');
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Handle Save Toggle
  const handleToggleSave = async (materialId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const mat = materials.find(m => m.id === materialId);
    if (!mat) return;

    try {
      await toggleSaveFirestore(materialId, currentUser.id, !!mat.userSaved);
      showToast(mat.userSaved ? 'Вилучено із збережених' : '🔖 Матеріал збережено в кабінет!');
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  // Handle Delete Material
  const handleDeleteMaterial = async (materialId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!currentUser) return;

    if (window.confirm('Ви дійсно бажаєте видалити цей матеріал?')) {
      try {
        await deleteMaterialFirestore(materialId);
        if (selectedMaterial?.id === materialId) {
          setSelectedMaterial(null);
        }
        showToast('🗑 Матеріал успішно видалено.');
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  // Open Material Detail Reader & Increment View
  const handleOpenDetail = (material: Material) => {
    setSelectedMaterial(material);
    incrementViewFirestore(material.id);
  };

  // Handle Comment Add
  const handleAddComment = async (materialId: string, content: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await addCommentFirestore(materialId, content, currentUser);
      showToast('💬 Коментар додано!');
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  // Handle Reply Add
  const handleAddReply = async (materialId: string, commentId: string, content: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await addReplyFirestore(materialId, commentId, content, currentUser);
      showToast('💬 Відповідь надіслано!');
    } catch (err) {
      console.error('Reply error:', err);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setActiveRoleFilter('all');
  };

  // Filter & Sort materials
  const filteredMaterials = useMemo(() => {
    return materials
      .filter((mat) => {
        // Role activity filter
        if (activeRoleFilter !== 'all') {
          if (mat.author?.role !== activeRoleFilter) return false;
        }

        // Category level filter
        if (selectedCategory !== 'all') {
          if (mat.category !== selectedCategory) return false;
        }

        // Type format filter
        if (selectedType !== 'all') {
          if (mat.type !== selectedType) return false;
        }

        // Search query search title, description, subject, tags, author
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = mat.title.toLowerCase().includes(q);
          const descMatch = mat.description.toLowerCase().includes(q);
          const subjMatch = mat.targetSubject.toLowerCase().includes(q);
          const authorMatch = mat.author?.name.toLowerCase().includes(q);
          const tagMatch = mat.tags?.some(t => t.toLowerCase().includes(q));

          return titleMatch || descMatch || subjMatch || authorMatch || tagMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        }
        if (sortBy === 'likes') {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [materials, activeRoleFilter, selectedCategory, selectedType, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenCreateModal={() => {
          if (!currentUser) setIsAuthModalOpen(true);
          else setIsCreateModalOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        materialsCount={materials.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Hero Banner */}
        <HeroBanner
          activeRoleFilter={activeRoleFilter}
          onSelectRoleFilter={setActiveRoleFilter}
          onOpenCreate={() => {
            if (!currentUser) setIsAuthModalOpen(true);
            else setIsCreateModalOpen(true);
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          hasUser={!!currentUser}
        />

        {/* Filters & Search */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          totalResults={filteredMaterials.length}
        />

        {/* Feed List Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Завантаження освітніх матеріалів...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/90 p-10 sm:p-14 text-center max-w-xl mx-auto shadow-sm my-8 space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <BookOpen size={32} />
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              {materials.length === 0 ? 'Педагогічних матеріалів поки немає' : 'Матеріалів за вашими фільтрами не знайдено'}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              {materials.length === 0
                ? 'Платформу підготовлено для обміну знаннями. Опублікуйте перший конспект, розробку чи презентацію!'
                : 'Спробуйте змінити ключове слово пошуку або скинути фільтри рівня чи типу.'}
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  if (!currentUser) setIsAuthModalOpen(true);
                  else setIsCreateModalOpen(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>Опублікувати перший матеріал</span>
              </button>

              {materials.length > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Скинути всі фільтри
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                currentUser={currentUser}
                onOpenDetail={handleOpenDetail}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onDeleteMaterial={handleDeleteMaterial}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-300">
            Освітній Хаб Педагогічних Матеріалів © {new Date().getFullYear()}
          </p>
          <p className="text-slate-500 text-[11px] flex items-center justify-center gap-1.5">
            <Database size={12} className="text-emerald-400" />
            <span>Педагогічна платформа для обміну навчальним контентом</span>
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MaterialDetailModal
        material={selectedMaterial}
        currentUser={currentUser}
        onClose={() => setSelectedMaterial(null)}
        onToggleLike={(id) => handleToggleLike(id)}
        onToggleSave={(id) => handleToggleSave(id)}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onDeleteMaterial={(id) => handleDeleteMaterial(id)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <CreateMaterialModal
        isOpen={isCreateModalOpen}
        currentUser={currentUser}
        onClose={() => setIsCreateModalOpen(false)}
        onPublish={handlePublishMaterial}
        onOpenAuth={() => {
          setIsCreateModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`👋 Вітаємо, ${user.name}! Профіль успішно авторизовано.`);
        }}
      />

      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        currentUser={currentUser}
        materials={materials}
        onClose={() => setIsProfileDrawerOpen(false)}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast('👤 Профіль успішно збережено!');
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Ви вийшли з акаунту.');
        }}
        onOpenMaterial={handleOpenDetail}
      />
    </div>
  );
}

export default App;
