import * as SecureStore from 'expo-secure-store';
import {useState, useEffect, useCallback} from 'react';
import { Platform } from 'react-native';

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}
export async function getStorageItemAsync(key: string) {
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    return SecureStore.getItemAsync(key);
  }
}

export function useStorageState(key: string) {
  // Public
  const [isLoading, setLoading] = useState(false);
  const [state, setState] = useState<string| null| undefined>("");


  const initValue = useCallback(async () => {
    setLoading(true);
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      const value = await getStorageItemAsync(key);
      setState(value);
    }
    setLoading(false);
  },[key])

  // Get
  useEffect(() => {
    initValue()
  }, [initValue]);

  // Set
  const setValue = useCallback(
    async (value: string | null | undefined) => {
      if (value !== undefined) {
        await setStorageItemAsync(key, value)
        setState(value);
      }
    },
    [key]
  );
  
  return {state, setValue, isLoading};
}
