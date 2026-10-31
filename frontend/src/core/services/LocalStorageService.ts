import { IStorageService } from '../contracts/interfaces';

export class LocalStorageService implements IStorageService {
  private readonly prefix: string;

  constructor(prefix: string = 'messnutri_') {
    this.prefix = prefix;
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = this.prefix + key;
      const raw = localStorage.getItem(fullKey);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[LocalStorageService] Failed to parse key ${key}:`, e);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.error(`[LocalStorageService] Failed to set key ${key}:`, e);
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.error(`[LocalStorageService] Failed to remove key ${key}:`, e);
    }
  }

  public clear(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('[LocalStorageService] Failed to clear keys:', e);
    }
  }
}
