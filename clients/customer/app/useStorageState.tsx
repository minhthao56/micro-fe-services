import * as SecureStore from 'expo-secure-store';
import {useState, useReducer, useEffect, useCallback} from 'react';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value?: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null]
  ): UseStateHook<T> {
    const reducer = (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => {
      return [false, action];
    };
  
    return useReducer(reducer, initialValue) as UseStateHook<T>;
  }
  

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

export function useStorageState(key: string) {
  // Public
  const [state, setState] = useAsyncState<string>();
  const [isLoading, session] = useState(state);

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then(value => {
        setState(value);
      });
    }
  }, [key]);

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
  
  return {state, setValue};
}
