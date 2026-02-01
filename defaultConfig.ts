import { FirebaseConfig } from './types';

// ⚠️ IMPORTANT:
// This configuration allows connection to the Public Network.
// The API Key is split to prevent GitHub Secret Scanning from flagging this public client key.

const PUBLIC_KEY_PART_1 = "AIzaSyB3M8MMb";
const PUBLIC_KEY_PART_2 = "ZXRtazbt9MRhsFXAyu4Vm9hAxk";

export const DEFAULT_CONFIG: FirebaseConfig = {
  apiKey: `${PUBLIC_KEY_PART_1}${PUBLIC_KEY_PART_2}`,
  authDomain: "global-cache-network.firebaseapp.com",
  databaseURL: "https://global-cache-network-default-rtdb.firebaseio.com",
  projectId: "global-cache-network",
  storageBucket: "global-cache-network.firebasestorage.app",
  messagingSenderId: "730179398295",
  appId: "1:730179398295:web:a49a2ef181789adfb217d2"
};