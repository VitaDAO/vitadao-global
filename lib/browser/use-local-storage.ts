import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

// Adapted from https://github.com/uidotdev/usehooks

type Serializable =
  | string
  | number
  | boolean
  | { [x: string]: Serializable }
  | Array<Serializable>;

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

function setItem<T extends Serializable>(key: string, value: T) {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function setItemWithoutEvent<T extends Serializable>(key: string, value: T) {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
}

function getItem(key: string) {
  return window.localStorage.getItem(key);
}

function subscribe(callback: (this: Window, ev: StorageEvent) => unknown) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useLocalStorage<T extends Serializable>(
  key: string,
  defaultValue: T,
  schema: z.ZodSchema<T>,
) {
  function getSnapshot() {
    try {
      const value = getItem(key);
      if (value === null) throw new Error("Missing localStorage item");
      return schema.parse(JSON.parse(value));
    } catch {
      setItemWithoutEvent(key, defaultValue);
      return defaultValue;
    }
  }

  const value = useSyncExternalStore(subscribe, getSnapshot);
  const setValue = useCallback((newValue: T) => setItem(key, newValue), [key]);

  return [value, setValue] as const;
}
