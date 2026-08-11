# 🎓 Освітній Хаб Педагогічних Матеріалів

Сучасна веб-платформа для інтерактивного обміну педагогічним та навчальним матеріалом між вчителями, викладачами, студентами та учнями.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-teal.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-orange.svg)](https://firebase.google.com/)

---

## 🌟 Основні Можливості

- 🔐 **Автентифікація Google & Firebase Auth**: Швидкий та безпечний вхід через Google акаунт або створення спеціалізованого освітнього профілю.
- 🎯 **Вибір Освітньої Ролі**:
  - **Викладач / Вчитель**: Публікація конспектів уроків, презентацій, методичок та завдань.
  - **Студент**: Обмін дипломними розробками, лабораторними та науковими проєктами.
  - **Учень**: Доступ до навчальних матеріалів, тестування та самопідготовки.
- 📖 **Інтерактивний Онлайн-Переглядач (Lightweight Reader)**:
  - Підтримка документів (PDF / DOC), презентацій (PPTX з покроковим переглядом слайдів), фотогалерей та статей.
  - Режим зумування, друку, повноекранного перегляду та швидкої завантажувальної панелі.
- 💬 **Обговорення та Коментарі**:
  - Можливість коментувати матеріали та залишати відповіді в гілках обговорень у реальному часі.
- ❤️ **Вподобайки та Збережене**:
  - Швидке додавання конспекту чи презентації до власного кабінету.
- 🔍 **Розумний Пошук та Фільтрація**:
  - Фільтрація за освітніми рівнями (початкова, середня, старша школа, ЗВО) та типами контенту.
- 🔒 **Безпечний Код для GitHub**:
  - Усі секретні ключі, API токени та параметри підключення винесені у змінні середовища (`.env`).
  - Усі конфіденційні файли автоматично внесені у `.gitignore`.

---

## 🛠 Технологічний Стек

- **Frontend**: React 19, TypeScript, Vite
- **Стилізація**: Tailwind CSS v4, Motion (анімації)
- **База Даних та Хмара**: Firebase Firestore (Real-Time Database)
- **Авторизація**: Firebase Auth (Google OAuth Provider)
- **Іконки**: Lucide React

---

## 🚀 Швидкий Старт

### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/pedagogical-hub.git
cd pedagogical-hub
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Налаштування змінних середовища (.env)

Створіть файл `.env` на основі наданого шаблону `.env.example`:

```bash
cp .env.example .env
```

Заповніть `.env` власними ключами підключення Firebase:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef"
VITE_FIREBASE_DATABASE_ID="your-database-id"

# Секретні ключі адміністрування (при необхідності)
ADMIN_PASSWORD="super-secret-admin-pass"
JWT_SECRET="your-jwt-secret-key"
```

> ⚠️ **Важливо**: Ніколи не додавайте файл `.env` до Git! Він вже доданий в `.gitignore`. У репозиторії залишається лише `.env.example`.

### 4. Запуск у режимі розробки

```bash
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у вашому браузері.

### 5. Збірка для Production

```bash
npm run build
```

---

## 🔒 Безпека та Публікація на GitHub

Цей проєкт повністю підготовлений для безпечного розміщення на **GitHub**:

1. **Конфіденційні файли ігноруються**:
   - `.env` та всі `.env.*` файли заблоковані у `.gitignore`.
   - Ключі авторизації Firebase (`firebase-applet-config.json`) винесені та ігноруються.
2. **Шаблон `.env.example`**:
   - Залишено безпечний шаблон змінних оточення без реальних паролів чи ключів.
3. **Автоматичний Fallback**:
   - Код проєкту розрахований на зчитування через `import.meta.env` без розкриття приватних даних.

---

## 📄 Ліцензія

Цей проєкт поширюється під ліцензією MIT. Ви можете вільно використовувати, копіювати та модифікувати код.
