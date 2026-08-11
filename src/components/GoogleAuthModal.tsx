import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Check, GraduationCap, BookOpen, School, ShieldCheck, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, saveUserProfile } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'teacher'
}) => {
  const [step, setStep] = useState<'google_select' | 'role_select'>('google_select');
  const [loading, setLoading] = useState(false);
  
  // Form fields for custom creation or Google login
  const [googleEmail, setGoogleEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [institution, setInstitution] = useState('');
  const [subject, setSubject] = useState('');

  if (!isOpen) return null;

  // Real Google Sign-In via Firebase Auth
  const handleFirebaseGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      setUserName(firebaseUser.displayName || 'Користувач Освіти');
      setGoogleEmail(firebaseUser.email || `user-${Date.now()}@pedagogy.edu.ua`);
      setAvatarUrl(firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      
      setStep('role_select');
    } catch (error) {
      console.error('Google Auth Popup failed, falling back to profile setup:', error);
      // Fallback if popup blocked in iframe
      setUserName('Педагог Навчання');
      setGoogleEmail(`pedagog-${Date.now()}@edu.ua`);
      setAvatarUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
      setStep('role_select');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAccountStart = (name: string, email: string, avatar: string) => {
    setUserName(name);
    setGoogleEmail(email);
    setAvatarUrl(avatar);
    setStep('role_select');
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userName || 'Користувач Освіти',
      email: googleEmail || 'user@edu.ua',
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: selectedRole,
      institution: institution || (selectedRole === 'teacher' ? 'ЗЗСО України' : selectedRole === 'student' ? 'ЗВО України' : 'Школа'),
      subject: subject || (selectedRole === 'teacher' ? 'Загальна дисципліна' : 'Предмет'),
      bio: selectedRole === 'teacher' 
        ? 'Педагог, що активно впроваджує нові освітні технології.'
        : selectedRole === 'student'
        ? 'Студент, який активно готує наукові та методичні роботи.'
        : 'Учень, що прагне високих результатів.',
      verified: selectedRole === 'teacher',
      createdAt: new Date().toISOString()
    };

    try {
      await saveUserProfile(newUser);
      onLoginSuccess(newUser);
      onClose();
    } catch (err) {
      console.error('Failed to save profile to Firestore:', err);
      // Still set logged in user state
      onLoginSuccess(newUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 z-10"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {step === 'google_select' ? 'Авторизація користувача' : 'Завершення профілю'}
                </h3>
                <p className="text-xs text-slate-400">Вхід та реєстрація</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 'google_select' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Увійдіть через акаунт Google або створіть власний педагогічний профіль:
                </p>

                {/* Direct Google Popup Sign In */}
                <button
                  onClick={handleFirebaseGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl font-bold text-slate-800 text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'З’єднання...' : 'Увійти з Google OAuth'}</span>
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">або швидкий профіль</span>
                </div>

                {/* Custom User creation */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleCustomAccountStart(
                      'Педагог-Дослідник',
                      'teacher.edu@gmail.com',
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                    )}
                    className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/40 transition group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-800">
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Профіль Вчителя / Викладача</div>
                        <div className="text-[10px] text-slate-500">Публікація конспектів та методичок</div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 transition" />
                  </button>

                  <button
                    onClick={() => handleCustomAccountStart(
                      'Студент Педагогічного',
                      'student.knu@gmail.com',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
                    )}
                    className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/40 transition group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-full bg-emerald-100 text-emerald-800">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Профіль Студента</div>
                        <div className="text-[10px] text-slate-500">Презентації, дипломні розробки</div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 transition" />
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>Захищені та надійні дані</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                {/* Inputs for registration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ваше ПІБ:</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="наприклад, Іван Васильович Франко"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Оберіть роль:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        selectedRole === 'teacher' ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-white border-slate-200'
                      }`}
                    >
                      <GraduationCap size={16} />
                      <span>Викладач</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        selectedRole === 'student' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-white border-slate-200'
                      }`}
                    >
                      <BookOpen size={16} />
                      <span>Студент</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('pupil')}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center transition ${
                        selectedRole === 'pupil' ? 'bg-sky-100 border-sky-500 text-sky-900' : 'bg-white border-slate-200'
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
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="наприклад, Київська гімназія №100 або КНУ"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Предмет / Спеціальність / Клас:</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="наприклад, Математика, Фізика, 11 клас"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{loading ? 'Збереження...' : 'Зберегти профіль та авторизуватись'}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
