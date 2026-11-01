import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Minimal storage contract used by supabase-js. */
export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

// SecureStore warns above ~2048 bytes per value; Supabase sessions exceed that,
// so values are split into chunks with a count stored under the base key.
const CHUNK_SIZE = 1800;
const countKey = (key: string) => `${key}.chunks`;
const chunkKey = (key: string, i: number) => `${key}.${i}`;

export const secureStorage: StorageAdapter = {
  async getItem(key) {
    const count = Number(await SecureStore.getItemAsync(countKey(key)));
    if (!Number.isInteger(count) || count <= 0) return null;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const part = await SecureStore.getItemAsync(chunkKey(key, i));
      if (part === null) return null; // corrupted/partial write: treat as signed out
      parts.push(part);
    }
    return parts.join('');
  },
  async setItem(key, value) {
    await secureStorage.removeItem(key);
    const chunks = value.match(new RegExp(`[\\s\\S]{1,${CHUNK_SIZE}}`, 'g')) ?? [];
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(chunkKey(key, i), chunks[i]);
    }
    await SecureStore.setItemAsync(countKey(key), String(chunks.length));
  },
  async removeItem(key) {
    const count = Number(await SecureStore.getItemAsync(countKey(key)));
    if (Number.isInteger(count)) {
      for (let i = 0; i < count; i++) await SecureStore.deleteItemAsync(chunkKey(key, i));
    }
    await SecureStore.deleteItemAsync(countKey(key));
  },
};

/** Encrypted keychain/keystore on native; AsyncStorage on web (no SecureStore there). */
export const authStorage: StorageAdapter = Platform.OS === 'web' ? AsyncStorage : secureStorage;
