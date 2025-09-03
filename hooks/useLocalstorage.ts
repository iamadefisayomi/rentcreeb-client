"use client";

import { useReducer, useEffect } from "react";

type UseLocalStorageReturnType<T> = [T, (value: T) => void];

function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturnType<T> {
  type Action = { type: "INIT" | "UPDATE"; payload?: T };

  function safeParse(value: string | null): T {
    try {
      return value !== null ? (JSON.parse(value) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function reducer(state: T, action: Action): T {
    switch (action.type) {
      case "INIT": {
        if (typeof window !== "undefined") {
          return safeParse(window.localStorage.getItem(key));
        }
        return state;
      }
      case "UPDATE":
        return action.payload as T;
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, defaultValue, () => {
    if (typeof window !== "undefined") {
      return safeParse(window.localStorage.getItem(key));
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch({ type: "INIT" });
    }
  }, [key]);

  const setValue = (value: T) => {
    dispatch({ type: "UPDATE", payload: value });
  };

  return [state, setValue];
}

export default useLocalStorage;
