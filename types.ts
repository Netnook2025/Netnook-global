
export type Category = 'education' | 'news' | 'entertainment';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface ContentItem {
  cid: string;
  fileName: string; // Used as title for text posts
  fileType: string; // 'text/plain' for text posts
  data: string; // Base64 for offline storage
  timestamp: number;
  category: Category;
  author?: string;
  authorId?: string;
  authorPhoto?: string;
  authorProfession?: string; // Added profession field
  likes?: Record<string, boolean>; // Map of UserID -> Boolean
  comments?: Record<string, Comment>;
  isSynced?: boolean; // True if exists on global network
}

export interface AppState {
  education: ContentItem[];
  news: ContentItem[];
  entertainment: ContentItem[];
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  profession?: string; // Added profession
}

export interface AuditReport {
  businessName: string;
  rating: string;
  hours: string;
  performanceScore: number;
  criticalProblems: string[];
  solutions: string[];
  sampleReply: string;
}