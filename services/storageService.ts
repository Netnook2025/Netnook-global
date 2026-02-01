import { ContentItem, Category, AppState, FirebaseConfig } from '../types';

const STORAGE_KEY = 'netnook_data_v1';
const CONFIG_KEY = 'netnook_wifi_config_v1';

// Simulate IPFS CID generation (SHA-like hash)
export const generateCID = async (content: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(content + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return 'Qm' + hashHex.substring(0, 44); // Mimic IPFS hash format
};

export const loadData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    education: [],
    news: [],
    entertainment: []
  };
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Network Config Persistence ---

export const saveWifiConfig = (config: FirebaseConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const loadWifiConfig = (): FirebaseConfig | null => {
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const clearWifiConfig = () => {
  localStorage.removeItem(CONFIG_KEY);
};