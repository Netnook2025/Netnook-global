import { FirebaseConfig } from './types';

// ⚠️ IMPORTANT FOR DEVELOPER:
// Replace the values below with your actual Firebase Project configuration.
// This allows all users to connect to your "Public Network" automatically without setup.

export const DEFAULT_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyB3M8MMbZXRtazbt9MRhsFXAyu4Vm9hAxk",
  authDomain: "global-cache-network.firebaseapp.com",
  // Inferred database URL. If this doesn't work, check the Realtime Database section in Firebase Console.
  databaseURL: "https://global-cache-network-default-rtdb.firebaseio.com",
  projectId: "global-cache-network",
  storageBucket: "global-cache-network.firebasestorage.app",
  messagingSenderId: "730179398295",
  appId: "1:730179398295:web:a49a2ef181789adfb217d2"
};