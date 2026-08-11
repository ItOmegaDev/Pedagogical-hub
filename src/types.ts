export type UserRole = 'teacher' | 'student' | 'pupil';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  institution?: string; // e.g., "Київський ліцей №100" or "КНУ ім. Т. Шевченка"
  subject?: string; // e.g., "Математика", "Фізика"
  bio?: string;
  verified?: boolean;
  createdAt: string;
}

export type MaterialType = 'document' | 'presentation' | 'photo' | 'news' | 'lesson' | 'test';

export type Category = 'elementary' | 'middle' | 'high' | 'university' | 'preschool' | 'general';

export interface CommentReply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
  userLiked?: boolean;
}

export interface Comment {
  id: string;
  materialId: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
  userLiked?: boolean;
  replies?: CommentReply[];
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  category: Category;
  targetSubject: string;
  author: User;
  createdAt: string;
  viewsCount: number;
  likesCount: number;
  userLiked?: boolean;
  userSaved?: boolean;
  
  // File & document specifics
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  pageCount?: number;
  
  // Gallery images (for photo/gallery type)
  images?: string[];
  
  // Presentation slides (for presentation type)
  slides?: { id: number; title: string; imageUrl: string; notes: string }[];
  
  // Document full text preview for lightweight reader
  docPreviewContent?: string;
  
  tags: string[];
  commentsCount: number;
  comments: Comment[];
}

export type SortOption = 'newest' | 'popular' | 'most_commented';
