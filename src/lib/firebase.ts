import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Material, User, Comment, CommentReply } from '../types';

let appletConfig: Record<string, string> = {};
try {
  // Vite synchronous eager glob import safely returns empty object if file is missing
  // @ts-ignore
  const globConfig = import.meta.glob('../../firebase-applet-config.json', { eager: true });
  const matched = Object.values(globConfig)[0] as any;
  if (matched) {
    appletConfig = matched.default || matched;
  }
} catch {
  // Config json file may be omitted in git
}

const env = (import.meta as any).env || {};

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || appletConfig.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || '',
  appId: env.VITE_FIREBASE_APP_ID || appletConfig.appId || '',
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || ''
};

// Initialize Firebase App
const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
});

// Initialize Firestore with specific database ID if present
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Collection References
export const materialsCol = collection(db, 'materials');
export const usersCol = collection(db, 'users');

// ------------------------------------
// USER PROFILE FIRESTORE FUNCTIONS
// ------------------------------------

export async function saveUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// ------------------------------------
// MATERIALS FIRESTORE REAL-TIME & CRUD
// ------------------------------------

export function subscribeToMaterials(
  currentUserId: string | null,
  onData: (materials: Material[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(materialsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Material[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const likedBy: string[] = data.likedBy || [];
        const savedBy: string[] = data.savedBy || [];

        return {
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          type: data.type || 'document',
          category: data.category || 'general',
          targetSubject: data.targetSubject || 'Загальний предмет',
          author: data.author || {
            id: 'u-unknown',
            name: 'Анонімний Автор',
            email: '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: 'teacher',
            createdAt: new Date().toISOString()
          },
          createdAt: data.createdAt || new Date().toISOString(),
          viewsCount: data.viewsCount || 0,
          likesCount: data.likesCount || likedBy.length || 0,
          userLiked: currentUserId ? likedBy.includes(currentUserId) : false,
          userSaved: currentUserId ? savedBy.includes(currentUserId) : false,
          likedBy,
          savedBy,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileSize: data.fileSize,
          pageCount: data.pageCount,
          images: data.images,
          slides: data.slides,
          docPreviewContent: data.docPreviewContent,
          tags: data.tags || [],
          commentsCount: data.commentsCount || (data.comments ? data.comments.length : 0),
          comments: data.comments || []
        } as Material & { likedBy?: string[]; savedBy?: string[] };
      });

      onData(items);
    },
    (error) => {
      console.error('Firestore materials snapshot error:', error);
      if (onError) onError(error);
    }
  );
}

export async function publishMaterial(material: Omit<Material, 'id'>): Promise<string> {
  try {
    const newDocRef = doc(materialsCol);
    const materialData = {
      ...material,
      id: newDocRef.id,
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      likedBy: [],
      savedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    await setDoc(newDocRef, materialData);
    return newDocRef.id;
  } catch (error) {
    console.error('Error publishing material to Firestore:', error);
    throw error;
  }
}

export async function toggleLikeMaterial(materialId: string, currentUserId: string, isCurrentlyLiked: boolean): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    if (isCurrentlyLiked) {
      await updateDoc(matRef, {
        likedBy: arrayRemove(currentUserId),
        likesCount: increment(-1)
      });
    } else {
      await updateDoc(matRef, {
        likedBy: arrayUnion(currentUserId),
        likesCount: increment(1)
      });
    }
  } catch (error) {
    console.error('Error toggling like in Firestore:', error);
    throw error;
  }
}

export async function toggleSaveMaterial(materialId: string, currentUserId: string, isCurrentlySaved: boolean): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    if (isCurrentlySaved) {
      await updateDoc(matRef, {
        savedBy: arrayRemove(currentUserId)
      });
    } else {
      await updateDoc(matRef, {
        savedBy: arrayUnion(currentUserId)
      });
    }
  } catch (error) {
    console.error('Error toggling save in Firestore:', error);
    throw error;
  }
}

export async function incrementViewCount(materialId: string): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    await updateDoc(matRef, {
      viewsCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing view count in Firestore:', error);
  }
}

export async function addCommentToMaterial(
  materialId: string,
  content: string,
  currentUser: User
): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    const snap = await getDoc(matRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const existingComments: Comment[] = data.comments || [];

    const newComment: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      materialId,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      userLiked: false,
      replies: []
    };

    const updatedComments = [newComment, ...existingComments];

    await updateDoc(matRef, {
      comments: updatedComments,
      commentsCount: increment(1)
    });
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
    throw error;
  }
}

export async function addReplyToComment(
  materialId: string,
  commentId: string,
  content: string,
  currentUser: User
): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    const snap = await getDoc(matRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const existingComments: Comment[] = data.comments || [];

    const newReply: CommentReply = {
      id: `cr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      userLiked: false
    };

    const updatedComments = existingComments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    });

    await updateDoc(matRef, {
      comments: updatedComments,
      commentsCount: increment(1)
    });
  } catch (error) {
    console.error('Error adding reply to Firestore:', error);
    throw error;
  }
}

export async function deleteMaterial(materialId: string): Promise<void> {
  try {
    const matRef = doc(db, 'materials', materialId);
    await deleteDoc(matRef);
  } catch (error) {
    console.error('Error deleting material from Firestore:', error);
    throw error;
  }
}
