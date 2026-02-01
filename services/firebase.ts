import { initializeApp, deleteApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, query, limitToLast, onValue, push, update, remove, Database, Unsubscribe } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile, Auth, User } from 'firebase/auth';
import { ContentItem, FirebaseConfig, Comment, UserProfile } from '../types';

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

export const initFirebase = async (config: FirebaseConfig): Promise<boolean> => {
  try {
    const apps = getApps();
    if (apps.length > 0) {
      if (apps[0].options.apiKey !== config.apiKey) {
         await deleteApp(apps[0]);
         app = initializeApp(config);
      } else {
         app = apps[0];
      }
    } else {
      app = initializeApp(config);
    }

    db = getDatabase(app);
    auth = getAuth(app);
    return true;
  } catch (e) {
    console.error("Firebase Init Error:", e);
    return false;
  }
};

// --- Auth Services ---

export const loginWithGoogle = async (): Promise<UserProfile | null> => {
  if (!auth) return null;
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email
    };
  } catch (error: any) {
    console.error("Login Failed:", error);

    // FIX: Fallback to Guest Mode if domain is not authorized in Firebase Console
    if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
      const hostname = window.location.hostname;
      alert(
        `Firebase Error: Domain (${hostname}) is not authorized.\n\n` +
        `To fix: Add this domain to Firebase Console > Auth > Settings > Authorized Domains.\n\n` +
        `FALLBACK: Logging in as 'Guest User' for testing.`
      );
      
      // Return a Mock/Guest User so the app remains usable
      return {
        uid: 'guest_' + Math.floor(Math.random() * 10000),
        displayName: 'Guest User',
        photoURL: null,
        email: 'guest@netnook.local',
        profession: 'Visitor'
      };
    }

    alert(`Login failed: ${error.message}\nEnsure 'Google' provider is enabled in Firebase Console.`);
    return null;
  }
};

export const logout = async () => {
  if (!auth) return;
  await signOut(auth);
};

export const updateUserProfile = async (displayName: string, photoURL?: string): Promise<boolean> => {
  if (!auth || !auth.currentUser) return false;
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName,
      photoURL: photoURL
    });
    return true;
  } catch (e) {
    console.error("Profile Update Error:", e);
    return false;
  }
};

export const subscribeToAuth = (callback: (user: UserProfile | null) => void): Unsubscribe => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
    } else {
      callback(null);
    }
  });
};

// --- Data Services ---

export const uploadToCloud = async (item: ContentItem): Promise<{ success: boolean; error?: string }> => {
  if (!db) return { success: false, error: "Database not initialized (Offline)" };
  try {
    // Sanitize item before upload to prevent "undefined" errors in Firebase
    const cleanItem = JSON.parse(JSON.stringify(item));
    // Ensure authorProfession is set or empty string to avoid undefined issues
    if (cleanItem.authorProfession === undefined) cleanItem.authorProfession = "";
    
    await set(ref(db, 'posts/' + item.cid), {
      ...cleanItem,
      isSynced: true
    });
    return { success: true };
  } catch (e: any) {
    console.error("Upload Error:", e);
    return { success: false, error: e.message || "Unknown Upload Error" };
  }
};

export const updatePost = async (cid: string, updates: Partial<ContentItem>): Promise<boolean> => {
  if (!db) return false;
  try {
    await update(ref(db, `posts/${cid}`), updates);
    return true;
  } catch (e) {
    console.error("Update Error:", e);
    return false;
  }
};

export const deletePost = async (cid: string): Promise<boolean> => {
  if (!db) return false;
  try {
    await remove(ref(db, `posts/${cid}`));
    return true;
  } catch (e) {
    console.error("Delete Error:", e);
    return false;
  }
}

export const fetchFromCloud = async (cid: string): Promise<ContentItem | null> => {
  if (!db) return null;
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `posts/${cid}`));
    if (snapshot.exists()) {
      return snapshot.val() as ContentItem;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Fetch Error:", e);
    return null;
  }
};

export const subscribeToGlobalFeed = (callback: (posts: ContentItem[]) => void): Unsubscribe | (() => void) => {
  if (!db) return () => {};
  
  const postsRef = ref(db, 'posts');
  const recentPostsQuery = query(postsRef, limitToLast(50));
  
  const unsubscribe = onValue(recentPostsQuery, (snapshot) => {
    const val = snapshot.val();
    if (val) {
      const postsArray = Object.values(val) as ContentItem[];
      postsArray.sort((a, b) => b.timestamp - a.timestamp);
      callback(postsArray);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

// --- Interactions ---

export const toggleLike = async (cid: string, userId: string, isLiked: boolean) => {
  if (!db) return;
  const updates: any = {};
  if (isLiked) {
    updates[`posts/${cid}/likes/${userId}`] = null; // Remove like
  } else {
    updates[`posts/${cid}/likes/${userId}`] = true; // Add like
  }
  await update(ref(db), updates);
};

export const addComment = async (cid: string, comment: Comment) => {
  if (!db) return;
  const newCommentKey = push(child(ref(db), `posts/${cid}/comments`)).key;
  const updates: any = {};
  updates[`posts/${cid}/comments/${newCommentKey}`] = comment;
  await update(ref(db), updates);
};